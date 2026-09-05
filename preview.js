/* Standalone public prototype. All records below are invented; no production APIs. */
'use strict';
const app = document.getElementById('app');
const dialog = document.getElementById('details');
const title = document.getElementById('dialog-title');
const content = document.getElementById('dialog-content');
const state = { role: 'owner', screen: 'play', person: 'Jennifer', common: true, historyPlayer: 'Logan', count: 4, metric: 'Win rate' };
const colors = {p:'#a66bd1',y:'#f7d154',g:'#83bd58',b:'#659fd0'};
const categories = [
  ['p','WORDS BEFORE “BOARD”','CLIP, CUP, KEY, SKATE'],
  ['y','FRUITS','APPLE, BANANA, GRAPE, PEACH'],
  ['g','WAYS TO MOVE QUICKLY','BOLT, DASH, RACE, SPRINT'],
  ['b','PARTS OF A BOOK','COVER, INDEX, PAGE, SPINE']
];
const players = ['Logan','Jennifer','Mom'];
const history = Object.fromEntries(players.map((name,p) => [name, Array.from({length:14},(_,i)=>({id:`${p}-${i}`,day:14-i,number:1276-i,mistakes:i===0&&p===0?0:(i+p)%5}))]));
const escapeHtml = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function grid(small=false, mistakes=0) {
  const rows = mistakes===4?['yyyy','gggg','pbpb','bpbp','ppbb','bbpp']:Array.from({length:mistakes},()=> 'pgby').concat(['pppp','yyyy','gggg','bbbb']);
  return `<div class="${small?'cx-history-grid':'cx-grid'}" aria-label="${mistakes} mistakes, ${mistakes===4?'two':'four'} groups solved">${rows.join('').split('').map(c=>`<i class="${c}"></i>`).join('')}</div>`;
}
function chrome(name,sub=''){return `<h1 class="cx-title">${name}</h1><p class="cx-subtitle">${sub||'Illustrative stats · not real results'}</p>`;}
function nav(){ const current=['my-stats','compare','leaderboard'].includes(state.screen)?'stats':state.screen;return `<nav class="cx-bottom" style="grid-template-columns:repeat(${state.role==='owner'?4:3},1fr)" aria-label="Main navigation">${[['Play','play'],['Stats','stats'],['History','history'],...(state.role==='owner'?[['Admin','admin']]:[])].map(([label,key])=>`<button class="cx-nav ${current===key?'active':''}" data-go="${key==='stats'?'my-stats':key}" ${current===key?'aria-current="page"':''}>${label}</button>`).join('')}</nav>`;}
function tabs(){return `<div class="cx-tabs" aria-label="Stats sections">${[['My Stats','my-stats'],['Head-to-Head','compare'],['Leaderboard','leaderboard']].map(([label,key])=>`<button class="${state.screen===key?'active':''}" data-go="${key}" aria-pressed="${state.screen===key}">${label}</button>`).join('')}</div>`;}
function today(){return `<section class="cx-panel cx-summary"><div class="cx-row"><div class="cx-result"><span class="cx-eyebrow">Today's summary</span><h2>Perfect game</h2><p>Puzzle #1276 · 4:32</p></div>${grid()}</div><div class="cx-row" style="margin-top:12px"><span class="cx-badge">★ Perfect</span><span class="cx-badge">♛ Purple first</span></div><div class="cx-metrics"><div class="cx-metric"><strong>0</strong><small>Mistakes</small></div><div class="cx-metric"><strong>P · Y · G · B</strong><small>Solve order</small></div><div class="cx-metric"><strong>13</strong><small>Streak</small></div></div><div class="cx-actions"><button class="cx-action primary" data-action="share">Share result</button><button class="cx-action" data-action="guesses">View guesses</button></div></section>`;}
function mini(label,value){return `<div class="cx-mini"><span>${label}</span><strong>${value}</strong></div>`;}
function play(){return chrome('Connections','Completed puzzle · Illustrative game')+`<section class="cx-solved" aria-label="Four solved categories">${categories.map(([c,t,w])=>`<div class="cx-solved-bar ${c}"><strong>${t}</strong><span>${w}</span></div>`).join('')}</section><button class="previous" data-action="guesses">↶ Previous guesses</button>`+today();}
function myStats(){return chrome('Stats')+tabs()+today()+`<h2 class="cx-section-title">All-time highlights</h2><div class="cx-mini-grid">${mini('Win rate','93%')+mini('Perfect games','42')+mini('Best streak','18 🔥')+mini('Avg. mistakes','2.1')}</div>`;}
function comparison(){
  const index=['Jennifer','Mom','Everyone'].indexOf(state.person);
  const sample = state.common ? [{n:38,me:92,them:89,mm:1.8,tm:2.1,mp:11,tp:9},{n:24,me:92,them:88,mm:1.7,tm:2.3,mp:8,tp:6},{n:42,me:93,them:89,mm:1.8,tm:2.2,mp:29,tp:25}][index] : [{n:0,me:93,them:94,mm:2.1,tm:1.9,mp:42,tp:44},{n:0,me:93,them:89,mm:2.1,tm:2.3,mp:42,tp:25},{n:0,me:93,them:92,mm:2.1,tm:2.1,mp:32,tp:30}][index];
  const collective=state.person==='Everyone';
  return chrome('Stats')+tabs()+`<section class="cx-panel"><div class="cx-row"><span class="cx-eyebrow">Compare</span><span class="cx-badge">${state.common?sample.n+' games in common':'All recorded results'}</span></div><div class="cx-compare" style="margin-top:16px"><div class="cx-person"><span class="cx-badge">You</span><strong>Logan</strong><small>${sample.me}% wins</small></div><div class="cx-versus">VS</div><div class="cx-person"><select id="opponent" class="cx-select" aria-label="Comparison player">${['Jennifer','Mom','Everyone'].map(n=>`<option ${state.person===n?'selected':''}>${n}</option>`).join('')}</select><strong>${collective?'Group average':state.person}</strong><small>${sample.them}% wins</small></div></div><div class="cx-actions"><button class="cx-action ${!state.common?'primary':''}" data-mode="all" aria-pressed="${!state.common}">All results</button><button class="cx-action ${state.common?'primary':''}" data-mode="common" aria-pressed="${state.common}">Games in common</button></div></section><div class="cx-mini-grid">${mini('Your avg. mistakes',sample.mm)+mini('Their avg. mistakes',sample.tm)+mini(collective?'Your perfect rate':'Your perfect games',sample.mp+(collective?'%':''))+mini(collective?'Group perfect rate':'Their perfect games',sample.tp+(collective?'%':''))}</div><p class="cx-subtitle" style="margin-top:14px">Sample comparison values for testing the controls.</p>`;
}
function leaderboard(){const rankings={'Win rate':[['Jennifer','94%'],['Logan','93%'],['Mom','89%']],'Perfect games':[['Jennifer','44'],['Logan','42'],['Mom','25']],'Purple first':[['Logan','31%'],['Jennifer','28%'],['Mom','19%']]};return chrome('Stats')+tabs()+`<label class="cx-eyebrow" for="metric">Rank by</label><select class="cx-select" id="metric" style="margin:8px 0 16px">${Object.keys(rankings).map(k=>`<option ${state.metric===k?'selected':''}>${k}</option>`).join('')}</select><section class="cx-panel">${rankings[state.metric].map(([n,v],i)=>`<div class="cx-rank"><span class="place">${i+1}</span><span>${n}${n==='Logan'?' · You':''}</span><strong>${v}</strong></div>`).join('')}</section>`;}
function games(){const records=history[state.historyPlayer];return chrome('History',state.historyPlayer+"’s sample games")+(state.role==='owner'?`<label class="cx-eyebrow" for="history-player">Player</label><select class="cx-select" id="history-player" style="margin:8px 0">${players.map(n=>`<option ${n===state.historyPlayer?'selected':''}>${n}</option>`).join('')}</select>`:'')+`<h2 class="cx-section-title">Recent games</h2><section class="cx-panel">${records.slice(0,state.count).map(r=>`<button class="cx-history" data-record="${r.id}"><span class="cx-day">SEP<strong>${r.day}</strong></span>${grid(true,r.mistakes)}<span class="cx-history-text"><strong>${r.mistakes===0?'Perfect game':r.mistakes===4?'Unsolved':'Solved'}</strong><small>#${r.number} · ${r.mistakes} mistakes</small></span><span aria-hidden="true">›</span></button>`).join('')}${state.count<records.length?'<button class="cx-action" data-action="more" style="width:100%;margin-top:12px">Load 10 more</button>':'<p class="cx-subtitle">End of sample history</p>'}</section>`;}
function admin(){return chrome('Admin','Owner view · simulated controls only')+`<section class="cx-panel">${[['Players','Manage sample players'],['Imports','Owner-only result import'],['Demo data','Preview test-data controls'],['Access & recovery','Preview account controls'],['Development tools','Preview reset controls']].map(([n,s])=>`<button class="cx-admin-row" data-admin="${n}"><span>${n}<small>${s}</small></span><b aria-hidden="true">›</b></button>`).join('')}</section>`;}
function render(){if(state.role!=='owner'&&state.screen==='admin')state.screen='play';app.innerHTML=({play,'my-stats':myStats,compare:comparison,leaderboard,history:games,admin}[state.screen]||play)()+nav();}
function navigate(screen){state.screen=screen;render();window.scrollTo({top:0,behavior:'instant'});}
function show(titleText,html){title.textContent=titleText;content.innerHTML=html;if(!dialog.open)dialog.showModal();}
function notify(message){const node=document.getElementById('notice');node.textContent=message;node.hidden=false;clearTimeout(notify.timer);notify.timer=setTimeout(()=>node.hidden=true,3500);}
function showGuesses(){show('Previous guesses',`<p>Sample puzzle #1276 · 4 correct guesses</p>${categories.map(([c,t,w],i)=>`<div class="guess-row" style="background:${colors[c]}"><strong>${i+1}. ${t}</strong><br>${w}</div>`).join('')}`);}
const sharedText='Connections\nPuzzle #1276\n🟪🟪🟪🟪\n🟨🟨🟨🟨\n🟩🟩🟩🟩\n🟦🟦🟦🟦\nSample design preview';
function showShare(){show('Share sample result',`<p>This shares fictional sample data only.</p><textarea readonly aria-label="Sample result">${sharedText}</textarea><div style="display:flex;gap:8px;margin-top:12px"><button data-copy>Copy result</button>${navigator.share?'<button data-native-share>Share…</button>':''}</div>`);}
function showRecord(id){const record=history[state.historyPlayer].find(r=>r.id===id);if(!record)return;show('Puzzle #'+record.number,`<p>${state.historyPlayer} · September ${record.day} · ${record.mistakes} mistakes</p><p>${record.mistakes===4?'Unsolved · 2 groups found':'Solved · 4 groups found'}</p><p>Game-detail design is still to be reviewed.</p>${state.role==='owner'?`<button data-delete="${id}">Delete sample result</button><p>Only removes this sample from the current preview. Reload to restore.</p>`:''}`);}
app.addEventListener('click',e=>{
 const target=e.target.closest('button');if(!target)return;
 if(target.dataset.go){navigate(target.dataset.go);return;}
 if(target.dataset.mode){state.common=target.dataset.mode==='common';render();return;}
 if(target.dataset.record){showRecord(target.dataset.record);return;}
 if(target.dataset.admin&&state.role==='owner'){
   const name=target.dataset.admin;
   if(name==='Imports')show('Import sample result','<p>Owner-only in the app. This public preview does not save imports.</p><label for="sample-import">Connections result</label><textarea id="sample-import" placeholder="Paste a sample result here"></textarea><button data-import-preview style="margin-top:12px">Preview sample</button>');
   else if(name==='Players')show('Sample players',players.map(n=>`<p>${n}</p>`).join('')+'<p>Player-editing controls will be reviewed separately.</p>');
   else show(name,'<p>Design placeholder only. No production controls, credentials, or data are connected to this preview.</p>');
   return;
 }
 if(target.dataset.action==='guesses')showGuesses();
 if(target.dataset.action==='share')showShare();
 if(target.dataset.action==='more'){state.count+=10;render();}
});
app.addEventListener('change',e=>{if(e.target.id==='opponent')state.person=e.target.value;if(e.target.id==='metric')state.metric=e.target.value;if(e.target.id==='history-player'){state.historyPlayer=e.target.value;state.count=4;}render();});
document.getElementById('role').addEventListener('change',e=>{state.role=e.target.value;state.historyPlayer='Logan';dialog.close();navigate('play');});
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
content.addEventListener('click',async e=>{
 const button=e.target.closest('button');if(!button)return;
 if(button.hasAttribute('data-copy')){try{await navigator.clipboard.writeText(sharedText);notify('Sample result copied');}catch{content.querySelector('textarea').select();notify('Select and copy the sample text');}}
 if(button.hasAttribute('data-native-share')){try{await navigator.share({text:sharedText});}catch(error){if(error.name!=='AbortError')notify('Use Copy result instead');}}
 if(button.dataset.delete&&state.role==='owner'){history[state.historyPlayer]=history[state.historyPlayer].filter(r=>r.id!==button.dataset.delete);dialog.close();render();notify('Sample removed. Real history unchanged.');}
 if(button.hasAttribute('data-import-preview')){const value=document.getElementById('sample-import').value;if(!value.trim()){notify('Paste a sample result first');return;}show('Sample import preview',`<p>Not saved. This is a layout and interaction test.</p><pre style="white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(value)}</pre>`);}
});
render();
