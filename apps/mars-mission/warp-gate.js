const gate=document.querySelector('#warpGate');
const canvas=document.querySelector('#warpCanvas');
const ctx=canvas.getContext('2d',{alpha:false,desynchronized:true});
const engageButton=document.querySelector('#warpEngage');
const skipButton=document.querySelector('#warpSkip');
const replayButton=document.querySelector('#warpReplay');
const statusText=document.querySelector('#warpStatus');
const velocityText=document.querySelector('#warpVelocity');

let width=0,height=0,scale=1,active=false,complete=false,startTime=0,flashTriggered=false,raf=0;
const stars=[];
const STAR_COUNT=960;
const TUNNEL_RINGS=36;
const duration=6200;

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const easeIn=t=>t*t*t;
const easeOut=t=>1-Math.pow(1-t,3);
const randomStar=star=>{
  star.x=(Math.random()*2-1)*1.15;
  star.y=(Math.random()*2-1)*.78;
  star.z=.05+Math.random()*.96;
  star.size=.25+Math.random()*1.65;
  star.hue=Math.random()<.2?188:Math.random()<.08?31:205;
  star.phase=Math.random()*Math.PI*2;
  return star;
};
for(let i=0;i<STAR_COUNT;i++)stars.push(randomStar({}));

function resize(){
  width=innerWidth;height=innerHeight;
  scale=Math.min(devicePixelRatio||1,1.5,3200/Math.max(width,1));
  canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
  canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;
  ctx.setTransform(scale,0,0,scale,0,0);
}

function centerFor(progress,now){
  const curve=active?Math.sin(progress*Math.PI*2.6)*width*.018*easeIn(clamp(progress/.78)):0;
  const drift=Math.sin(now*.00024)*width*.004;
  return{x:width*.5+curve+drift,y:height*(.47+Math.cos(now*.00019)*.006)};
}

function drawTunnel(cx,cy,p,now){
  const appear=clamp((p-.1)/.55),rush=clamp((p-.17)/.66);
  if(appear<=0)return;
  ctx.save();ctx.globalCompositeOperation='lighter';
  const maxRadius=Math.hypot(width,height)*.78;
  for(let i=0;i<TUNNEL_RINGS;i++){
    const lane=(i/TUNNEL_RINGS+rush*2.35)%1;
    const r=26+Math.pow(lane,1.72)*maxRadius;
    const alpha=Math.sin(lane*Math.PI)*appear*(.055+lane*.1);
    const points=74;
    ctx.beginPath();
    for(let j=0;j<=points;j++){
      const a=j/points*Math.PI*2;
      const noise=1+Math.sin(a*5+i*.73+now*.0019)*.026+Math.sin(a*11-now*.0012)*.012;
      const x=cx+Math.cos(a)*r*noise;
      const y=cy+Math.sin(a)*r*.52*noise;
      if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle=`hsla(${188+i%4*8},100%,${64+i%3*8}%,${alpha})`;
    ctx.lineWidth=.45+lane*2.2;ctx.stroke();
  }
  for(let i=0;i<42;i++){
    const a=i/42*Math.PI*2+Math.sin(i*8.3)*.025;
    const inner=34+Math.sin(now*.001+i)*8;
    const outer=maxRadius*(.78+Math.sin(i*4.7)*.08);
    const bend=Math.sin(rush*Math.PI*2.4+i)*width*.012;
    ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*inner,cy+Math.sin(a)*inner*.52);
    ctx.quadraticCurveTo(cx+bend+Math.cos(a)*outer*.35,cy+Math.sin(a)*outer*.2,cx+Math.cos(a)*outer,cy+Math.sin(a)*outer*.52);
    ctx.strokeStyle=`hsla(${i%5===0?31:193},100%,72%,${appear*(i%5===0?.035:.055)})`;ctx.lineWidth=i%5===0?1.3:.65;ctx.stroke();
  }
  ctx.restore();
}

function drawStars(cx,cy,p,dt){
  const acceleration=active?easeIn(clamp(p/.72)):0;
  const speed=.0008+acceleration*.046+(p>.72?easeIn((p-.72)/.28)*.09:0);
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const star of stars){
    const oldZ=star.z;
    star.z-=speed*Math.max(.5,dt/16.67);
    if(star.z<.012)randomStar(star);
    const sx=cx+star.x/star.z*width*.36,sy=cy+star.y/star.z*height*.46;
    const px=cx+star.x/(oldZ+speed*(3+acceleration*45))*width*.36;
    const py=cy+star.y/(oldZ+speed*(3+acceleration*45))*height*.46;
    if(sx<-width*.2||sx>width*1.2||sy<-height*.2||sy>height*1.2){randomStar(star);continue}
    const proximity=clamp(1-star.z);
    const alpha=.18+proximity*.78;
    ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(sx,sy);
    ctx.strokeStyle=`hsla(${star.hue},100%,${72+star.size*8}%,${alpha})`;
    ctx.lineWidth=Math.min(5,.35+star.size*proximity*(1+acceleration*2.2));ctx.stroke();
  }
  ctx.restore();
}

function drawPortal(cx,cy,p,now){
  const q=clamp((p-.48)/.34);if(q<=0)return;
  const r=(24+easeOut(q)*Math.min(width,height)*.19)*(1+Math.sin(now*.004)*.012);
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(let i=0;i<7;i++){
    ctx.beginPath();ctx.ellipse(cx,cy,r+i*4,r*.54+i*2,0,0,Math.PI*2);
    ctx.strokeStyle=`rgba(${i<2?'255,190,118':'88,226,255'},${(.34-i*.035)*Math.sin(q*Math.PI*.9)})`;
    ctx.lineWidth=1+i*.65;ctx.stroke();
  }
  const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.18);glow.addColorStop(0,'rgba(225,251,255,.28)');glow.addColorStop(.2,'rgba(80,225,255,.09)');glow.addColorStop(.62,'rgba(40,160,255,.025)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(cx-r*1.4,cy-r*1.1,r*2.8,r*2.2);ctx.restore();
}

function updateLabels(p){
  if(!active)return;
  let label='正在锁定深空航向';
  if(p>.2)label='推进器同步 · 星场加速';
  if(p>.43)label='穿越空间折叠区';
  if(p>.7)label='接近尚睿通任务仓';
  if(p>.86)label='深空链路已建立';
  statusText.textContent=label;
  velocityText.textContent=`${Math.min(.997,easeIn(clamp(p/.86))*.997).toFixed(3)} c`;
  gate.dataset.phase=p>.86?'arrival':p>.48?'tunnel':p>.12?'acceleration':'ignition';
}

let lastFrame=performance.now();
function frame(now){
  const dt=Math.min(35,now-lastFrame);lastFrame=now;
  const elapsed=active?now-startTime:0,p=active?clamp(elapsed/duration):0;
  const c=centerFor(p,now);
  const bg=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,Math.hypot(width,height)*.62);
  bg.addColorStop(0,active?'#07101c':'#040914');bg.addColorStop(.34,'#020611');bg.addColorStop(1,'#000103');ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);
  drawTunnel(c.x,c.y,p,now);drawStars(c.x,c.y,p,dt);drawPortal(c.x,c.y,p,now);updateLabels(p);
  if(active&&p>.73&&!flashTriggered){flashTriggered=true;gate.classList.add('is-flashing')}
  if(active&&p>=1)finish();
  raf=requestAnimationFrame(frame);
}

function engage(){
  if(active)return;complete=false;active=true;flashTriggered=false;startTime=performance.now();
  gate.classList.remove('is-complete','is-flashing');gate.classList.add('is-engaged');gate.setAttribute('aria-hidden','false');
  document.body.classList.add('warp-running');
  dispatchEvent(new CustomEvent('warp:engage'));
}
function finish(){
  if(complete)return;complete=true;active=false;gate.classList.add('is-complete');gate.classList.remove('is-engaged');document.body.classList.remove('warp-running');
  gate.setAttribute('aria-hidden','true');dispatchEvent(new CustomEvent('warp:complete'));
}
function replay(){
  complete=false;active=false;flashTriggered=false;gate.dataset.phase='ready';gate.classList.remove('is-complete','is-engaged','is-flashing');
  gate.setAttribute('aria-hidden','false');statusText.textContent='深空链路待连接';velocityText.textContent='0.000 c';
  setTimeout(engage,120);
}

engageButton.addEventListener('click',engage);skipButton.addEventListener('click',finish);replayButton?.addEventListener('click',replay);
addEventListener('resize',resize);resize();
if(new URL(location.href).searchParams.get('skipIntro')==='1')finish();
raf=requestAnimationFrame(frame);
window.SRTWarpGate={engage,finish,replay};

