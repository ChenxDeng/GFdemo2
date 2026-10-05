const menu=document.querySelector('#menu-toggle');
const nav=document.querySelector('#navigation');
function setMenu(open){menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.title=open?'Close navigation':'Open navigation';menu.querySelector('img').src=open?'assets/x.svg':'assets/menu.svg';nav.classList.toggle('open',open);}
menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus();}});
document.querySelector('#copy-code').addEventListener('click',async()=>{
 const status=document.querySelector('#copy-status');
 try{await navigator.clipboard.writeText(document.querySelector('#install-code').textContent);status.textContent='Commands copied.';}
 catch{status.textContent='Clipboard unavailable. Select the commands to copy them.';}
});


// Exact ideal two-level probabilities; drive varies BETWEEN independent pulses.
// u=t/Tref, d=Δ/Ωref, a=Ω/Ωref. Opacity is decorative, not a probability scale.
{
 const hero=document.querySelector('.hero');
 const field=document.querySelector('.hero-field');
 const canvas=document.querySelector('#rabi-canvas');
 const ctx=canvas.getContext('2d');
 const source=document.createElement('canvas'),sourceCtx=source.getContext('2d',{alpha:false});
 const reveal=document.createElement('canvas'),revealCtx=reveal.getContext('2d');
 const play=document.querySelector('#rabi-play');
 const caption=document.querySelector('#rabi-caption');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const colors=[[245,247,248],[153,217,208],[35,142,133],[19,61,59],[250,171,113]];
 const lut=new Uint8ClampedArray(3072);
 for(let i=0;i<1024;i++){
  const v=i/1023*4,k=Math.min(3,Math.floor(v)),f=v-k;
  for(let c=0;c<3;c++)lut[i*3+c]=colors[k][c]*(1-f)+colors[k+1][c]*f;
 }
 let width=1000,height=500,pixels,phase=0,last=null,lastPaint=0,frame=null;
 let playing=!reduced.matches,visible=true,dirty=true,hovered=false;
 let targetX=.8,targetY=.5,x=.8,y=.5,strength=0;
 function drawField(){
  const a=1+.3*Math.sin(phase*Math.PI/10),aa=a*a,data=pixels.data;
  for(let row=0;row<height;row++){
   const d=2.4-4.8*row/(height-1),q=aa+d*d,scale=aa/q,w=Math.PI*Math.sqrt(q)*3.5/(width-1);
   for(let col=0;col<width;col++){
    const s=Math.sin(w*col),color=Math.round(scale*s*s*1023)*3,index=(row*width+col)*4;
    data[index]=lut[color];data[index+1]=lut[color+1];data[index+2]=lut[color+2];data[index+3]=255;
   }
  }
  sourceCtx.putImageData(pixels,0,0);dirty=false;
 }
 function composite(){
  ctx.clearRect(0,0,width,height);ctx.globalAlpha=.42;ctx.drawImage(source,0,0);ctx.globalAlpha=1;
  if(strength>.001){
   revealCtx.clearRect(0,0,width,height);revealCtx.globalCompositeOperation='source-over';revealCtx.drawImage(source,0,0);
   const r=width*.20*(1+.035*Math.sin(phase*1.7));
   const gradient=revealCtx.createRadialGradient(x*width,y*height,r*.14,x*width,y*height,r);
   gradient.addColorStop(0,'rgba(0,0,0,'+strength+')');gradient.addColorStop(.24,'rgba(0,0,0,'+strength*.97+')');gradient.addColorStop(.6,'rgba(0,0,0,'+strength*.4+')');gradient.addColorStop(1,'transparent');
   revealCtx.globalCompositeOperation='destination-in';revealCtx.fillStyle=gradient;revealCtx.fillRect(0,0,width,height);
   revealCtx.globalCompositeOperation='source-over';ctx.drawImage(reveal,0,0);
  }
  field.classList.add('ready');
 }
 function tick(now){
  frame=null;if(document.hidden||!visible){last=null;return;}
  const delta=last===null?0:Math.min((now-last)/1000,.08);last=now;
  if(playing){phase+=delta;dirty=true;}
  const ease=reduced.matches?1:1-Math.exp(-delta*12);
  x+=(targetX-x)*ease;y+=(targetY-y)*ease;strength+=((hovered?1:0)-strength)*ease;
  if(now-lastPaint>=1000/24){if(dirty)drawField();composite();lastPaint=now;}
  if(playing||Math.abs(strength-(hovered?1:0))>.001||Math.abs(x-targetX)+Math.abs(y-targetY)>.001)frame=requestAnimationFrame(tick);
 }
 function schedule(){if(frame!==null||!visible||document.hidden)return;last=null;frame=requestAnimationFrame(tick);}
 function resize(){
  const box=field.getBoundingClientRect();width=Math.min(1200,Math.max(400,Math.round(box.width)));height=Math.max(200,Math.round(width*box.height/box.width));
  canvas.width=source.width=reveal.width=width;canvas.height=source.height=reveal.height=height;
  pixels=sourceCtx.createImageData(width,height);dirty=true;drawField();composite();schedule();
 }
 hero.addEventListener('pointermove',event=>{
  const box=field.getBoundingClientRect();
  const px=(event.clientX-box.left)/box.width,py=(event.clientY-box.top)/box.height;
  const inside=px>=0&&px<=1&&py>=0&&py<=1;
  const captionBox=caption.getBoundingClientRect();
  const nearCaption=event.clientX>=captionBox.left&&event.clientX<=captionBox.right&&event.clientY>=box.bottom&&event.clientY<=captionBox.bottom;
  hero.classList.toggle('field-caption-visible',inside||nearCaption);
  targetX=Math.max(0,Math.min(1,px));targetY=Math.max(0,Math.min(1,py));
  // Suppress the full-opacity lens when the pointer is over protected text/CTAs.
  // The broad page wash and glyph-shaped text shadows preserve readability.
  hovered=inside&&!event.target.closest('.protected');schedule();
 });
 hero.addEventListener('pointerleave',()=>{hovered=false;hero.classList.remove('field-caption-visible');schedule();});
 function syncPlay(){play.textContent=playing?'Ⅱ  Pause motion':'▷  Play motion';play.setAttribute('aria-label',playing?'Pause background animation':'Play background animation');schedule();}
 play.addEventListener('click',()=>{playing=!playing;syncPlay();});
 reduced.addEventListener('change',event=>{if(event.matches){playing=false;syncPlay();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame!==null){cancelAnimationFrame(frame);frame=null;}schedule();});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible&&frame!==null){cancelAnimationFrame(frame);frame=null;}schedule();}).observe(hero);
 resize();new ResizeObserver(resize).observe(field);syncPlay();
}

// Educational examples never submit data or consume real evaluation quota.
{
 const demo=document.querySelector('.evaluation-demo');
 const next=document.querySelector('#demo-next'),reset=document.querySelector('#demo-reset');
 const status=document.querySelector('#evaluation-result');
 const slots=[...demo.querySelectorAll('.attempts>span')];
 const stations=[...demo.querySelectorAll('[data-station]')],panels=[...demo.querySelectorAll('[data-scene]')];
 const explanation=demo.querySelector('.eval-explanation');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const lessons=[
  ['01 / THE HARNESS','Your code runs around HY4.','The team submits an AGPL open-source harness: the code that plans experiments, calls tools and checks results. Official model inference uses Tencent Hunyuan 4 Preview (HY4).','Teams improve the harness around a common model.'],
  ['02 / ALL 49 TASKS','Five public. Forty-four hidden.','A full official evaluation includes both groups. The five public tasks are available for practice; the 44 hidden tasks are withheld during evaluation. This diagram groups the tasks; it does not prescribe their execution order.','5 + 44 = 49 tasks in ONE evaluation.'],
  ['03 / THE EVIDENCE','Show what the agent actually did.','Evaluation checks the task result against recorded or replayed evidence. This scene illustrates the process only: it does not reveal hidden task details or produce a real leaderboard score.','A claimed result needs verifiable evidence.'],
  ['04 / THE ALLOWANCE','One full run uses one attempt.','The example has completed a full 49-task evaluation. The counter below now increases by one. Each team can have at most three official full evaluations.','Local practice and a full official evaluation are different.']
 ];
 let attempts=0,step=0;
 function render(animate=false){
  demo.dataset.stage=String(step);demo.style.setProperty('--eval-progress',String(Math.max(0,step)/3));
  stations.forEach((station,i)=>{station.classList.toggle('active',i===step);station.classList.toggle('complete',i<step);});
  panels.forEach(panel=>{panel.hidden=panel.dataset.scene!==(step<0?'idle':String(step));});
  slots.forEach((slot,i)=>slot.classList.toggle('used',i<attempts));
  document.querySelector('#attempt-count').textContent=attempts+' / 3 used';
  document.querySelector('#scene-attempt').textContent=attempts+' of 3 attempts used';
  const lesson=step<0?['BEFORE YOU START','Follow a complete run.','This is a visual explanation of the competition rules. Nothing is submitted, no model is called, and your real evaluation allowance is unaffected.','One full evaluation covers all 49 tasks. It is one attempt, not 49 attempts.']:lessons[step];
  ['eval-step-label','eval-step-title','eval-step-copy','eval-step-takeaway'].forEach((id,i)=>document.getElementById(id).textContent=lesson[i]);
  next.disabled=attempts>=3;
  next.textContent=attempts>=3?'Limit reached':step===3?'Next evaluation →':'Next step →';
  status.textContent=attempts===3?'All 3 example attempts used. Reset to replay.':step===3?'One complete 49-task evaluation counted. '+(3-attempts)+' remain in this example.':'Click Next step. This is an explainer, not a live evaluation.';
  if(animate&&!reduced.matches){
   const panel=panels.find(item=>!item.hidden);
   for(const element of [panel,explanation]){
    element.getAnimations().forEach(animation=>animation.cancel());
    element.animate([{opacity:.25,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
   }
  }
 }
 function advance(){
  if(attempts>=3)return;
  step=step===3?0:step+1;
  if(step===3)attempts++;
  render(true);
 }
 next.addEventListener('click',()=>{if(!next.disabled)advance();});
 reset.addEventListener('click',()=>{attempts=0;step=0;render(true);});
 render();
 const scenarios={
  first:['One qualifying team. USD 15,000.','The first qualifying team whose hidden score is strictly above the frozen GPT-6 Astra baseline receives the challenger award.'],
  tie:['Equal is not above.','Matching the GPT-6 Astra hidden baseline does not qualify. The team must strictly exceed it.'],
  later:['A breakthrough, but not the first.','If another qualifying team has already exceeded the baseline first, this team does not receive the challenger award. Placement prizes are separate; stacking terms are pending.'],
  none:['No qualifying team. No challenger payout.','If no team strictly exceeds the GPT-6 Astra hidden baseline, the USD 15,000 challenger award is not paid.']
 };
 const scenarioButtons=[...document.querySelectorAll('[data-scenario]')];
 scenarioButtons.forEach(button=>button.addEventListener('click',()=>{
  scenarioButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  const [title,copy]=scenarios[button.dataset.scenario];const result=document.querySelector('#award-result');
  result.querySelector('strong').textContent=title;result.querySelector('p').textContent=copy;
 }));
 const steps=[
  ['BEFORE THE COMPETITION','Build the decision-making around HY4.','A sample team writes a harness that chooses a quantum experiment, calls the lab tools, reads the result and decides what to do next. The model stays fixed; the orchestration is theirs.','YOUR HARNESS',['Plan','Use tools','Verify'],'↳  Learn from the evidence. Try again.','Illustrative workflow · no model call or experiment is running here.'],
  ['PREPARATION','Learn on the five public tasks.','The team tests locally in Quantum-Harbor, inspects its execution traces and improves the harness. Local practice is distinct from an official full evaluation. Exact development quotas remain to be announced.','PUBLIC PRACTICE',['5 tasks','Run locally','Inspect traces'],'↳  Improve the harness using public evidence.','Illustrative workflow · hidden tasks are not exposed in this demo.'],
  ['08–10 NOVEMBER 2026','Use each official evaluation deliberately.','From the November 8 start to the November 10 deadline, each team has at most three official full evaluations across all 49 tasks: five public and 44 hidden. The exact submission interface and daily times are to be announced.','OFFICIAL EVALUATION',['Harness','49 tasks','Evidence'],'↳  At most three full evaluations per team.','Illustrative workflow · this demo does not run a benchmark or produce a score.'],
  ['12 NOVEMBER 2026','Show what worked. Explain what did not.','Demo Day is November 12. Prepare a clear account of your approach and evidence. The current proposed review format asks finalists to explain a success and a failure; final judging details will be published in the rules.','DEMO DAY',['Approach','Evidence','Discussion'],'↳  A result that other people can inspect.','Demo Day date is confirmed; the detailed review format remains proposed.']
 ];
 const stepButtons=[...document.querySelectorAll('[data-step]')];
 stepButtons.forEach(button=>button.addEventListener('click',()=>{
  stepButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  const [date,title,copy,label,nodes,loop,note]=steps[Number(button.dataset.step)];
  for(const [id,text] of [['flow-date',date],['flow-title',title],['flow-copy',copy],['flow-diagram-label',label],['flow-note',note]])document.getElementById(id).textContent=text;
  nodes.forEach((text,i)=>document.getElementById('flow-node-'+['a','b','c'][i]).textContent=text);
  document.querySelector('.flow-loop').textContent=loop;
 }));
}

// Reference: workshop-preview/dist/motion.js. Animate inner spans so hit boxes
// and document layout remain stable. Text selection always takes priority.
{
 const title=document.querySelector('#hero-title');
 const items=[...title.querySelectorAll('.title-line')].map(target=>({target,surface:target.querySelector('.motion-surface')}));
 const motion=matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
 let frame=null,selecting=false;
 const pending=new Map();
 function resetItem(item){pending.delete(item);item.target.classList.remove('is-hovered');item.surface.style.removeProperty('--shift-x');item.surface.style.removeProperty('--shift-y');}
 function reset(){if(frame!==null)cancelAnimationFrame(frame);frame=null;items.forEach(resetItem);}
 function render(){
  frame=null;if(!motion.matches||selecting)return;
  for(const [item,point] of pending){
   const rect=item.target.getBoundingClientRect();
   const x=Math.max(-1,Math.min(1,(point.x-rect.left)/rect.width*2-1));
   const y=Math.max(-1,Math.min(1,(point.y-rect.top)/rect.height*2-1));
   item.surface.style.setProperty('--shift-x',(x*8)+'px');
   item.surface.style.setProperty('--shift-y',(y*4.8)+'px');
   item.target.classList.add('is-hovered');
  }
  pending.clear();
 }
 items.forEach(item=>{
  item.target.addEventListener('pointermove',event=>{
   if(!motion.matches||selecting||event.buttons||event.pointerType==='touch')return;
   pending.set(item,{x:event.clientX,y:event.clientY});if(frame===null)frame=requestAnimationFrame(render);
  });
  item.target.addEventListener('pointerleave',()=>resetItem(item));
  item.target.addEventListener('pointercancel',()=>resetItem(item));
 });
 title.addEventListener('pointerdown',()=>{selecting=true;title.classList.add('is-selecting');reset();});
 function endSelection(){selecting=false;title.classList.remove('is-selecting');}
 window.addEventListener('pointerup',endSelection);window.addEventListener('pointercancel',endSelection);
 window.addEventListener('scroll',reset,{passive:true});
 window.addEventListener('blur',()=>{endSelection();reset();});
 motion.addEventListener('change',reset);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){endSelection();reset();}});
}

// Registration remains an explicit inquiry until a real form URL is configured.
{
 const trigger=document.querySelector('#register-now');
 const dialog=document.querySelector('#registration-dialog');
 if(trigger&&dialog){
  trigger.addEventListener('click',()=>dialog.showModal());
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>trigger.focus());
 }
}

// Align the section boundary (including its divider) below the sticky header.
// Pixel scrolling avoids stacking scroll-padding with negative scroll margins.
{
 const header=document.querySelector('.site-header');
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let queued=null;
 function updateHeader(){root.style.setProperty('--nav-height',header.getBoundingClientRect().height+'px');}
 function resolve(hash){
  if(!hash||hash==='#')return null;
  let id;try{id=decodeURIComponent(hash.slice(1));}catch{return null;}
  const target=document.getElementById(id);
  if(!target)return null;
  const heading=target.matches('.hero')?target.querySelector('h1'):target.matches('.section')?target.querySelector('.section-heading, .eyebrow, h2'):target;
  return {target,heading:heading||target};
 }
 function navigate(hash,{push=false,smooth=false,focus=false}={}){
  const resolved=resolve(hash);if(!resolved)return;
  updateHeader();
  const absoluteTop=resolved.target.getBoundingClientRect().top+window.scrollY;
  const inset=header.getBoundingClientRect().bottom;
  const maxTop=Math.max(0,root.scrollHeight-window.innerHeight);
  const top=Math.max(0,Math.min(maxTop,absoluteTop-inset));
  if(push&&location.hash!==hash)history.pushState(null,'',hash);
  if(focus){
   if(!resolved.heading.hasAttribute('tabindex')){
    resolved.heading.setAttribute('tabindex','-1');
    resolved.heading.addEventListener('blur',()=>resolved.heading.removeAttribute('tabindex'),{once:true});
   }
   resolved.heading.focus({preventScroll:true});
  }
  window.scrollTo({top,behavior:smooth&&!reduced.matches?'smooth':'instant'});
 }
 function queue(hash,options){
  if(queued!==null)cancelAnimationFrame(queued);
  queued=requestAnimationFrame(()=>{queued=null;navigate(hash,options);});
 }
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest('a[href^="#"]');
  if(!link||link.hasAttribute('download')||link.target==='_blank')return;
  const hash=link.getAttribute('href');if(!resolve(hash))return;
  event.preventDefault();setMenu(false);
  // Wait for the collapsed navigation to have its final geometry.
  queue(hash,{push:true,smooth:true,focus:event.detail===0});
 });
 const restore=()=>queue(location.hash,{smooth:false});
 window.addEventListener('popstate',restore);
 window.addEventListener('hashchange',restore);
 updateHeader();new ResizeObserver(updateHeader).observe(header);
 const initialHash=location.hash;
 const loaded=document.readyState==='complete'?Promise.resolve():new Promise(resolve=>window.addEventListener('load',resolve,{once:true}));
 Promise.all([loaded,document.fonts?document.fonts.ready:Promise.resolve()]).then(()=>{
  if(initialHash&&location.hash===initialHash)queue(initialHash,{smooth:false});
 });
}

// Count each homepage prize up once when it first enters view.
{
 const numbers=[...document.querySelectorAll('.prize-number[data-amount]')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const active=new Map();
 const formatter=new Intl.NumberFormat('en-US');
 function finish(number){
  if(active.has(number))cancelAnimationFrame(active.get(number));
  active.delete(number);
  number.textContent=formatter.format(Number(number.dataset.amount));
 }
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   const number=entry.target;
   observer.unobserve(number);
   if(reduced.matches||document.hidden){finish(number);return;}
   const amount=Number(number.dataset.amount),duration=1700;
   let start=null;
   number.textContent='0';
   function tick(now){
    if(start===null)start=now;
    const progress=Math.min(1,(now-start)/duration);
    const eased=1-Math.pow(1-progress,3);
    number.textContent=formatter.format(Math.round(amount*eased));
    if(progress<1)active.set(number,requestAnimationFrame(tick));
    else finish(number);
   }
   active.set(number,requestAnimationFrame(tick));
  });
 },{threshold:.5});
 if(!reduced.matches)numbers.forEach(number=>observer.observe(number));
 reduced.addEventListener('change',event=>{
  if(event.matches){observer.disconnect();numbers.forEach(finish);}
 });
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden)[...active.keys()].forEach(finish);
 });
}
