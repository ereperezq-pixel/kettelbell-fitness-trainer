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
  const kettlebell = `<path d="M68 58c0-16 24-16 24 0" fill="none" stroke="#ddd" stroke-width="6" stroke-linecap="round"/><circle cx="80" cy="78" r="17" fill="#b82d4d"/><path d="M70 77h20" stroke="#6b0e24" stroke-width="3"/>`;
  const head = `<circle cx="79" cy="34" r="7" fill="#eee"/>`;
  const stick = (body="M79 42L79 75", arms="M79 49L55 61M79 49L103 61", legs="M79 75L63 105M79 75L96 105") => `${head}<path d="${body}" stroke="#eee" stroke-width="5" stroke-linecap="round" fill="none"/><path d="${arms}" stroke="#eee" stroke-width="5" stroke-linecap="round"/><path d="${legs}" stroke="#eee" stroke-width="5" stroke-linecap="round"/>`;
  let body=stick();
  if(type==="swing") body=`${head}<path d="M79 42L67 70L78 91" stroke="#eee" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M68 53L55 72M68 53L91 72" stroke="#eee" stroke-width="5" stroke-linecap="round"/>${kettlebell}<path d="M78 91L58 108M78 91L96 108" stroke="#eee" stroke-width="5" stroke-linecap="round"/>`;
  if(type==="squat"||type==="frontsquat") body=`${head}<path d="M79 42L79 70L61 87M79 70L97 87" stroke="#eee" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M79 50L61 53M79 50L97 53" stroke="#eee" stroke-width="5" stroke-linecap="round"/>${kettlebell}<path d="M61 87L53 108M97 87L105 108" stroke="#eee" stroke-width="5" stroke-linecap="round"/>`;
  if(type==="pushup"||type==="drag") body=`${head}<path d="M44 79L84 72L112 90" stroke="#eee" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M57 77L48 101M101 83L108 106" stroke="#eee" stroke-width="5" stroke-linecap="round"/>${type==="drag"?kettlebell:""}`;
  if(type==="plank"||type==="tap") body=`${head}<path d="M42 80L88 75L112 91" stroke="#eee" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M53 78L47 104M100 83L105 106" stroke="#eee" stroke-width="5" stroke-linecap="round"/>`;
  if(type==="twist"||type==="situp"||type==="legpass") body=`${head}<path d="M79 42L64 67L90 79" stroke="#eee" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M64 67L43 91M90 79L111 94" stroke="#eee" stroke-width="5" stroke-linecap="round"/>${kettlebell}`;
  if(["clean","press","snatch","highpull","halo"].includes(type)) body=`${stick()}${kettlebell}`;
  return `<svg viewBox="0 0 160 130" width="100%" height="100%" aria-hidden="true"><g transform="translate(0,-4)">${body}</g></svg>`;
}
function renderExercises(){
  $("exerciseGrid").innerHTML=EXERCISES.map((e,i)=>`
    <button class="exercise-card ${state.selected.includes(i)?"selected":""}" data-i="${i}">
      <div class="art">${artSvg(e[2])}</div>
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
