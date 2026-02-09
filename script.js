const questions = [
  {id:1, text:'What does CODE 2 mean?', type:'radio', options:['Responding with no lights no sirens','Responding with lights but no sirens','Responding with lights and sirens','Situation resolved']},
  {id:2, text:'What does CODE 4 mean?', type:'radio', options:['Responding with lights but no sirens','Situation resolved','Responding with no lights no sirens','Responding with lights and sirens']},
  {id:3, text:'What is the rank requirement for SGT?', type:'text'},
  {id:4, text:'What would you do if you were patrolling and witnessed someone looting a dead body? How would you respond?', type:'text'},
  {id:5, text:'What does 10-50 mean?', type:'radio', options:['Shots Fired','Negative','Vehicle accident','Responding with lights and sirens']},
  {id:6, text:'What is the correct arresting procedure?', type:'text'},
  {id:7, text:'What is rank lock? (2+ sentences)', type:'text'},
  {id:8, text:'What is the difference between Lethal and Non Lethal Force?', type:'text'},
  {id:9, text:'What is the purpose of the Chain of Command? (2+ sentences)', type:'text'},
  {id:10, text:'What does the code 10-21 mean?', type:'text'},
  {id:12, text:'What car are all PPD personnel allowed to operate while on duty?', type:'text'},
  {id:13, text:'What is the punishment for fake logging patrols?', type:'text'}
];

function renderQuestions(){
  const container = document.getElementById('questions');
  container.innerHTML = '';
  questions.forEach(q=>{
    const div = document.createElement('div');
    div.className = 'question';
    const h = document.createElement('div');
    h.textContent = q.text;
    h.style.fontWeight = '500';
    div.appendChild(h);
    
    if(q.type === 'radio'){
      const opts = document.createElement('div');
      opts.className = 'opts';
      q.options.forEach((opt,i)=>{
        const id = `q${q.id}_opt${i}`;
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="q${q.id}" value="${opt}" id="${id}"> ${opt}`;
        opts.appendChild(label);
      });
      div.appendChild(opts);
    } else if(q.type === 'text'){
      const input = document.createElement('textarea');
      input.name = `q${q.id}`;
      input.id = `q${q.id}_text`;
      input.rows = 3;
      input.style.width = '100%';
      input.style.padding = '8px';
      input.style.marginTop = '8px';
      input.style.borderRadius = '4px';
      input.style.border = '1px solid #ccc';
      input.style.fontFamily = 'inherit';
      div.appendChild(input);
    }
    container.appendChild(div);
  });
}

function showMessage(msg, isError){
  const el = document.getElementById('message');
  el.textContent = msg;
  el.style.color = isError ? 'crimson' : 'green';
  el.style.backgroundColor = isError ? '#ffeceb' : '#e8f5e9';
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderQuestions();
  const form = document.getElementById('quiz-form');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    showMessage('Sending...', false);

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const webhookUrl = 'https://discord.com/api/webhooks/1468601663580278857/hRBbSxeQEb8ofil1b9NXoOD0dJx-TPTf75Anm87DpHhIIth7va_YZNtT8uPgHqEASgqJ';

    const answers = questions.map(q=>{
      let answer;
      if(q.type === 'radio'){
        const el = document.querySelector(`input[name="q${q.id}"]:checked`);
        answer = el ? el.value : null;
      } else if(q.type === 'text'){
        answer = document.getElementById(`q${q.id}_text`).value.trim();
      }
      return {questionId:q.id, question:q.text, answer};
    });

    const submittedAt = new Date().toISOString();
    const title = `New quiz submission: ${name || 'Anonymous'}`;
    const desc = answers.map(a=>`**${a.question}**\n${a.answer || 'No answer'}`).join('\n\n');
    
    const discordPayload = {
      username: 'Training Quiz Bot',
      embeds: [{
        title,
        description: desc,
        timestamp: submittedAt,
        color: 2932299
      }]
    };

    try{
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload)
      });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      showMessage('✓ Submitted to Discord!', false);
      form.reset();
      renderQuestions();
    }catch(err){
      showMessage('Failed: '+err.message, true);
    }finally{
      submitBtn.disabled = false;
    }
  });
});

