/* ========= HELPERS ========= */
const getProfile = () => JSON.parse(localStorage.getItem('userProfile') || '{}');
const setProfile = p   => localStorage.setItem('userProfile', JSON.stringify(p));
const getHist   = ()   => JSON.parse(localStorage.getItem('practiceHistory') || '[]');
const setHist   = h    => localStorage.setItem('practiceHistory', JSON.stringify(h));

/* ========= NAV ========= */
function toggleMenu(){document.getElementById('menuList').classList.toggle('hidden');}
function setNavName(){
  const u = getProfile();
  document.querySelectorAll('#navUser').forEach(e=>e.textContent = u.name || 'Guest');
}

/* ========= HOME ========= */
function initHome() {
  setNavName();

  const weeklyPlan = {
    Monday: [ "10 – Breathing Exercises", "15 – Vocal Warm-up", "25 – Alankar Practice", "10 – Scale & Pitch Practice", "30 – Raag Yaman", "30 – Sad Song Practice", "15 – Expression Practice", "15 – Taan & Gamak Practice", "15 – Mic / Recording", "15 – Song Listening", "15 – Composition Practice" ],
    Tuesday: [ "10 – Breathing Exercises", "15 – Vocal Warm-up", "25 – Speed Alankars", "10 – Range Practice", "30 – Raag Bhairav", "30 – Romantic Song Practice", "15 – Mirror Performance", "15 – Taan + Modulation", "15 – Reel Recording", "15 – Legendary Voice Study", "15 – Tune Writing" ],
    Wednesday: [ "10 – Breathing Exercises", "15 – Vocal Warm-up", "25 – Vakra Alankars", "10 – Pitch Accuracy", "30 – Raag Bageshree", "30 – Classical Bandish", "15 – Emotional Singing", "15 – Fast Taan & Meend", "15 – Studio Simulation", "15 – Line-by-Line Comparison", "15 – Lyrics + Melody Creation" ],
    Thursday: [ "10 – Breathing Exercises", "15 – Vocal Warm-up", "25 – Double Speed Alankars", "10 – High-Low Shift", "30 – Raag Desh", "30 – Retro Bollywood Song", "15 – Acting in Singing", "15 – Gamak Focus", "15 – Playback Review", "15 – Copy + Sing Along", "15 – Hook Line Creation" ],
    Friday: [ "10 – Breathing Exercises", "15 – Vocal Warm-up", "25 – Alankar + Gamak", "10 – High Note Stretch", "30 – Raag Bhimpalasi", "30 – High Pitch Song", "15 – Feel Building", "15 – Mixed Taan Practice", "15 – Mic Control Practice", "15 – Self + Original Compare", "15 – Tune Polishing" ],
    Saturday: [ "10 – Breathing Exercises", "15 – Vocal Warm-up", "25 – Mixed Alankars", "10 – Keyboard Scale Play", "30 – Raag of Choice", "30 – Duet Song Practice", "15 – Improvisation Practice", "15 – Creative Taan", "15 – Final Reel Record", "15 – New Singer Study", "15 – Sing Self-made Tune" ],
    Sunday: [ "10 – Light Breathing", "15 – Humming Only", "25 – Rest (No Alankar)", "10 – Only Listening", "30 – Light Alaap", "30 – Bhajan / Light Song", "15 – Skip / Relax", "15 – Optional Taan Practice", "15 – Feedback Review", "15 – Light Listening", "15 – Skip / Free Practice" ]
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = days[new Date().getDay()];
  const todayPlan = weeklyPlan[todayName] || [];

  const list = document.getElementById("todayList");
  list.innerHTML = "";

  let totalMinutes = 0;

  todayPlan.forEach(task => {
    const [min, title] = task.split(" – ");
    totalMinutes += parseInt(min);

    const li = document.createElement("li");
    li.innerHTML = `
      <i class="fa-solid fa-clock" onclick="startTimer(${min})" title="Start ${min} min timer"></i>
      <label onclick="startTimer(${min})" style="cursor:pointer">
        <input type="checkbox"> ${title} (${min} min)
      </label>
    `;
    list.appendChild(li);
  });

  // Update header
  const header = document.querySelector(".hero h1");
  if (header) {
    header.innerHTML = `🎤 आज (${todayName}) का Riyaz Plan`;
  }
}

/* save */
function saveToday(){
  const date = new Date().toLocaleDateString('en-GB');
  const tasks=[...document.querySelectorAll('#todayList li')]
    .map(li=>(li.querySelector('input').checked?'✅':'❌')+' '+li.textContent.trim());
  const hist = getHist(); hist.unshift({date,tasks}); setHist(hist);
  alert('Saved!');}

/* ========= TIMER ========= */
let tInt;
function startTimer(min){
  clearInterval(tInt); let s=min*60;
  const d=document.getElementById('timerDisplay');
  const up=()=>{const m=String(Math.floor(s/60)).padStart(2,'0');
                const ss=String(s%60).padStart(2,'0');
                d.textContent=`Timer : ${m}:${ss}`; if(s<=0)clearInterval(tInt);s--;};
  up(); tInt=setInterval(up,1000);
}

/* ========= PROFILE ========= */
function initProfile(){
  setNavName(); showSub('new');
  ['Male','Female'].forEach(g=>editGender.append(new Option(g,g)));
  const p=getProfile();
  if(Object.keys(p).length){
    editName.value=p.name; editAge.value=p.age; editGender.value=p.gender;
    editGenre.value=p.genre; editScale.value=p.scale; showSub('edit');
  }
}
function showSub(m){newForm.classList.toggle('hidden',m!=='new');
                    editForm.classList.toggle('hidden',m!=='edit');}
function saveProfile(e){
  e.preventDefault();
  const p={name:newName.value,age:newAge.value,gender:newGender.value,
           genre:newGenre.value,scale:newScale.value};
  setProfile(p); alert('Profile saved!'); location.href='index.html';
}
function updateProfile(e){
  e.preventDefault();
  const p={name:editName.value,age:editAge.value,gender:editGender.value,
           genre:editGenre.value,scale:editScale.value};
  setProfile(p); alert('Profile updated!'); location.href='index.html';
}

/* ========= HISTORY ========= */
function initHistory(){
  setNavName();
  const tb=document.querySelector('#historyTable tbody'); const h=getHist();
  if(!h.length){tb.innerHTML='<tr><td colspan="2">No history yet</td></tr>';return;}
  h.forEach(r=>{
    const tr=document.createElement('tr');
    //tr.innerHTML=`<td>${r.date}</td><td>${r.tasks.join('<br>')}</td>`;tb.appendChild(tr);
    tr.innerHTML = `<td>${r.date}</td><td>${r.tasks.map(t => `<div class="task-item">${t}</div>`).join('')}</td>`;tb.appendChild(tr);

  });
  /* chart */
  const labels=h.map(r=>r.date).reverse();
  const data=h.map(r=>r.tasks.filter(t=>t.startsWith('✅')).length).reverse();
  const ctx=document.getElementById('progressChart').getContext('2d');
  new Chart(ctx,{type:'bar',
    data:{labels,datasets:[{label:'Completed',data,backgroundColor:'#8a2be2'}]},
    options:{scales:{y:{beginAtZero:true,stepSize:1,max:5}}}});
}
// 📈 Line Graph: Weekly Total Practice Time (in mins)
const timeLabels = [];
const timeData = [];

getHist().forEach(entry => {
  const totalMinutes = entry.tasks
    .filter(t => t.startsWith("✅"))
    .reduce((sum, task) => {
      const match = task.match(/(\d+)\s*(min|mins|minutes)?/i);

      return sum + (match ? parseInt(match[1]) : 0);
    }, 0);
  timeLabels.push(entry.date);
  timeData.push(totalMinutes);
});

const ctx2 = document.getElementById('timeChart').getContext('2d');
new Chart(ctx2, {
  type: 'line',
  data: {
    labels: timeLabels.reverse(),
    datasets: [{
      label: 'Total Practice Time (mins)',
      data: timeData.reverse(),
      borderColor: '#5e00a3',
      backgroundColor: 'rgba(94,0,163,0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 4
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  }
});
// INSTALL PROMPT HANDLER
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById('installBtn');
  if (installBtn) installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    deferredPrompt.prompt();
    installBtn.style.display = 'none';
  });
});


