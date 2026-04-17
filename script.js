let step = 0, userData = {}, lang = 'en';

const t = {
  en:{welcome:"Hello! I am Setu. I will help you find government schemes.",state:"Which state?",income:"Enter your yearly income (₹):",category:"Category?",age:"Age?",results:"You are eligible for:"},
  hi:{welcome:"नमस्ते! मैं सेतु हूँ। मैं आपको सरकारी योजनाएं खोजने में मदद करूंगा।",state:"राज्य?",income:"अपनी वार्षिक आय दर्ज करें (₹):",category:"श्रेणी?",age:"उम्र?",results:"आप पात्र हैं:"}
  // (keep rest same as original file)
};

const schemes = [
  {name:{en:"PM Kisan",hi:"पीएम किसान"},category:"Farmer",maxIncome:500000,reason:{en:"For farmers",hi:"किसानों के लिए"},benefit:{en:"₹6000/year",hi:"₹6000/वर्ष"},link:"https://pmkisan.gov.in/"}
  // (keep rest same as original file)
];

function tr(k){return t[lang][k]||t.en[k]}
function txt(o){return o[lang]||o.en}

function addMessage(text,type='bot'){
  let m=document.createElement('div');
  m.className='message '+type;
  m.innerText=text;
  document.getElementById('chat').appendChild(m);
  scroll();
}

function addButtons(arr){
  let wrap=document.createElement('div');
  wrap.className='options';
  arr.forEach(v=>{
    let b=document.createElement('button');
    b.className='option';
    b.innerText=v;
    b.onclick=()=>selectOption(v);
    wrap.appendChild(b)
  });
  document.getElementById('chat').appendChild(wrap);
}

function addDropdown(){
  let s=document.createElement('select');
  s.className='dropdown';
  ["Uttar Pradesh","Bihar","Maharashtra","Tamil Nadu"].forEach(v=>{
    let o=document.createElement('option');
    o.value=v;
    o.innerText=v;
    s.appendChild(o)
  });
  s.onchange=e=>selectOption(e.target.value);
  document.getElementById('chat').appendChild(s);
}

function selectOption(v){addMessage(v,'user');handle(v)}

function sendMessage(){
  let i=document.getElementById('input');
  if(!i.value)return;
  addMessage(i.value,'user');
  handle(i.value);
  i.value='';
}

function handle(v){
  step++;
  if(step===1){addMessage(tr('state'));addDropdown()}
  else if(step===2){userData.state=v;addMessage(tr('income'))}
  else if(step===3){userData.income=parseInt(v)||0;addMessage(tr('category'));addButtons(["Student","Farmer","Worker","Women","Senior Citizen","Business","Unemployed","Disabled"])}
  else if(step===4){userData.category=v;addMessage(tr('age'))}
  else if(step===5){userData.age=parseInt(v)||0;showResults()}
}

function showResults(){
  addMessage(tr('results'));
  let chat=document.getElementById('chat');

  let filtered = schemes.filter(s=>{
    let incomeOk = userData.income <= s.maxIncome;
    let categoryOk = s.category==="Any" || s.category.toLowerCase()===userData.category.toLowerCase();
    return incomeOk && categoryOk;
  });

  if(filtered.length===0) filtered = schemes;

  filtered.forEach(s=>{
    let c=document.createElement('div');
    c.className='card';
    c.innerHTML=`
    <strong>${txt(s.name)}</strong>
    <div class='divider'></div>
    <p><b>Why:</b> ${txt(s.reason)}</p>
    <p><b>Benefit:</b> ${txt(s.benefit)}</p>
    <button class='apply' onclick="window.open('${s.link}','_blank')">Apply Now</button>`;
    chat.appendChild(c);
  });

  scroll();
}

function changeLang(l){lang=l;reset()}
function reset(){document.getElementById('chat').innerHTML='';step=0;start()}
function scroll(){let c=document.getElementById('chat');c.scrollTop=c.scrollHeight}
function start(){addMessage(tr('welcome'))}

start();