const EXERCISES = [
  ["Kettlebell Swing","Potencia / glúteos","swing"],
  ["Goblet Squat","Piernas / core","squat"],
  ["Kettlebell Clean","Potencia / hombros","clean"],
  ["Kettlebell Press","Hombros / core","press"],
  ["Kettlebell Snatch","Potencia total","snatch"],
  ["Turkish Get-Up","Core / estabilidad","tgu"],
  ["Kettlebell Deadlift","Cadena posterior","deadlift"],
  ["Reverse Lunge","Piernas / equilibrio","lunge"],
  ["Front Rack Squat","Piernas / core","frontsquat"],
  ["Kettlebell High Pull","Espalda / hombros","highpull"],
  ["Kettlebell Halo","Hombros / movilidad","halo"],
  ["Russian Twist","Abdominales","twist"],
  ["Sit-Up con Kettlebell","Abdominales","situp"],
  ["Leg Pass","Abdominales","legpass"],
  ["Push-Up","Pecho / tríceps","pushup"],
  ["Push-Up + Drag","Pecho / core","drag"],
  ["Plank","Core","plank"],
  ["Plank Shoulder Tap","Core / hombros","tap"],
  ["Mountain Climber","Core / cardio","climber"],
  ["Kettlebell Bear Crawl","Core / cuerpo completo","crawl"]
];

const state = {
  mode:"manual", count:4, work:20, rest:10, rounds:3, weight:"",
  selected:[], phase:"work", exercise:0, round:1, remaining:20,
  running:false, timerId:null, startedAt:null, elapsedBeforePause:0, phaseTotal:20
};

const $ = id => document.getElementById(id);
const screens = ["config","select","workout","summary","history"];
function showScreen(name){
  screens.forEach(s => $(`screen-${s}`).classList.toggle("active",s===name));
  $("backBtn").classList.toggle("hidden", name==="config" || name==="workout" || name==="summary");
  if(name==="history") renderHistory();
  window.scrollTo(0,0);
}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function updateSettings(){
  $("countValue").textContent=state.count; $("workValue").textContent=state.work;
  $("restValue").textContent=state.rest; $("roundsValue").textContent=state.rounds;
  $("selectedMax").textContent=state.count;
}
document.querySelectorAll(".mode-card").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".mode-card").forEach(x=>x.classList.remove("selected"));
  btn.classList.add("selected"); state.mode=btn.dataset.mode;
}));
document.querySelectorAll("[data-step]").forEach(btn=>btn.addEventListener("click",()=>{
  const k=btn.dataset.step, d=Number(btn.dataset.dir);
  const ranges={count:[3,8],work:[5,120],rest:[0,120],rounds:[1,20]};
  const step=k==="work"||k==="rest"?5:1;
  state[k]=clamp(state[k]+d*step,...ranges[k]);
  updateSettings();
}));
$("continueBtn").addEventListener("click",()=>{
  state.weight=$("weight").value;
  if(state.mode==="random"){
    state.selected=[...Array(EXERCISES.length).keys()].sort(()=>Math.random()-.5).slice(0,state.count);
    startWorkout();
  } else {
    state.selected=[];
    renderExercises(); showScreen("select");
  }
});
$("historyLink").addEventListener("click",()=>showScreen("history"));
$("historyHomeBtn").addEventListener("click",()=>showScreen("config"));
$("homeBtn").addEventListener("click",()=>{
  if($("screen-workout").classList.contains("active")) return;
  showScreen("config");
});
$("backBtn").addEventListener("click",()=>showScreen("config"));

function artSvg(type){
  const W=220,H=160;
  const C="#f7f2f0", A="#b52b4a", D="#171416", M="#7f2639";
  const base=`<svg class="exercise-art" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${type}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#25191d"/>
        <stop offset="1" stop-color="#111012"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" rx="18" fill="url(#bg)"/>
    <path d="M18 132H202" stroke="#4d3940" stroke-width="2"/>
    <g stroke="${C}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none">
  `;
  const head=(x,y)=>`<circle cx="${x}" cy="${y}" r="9" fill="${C}" stroke="none"/>`;
  const body=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1} L${x2} ${y2}"/>`;
  const line=(x1,y1,x2,y2,w=6)=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke-width="${w}"/>`;
  const kb=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-12 0 Q-12 -15 0 -15 Q12 -15 12 0" stroke="${A}" stroke-width="5" fill="none"/>
      <path d="M-13 0 Q0 10 13 0 L10 18 Q0 25 -10 18 Z" fill="${A}" stroke="${A}" stroke-width="2"/>
      <circle cx="0" cy="8" r="3" fill="${C}" stroke="none"/>
    </g>`;
  const arrow=(d)=>`<path d="${d}" stroke="${A}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M0 0" />`;
  let p="";

  switch(type){
    case "swing":
      p=head(92,48)+body(92,60,120,86)+line(93,67,69,88)+line(94,69,76,99)+line(119,85,95,119)+line(119,85,145,112)+line(145,112,159,129)+line(95,119,91,132)+line(92,67,116,91)+line(92,67,116,91)+kb(128,100,.85)+arrow("M150 80 Q182 72 180 105");
      break;
    case "goblet":
      p=head(104,34)+body(104,46,104,84)+line(104,55,82,72)+line(104,55,126,72)+line(82,72,101,76)+line(126,72,107,76)+line(104,84,79,105)+line(79,105,68,130)+line(104,84,130,105)+line(130,105,141,130)+kb(104,74,.9);
      break;
    case "clean":
      p=head(105,34)+body(105,46,105,84)+line(105,55,82,73)+line(105,55,128,66)+line(82,73,72,98)+line(128,66,133,77)+line(105,84,82,109)+line(82,109,77,131)+line(105,84,128,108)+line(128,108,134,131)+kb(138,72,.72)+arrow("M70 103 Q61 76 82 62");
      break;
    case "press":
      p=head(104,36)+body(104,48,104,84)+line(104,58,83,74)+line(104,58,126,72)+line(83,74,77,89)+line(126,72,128,53)+line(128,53,130,31)+line(104,84,84,109)+line(84,109,80,131)+line(104,84,126,109)+line(126,109,130,131)+kb(132,24,.7);
      break;
    case "snatch":
      p=head(105,37)+body(105,49,105,84)+line(105,59,84,77)+line(105,59,126,54)+line(84,77,76,96)+line(126,54,137,31)+line(137,31,144,18)+line(105,84,82,108)+line(82,108,78,131)+line(105,84,128,108)+line(128,108,133,131)+kb(145,15,.65)+arrow("M73 101 Q64 59 103 26");
      break;
    case "tgu":
      p=head(57,104)+body(68,103,101,103)+line(78,103,76,83)+line(76,83,91,67)+line(91,67,109,57)+line(109,57,119,39)+line(101,103,112,84)+line(112,84,125,74)+line(125,74,139,58)+kb(119,33,.62)+arrow("M51 120 Q73 133 94 124");
      break;
    case "deadlift":
      p=head(93,45)+body(93,57,119,81)+line(95,65,72,88)+line(95,65,119,92)+line(119,81,101,112)+line(101,112,95,130)+line(119,81,139,109)+line(139,109,148,130)+line(72,88,83,100)+line(119,92,133,99)+kb(94,106,.75);
      break;
    case "lunge":
      p=head(103,35)+body(103,47,103,83)+line(103,57,82,73)+line(103,57,126,72)+line(82,73,73,93)+line(126,72,134,91)+line(103,83,77,108)+line(77,108,58,130)+line(103,83,132,99)+line(132,99,157,130)+kb(106,75,.7);
      break;
    case "front_squat":
      p=head(104,34)+body(104,46,104,84)+line(104,56,82,66)+line(104,56,126,66)+line(82,66,92,73)+line(126,66,116,73)+line(104,84,78,103)+line(78,103,68,130)+line(104,84,130,103)+line(130,103,140,130)+kb(104,71,.78);
      break;
    case "high_pull":
      p=head(105,35)+body(105,47,105,83)+line(105,57,82,76)+line(105,57,128,73)+line(82,76,73,94)+line(128,73,135,52)+line(105,83,82,108)+line(82,108,77,130)+line(105,83,129,108)+line(129,108,134,130)+kb(134,45,.72)+arrow("M133 80 Q146 57 135 40");
      break;
    case "halo":
      p=head(105,35)+body(105,47,105,84)+line(105,58,83,68)+line(105,58,127,68)+line(83,68,91,54)+line(127,68,119,54)+line(91,54,103,22)+line(119,54,103,22)+line(105,84,82,108)+line(82,108,77,130)+line(105,84,128,108)+line(128,108,133,130)+kb(103,21,.68)+arrow("M77 48 Q105 5 137 47");
      break;
    case "russian_twist":
      p=head(91,65)+body(97,76,116,94)+line(101,78,78,87)+line(101,78,126,84)+line(116,94,94,111)+line(94,111,77,128)+line(116,94,139,111)+line(139,111,157,128)+line(78,87,94,88)+line(126,84,105,89)+kb(100,88,.65)+arrow("M66 73 Q55 97 74 114");
      break;
    case "situp":
      p=head(54,101)+body(63,100,94,82)+line(72,95,91,109)+line(94,82,119,94)+line(119,94,141,112)+line(141,112,161,128)+line(94,82,108,62)+line(108,62,120,52)+kb(126,49,.62)+arrow("M49 87 Q74 55 105 59");
      break;
    case "leg_pass":
      p=head(73,54)+body(84,65,111,92)+line(88,69,67,82)+line(88,69,108,76)+line(111,92,144,100)+line(144,100,171,91)+line(111,92,132,112)+line(132,112,153,128)+line(67,82,57,101)+kb(113,91,.65)+arrow("M148 76 Q169 65 176 82");
      break;
    case "pushup":
      p=head(55,76)+body(64,80,102,91)+line(76,84,53,103)+line(53,103,35,128)+line(102,91,125,108)+line(125,108,147,128)+line(102,91,126,84)+line(126,84,146,82)+arrow("M75 64 L124 64");
      break;
    case "push_drag":
      p=head(55,76)+body(64,80,103,91)+line(76,84,54,103)+line(54,103,35,128)+line(103,91,125,108)+line(125,108,147,128)+line(102,91,128,82)+line(128,82,148,82)+kb(132,88,.55)+arrow("M126 70 L151 70");
      break;
    case "plank":
      p=head(53,76)+body(63,80,103,91)+line(76,84,55,105)+line(55,105,36,128)+line(103,91,126,108)+line(126,108,148,128)+arrow("M70 65 L142 65");
      break;
    case "shoulder_tap":
      p=head(53,76)+body(63,80,103,91)+line(76,84,55,105)+line(55,105,36,128)+line(103,91,126,108)+line(126,108,148,128)+line(88,87,98,70)+line(98,70,106,64)+arrow("M99 61 Q112 50 124 61");
      break;
    case "mountain":
      p=head(53,76)+body(63,80,103,91)+line(76,84,55,105)+line(55,105,36,128)+line(103,91,126,108)+line(126,108,148,128)+line(88,88,72,109)+line(72,109,83,123)+line(103,91,118,105)+arrow("M84 121 Q96 133 109 121");
      break;
    case "bear_crawl":
      p=head(59,69)+body(68,75,104,91)+line(76,80,57,102)+line(57,102,42,121)+line(104,91,126,104)+line(126,104,143,122)+line(88,84,99,104)+line(99,104,113,121)+arrow("M37 62 Q76 48 118 62");
      break;
    default:
      p=head(105,35)+body(105,47,105,84)+line(105,58,82,75)+line(105,58,128,75)+line(105,84,82,108)+line(82,108,77,130)+line(105,84,128,108)+line(128,108,133,130);
  }
  return base+p+`</g></svg>`;
}

function exerciseCategory(type){
  if(["swing","goblet","clean","press","snatch","tgu","deadlift","lunge","front_squat","high_pull","halo"].includes(type)) return "KETTLEBELL";
  if(["russian_twist","situp","leg_pass"].includes(type)) return "ABDOMINALES";
  if(["pushup","push_drag"].includes(type)) return "FLEXIONES";
  return "CORE";
}


const commonsImg = (file) =>
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/" + encodeURIComponent(file);

const EXERCISE_IMAGES = {
  swing: commonsImg("Kettlebell swing with arms fully extended.jpg"),
  goblet: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Kettlebell_Goblet_Squat.webm/500px--Kettlebell_Goblet_Squat.webm.jpg",
  clean: commonsImg("Kettlebell Clean and Jerk 12 Rack Transition.jpg"),
  press: commonsImg('AB 201 honors fallen EOD members with memorial workout (8259417).jpg'),
  snatch: commonsImg("Kettlebell Half Snatch 11 Lockout - Fixation.jpg"),
  tgu: commonsImg("Turkish Get Up.jpg"),
  deadlift: commonsImg("Deadlift.JPG"),
  lunge: commonsImg("Girl doing lunges.jpg"),
  front_squat: commonsImg("Kettlebell Front Squat 4 Full.jpg"),
  high_pull: commonsImg("Kettlebell Clean and Jerk 8 Up-swing.jpg"),
  halo: "https://exercise-dataset.com/images/flat/kettlebell-halo-start.webp",
  russian_twist: commonsImg("Football strength image.jpg"),
  situp: commonsImg("Sit-up with weight.jpg"),
  leg_pass: commonsImg("Kettlebell truebalance romeike.jpg"),
  pushup: commonsImg("Push-up.jpg"),
  push_drag: commonsImg("Push up (PSF).png"),
  plank: commonsImg("Plank.jpg"),
  shoulder_tap: commonsImg('10th AAMDC host “Key Leader Physical Readiness Training” (8448512).jpg'),
  mountain: commonsImg('Airmen perform "mountain climbers".jpg'),
  bear_crawl: commonsImg("Weapons Co. conducts physical training 150326-M-PJ210-084.jpg")
};

const IMAGE_SOURCES = {
  swing: "Wikimedia Commons · CC BY-SA 4.0",
  goblet: "Wikimedia Commons · CC BY-SA 4.0",
  clean: "Wikimedia Commons · CC BY-SA 4.0",
  press: "U.S. Air Force / Wikimedia Commons · Public Domain",
  snatch: "Wikimedia Commons · CC BY-SA 4.0",
  tgu: "Wikimedia Commons · CC BY-SA 4.0",
  deadlift: "Wikimedia Commons · licencia indicada en Commons",
  lunge: "Wikimedia Commons · licencia indicada en Commons",
  front_squat: "Wikimedia Commons · CC BY-SA 4.0",
  high_pull: "Wikimedia Commons · CC BY-SA 4.0",
  halo: "RepDB · uso en app con atribución",
  russian_twist: "Wikimedia Commons · CC0 1.0",
  situp: "Wikimedia Commons · CC BY 2.0",
  leg_pass: "Wikimedia Commons · licencia indicada en Commons",
  pushup: "Wikimedia Commons · CC BY-SA 4.0",
  push_drag: "Wikimedia Commons · Public Domain",
  plank: "Wikimedia Commons · CC BY-SA 3.0",
  shoulder_tap: "U.S. Army / Wikimedia Commons · Public Domain",
  mountain: "U.S. Air Force / Wikimedia Commons · Public Domain",
  bear_crawl: "U.S. Marine Corps / Wikimedia Commons · Public Domain"
};


function movementGuide(type){
  const arrows = {
    swing:"M8 22 Q28 4 48 22 M48 22 l-7 -2 M48 22 l-2 -7",
    goblet:"M28 5 L28 42 M28 42 l-5 -7 M28 42 l5 -7",
    clean:"M12 38 Q24 10 40 20 M40 20 l-7 -1 M40 20 l-3 -6",
    press:"M28 42 L28 7 M28 7 l-5 7 M28 7 l5 7",
    snatch:"M12 40 Q22 8 39 6 M39 6 l-8 1 M39 6 l-2 7",
    tgu:"M10 38 Q18 12 40 12 M40 12 l-7 -3 M40 12 l-3 6",
    deadlift:"M10 12 Q28 32 46 12 M46 12 l-7 0 M46 12 l-3 6",
    lunge:"M12 8 L39 38 M39 38 l-8 -2 M39 38 l-2 -8",
    front_squat:"M28 6 L28 42 M28 42 l-5 -7 M28 42 l5 -7",
    high_pull:"M12 40 Q24 8 39 20 M39 20 l-7 -1 M39 20 l-3 -6",
    halo:"M9 27 Q28 2 47 27 M47 27 l-7 -2 M47 27 l-2 -7",
    russian_twist:"M9 13 Q28 35 47 13 M9 13 l6 0 M47 13 l-6 0",
    situp:"M10 38 Q18 8 42 12 M42 12 l-6 -3 M42 12 l-2 6",
    leg_pass:"M9 30 Q28 6 47 30 M47 30 l-7 -1 M47 30 l-2 -7",
    pushup:"M8 25 L48 25 M48 25 l-7 -4 M48 25 l-7 4",
    push_drag:"M10 34 Q28 10 46 34 M46 34 l-7 -1 M46 34 l-2 -7",
    plank:"M8 25 L48 25 M48 25 l-7 -4 M48 25 l-7 4",
    shoulder_tap:"M12 36 Q28 5 44 36 M44 36 l-7 -1 M44 36 l-2 -7",
    mountain:"M8 35 L28 12 L48 35 M48 35 l-7 -1 M48 35 l-2 -7",
    bear_crawl:"M8 30 L48 30 M48 30 l-7 -4 M48 30 l-7 4"
  };
  return `<span class="movement-guide" aria-hidden="true"><svg viewBox="0 0 56 48" xmlns="http://www.w3.org/2000/svg"><path d="${arrows[type]||arrows.plank}"/></svg></span>`;
}

function exerciseImage(type){
  const src = EXERCISE_IMAGES[type];
  const idx = EXERCISES.findIndex(e => e[2] === type);
  const num = idx >= 0 ? String(idx + 1).padStart(2,"0") : "";
  return `<div class="photo-frame">
    <img src="${src}" alt="" loading="lazy" referrerpolicy="no-referrer"
      onerror="this.closest('.photo-frame').classList.add('image-failed');this.style.display='none';">
    <div class="photo-shade"></div>
    <span class="photo-number">${num}</span>
    <span class="photo-category">${exerciseCategory(type)}</span>
    ${movementGuide(type)}
    <span class="photo-credit">${IMAGE_SOURCES[type] || "Imagen de licencia abierta"}</span>
  </div>`;
}

function renderExercises(){
  $("exerciseGrid").innerHTML=EXERCISES.map((e,i)=>`
    <button class="exercise-card ${state.selected.includes(i)?"selected":""}" data-i="${i}">
      <div class="art">${exerciseImage(e[2])}</div>
      <div class="exercise-info"><strong>${e[0]}</strong><small>${e[1]}</small></div>
    </button>`).join("");
  document.querySelectorAll(".exercise-card").forEach(card=>card.addEventListener("click",()=>{
    const i=Number(card.dataset.i);
    if(state.selected.includes(i)) state.selected=state.selected.filter(x=>x!==i);
    else if(state.selected.length<state.count) state.selected.push(i);
    $("selectedCount").textContent=state.selected.length;
    $("startSelectionBtn").disabled=state.selected.length!==state.count;
    renderExercises();
  }));
}
$("startSelectionBtn").addEventListener("click",()=>{state.weight=$("weight").value;startWorkout()});

function startWorkout(){
  if(!state.selected.length) return;
  state.exercise=0; state.round=1; state.phase="work"; state.remaining=state.work;
  state.phaseTotal=state.work; state.running=false; state.startedAt=Date.now(); state.elapsedBeforePause=0;
  updateWorkout(); showScreen("workout");
}
function updateWorkout(){
  const ex=EXERCISES[state.selected[state.exercise]];
  $("roundText").textContent=`${state.round}/${state.rounds}`;
  $("phaseText").textContent=state.phase==="work"?"TRABAJO":"DESCANSO";
  $("phaseText").style.color=state.phase==="work"?"#d64a68":"#b8b1b3";
  $("timer").textContent=String(state.remaining).padStart(2,"0");
  $("exerciseIndex").textContent=`EJERCICIO ${state.exercise+1}/${state.selected.length}`;
  $("workoutName").textContent=ex[0];
  $("workoutArt").innerHTML=artSvg(ex[2]);
  const elapsed=state.phaseTotal-state.remaining;
  $("progressBar").style.width=`${Math.max(0,Math.min(100,elapsed/state.phaseTotal*100))}%`;
  $("startStopBtn").textContent=state.running?"STOP":"START";
  $("startStopBtn").classList.toggle("danger",state.running);
  $("startStopBtn").classList.toggle("primary",!state.running);
}
function beep(freq=760,duration=.08){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const ctx=new C(),o=ctx.createOscillator(),g=ctx.createGain();
    o.frequency.value=freq;o.type="sine";g.gain.value=.12;o.connect(g);g.connect(ctx.destination);
    o.start();g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);o.stop(ctx.currentTime+duration);
  }catch(e){}
}
function tick(){
  if(!state.running)return;
  if(state.remaining>0){
    state.remaining--;
    const threshold=state.phase==="work"?10:5;
    if(state.remaining<=threshold && state.remaining>0) beep(state.remaining<=3?1000:760);
    updateWorkout();
  }
  if(state.remaining<=0) nextPhase();
}
function nextPhase(){
  if(state.phase==="work"){
    if(state.rest>0){
      state.phase="rest";state.remaining=state.rest;state.phaseTotal=state.rest;beep(500,.16);updateWorkout();return;
    }
    advanceExercise();
  }else advanceExercise();
}
function advanceExercise(){
  state.exercise++;
  if(state.exercise>=state.selected.length){
    state.exercise=0;state.round++;
    if(state.round>state.rounds){finishWorkout();return;}
  }
  state.phase="work";state.remaining=state.work;state.phaseTotal=state.work;beep(560,.16);updateWorkout();
}
$("startStopBtn").addEventListener("click",()=>{
  if(state.running){pauseWorkout();return;}
  state.running=true;
  if(!state.timerId) state.timerId=setInterval(tick,1000);
  updateWorkout();
});
function pauseWorkout(){
  state.running=false;clearInterval(state.timerId);state.timerId=null;
  $("pauseModal").classList.remove("hidden");updateWorkout();
}
$("resumeBtn").addEventListener("click",()=>{
  $("pauseModal").classList.add("hidden");state.running=true;state.timerId=setInterval(tick,1000);updateWorkout();
});
$("exitBtn").addEventListener("click",()=>{
  $("pauseModal").classList.add("hidden");clearInterval(state.timerId);state.timerId=null;showScreen("config");
});
function finishWorkout(){
  state.running=false;clearInterval(state.timerId);state.timerId=null;
  const seconds=Math.max(0,Math.round((Date.now()-state.startedAt)/1000));
  const session={date:new Date().toISOString(),seconds,work:state.work,rest:state.rest,rounds:state.rounds,count:state.selected.length,weight:state.weight||"",exercises:state.selected.map(i=>EXERCISES[i][0])};
  const history=JSON.parse(localStorage.getItem("kbHistory")||"[]");history.unshift(session);localStorage.setItem("kbHistory",JSON.stringify(history.slice(0,100)));
  renderSummary(session);showScreen("summary");
}
function fmt(sec){const m=Math.floor(sec/60),s=sec%60;return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}
function renderSummary(s){
  $("summaryTime").textContent=fmt(s.seconds);$("summaryExercises").textContent=s.count;$("summaryRounds").textContent=s.rounds;$("summaryWeight").textContent=s.weight?s.weight+" kg":"—";
  $("summaryList").innerHTML=s.exercises.map((x,i)=>`<div class="summary-item"><span>${String(i+1).padStart(2,"0")}</span><strong>${x}</strong></div>`).join("");
}
$("newWorkoutBtn").addEventListener("click",()=>showScreen("config"));
$("summaryHistoryBtn").addEventListener("click",()=>showScreen("history"));
function renderHistory(){
  const h=JSON.parse(localStorage.getItem("kbHistory")||"[]");
  $("emptyHistory").classList.toggle("hidden",h.length>0);
  $("historyList").innerHTML=h.map(s=>{
    const d=new Date(s.date), date=d.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"});
    return `<article class="history-item"><div class="history-top"><strong>${date}</strong><span>${fmt(s.seconds)}</span></div><div class="history-meta"><span>${s.count} ejercicios</span><span>${s.rounds} vueltas</span><span>${s.weight?s.weight+" kg":"sin peso"}</span></div><div class="history-exercises">${s.exercises.join(" · ")}</div></article>`;
  }).join("");
}
$("clearHistoryBtn").addEventListener("click",()=>{
  if(confirm("¿Borrar todo el historial?")){localStorage.removeItem("kbHistory");renderHistory();}
});
updateSettings();
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
