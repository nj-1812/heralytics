import {CASES,PTS,HINT_COST,MAX_ATTEMPTS} from "./cases.js";
import {FIREBASE_CONFIG} from "./config.js";

/* ---------- STATE ---------- */
const KEY="heralytics-desk-v1";
let S={name:"",start:null,end:null,cases:{},notes:{}};
try{const r=localStorage.getItem(KEY);if(r)S=Object.assign(S,JSON.parse(r));}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}queueSync()}
function C(id){return S.cases[id]||(S.cases[id]={status:"open",attempts:0,hints:{},answers:{},score:0,results:null})}
const done=id=>{const c=S.cases[id];return c&&(c.status==="solved"||c.status==="cold")};
const unlocked=id=>id===1||done(id-1);
const norm=s=>String(s??"").toLowerCase().replace(/\s+/g,"");
const enc=s=>{try{return btoa(norm(s).split("").reverse().join(""))}catch(e){return ""}};
function check(q,v){let x=v; if(q.t==="num"){const n=parseFloat(String(v).replace(/,/g,""));if(isNaN(n))return false;x=String(n)} return enc(x)===q.a}
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function toast(m){const t=$("#toast");t.textContent=m;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,2600)}

/* ---------- ART ---------- */
function fingerprint(){let p="";for(let i=1;i<15;i++){const rx=3+i*2.6,ry=4+i*3.2;const da=`${6+((i*7)%9)} ${2+(i%3)}`;p+=`<ellipse cx="30" cy="38" rx="${rx}" ry="${ry}" fill="none" stroke="#241d16" stroke-width="1.5" stroke-dasharray="${da}" transform="rotate(${(i%2?-6:4)} 30 38)"/>`}
 return `<svg viewBox="0 0 60 76" width="100%" height="100%"><clipPath id="fpc${Math.random().toString(36).slice(2,6)}"><ellipse cx="30" cy="38" rx="27" ry="35"/></clipPath>${p}</svg>`}
function mugshot(s,i){const sh=[["M50 112c0-26 14-40 50-40s50 14 50 40","42","34"],["M44 112c2-24 18-38 56-38s54 14 56 38","40","38"],["M48 112c0-28 16-42 52-42s52 14 52 42","44","32"]][s.shape||0];
 let lines="";for(let y=20;y<140;y+=12)lines+=`<line x1="0" x2="200" y1="${y}" y2="${y}" stroke="#a89d86" stroke-width="${y%36===20?1.4:.6}"/>`;
 return `<svg class="ph" viewBox="0 0 200 200" role="img" aria-label="Mugshot silhouette of ${esc(s.name)}"><rect width="200" height="200" fill="#d8d0bd"/>${lines}<text x="6" y="32" font-family="Courier Prime,monospace" font-size="10" fill="#7d7260">6'</text><text x="6" y="80" font-family="Courier Prime,monospace" font-size="10" fill="#7d7260">5'</text><g transform="translate(0,62)"><path d="${sh[0]}" fill="${s.tone}"/></g><ellipse cx="100" cy="${78-+sh[2]/4}" rx="${sh[2]}" ry="${sh[1]}" fill="${s.tone}"/><rect x="62" y="150" width="76" height="30" fill="#241d16"/><text x="100" y="170" text-anchor="middle" font-family="Courier Prime,monospace" font-size="12" fill="#f4ecd8">${esc(s.badge)}</text></svg>`}
const ART={
 door:`<svg class="ph" viewBox="0 0 200 200" role="img" aria-label="Keypad with broken seal"><rect width="200" height="200" fill="#5d5448"/><rect x="60" y="30" width="80" height="130" rx="6" fill="#2b2620"/><rect x="72" y="42" width="56" height="20" fill="#7fae6a"/><text x="100" y="57" text-anchor="middle" font-size="11" font-family="Courier Prime" fill="#1c2a16">OVRD</text>${[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${74+c*18}" y="${72+r*20}" width="14" height="14" rx="2" fill="#a8a196"/>`).join("")).join("")}<path d="M50 120l100-30" stroke="#b02a20" stroke-width="6"/><path d="M98 104l6 14-12 2z" fill="#f4ecd8"/></svg>`,
 shoe:`<svg class="ph" viewBox="0 0 200 200" role="img" aria-label="Shoe print in dust"><rect width="200" height="200" fill="#bfb39b"/><g fill="#5a4a39" opacity=".75" transform="rotate(-18 100 100)"><ellipse cx="100" cy="72" rx="30" ry="44"/><ellipse cx="100" cy="150" rx="22" ry="26"/></g><g stroke="#bfb39b" stroke-width="2" transform="rotate(-18 100 100)">${[50,60,70,80,90,100].map(y=>`<line x1="74" x2="126" y1="${y}" y2="${y}"/>`).join("")}</g><rect x="140" y="20" width="44" height="14" fill="#f4ecd8"/><text x="162" y="31" text-anchor="middle" font-size="10" font-family="Courier Prime">SZ 10</text></svg>`,
 log:`<svg class="ph" viewBox="0 0 200 200" role="img" aria-label="Observation log page"><rect width="200" height="200" fill="#efe6cf"/>${[40,62,84,106,128].map((y,i)=>`<line x1="20" x2="180" y1="${y}" y2="${y}" stroke="#9fb3c8"/><text x="22" y="${y-5}" font-size="11" font-family="Kalam" fill="#2b3a56">${["23:12 Saturn, clear","23:26 M42 seeing 2.1","23:38 refocus","23:49 there is someo",""][i]}</text>`).join("")}<path d="M120 130q10 10 0 40" stroke="#2b3a56" fill="none"/></svg>`,
 static:`<svg class="ph" viewBox="0 0 200 200" role="img" aria-label="Camera static"><filter id="st"><feTurbulence baseFrequency=".9" numOctaves="1"/><feColorMatrix type="saturate" values="0"/></filter><rect width="200" height="200" filter="url(#st)"/><rect x="10" y="10" width="86" height="18" fill="#000"/><text x="14" y="23" font-size="11" font-family="Courier Prime" fill="#ff5a4e">● FEED LOST</text><text x="190" y="190" text-anchor="end" font-size="11" font-family="Courier Prime" fill="#fff">CAM-04 23:40</text></svg>`,
 crate:`<svg class="ph" viewBox="0 0 200 200" role="img" aria-label="Wooden crate with wax seal"><rect width="200" height="200" fill="#8b6a43"/>${[40,80,120,160].map(y=>`<rect x="20" y="${y-30}" width="160" height="34" fill="#b08a5a" stroke="#6b4f2e"/>`).join("")}<circle cx="100" cy="100" r="20" fill="#b8382b"/><circle cx="100" cy="100" r="12" fill="none" stroke="#e06a55"/><text x="100" y="185" text-anchor="middle" font-family="Courier Prime" font-size="14" fill="#f4ecd8">CR-0419</text></svg>`,
 sticker:`<svg class="ph" viewBox="0 0 200 200" role="img" aria-label="Expired calibration sticker"><rect width="200" height="200" fill="#9aa0a4"/><rect x="40" y="60" width="120" height="80" fill="#f4ecd8" stroke="#241d16" stroke-width="2"/><text x="100" y="84" text-anchor="middle" font-family="Oswald" font-size="14">CALIBRATED</text><text x="100" y="106" text-anchor="middle" font-family="Courier Prime" font-size="13">SC-3</text><text x="100" y="126" text-anchor="middle" font-family="Courier Prime" font-size="11" fill="#b02a20">DUE: FEB 1987</text></svg>`,
 glove:`<svg class="ph" viewBox="0 0 200 200" role="img" aria-label="Cotton glove"><rect width="200" height="200" fill="#6f6658"/><path d="M70 170V90q0-12 10-12v-30q0-10 9-10t9 10v-6q0-10 9-10t9 10v6q0-8 9-8t9 8v40l12-14q8-6 13 0t-2 14l-26 40v52z" fill="#efe9da" stroke="#c9bfa8" stroke-width="2"/>${[0,1,2,3,4,5,6,7].map(i=>`<circle cx="${92+((i*13)%30)}" cy="${60+i*9}" r="1.6" fill="#9cc"/>`).join("")}</svg>`
};
const sealSVG=`<svg class="seal" viewBox="0 0 42 42" aria-hidden="true"><circle cx="21" cy="21" r="19" fill="#9b2a1f"/><circle cx="21" cy="21" r="13" fill="none" stroke="#d76a5a" stroke-width="2"/><path d="M15 23v-4a6 6 0 0 1 12 0v4" fill="none" stroke="#f4ecd8" stroke-width="2.4"/><rect x="13" y="22" width="16" height="10" rx="2" fill="#f4ecd8"/></svg>`;
const clipSVG=(l)=>`<svg class="clip" style="left:${l}" viewBox="0 0 20 60" aria-hidden="true"><path d="M6 50V12a4 4 0 0 1 8 0v36a7 7 0 0 1-14 0V8a10 10 0 0 1 20 0v38" fill="none" stroke="#8a8f94" stroke-width="2.2"/></svg>`;

/* ---------- HELPERS ---------- */
function elapsed(){if(!S.start)return 0;return Math.floor(((S.end||Date.now())-S.start)/1000)}
function fmt(t){const h=String(Math.floor(t/3600)).padStart(2,"0"),m=String(Math.floor(t%3600/60)).padStart(2,"0"),s=String(t%60).padStart(2,"0");return `${h}:${m}:${s}`}
function totals(){let solved=0,score=0,fails=0,closed=0;for(const k in S.cases){const c=S.cases[k];if(c.status==="solved")solved++;if(done(+k))closed++;score+=c.score||0;fails+=c.status==="solved"?c.attempts-1:c.attempts}return{solved,score,fails,closed}}
function activeCase(){for(const c of CASES)if(!done(c.id))return c.id;return null}

/* ---------- VIEWS ---------- */
function viewDesk(){
 const t=totals(),act=activeCase();
 return `<div class="board">
 <section class="sheet ring">${clipSVG("2rem")}
  <div class="hello">
   <div>
    <span class="lbl">Investigation dossier desk</span>
    <h1 style="margin-top:.8rem">Decode data. Uncover the truth.</h1>
    <p style="margin-top:.6rem;max-width:58ch">Ten connected crimes. One shadow mastermind. Work each case file in order: read the briefing, test every alibi against the records, and submit five findings to close it.</p>
    <div class="namefield"><label for="detName">Detective</label><input id="detName" placeholder="write your full name" value="${esc(S.name)}" maxlength="40" autocomplete="off"></div>
    <div style="margin-top:.5rem">${syncChip()}</div>
    <div style="margin-top:1.2rem;display:flex;gap:.8rem;flex-wrap:wrap">${act?`<button class="cta" id="startBtn" data-go="case-${act}" ${S.name.trim()?"":"disabled"}>${S.start?"Continue investigation":"Open first case"} →</button><span class="muted" id="nameNote" style="font-size:.85rem;align-self:center" ${S.name.trim()?"hidden":""}>Write your name first. It goes on your case file and the organisers' board.</span>`:`<button class="cta" data-go="standings">View your record →</button>`}</div>
   </div>
   <div class="wanted"><div class="w">WANTED</div>
    <svg viewBox="0 0 120 140" role="img" aria-label="Unknown suspect silhouette"><rect width="120" height="140" fill="#d9d2c0"/><circle cx="60" cy="52" r="24" fill="#241d16"/><path d="M18 140c0-34 18-50 42-50s42 16 42 50z" fill="#241d16"/><text x="60" y="62" text-anchor="middle" font-family="Alfa Slab One" font-size="26" fill="#f4ecd8">?</text></svg>
    <b style="letter-spacing:.14em">ARCHITECT-ZERO</b><span class="muted" style="font-size:.8rem">Identity unknown · unmask in Case 10</span></div>
  </div>
  <div class="metrics" role="list">
   <div class="metric" role="listitem"><span>Cases solved</span><strong>${t.solved} / 10</strong></div>
   <div class="metric" role="listitem"><span>Total score</span><strong>${t.score} pts</strong></div>
   <div class="metric" role="listitem"><span>Investigation time</span><strong id="clock">${fmt(elapsed())}</strong></div>
   <div class="metric" role="listitem"><span>Failed attempts</span><strong>${t.fails}</strong></div>
  </div>
 </section>
 <section class="sheet">
  <div class="secrow"><span class="lbl">The ten case folders</span><span class="muted" style="font-size:.88rem">Cases unseal in order. Close one to open the next.</span></div>
  <div class="folders">${CASES.map(c=>{const st=S.cases[c.id]?.status,u=unlocked(c.id)&&!!S.name.trim();
   const label=st==="solved"?"Solved & closed":st==="cold"?"Cold case":u?"Unsealed":"Sealed";
   return `<button class="folder ${act===c.id?"active":""}" ${u?`data-go="case-${c.id}"`:"disabled"} aria-label="Case ${c.id}: ${u?esc(c.title):"sealed"}, ${label}">
    <span class="no">${String(c.id).padStart(2,"0")}</span>
    ${st==="solved"?`<span class="stamp red mini">Closed</span>`:st==="cold"?`<span class="stamp ink mini">Cold</span>`:""}
    <span class="ti">${u?esc(c.title):"Classified"}</span><span class="st">${label}</span>${u?"":sealSVG}</button>`}).join("")}</div>
 </section></div>`;
}

let tab="briefing", dsIdx=0, dsView="grid", dsQ="", dsCol="", dsSort={c:-1,d:1};
function viewCase(id){
 const c=CASES.find(x=>x.id===id);
 if(!c||!unlocked(id))return `<section class="sheet"><span class="stamp red big">Sealed</span><p style="margin-top:1.2rem">Close the previous case to unseal this folder.</p><p style="margin-top:1rem"><button class="ghost" data-go="desk">Back to case desk</button></p></section>`;
 if(!S.name.trim())return `<section class="sheet"><span class="lbl">Name required</span><h1 style="margin-top:.8rem;font-size:clamp(1.6rem,5vw,2.2rem)">Sign your case file first</h1><p style="margin-top:.8rem">Write your detective name on the case desk. The organisers use it to follow your progress.</p><p style="margin-top:1rem"><button class="cta" data-go="desk">Go to case desk</button></p></section>`;
 if(!c.questions)return `<section class="sheet ring">${clipSVG("2rem")}<span class="lbl">Case ${String(id).padStart(2,"0")} · ${esc(c.crime)}</span><h1 style="margin-top:.8rem;font-size:clamp(1.8rem,5vw,2.6rem)">${esc(c.title)}</h1><p style="margin-top:1rem;max-width:60ch">This folder is unsealed, but HQ has not delivered the case file yet. Organisers load the briefing, suspects, evidence and datasets for this case before the event.</p><div style="margin-top:1.4rem"><span class="stamp ink">Awaiting file</span></div><p style="margin-top:1.4rem"><button class="ghost" data-go="desk">Back to case desk</button></p></section>`;
 if(!S.start){S.start=Date.now();save()}
 const st=C(id);
 const tabs=[["briefing","Briefing"],["suspects","Suspects"],["evidence","Evidence"],["datasets","Datasets"],["notes","Scratchpad"],["findings","Findings"]];
 return `<section class="sheet">${clipSVG("calc(100% - 4rem)")}
  <div class="casehead"><div>
   <span class="lbl">Case file No. HX-C${String(id).padStart(2,"0")}</span>
   <h1 style="margin-top:.7rem">${esc(c.title)}</h1>
   <div class="meta"><span>Place <b>${esc(c.place)}</b></span><span>Date <b>${esc(c.date)}</b></span><span>Crime window <b>${esc(c.time)}</b></span></div>
   <div class="classified">★ Classified information · for authorised detectives only ★</div></div>
   <div>${st.status==="solved"?`<span class="stamp red big">Case closed</span>`:st.status==="cold"?`<span class="stamp ink big">Cold case</span>`:`<span class="stamp red">Top secret</span>`}</div>
  </div>
  <div class="tabs" role="tablist">${tabs.map(([k,l],i)=>`<button role="tab" id="tab-${k}" aria-selected="${tab===k}" aria-controls="panel" data-tab="${k}">${i+1} · ${l}</button>`).join("")}</div>
  <div class="panel" id="panel" role="tabpanel" aria-labelledby="tab-${tab}">${panel(c,st)}</div>
 </section>`;
}
function panel(c,st){
 if(tab==="briefing")return `<div class="two">
  <div style="display:grid;gap:1.6rem;padding-top:.6rem">
   <div class="box"><span class="lbl">Summary</span><p>${esc(c.summary)}</p><p class="muted">${esc(c.details)}</p></div>
   <div class="box"><span class="lbl">Reconstruction timeline</span><ol class="timeline">${c.timeline.map(([t,e])=>`<li><time>${t}</time><span>${esc(e)}</span></li>`).join("")}</ol></div>
  </div>
  <div class="casecard" style="margin-top:.6rem"><h3>Case file</h3><div><b>Date</b>${esc(c.date)}</div><div><b>Window</b>${esc(c.time)}</div><div><b>Place</b>${esc(c.place)}</div><div><b>Crime</b>${esc(c.crime)}</div><div><b>Suspects</b>${c.suspects.length}</div><p class="hand" style="margin-top:.4rem;font-size:1.05rem;color:var(--red)">Note the crime window before you touch the data.</p></div>
 </div>`;
 if(tab==="suspects")return `<p class="muted" style="font-size:.9rem">Treat every alibi as a claim to test against the datasets.</p><div class="pols">${c.suspects.map((s,i)=>`<article class="pol">${mugshot(s,i)}<span class="lbl nm">${esc(s.name)}</span><dl><div><dt>Role</dt><dd>${esc(s.role)}</dd></div><div><dt>Motive</dt><dd>${esc(s.motive)}</dd></div></dl><p class="q">“${esc(s.alibi)}”</p></article>`).join("")}</div>`;
 if(tab==="evidence")return `<p class="muted" style="font-size:.9rem">Physical items often name the badge, crate or time you then look up in the datasets.</p><div class="pols">${c.evidence.map(e=>`<article class="pol"><span class="letter">${e.k}</span>${ART[e.art]}<span class="lbl nm">${esc(e.title)}</span><p class="q">${esc(e.note)}</p></article>`).join("")}</div>`;
 if(tab==="datasets")return datasetPanel(c);
 if(tab==="notes")return `<div class="pad"><label class="sr" for="notes">Detective scratchpad</label><textarea id="notes" placeholder="Alibi times, suspicious IDs, deductions…">${esc(S.notes[c.id]||"")}</textarea></div><p class="muted" style="font-size:.85rem;margin-top:.8rem">Saves automatically in this browser. Keep working on the same device.</p>`;
 return findingsPanel(c,st);
}
function datasetPanel(c){
 const ds=c.datasets[dsIdx]||c.datasets[0];
 let rows=ds.rows.trim().split("\n").map(r=>r.split(","));
 const q=dsQ.trim().toLowerCase();
 if(q)rows=rows.filter(r=>(dsCol===""?r:[r[+dsCol]]).some(v=>v.toLowerCase().includes(q)));
 if(dsSort.c>=0){const k=dsSort.c;rows.sort((a,b)=>{const x=a[k],y=b[k],nx=parseFloat(x),ny=parseFloat(y);const r=!isNaN(nx)&&!isNaN(ny)&&/^[\d.\-]+$/.test(x)?nx-ny:x.localeCompare(y);return r*dsSort.d})}
 const hl=v=>{if(!q)return esc(v);const i=v.toLowerCase().indexOf(q);return i<0?esc(v):esc(v.slice(0,i))+"<mark>"+esc(v.slice(i,i+q.length))+"</mark>"+esc(v.slice(i+q.length))};
 let body;
 if(dsView==="grid"){
  body=`<div class="gridwrap"><table><thead><tr>${ds.cols.map((h,i)=>`<th scope="col" aria-sort="${dsSort.c===i?(dsSort.d>0?"ascending":"descending"):"none"}"><button data-sort="${i}">${esc(h)} ${dsSort.c===i?(dsSort.d>0?"▲":"▼"):""}</button></th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(v=>`<td>${hl(v)}</td>`).join("")}</tr>`).join("")||`<tr><td colspan="${ds.cols.length}">No records match “${esc(dsQ)}”.</td></tr>`}</tbody></table></div>`;
 }else{
  body=`<div class="stats">${ds.cols.map((h,i)=>{const vals=rows.map(r=>r[i]);const nums=vals.map(Number).filter(n=>!isNaN(n));const isNum=nums.length===vals.length&&vals.length&&vals.every(v=>/^[\d.\-]+$/.test(v));
   const uniq=[...new Set(vals)];
   return `<div class="box"><b>${esc(h)}</b><span>Records: ${vals.length} · Missing: ${vals.filter(v=>v==="").length}</span>${isNum?`<span>Min ${Math.min(...nums)} · Max ${Math.max(...nums)}</span><span>Average ${(nums.reduce((a,b)=>a+b,0)/nums.length).toFixed(3)}</span>`:`<span>Distinct values: ${uniq.length}</span>${uniq.length<=6?`<span class="muted">${uniq.map(u=>`${esc(u)} (${vals.filter(v=>v===u).length})`).join(", ")}</span>`:""}`}</div>`}).join("")}</div>`;
 }
 return `<div class="files" role="group" aria-label="Dataset files">${c.datasets.map((d,i)=>`<button aria-pressed="${i===dsIdx}" data-ds="${i}">${esc(d.file)}</button>`).join("")}</div>
 <div class="tools"><label class="sr" for="dsq">Search records</label><input id="dsq" type="search" placeholder="Search IDs, times, names…" value="${esc(dsQ)}">
  <label class="sr" for="dscol">Column</label><select id="dscol"><option value="">All columns</option>${ds.cols.map((h,i)=>`<option value="${i}" ${String(i)===dsCol?"selected":""}>${esc(h)}</option>`).join("")}</select>
  <div class="seg" role="group" aria-label="View"><button aria-pressed="${dsView==="grid"}" data-view="grid">Grid</button><button aria-pressed="${dsView==="stats"}" data-view="stats">Statistics</button></div>
  <button class="ghost" data-dlcsv="1">Download CSV</button><button class="ghost" data-copy="1">Copy</button></div>
 ${body}<p class="dsnote muted">${rows.length} of ${ds.rows.trim().split("\n").length} records shown${dsSort.c>=0?` · sorted by ${esc(ds.cols[dsSort.c])}`:""}. Click a column header to sort.</p>`;
}
function findingsPanel(c,st){
 const locked=st.status!=="open";
 const pts=c.questions.reduce((a,_,i)=>a+PTS-(st.hints[i]?HINT_COST:0),0);
 return `<form id="findings" novalidate><div class="slips">${c.questions.map((q,i)=>{const v=st.answers[i]??"";const r=st.results?.[i];
  const inp=q.t==="mc"?`<div class="opts" role="radiogroup" aria-labelledby="q${i}">${q.opts.map((o,j)=>`<label><input type="radio" name="a${i}" id="a${i}-${j}" value="${esc(o)}" ${v===o?"checked":""} ${locked?"disabled":""}>${esc(o)}</label>`).join("")}</div>`
   :`<label class="sr" for="a${i}">Answer</label><input type="text" id="a${i}" name="a${i}" value="${esc(v)}" placeholder="${esc(q.ph||"")}" autocomplete="off" ${locked?"disabled":""}>`;
  return `<div class="slip"><div class="qh"><b id="q${i}">Finding ${i+1} · ${q.t==="mc"?"Multiple choice":q.t==="num"?"Numeric":"Text"}</b>${r!=null&&st.status==="open"?`<span class="verdict ${r?"ok":"no"}">${r?"Holds up":"Contradicts the data"}</span>`:""}<span class="muted" style="font-size:.82rem">${PTS-(st.hints[i]?HINT_COST:0)} pts</span></div>
   <p class="qt">${esc(q.q)}</p>${inp}
   ${st.hints[i]?`<p class="hint"><b>Field hint:</b> ${esc(q.hint)}</p>`:locked?"":`<button type="button" class="hintbtn" data-hint="${i}">Unlock field hint (−${HINT_COST} pts)</button>`}</div>`}).join("")}</div>
 ${st.status==="solved"?`<div class="result"><span class="stamp red big slam">Case closed</span><div><p><b>${st.score} points</b> added to your record.</p>${CASES[c.id]?`<p style="margin-top:.8rem"><button type="button" class="cta" data-go="case-${c.id+1}">Proceed to next case →</button></p>`:""}</div></div>`
 :st.status==="cold"?`<div class="result"><span class="stamp ink big">Cold case</span><div><p>Five attempts used. No points for this case. The next folder is unsealed.</p>${CASES[c.id]?`<p style="margin-top:.8rem"><button type="button" class="cta" data-go="case-${c.id+1}">Proceed to next case →</button></p>`:""}</div></div>`
 :`<div class="submitbar"><div class="attempts" aria-label="${st.attempts} of ${MAX_ATTEMPTS} attempts used">Attempts ${[...Array(MAX_ATTEMPTS)].map((_,i)=>`<i class="${i<st.attempts?"used":""}"></i>`).join("")}</div><span>Worth ${pts} pts now</span><button class="cta" type="submit">Submit evidence findings</button></div>`}
 </form>`;
}
function viewStandings(){
 const t=totals();
 return `<div class="board"><section class="sheet ring">${clipSVG("2rem")}
  <span class="lbl">Official standings</span><h1 style="margin-top:.8rem;font-size:clamp(1.8rem,5vw,2.6rem)">How the winner is decided</h1>
  <p style="margin-top:.6rem;max-width:60ch">Detectives are ranked by these rules, in this order. A later rule only applies when everything above it is tied.</p>
  <ol class="rules" style="margin-top:1.4rem">
   <li><div><h3>Finishers first</h3><p class="muted">Anyone who closes all 10 cases ranks above anyone who has not.</p></div></li>
   <li><div><h3>Most cases solved</h3><p class="muted">More solved cases ranks higher.</p></div></li>
   <li><div><h3>Shortest elapsed time</h3><p class="muted">Among finishers, the fastest time wins.</p></div></li>
   <li><div><h3>Highest total score</h3><p class="muted">Breaks a tie when times are identical.</p></div></li>
   <li><div><h3>Fewest errors</h3><p class="muted">Fewest failed submissions breaks any tie left.</p></div></li>
  </ol></section>
  <section class="sheet"><div class="secrow"><span class="lbl">Your record</span><span class="hand" style="font-size:1.3rem">${esc(S.name||"Unnamed detective")}</span></div>
  <div class="gridwrap" style="max-height:none"><table class="record"><thead><tr><th scope="col" style="padding:.45rem .6rem">Case</th><th scope="col" style="padding:.45rem .6rem">Status</th><th scope="col" style="padding:.45rem .6rem">Attempts</th><th scope="col" style="padding:.45rem .6rem">Hints</th><th scope="col" style="padding:.45rem .6rem">Points</th></tr></thead><tbody>
  ${CASES.map(c=>{const s=S.cases[c.id];return `<tr><td>${String(c.id).padStart(2,"0")} · ${unlocked(c.id)?esc(c.title):"Classified"}</td><td>${s?.status==="solved"?"Solved":s?.status==="cold"?"Cold case":unlocked(c.id)?"Open":"Sealed"}</td><td>${s?s.attempts:"–"}</td><td>${s?Object.keys(s.hints).length:"–"}</td><td>${s?.score||0}</td></tr>`}).join("")}
  <tr><td><b>Total</b></td><td>${t.closed} / 10 closed</td><td>${t.fails} failed</td><td></td><td><b>${t.score}</b></td></tr></tbody></table></div>
  <p class="muted" style="margin-top:.8rem;font-size:.88rem">Elapsed time: <b style="color:var(--ink)">${fmt(elapsed())}</b>${S.end?" (finished)":""}. Progress is kept in this browser only.</p>
  <p style="margin-top:1rem"><button class="ghost" id="reset">Clear my progress</button> <span id="resetConfirm" hidden><span class="muted" style="font-size:.88rem">This wipes every case and note.</span> <button class="ghost" id="resetYes" style="border-color:var(--red);color:var(--red)">Yes, clear it</button></span></p>
  </section></div>`;
}

/* ---------- ROUTER ---------- */
function route(){
 const h=location.hash.replace("#","")||"desk";
 document.querySelectorAll("[data-nav]").forEach(a=>a.toggleAttribute("aria-current",false));
 let html;
 const m=h.match(/^case-(\d+)$/);
 if(m){const id=+m[1];if(route.cur!==h){tab="briefing";dsIdx=0;dsQ="";dsCol="";dsSort={c:-1,d:1}}html=viewCase(id)}
 else if(h==="admin"){html=viewAdmin();$('[data-nav="admin"]').setAttribute("aria-current","page")}
 else if(h==="standings"){html=viewStandings();$('[data-nav="standings"]').setAttribute("aria-current","page")}
 else{html=viewDesk();$('[data-nav="desk"]').setAttribute("aria-current","page")}
 route.cur=h; $("#app").innerHTML=html;
}
function rerender(keepFocus){const a=document.activeElement,id=a&&a.id,pos=a&&a.selectionStart;route();if(keepFocus&&id){const e=document.getElementById(id);if(e){e.focus();try{e.setSelectionRange(pos,pos)}catch(_){}}}}
function go(h){if(location.hash==="#"+h)route();else location.hash=h;window.scrollTo({top:0})}
window.addEventListener("hashchange",()=>{route();window.scrollTo({top:0})});

document.addEventListener("click",e=>{
 const g=e.target.closest("[data-go]");if(g){go(g.dataset.go);return}
 const t=e.target.closest("[data-tab]");if(t){tab=t.dataset.tab;rerender();document.getElementById("tab-"+tab)?.focus();return}
 const d=e.target.closest("[data-ds]");if(d){dsIdx=+d.dataset.ds;dsQ="";dsCol="";dsSort={c:-1,d:1};rerender();return}
 const v=e.target.closest("[data-view]");if(v){dsView=v.dataset.view;rerender();return}
 const s=e.target.closest("[data-sort]");if(s){const i=+s.dataset.sort;dsSort=dsSort.c===i?{c:i,d:-dsSort.d}:{c:i,d:1};rerender();document.querySelector(`[data-sort="${i}"]`)?.focus();return}
 const cp=e.target.closest("[data-copy]");if(cp){const c=curCase();const ds=c.datasets[dsIdx];const txt=ds.cols.join(",")+"\n"+ds.rows.trim();
  const fb=()=>toast("Copy is blocked here. Select the table and copy it manually.");
  try{navigator.clipboard.writeText(txt).then(()=>toast(`${ds.file} copied. Paste it into Excel or Python.`),fb)}catch(_){fb()}return}
 const hb=e.target.closest("[data-hint]");if(hb){const c=curCase(),st=C(c.id);saveDraft(c);st.hints[hb.dataset.hint]=true;save();rerender();toast(`Hint unlocked. −${HINT_COST} pts on that finding.`);return}
 if(e.target.id==="reset"){$("#resetConfirm").hidden=false;return}
 if(e.target.id==="resetYes"){S={name:S.name,start:null,end:null,cases:{},notes:{}};save();route();toast("Progress cleared.");return}
});
function curCase(){const m=(location.hash||"").match(/case-(\d+)/);return CASES.find(c=>c.id===+m?.[1])}
function saveDraft(c){const f=$("#findings");if(!f)return;const st=C(c.id);c.questions.forEach((q,i)=>{if(q.t==="mc"){const r=f.querySelector(`input[name="a${i}"]:checked`);st.answers[i]=r?r.value:""}else st.answers[i]=f.querySelector(`#a${i}`).value});save()}
document.addEventListener("input",e=>{
 if(e.target.id==="detName"){S.name=e.target.value;save();const ok=!!S.name.trim(),b=$("#startBtn"),n=$("#nameNote");if(b)b.disabled=!ok;if(n)n.hidden=ok;if(ok!==route.named){route.named=ok;const f=document.querySelector(".folders");if(f){const tmp=document.createElement("div");tmp.innerHTML=viewDesk();f.replaceWith(tmp.querySelector(".folders"))}}}
 if(e.target.id==="admq"){admQ=e.target.value;rerender(true)}
 if(e.target.id==="notes"){const c=curCase();S.notes[c.id]=e.target.value;save()}
 if(e.target.id==="dsq"){dsQ=e.target.value;rerender(true)}
 if(e.target.id==="dscol"){dsCol=e.target.value;rerender(true)}
 if(e.target.closest("#findings")){saveDraft(curCase())}
});
document.addEventListener("submit",e=>{
 if(e.target.id!=="findings")return;e.preventDefault();
 const c=curCase(),st=C(c.id);saveDraft(c);
 if(c.questions.some((q,i)=>!String(st.answers[i]??"").trim())){toast("Fill in all five findings before you submit.");return}
 st.attempts++;st.results=c.questions.map((q,i)=>check(q,st.answers[i]));
 if(st.results.every(Boolean)){st.status="solved";st.score=c.questions.reduce((a,_,i)=>a+PTS-(st.hints[i]?HINT_COST:0),0)}
 else if(st.attempts>=MAX_ATTEMPTS){st.status="cold";st.score=0}
 else{const bad=st.results.filter(r=>!r).length;toast(`Rejected. ${bad} finding${bad>1?"s":""} contradict${bad>1?"":"s"} the data.`)}
 if(CASES.every(x=>done(x.id))&&!S.end)S.end=Date.now();
 save();rerender();
});

/* ---------- ORGANISER SYNC (Firebase) ---------- */
const FB_V="10.12.2";
let FB=null,ME=null,IS_ADMIN=false,AUTH_USER=null,lastSent="",syncing=false,syncTimer=null,syncState="off",PLAYERS=null,admQ="",admErr="",unsubPlayers=null,loginErr="",loginBusy=false;
const configured=()=>!!(FIREBASE_CONFIG&&FIREBASE_CONFIG.apiKey&&!String(FIREBASE_CONFIG.apiKey).startsWith("PASTE"));
function syncChip(){const m={off:"Practice mode · progress stays on this device",on:"Linked to the organisers' board",err:"Can't reach the organisers' board right now",denied:"The organisers' board refused the save",wait:"Linking to the organisers' board…"};return `<span class="sync ${syncState}" id="syncChip"><i></i>${m[syncState]}</span>`}
function setSync(s){syncState=s;const c=$("#syncChip");if(c)c.outerHTML=syncChip()}
function payload(){const t=totals(),cases={};let hints=0;for(const c of CASES){const s=S.cases[c.id];if(s){const h=Object.keys(s.hints).length;hints+=h;cases[c.id]={status:s.status,attempts:s.attempts,hints:h,score:s.score||0}}}
 return{name:(S.name||"").trim().slice(0,40),solved:t.solved,closed:t.closed,score:t.score,fails:t.fails,hints,current:activeCase(),startedAt:S.start||null,endedAt:S.end||null,cases}}
function isPlayer(){return FB&&ME&&AUTH_USER&&AUTH_USER.isAnonymous}
function queueSync(){if(!isPlayer())return;clearTimeout(syncTimer);syncTimer=setTimeout(doSync,800)}
async function doSync(){if(!isPlayer())return;if(syncing){queueSync();return}const p=payload();if(!p.name)return;const js=JSON.stringify(p);if(js===lastSent){setSync("on");return}syncing=true;
 try{await FB.fs.setDoc(FB.fs.doc(FB.db,"players",ME),{...p,updatedAt:Date.now()});lastSent=js;setSync("on")}
 catch(e){if(e&&e.code==="permission-denied")setSync("denied");else{setSync("err");setTimeout(queueSync,4000)}}
 syncing=false}
function rankPlayers(list){return list.slice().sort((a,b)=>{const fa=a.closed>=10,fb=b.closed>=10;if(fa!==fb)return fa?-1:1;if((b.solved||0)!==(a.solved||0))return (b.solved||0)-(a.solved||0);const ea=pEl(a),eb=pEl(b);if(ea!==eb)return ea-eb;if((b.score||0)!==(a.score||0))return (b.score||0)-(a.score||0);return (a.fails||0)-(b.fails||0)})}
function pEl(p){return p.startedAt?Math.floor(((p.endedAt||Date.now())-p.startedAt)/1000):0}
function ago(ms){const s=Math.max(0,Math.floor((Date.now()-ms)/1000));if(s<60)return "just now";if(s<3600)return Math.floor(s/60)+" min ago";if(s<86400)return Math.floor(s/3600)+" h ago";return Math.floor(s/86400)+" d ago"}
function loginView(){
 if(!configured())return `<section class="sheet"><span class="lbl">Organiser desk</span><h1 style="margin-top:.8rem;font-size:clamp(1.6rem,5vw,2.2rem)">Not connected yet</h1><p style="margin-top:.8rem;max-width:60ch">Add your Firebase settings to <code>js/config.js</code> to turn on the organiser desk. The README has the steps.</p></section>`;
 if(AUTH_USER&&!AUTH_USER.isAnonymous)return `<section class="sheet"><span class="stamp red big">Restricted</span><p style="margin-top:1.2rem">${esc(AUTH_USER.email||"This account")} is signed in but is not on the organiser list. Add its UID to the <code>admins</code> collection in Firestore.</p><p style="margin-top:1rem"><button class="ghost" id="signOut">Sign out</button></p></section>`;
 return `<section class="sheet" style="max-width:520px;margin-inline:auto">${clipSVG("2rem")}<span class="lbl">Restricted · organisers only</span><h1 style="margin-top:.8rem;font-size:clamp(1.6rem,5vw,2.2rem)">Organiser desk</h1>
  <form id="login" style="display:grid;gap:.9rem;margin-top:1.2rem" novalidate>
   <label for="lgEmail" class="muted" style="font-size:.85rem">Organiser email</label><input id="lgEmail" type="email" autocomplete="username" required style="border:0;border-bottom:2px solid var(--ink);background:transparent;padding:.3rem;font-size:1.05rem">
   <label for="lgPass" class="muted" style="font-size:.85rem">Password</label><input id="lgPass" type="password" autocomplete="current-password" required style="border:0;border-bottom:2px solid var(--ink);background:transparent;padding:.3rem;font-size:1.05rem">
   ${loginErr?`<p class="hint" style="border-left-color:var(--red)">${esc(loginErr)}</p>`:""}
   <button class="cta" type="submit" ${loginBusy?"disabled":""}>${loginBusy?"Checking…":"Open organiser desk"}</button>
  </form><p class="muted" style="font-size:.82rem;margin-top:1rem">Use a separate browser from the one you play in. Signing in here replaces the player session in this browser.</p></section>`;
}
function viewAdmin(){
 if(!IS_ADMIN)return loginView();
 const all=PLAYERS?rankPlayers(PLAYERS):[];
 const live=all.filter(p=>Date.now()-(p.updatedAt||0)<10*60e3&&!p.endedAt).length, fin=all.filter(p=>p.closed>=10).length;
 const avg=all.length?Math.round(all.reduce((a,p)=>a+(p.score||0),0)/all.length):0;
 const q=admQ.trim().toLowerCase(), shown=all.map((p,i)=>({...p,rank:i+1})).filter(p=>!q||String(p.name).toLowerCase().includes(q));
 const strip=p=>`<span class="strip" aria-label="${p.closed} of 10 cases closed">${CASES.map(c=>{const s=p.cases?.[c.id]?.status;return `<i class="${s==="solved"?"s":s==="cold"?"c":p.current===c.id?"o":""}" title="Case ${c.id}: ${s==="solved"?"solved":s==="cold"?"cold case":p.current===c.id?"working on it":"sealed"}"></i>`}).join("")}</span>`;
 return `<div class="board"><section class="sheet ring">${clipSVG("2rem")}
  <div class="secrow"><span class="lbl">Organiser desk</span><span style="display:flex;gap:.8rem;align-items:center;flex-wrap:wrap">${PLAYERS?`<span class="sync on"><i></i>Live</span>`:""}<button class="ghost" id="signOut">Sign out</button></span></div>
  <h1 style="font-size:clamp(1.8rem,5vw,2.6rem)">Detectives on the case</h1>
  <p class="muted" style="margin-top:.5rem;max-width:62ch">Ranked by the official rules: finishers first, then cases solved, time, score and fewest errors. Updates as players submit.</p>
  <div class="metrics"><div class="metric"><span>Detectives</span><strong>${all.length}</strong></div><div class="metric"><span>Active now</span><strong>${live}</strong></div><div class="metric"><span>Finished all 10</span><strong>${fin}</strong></div><div class="metric"><span>Average score</span><strong>${avg} pts</strong></div></div>
 </section>
 <section class="sheet">
  ${admErr?`<p>${esc(admErr)}</p>`
  :!PLAYERS?`<p class="muted">Opening the case register…</p>`
  :!all.length?`<p><b>No detectives yet.</b> <span class="muted">Players appear here as soon as they write their name on the case desk.</span></p>`
  :`<div class="tools"><label class="sr" for="admq">Find a detective</label><input id="admq" type="search" placeholder="Find a detective by name" value="${esc(admQ)}"><span class="muted" style="font-size:.85rem">${shown.length} of ${all.length}</span><button class="ghost" id="dlResults">Download results CSV</button></div>
  <div class="gridwrap" style="max-height:none"><table class="adm"><thead><tr>${["Rank","Detective","Progress","Closed","Score","Time","Failed","Hints","Last seen"].map(h=>`<th scope="col" style="padding:.45rem .6rem">${h}</th>`).join("")}</tr></thead><tbody>
  ${shown.map(p=>`<tr><td class="rk">#${p.rank}</td><td class="nm">${esc(p.name||"Unnamed")}</td><td>${strip(p)}</td><td>${p.closed||0}/10${p.closed>=10?` <span class="stamp red" style="font-size:.6rem;border-width:2px;padding:0 .2rem">Done</span>`:""}</td><td><b>${p.score||0}</b></td><td class="el" data-s="${p.startedAt||""}" data-e="${p.endedAt||""}">${p.startedAt?fmt(pEl(p)):"–"}</td><td>${p.fails||0}</td><td>${p.hints||0}</td><td>${Date.now()-(p.updatedAt||0)<10*60e3&&!p.endedAt?`<span class="live">● active</span>`:p.updatedAt?ago(p.updatedAt):"–"}</td></tr>`).join("")}
  </tbody></table></div>
  <p class="muted" style="font-size:.82rem;margin-top:.7rem">Progress squares: green solved, grey cold case, red outline the case they are on now. Time runs from when a player first opened Case 01.</p>`}
 </section></div>`;
}
function downloadText(name,text){const b=new Blob([text],{type:"text/csv"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
const csvCell=v=>{v=String(v??"");return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
function resultsCSV(){const rows=[["rank","name","cases_closed","cases_solved","score","elapsed","failed_attempts","hints","finished"]];rankPlayers(PLAYERS||[]).forEach((p,i)=>rows.push([i+1,p.name,p.closed||0,p.solved||0,p.score||0,p.startedAt?fmt(pEl(p)):"",p.fails||0,p.hints||0,p.endedAt?"yes":"no"]));return rows.map(r=>r.map(csvCell).join(",")).join("\n")}
function watchPlayers(){if(unsubPlayers)return;unsubPlayers=FB.fs.onSnapshot(FB.fs.collection(FB.db,"players"),s=>{PLAYERS=s.docs.map(d=>({id:d.id,...d.data()}));admErr="";if(location.hash==="#admin"){const a=document.activeElement?.id;rerender(a==="admq")}},e=>{admErr="The player register stopped updating. Reload the page to reconnect.";unsubPlayers=null;if(location.hash==="#admin")route()})}
async function hydrate(){try{const snap=await FB.fs.getDoc(FB.fs.doc(FB.db,"players",ME));if(!snap.exists())return;const r=snap.data();
 if((r.closed||0)>totals().closed||(!S.start&&r.startedAt)){S.name=S.name||r.name||"";S.start=r.startedAt||S.start;S.end=r.endedAt||null;
  for(const k in (r.cases||{})){const rc=r.cases[k],h={};for(let i=0;i<(rc.hints||0);i++)h[i]=true;S.cases[k]=Object.assign(C(+k),{status:rc.status,attempts:rc.attempts,score:rc.score,hints:h})}
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
 lastSent=JSON.stringify(payload())}catch(e){}}
async function bootSync(){
 if(!configured()){setSync("off");return}
 setSync("wait");
 try{const base=`https://www.gstatic.com/firebasejs/${FB_V}/`;
  const [a,au,fs]=await Promise.all([import(base+"firebase-app.js"),import(base+"firebase-auth.js"),import(base+"firebase-firestore.js")]);
  const app=a.initializeApp(FIREBASE_CONFIG);FB={auth:au.getAuth(app),db:fs.getFirestore(app),au,fs};
 }catch(e){setSync("err");return}
 FB.au.onAuthStateChanged(FB.auth,async u=>{
  AUTH_USER=u;IS_ADMIN=false;if(unsubPlayers){unsubPlayers();unsubPlayers=null}PLAYERS=null;
  if(!u){try{await FB.au.signInAnonymously(FB.auth)}catch(e){setSync("err")}route();return}
  ME=u.uid;
  if(u.isAnonymous){await hydrate();setSync(S.name.trim()?"wait":"on");queueSync()}
  else{try{IS_ADMIN=(await FB.fs.getDoc(FB.fs.doc(FB.db,"admins",u.uid))).exists()}catch(e){}if(IS_ADMIN)watchPlayers();setSync("off")}
  const al=document.getElementById("adminLink");if(al)al.hidden=!IS_ADMIN;
  route();
 });
}
document.addEventListener("submit",async e=>{if(e.target.id!=="login")return;e.preventDefault();if(!FB){loginErr="Firebase is not loaded. Check your connection and js/config.js.";route();return}
 const em=$("#lgEmail").value.trim(),pw=$("#lgPass").value;if(!em||!pw){loginErr="Enter your organiser email and password.";route();return}
 loginBusy=true;loginErr="";route();
 try{await FB.au.signInWithEmailAndPassword(FB.auth,em,pw)}catch(err){loginErr=/invalid|wrong|not-found|credential/.test(err.code||"")?"That email and password don't match an organiser account.":"Couldn't sign in. Try again in a moment."}
 loginBusy=false;route()});
document.addEventListener("click",async e=>{
 if(e.target.id==="signOut"&&FB){await FB.au.signOut(FB.auth);return}
 if(e.target.id==="dlResults"){downloadText("heralytics-results.csv",resultsCSV());return}
 const d=e.target.closest("[data-dlcsv]");if(d){const c=curCase(),ds=c.datasets[dsIdx];downloadText(ds.file,ds.cols.join(",")+"\n"+ds.rows.trim());return}
});

/* ---------- BOOT ---------- */
$("#tapeText").textContent=("CRIME SCENE · DO NOT CROSS · HERALYTICS · ").repeat(14);
$("#fpMast").innerHTML=fingerprint();
route();
setInterval(()=>{const k=$("#clock");if(k)k.textContent=fmt(elapsed());document.querySelectorAll("td.el[data-s]").forEach(td=>{const s=+td.dataset.s,e=+td.dataset.e;if(s)td.textContent=fmt(Math.floor(((e||Date.now())-s)/1000))})},1000);
bootSync();
