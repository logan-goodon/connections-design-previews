/* New non-game concept. Metrics are calculated from reproducible fictional records. */
'use strict';
const journalColors=['y','g','b','p'];
const journalOrders=['ygbp','pygb','gbyp','bypg','pbgy','ypgb','gybp','bgyp'];
function buildJournal(playerIndex){
 const out=[];
 for(let i=0;i<84;i++){
  if(playerIndex&&i%(7+playerIndex)===playerIndex)continue;
  const seed=(i*17+playerIndex*23)%101;
  const m=i===0&&playerIndex===0?0:seed<29?0:seed<59?1:seed<80?2:seed<93?3:4;
  const order=journalOrders[(i*3+playerIndex)%journalOrders.length].split('');
  if(i===0&&playerIndex===0)order.splice(0,4,'p','y','g','b');
  const solved=m===4?order.slice(0,seed%3):order;
  const rows=[];
  if(m===4){solved.forEach(c=>rows.push(c.repeat(4)));const remaining=order.filter(c=>!solved.includes(c));for(let j=0;j<4;j++)rows.push(remaining[0].repeat(j%2?2:3)+remaining[1].repeat(j%2?2:1));}
  else{const wrongAt=i%2;solved.forEach((c,k)=>{if(k===wrongAt)for(let j=0;j<m;j++)rows.push(c.repeat(j%2?2:3)+solved[k+1].repeat(j%2?2:1));rows.push(c.repeat(4));});}
  const date=new Date(Date.UTC(2026,8,5-i)).toISOString().slice(0,10);
  out.push({id:`${playerIndex}-${i}`,n:1276-i,day:Number(date.slice(-2)),date,m,order:solved,rows,win:m<4});
 }
 return out;
}
players.forEach((name,i)=>{records[name]=buildJournal(i);});
['Jennifer','Mom','ANP'].forEach(name=>{const g=friendGames[name];if(!g){records[name]=records[name].filter(r=>r.n!==1276);return;}const r=records[name].find(r=>r.n===1276);if(r)Object.assign(r,{m:g.mistakes,order:[...g.order],rows:[...g.rows],win:g.solved});});
function journalMetrics(list){
 const wins=list.filter(r=>r.win),hist=[0,0,0,0,0];list.forEach(r=>hist[r.m]++);
 let best=0,run=0;[...list].reverse().forEach(r=>{run=r.win?run+1:0;best=Math.max(best,run);});
 let current=0;for(const r of list){if(!r.win)break;current++;}
 const firstClean=list.filter(r=>r.rows[0]&&new Set(r.rows[0]).size===1).length;
 const pairs=Object.entries(list.reduce((a,r)=>{if(r.win){const key=r.order.join('');a[key]=(a[key]||0)+1;}return a;},{})).sort((a,b)=>b[1]-a[1]);
 return {n:list.length,wins:wins.length,rate:list.length?Math.round(wins.length/list.length*100):0,perfect:hist[0],hist,avg:list.length?(list.reduce((s,r)=>s+r.m,0)/list.length).toFixed(1):'—',best,current,firstClean,escape:wins.filter(r=>r.m===3).length,purple:list.filter(r=>r.order[0]==='p').length,reverse:wins.filter(r=>r.order.join('')==='pbgy').length,pattern:pairs[0]||['',0]};
}
function jHeading(kicker,title,side=''){return `<header class="j-heading"><span>${kicker}</span><div><h1>${title}</h1><small>${side}</small></div></header>`;}
function jSection(index,title,detail=''){return `<div class="j-section"><span>${index}</span><h2>${title}</h2>${detail?`<button data-explain="${detail}" aria-label="About ${title}">?</button>`:''}</div>`;}
function jOrder(order){return `<div class="j-order">${order.map((c,i)=>`<span class="${c}" aria-label="${i+1}: ${colorNames[c]}">${i+1}</span>`).join('')}</div>`;}
function today(){
 const g=myGame();
 if(!g)return `<section class="j-today j-wait"><span>TODAY / #1276</span><h2>Your page is still blank.</h2>${btn(state.game==='playing'?'Continue puzzle':'Play today’s puzzle','start','primary')}</section>`;
 return `<section class="j-today"><div class="j-today-top"><span>TODAY / #1276</span><strong>${g.solved?(g.mistakes?'Solved':'Perfect'):'Unsolved'}</strong></div><div class="j-today-body"><div><h2>${g.mistakes===0?'Four for four.':g.solved?'Found them.':'A tricky one.'}</h2><p><b>${g.mistakes}</b> mistakes <span>·</span> <b>${g.order.length}</b> groups</p>${jOrder(g.order)}</div>${mosaic(g.rows)}</div><div class="j-today-actions">${btn('Share result ↗','share')}<button data-go="compare">Compare today →</button></div></section>`;
}
function stats(){
 const list=records.Logan,s=journalMetrics(list),max=Math.max(...s.hist,1);
 return `<div class="field-screen">${jHeading('LOGAN / PERSONAL RECORD','The way<br>you solve.',`${s.n} puzzles`)}${tabs()}${today()}
 <section class="j-score"><div><span>ALL-TIME WIN RATE</span><strong>${s.rate}<small>%</small></strong></div><p>${s.wins} solved<br><b>${s.n-s.wins} unsolved</b></p></section>
 <div class="j-basics"><div><strong>${s.perfect}</strong><span>Perfect games</span></div><div><strong>${s.avg}</strong><span>Avg. mistakes</span></div><div><strong>${s.best}</strong><span>Best win run*</span></div></div>
 ${jSection('01','How close was it?','mistakes')}<div class="j-hist">${s.hist.map((v,i)=>`<button data-hist="${i}" aria-label="${i} mistakes: ${v} games"><strong>${v}</strong><div style="height:${16+v/max*96}px" class="hist-${i}"></div><span>${i===0?'Perfect':i===4?'Unsolved':i+' miss'+(i===1?'':'es')}</span></button>`).join('')}</div>
 ${jSection('02','Your color fingerprint','matrix')}<p class="j-caption">Where each color lands in your solve order.</p><div class="j-matrix"><span></span>${['1st','2nd','3rd','4th'].map(s=>`<small>${s}</small>`).join('')}${journalColors.map(c=>`<span class="matrix-name">${colorNames[c]}</span>${[0,1,2,3].map(pos=>{const count=list.filter(r=>r.order[pos]===c).length;return `<button class="${c}" style="--strength:${.18+count/list.length*.8}" data-cell="${c}-${pos}" aria-label="${colorNames[c]} solved ${pos+1}${pos===0?'st':pos===1?'nd':pos===2?'rd':'th'} in ${count} games">${count}</button>`;}).join('')}`).join('')}</div>
 <div class="j-route"><div><span>MOST-PLAYED ROUTE</span>${jOrder(s.pattern[0].split(''))}</div><strong>${s.pattern[1]}<small>games</small></strong></div>
 ${jSection('03','The small numbers','details')}<div class="j-ledger">${[['Clean opening',s.firstClean,'First guess was a correct group'],['Last-chance wins',s.escape,'Solved with three mistakes'],['Purple first',s.purple,'Purple was the first group found'],['Reverse rainbow',s.reverse,'Purple → blue → green → yellow']].map(([label,v,desc])=>`<div><span><strong>${label}</strong><small>${desc}</small></span><b>${v}</b></div>`).join('')}</div>
 ${jSection('04','Recent pages')}<div class="j-film">${list.slice(0,12).map(r=>`<button data-journal="${r.id}" aria-label="Puzzle ${r.n}, ${r.m} mistakes"><span>${String(r.n).slice(-2)}</span><div class="${r.m===0?'film-perfect':r.win?'film-win':'film-loss'}">${r.m===0?'✦':r.win?'✓':'×'}</div></button>`).join('')}</div><p class="j-caption">Newest first · tap a game to open it.</p><p class="j-source">All numbers are calculated from fictional results.<br>*Win runs count recorded puzzles, not a verified daily NYT streak.</p></div>`;
}
function jPlayerOptions(){return ['Jennifer','Mom','ANP','Everyone'].map(p=>`<option ${state.person===p?'selected':''}>${p}</option>`).join('');}
function compare(){
 const everyone=state.person==='Everyone',others=everyone?['Jennifer','Mom','ANP']:[state.person];
 let body='';
 if(state.period==='Today'){
  const mine=myGame(),game=everyone?null:friendGames[state.person];
  const row=(name,g,you=false)=>`<article class="j-day-row"><div class="j-day-name"><strong>${name}</strong><small>${you?'You':g?(g.solved?'Solved':'Unsolved'):'Not played'}</small></div>${g?`<div class="j-day-result">${mosaic(g.rows)}${jOrder(g.order)}</div><div class="j-day-number"><strong>${g.mistakes}</strong><small>mistakes</small></div>`:'<p class="j-pending">Waiting for a result<span>···</span></p>'}</article>`;
  body=`<div class="j-duel-heading"><span>TODAY’S PUZZLE</span><strong>#1276</strong></div><section class="j-day-table">${row('Logan',mine,true)}${others.map(name=>row(name,friendGames[name])).join('')}</section>${!mine?btn('Play today’s puzzle','start','primary full'):''}`;
  if(mine&&game)body+=`<div class="j-difference"><strong>${Math.abs(mine.mistakes-game.mistakes)}</strong><p>mistake${Math.abs(mine.mistakes-game.mistakes)===1?'':'s'} apart<small>${mine.solved===game.solved?(mine.solved?'Both found all four groups.':'Neither solved all four groups.'):'Different finishes on the same puzzle.'}</small></p></div>`;
 }else{
  let mine=records.Logan,opponents=others.flatMap(p=>records[p]);
  if(state.common){const ids=new Set(mine.filter(r=>others.every(p=>records[p].some(o=>o.n===r.n))).map(r=>r.n));mine=mine.filter(r=>ids.has(r.n));opponents=opponents.filter(r=>ids.has(r.n));}
  const a=journalMetrics(mine),b=journalMetrics(opponents);
  body=`<div class="j-common"><button data-mode="common" aria-pressed="${state.common}" class="${state.common?'active':''}">Games in common</button><button data-mode="all" aria-pressed="${!state.common}" class="${!state.common?'active':''}">All results</button></div><p class="j-caption">${state.common?mine.length+' puzzle IDs shared by everyone selected':'Full recorded histories'}${everyone?' · other players pooled, excluding you':''}</p><div class="j-versus"><strong>Logan</strong><span>vs</span><strong>${everyone?'Everyone':state.person}</strong></div><div class="j-versus-score"><strong>${a.rate}<small>%</small></strong><span>win rate</span><strong>${b.rate}<small>%</small></strong></div><section class="j-compare-table">${comparisonRows([[a.n,'Games played',b.n],[a.avg,'Avg. mistakes',b.avg],[Math.round(a.perfect/a.n*100)+'%','Perfect rate',Math.round(b.perfect/b.n*100)+'%'],[Math.round(a.firstClean/a.n*100)+'%','Clean opening',Math.round(b.firstClean/b.n*100)+'%'],[Math.round(a.purple/a.n*100)+'%','Purple first',Math.round(b.purple/b.n*100)+'%'],[a.escape,'Last-chance wins',b.escape]])}</section>`;
 }
 return `<div class="field-screen">${jHeading('SAME PUZZLES / DIFFERENT MINDS','Side by<br>side.')}${tabs()}<label class="j-picker" for="opponent"><span>COMPARE WITH</span><select id="opponent">${jPlayerOptions()}</select></label><div class="j-period">${['Today','All time'].map(p=>`<button data-period="${p}" class="${state.period===p?'active':''}" aria-pressed="${state.period===p}">${p}</button>`).join('')}</div>${body}<p class="j-source">Fictional results. No rankings or title ownership.</p></div>`;
}
function historyPage(){
 const list=records[state.player].filter(r=>String(r.n).includes(state.search));
 return `<div class="field-screen">${jHeading('YOUR PUZZLE JOURNAL','Every<br>attempt.',`${list.length} entries`)}${state.role==='owner'?`<label class="j-picker" for="history-player"><span>PLAYER</span><select id="history-player">${players.map(p=>`<option ${p===state.player?'selected':''}>${p}</option>`).join('')}</select></label>`:''}<input class="search" id="search" type="search" placeholder="Find a puzzle number" aria-label="Search puzzle number" value="${esc(state.search)}"><div class="j-archive">${list.slice(0,state.count).map(r=>`<button class="j-entry" data-journal="${r.id}"><span class="j-entry-date">${new Date(r.date+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'})}<small>#${r.n}</small></span><span class="j-entry-body"><strong>${r.m===0?'Perfect':r.win?'Solved':'Unsolved'}</strong>${jOrder(r.order)}</span><span class="j-entry-misses"><b>${r.m}</b><small>misses</small></span><span>↗</span></button>`).join('')||'<p>No games found.</p>'}</div>${state.count<list.length?btn('Next 10 entries ↓','more','full'):''}</div>`;
}
function admin(){return `<div class="field-screen">${jHeading('OWNER ONLY','Behind<br>the scenes.')}<div class="j-admin">${[['01','Import results','Paste a shared grid for any player.'],['02','Manage players','Names and access. Nothing public.'],['03','Game tools','Testing and maintenance.'],['04','Preferences','Sound, motion and appearance.']].map(([i,t,d])=>`<button data-admin="${t}"><small>${i}</small><span><strong>${t}</strong><p>${d}</p></span><b>↗</b></button>`).join('')}</div><p class="j-source">Simulated owner view. No real accounts or controls connected.</p></div>`;}
function showPreviousGuesses(){
 const guesses=state.guesses.length?state.guesses:cats.map(c=>c[2]);
 const cards=guesses.map((g,i)=>{const colors=g.map(w=>cats.find(c=>c[2].includes(w))[0]);const counts=journalColors.map(c=>colors.filter(x=>x===c).length),max=Math.max(...counts);return `<article class="guess-detail"><header><strong>Guess ${i+1}</strong><span class="${max===4?'correct':max===3?'one-away':'not-quite'}">${max===4?'Correct':max===3?'One away':'Not quite'}</span></header><div class="guess-swatches">${colors.map(c=>`<i class="${c}"></i>`).join('')}</div><p>${g.join(', ')}</p></article>`;}).join('');
 show('Previous guesses','<p>Oldest first. Tap outside or close when you’re ready to continue.</p>'+cards);
}
const explanations={mistakes:'Number of puzzles ending with 0, 1, 2, 3 or 4 mistakes. Four mistakes is an unsolved game. Tap a column to see the games.',matrix:'Each cell counts games where that color was solved in that position. Unsolved colors do not count. Tap a cell for its exact meaning.',details:'Clean opening: the first submitted group was correct. Last-chance wins: won with three mistakes. Purple first: first solved group was purple. Reverse rainbow: solved purple, blue, green, yellow. These can be derived from complete shared emoji grids; word-level analysis needs detailed guesses.'};
app.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.explain){show('How this is counted',`<p>${explanations[b.dataset.explain]}</p><p>All figures in this concept are computed from fictional sample games, not live records.</p>`);}
 if(b.dataset.cell){const [c,pos]=b.dataset.cell.split('-');const count=records.Logan.filter(r=>r.order[Number(pos)]===c).length;show('Color fingerprint',`<p>${colorNames[c]} was the ${Number(pos)+1}${pos==='0'?'st':pos==='1'?'nd':pos==='2'?'rd':'th'} group solved in <strong>${count}</strong> of ${records.Logan.length} sample games.</p>`);}
 if(b.dataset.hist!==undefined){const m=Number(b.dataset.hist),list=records.Logan.filter(r=>r.m===m);show(m+' mistakes',`<p>${list.length} sample games finished this way.</p><p>${list.map(r=>'#'+r.n).join(' · ')}</p>`);}
 if(b.dataset.journal){const player=state.screen==='history'?state.player:'Logan';const r=records[player].find(r=>r.id===b.dataset.journal);if(!r)return;show('Puzzle #'+r.n,`<p>${player} · ${r.date} · ${r.m} mistakes</p>${mosaic(r.rows)}<p>Solve order</p>${jOrder(r.order)}<p class="j-caption">Imported result: color rows available. The exact words guessed cannot be recovered from a shared grid.</p>${state.role==='owner'?`<button class="button" data-delete="${r.id}" data-player="${player}">Delete sample result</button>`:''}`);}
});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const legacyRender=render;
render=function(){legacyRender();document.body.dataset.page=state.screen;};
if(['stats','compare','history','admin','play'].includes(params.get('screen')))state.screen=params.get('screen');
render();
