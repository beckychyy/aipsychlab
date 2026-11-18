import * as THREE from './assets/js/three.module.min.js';

const canvas = document.querySelector('#universe');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010307);
scene.fog = new THREE.FogExp2(0x010307, .008);
const camera = new THREE.PerspectiveCamera(42, 1, .1, 900);
camera.position.set(0, 0, 13);

const loader = new THREE.TextureLoader();
function texture(path){ const t=loader.load(path); t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=renderer.capabilities.getMaxAnisotropy(); return t; }
const maps={earth:texture('./assets/textures/earth.jpg'),moon:texture('./assets/textures/moon.jpg'),mars:texture('./assets/textures/mars.jpg')};

const hemi = new THREE.HemisphereLight(0x385a80,0x030303,.12); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2db,4.2); sun.position.set(-8,3,8); scene.add(sun);
const rim = new THREE.PointLight(0x1dc9ff,8,40); rim.position.set(8,-4,4); scene.add(rim);

function planet(name,radius,map){
  const group=new THREE.Group(); group.name=name;
  const sphere=new THREE.Mesh(new THREE.SphereGeometry(radius,96,64),new THREE.MeshStandardMaterial({map,roughness:1,metalness:0}));
  sphere.castShadow=true; sphere.receiveShadow=true; group.add(sphere);
  return group;
}
const earth=planet('earth',2.8,maps.earth), moon=planet('moon',2.55,maps.moon), mars=planet('mars',2.75,maps.mars);
scene.add(earth,moon,mars);

function starField(count, spread, size){
  const pos=new Float32Array(count*3), col=new Float32Array(count*3);
  for(let i=0;i<count;i++){const r=spread*(.35+Math.random()*.65),a=Math.random()*Math.PI*2,z=(Math.random()-.5)*spread;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=Math.sin(a)*r;pos[i*3+2]=z;const c=.55+Math.random()*.45;col[i*3]=c*.76;col[i*3+1]=c*.9;col[i*3+2]=c;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
  return new THREE.Points(g,new THREE.PointsMaterial({size,vertexColors:true,transparent:true,opacity:.8,sizeAttenuation:true}));
}
const stars=starField(4200,260,.12); scene.add(stars);

function glowTexture(inner='rgba(255,255,255,1)',outer='rgba(255,255,255,0)'){
  const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,2,64,64,62);g.addColorStop(0,inner);g.addColorStop(.25,inner);g.addColorStop(1,outer);x.fillStyle=g;x.fillRect(0,0,128,128);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
const whiteGlow=glowTexture('rgba(220,245,255,1)'),warmGlow=glowTexture('rgba(255,185,85,1)','rgba(255,70,10,0)');

function makeSpeedLines(){
  const pts=[];for(let i=0;i<520;i++){const x=(Math.random()-.5)*32,y=(Math.random()-.5)*18,z=-30+Math.random()*55,l=.06+Math.random()*.6;pts.push(x,y,z,x,y,z+l)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));const m=new THREE.LineBasicMaterial({color:0x9edfff,transparent:true,opacity:.24,blending:THREE.AdditiveBlending});const lines=new THREE.LineSegments(g,m);lines.visible=false;return lines;
}
const speedLines=makeSpeedLines();scene.add(speedLines);

function makeRocket(){
  const g=new THREE.Group(); g.name='SLS';
  const white=new THREE.MeshStandardMaterial({color:0xe9ece8,roughness:.45,metalness:.15});
  const orange=new THREE.MeshStandardMaterial({color:0xb45b29,roughness:.7,metalness:.08});
  const dark=new THREE.MeshStandardMaterial({color:0x151a1d,roughness:.4,metalness:.55});
  const core=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,3.9,32),orange); core.position.y=.1;g.add(core);
  const upper=new THREE.Mesh(new THREE.CylinderGeometry(.16,.25,1.3,32),white);upper.position.y=2.7;g.add(upper);
  const nose=new THREE.Mesh(new THREE.ConeGeometry(.16,.65,32),white);nose.position.y=3.68;g.add(nose);
  [-.42,.42].forEach(x=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(.105,.12,3.65,24),white);b.position.set(x,-.05,0);g.add(b);const n=new THREE.Mesh(new THREE.ConeGeometry(.105,.35,24),white);n.position.set(x,1.95,0);g.add(n);const noz=new THREE.Mesh(new THREE.ConeGeometry(.13,.26,24,1,true),dark);noz.position.set(x,-2.02,0);noz.rotation.x=Math.PI;g.add(noz);});
  const flameMat=new THREE.MeshBasicMaterial({color:0xbfefff,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false});
  const flameOuter=new THREE.MeshBasicMaterial({color:0xff6b18,transparent:true,opacity:.62,blending:THREE.AdditiveBlending,depthWrite:false});
  [-.42,0,.42].forEach((x,i)=>{const out=new THREE.Mesh(new THREE.ConeGeometry(i===1?.24:.17,i===1?2.4:2,28),flameOuter);out.position.set(x,-2.75,0);out.rotation.x=Math.PI;g.add(out);const coreFlame=new THREE.Mesh(new THREE.ConeGeometry(i===1?.1:.075,i===1?1.75:1.4,20),flameMat);coreFlame.position.set(x,-2.62,.01);coreFlame.rotation.x=Math.PI;g.add(coreFlame)});
  const flare=new THREE.Sprite(new THREE.SpriteMaterial({map:warmGlow,color:0xff7a22,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));flare.position.set(0,-3.05,0);flare.scale.set(3.7,6.2,1);g.add(flare);
  const engineLight=new THREE.PointLight(0xff6a24,18,18);engineLight.position.set(0,-2.3,1);g.add(engineLight);
  g.visible=false;return g;
}
const rocket=makeRocket();scene.add(rocket);

function makeLaunchSmoke(){
  const g=new THREE.Group();for(let i=0;i<85;i++){const m=new THREE.SpriteMaterial({map:whiteGlow,color:i%4===0?0xffaa74:0xaab7bc,transparent:true,opacity:.05+Math.random()*.13,depthWrite:false});const s=new THREE.Sprite(m);const a=Math.random()*Math.PI*2,r=.2+Math.random()*2.8;s.position.set(Math.cos(a)*r,-3.7+Math.random()*.9,Math.sin(a)*r*.45);const z=.8+Math.random()*2.5;s.scale.set(z,z,z);s.userData={a,r,rate:.15+Math.random()*.55,seed:Math.random()*10};g.add(s)}g.visible=false;return g;
}
const launchSmoke=makeLaunchSmoke();scene.add(launchSmoke);

function solarPanel(){
  const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle='#071d39';x.fillRect(0,0,c.width,c.height);x.strokeStyle='rgba(93,170,255,.55)';x.lineWidth=2;for(let i=0;i<=16;i++){x.beginPath();x.moveTo(i*32,0);x.lineTo(i*32,128);x.stroke()}for(let i=0;i<=4;i++){x.beginPath();x.moveTo(0,i*32);x.lineTo(512,i*32);x.stroke()}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return new THREE.Mesh(new THREE.BoxGeometry(3.6,.05,.72),new THREE.MeshStandardMaterial({map:t,metalness:.55,roughness:.25,emissive:0x05142a,emissiveIntensity:.6}));
}
function makeOrion(){
  const g=new THREE.Group();g.name='ORION';const metal=new THREE.MeshStandardMaterial({color:0xcbd0d2,metalness:.86,roughness:.22}),foil=new THREE.MeshStandardMaterial({color:0xa8a9a0,metalness:1,roughness:.33}),dark=new THREE.MeshStandardMaterial({color:0x10161c,metalness:.65,roughness:.3});
  const service=new THREE.Mesh(new THREE.CylinderGeometry(.58,.63,1.25,48),foil);service.rotation.z=Math.PI/2;g.add(service);const capsuleBody=new THREE.Mesh(new THREE.ConeGeometry(.68,.92,48),metal);capsuleBody.rotation.z=-Math.PI/2;capsuleBody.position.x=.98;g.add(capsuleBody);const shield=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,.13,48),dark);shield.rotation.z=Math.PI/2;shield.position.x=.55;g.add(shield);
  for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.61-i*.035,.018,8,48),dark);ring.rotation.y=Math.PI/2;ring.position.x=-.38+i*.35;g.add(ring)}
  const nozzle=new THREE.Mesh(new THREE.ConeGeometry(.24,.5,32,1,true),dark);nozzle.rotation.z=Math.PI/2;nozzle.position.x=-.87;g.add(nozzle);
  const panel1=solarPanel();panel1.position.set(-.1,0,2.15);panel1.rotation.y=Math.PI/2;g.add(panel1);const panel2=panel1.clone();panel2.position.z=-2.15;g.add(panel2);const panel3=solarPanel();panel3.position.set(-.1,2.15,0);panel3.rotation.z=Math.PI/2;g.add(panel3);const panel4=panel3.clone();panel4.position.y=-2.15;g.add(panel4);
  const dish=new THREE.Mesh(new THREE.SphereGeometry(.28,24,12,0,Math.PI*2,0,Math.PI/2),metal);dish.rotation.z=-Math.PI/2;dish.position.set(-.35,.55,.4);g.add(dish);
  const windowMat=new THREE.MeshBasicMaterial({color:0x8fdfff});[-.18,.18].forEach(z=>{const w=new THREE.Mesh(new THREE.SphereGeometry(.08,16,8),windowMat);w.position.set(1.2,.34,z);g.add(w)});
  const rimLight=new THREE.PointLight(0x57cfff,5,12);rimLight.position.set(0,-1,2);g.add(rimLight);g.visible=false;return g;
}
const orion=makeOrion();scene.add(orion);

function makeCapsule(){
  const g=new THREE.Group(), metal=new THREE.MeshStandardMaterial({color:0xbfc5c6,metalness:.8,roughness:.25}), black=new THREE.MeshStandardMaterial({color:0x111416,metalness:.3,roughness:.7});
  const body=new THREE.Mesh(new THREE.ConeGeometry(.56,.9,32),metal);body.rotation.x=Math.PI;g.add(body);
  const shield=new THREE.Mesh(new THREE.CylinderGeometry(.59,.59,.12,32),black);shield.position.y=.44;g.add(shield);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.57,.03,10,40),new THREE.MeshBasicMaterial({color:0xff6b35}));ring.rotation.x=Math.PI/2;ring.position.y=.5;g.add(ring);g.visible=false;return g;
}
const capsule=makeCapsule();scene.add(capsule);

let current=0, targetCam=new THREE.Vector3(0,0,13), targetLook=new THREE.Vector3(), look=new THREE.Vector3(),launchStart=-1;
const configs=[
  {cam:[0,.2,15],earth:[5,-2,-2],moon:[-1,1,-5],mars:[-7,3,-12],er:1,mr:.5,mor:.7},
  {cam:[0,0,11],earth:[20,0,-10],moon:[1.1,-.1,0],mars:[-20,0,-10],mor:1},
  {cam:[0,.3,15],earth:[4.2,-3.8,-3],moon:[20,0,-10],mars:[-20,0,-10],er:1},
  {cam:[0,0,17],earth:[-8,-4,-5],moon:[20,0,-10],mars:[8,3,-7],er:.55,mr:.65},
  {cam:[0,0,14],earth:[20,0,-10],moon:[20,0,-10],mars:[5,-1,-3],mr:1.35},
  {cam:[0,0,11],earth:[20,0,-10],moon:[20,0,-10],mars:[.7,-.2,0],mr:1},
  {cam:[0,0,18],earth:[-6,-3,-6],moon:[1,1,-8],mars:[7,-1,-5],er:.45,mor:.45,mr:.55}
];
function applyBody(body,pos,scale=1){body.position.set(...pos);body.scale.setScalar(scale)}
export function setScene(index){
  current=index;const c=configs[index];targetCam.set(...c.cam);applyBody(earth,c.earth,c.er||1);applyBody(moon,c.moon,c.mor||1);applyBody(mars,c.mars,c.mr||1);
  rocket.visible=false;rocket.position.set(1.6,-.7,1);rocket.scale.setScalar(1.15);rocket.rotation.z=-.12;
  launchSmoke.visible=false;launchSmoke.position.set(1.6,0,1);speedLines.visible=index===3;speedLines.material.opacity=.28;
  orion.visible=index===3;orion.position.set(3.45,-.2,1.4);orion.scale.setScalar(1.12);orion.rotation.set(.26,-.35,.18);
  capsule.visible=index===4;capsule.position.set(1.5,1.4,1);capsule.scale.setScalar(1.15);capsule.rotation.z=-.8;
  if(index!==2)launchStart=-1;
  if(index===5) sun.position.set(-6,3,8); else if(index===1) sun.position.set(-7,3,8); else sun.position.set(-8,3,8);
}
export function setLightAngle(deg){const a=THREE.MathUtils.degToRad(deg);sun.position.set(Math.cos(a)*9,Math.sin(a)*8,6)}
export function setEDLProgress(p){capsule.position.y=1.8-p*2.8;capsule.rotation.z=-.9+p*.55;const s=1+p*.9;capsule.scale.setScalar(s)}
export function triggerLaunch(){launchStart=performance.now()/1000;launchSmoke.visible=false}

let dragging=false,lastX=0,lastY=0,zoom=0,dragBody=null;
const interactionLayer=document.querySelector('#stage'),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),planetMeshes=[earth.children[0],moon.children[0],mars.children[0]];
function planetAt(e){pointer.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(planetMeshes,false)[0];return hit?.object?.parent||null}
function overInterface(target){return !!target.closest('button,input,a,.story-card,.target-list,.site-options,.site-decision,.site-equipment,.surface-mission,.surface-hotspots,.mars-base-reveal,.timeline,.help-panel,.settlement,.audio-gate')}
interactionLayer.addEventListener('pointerdown',e=>{if(document.body.classList.contains('kv-mode')||document.body.classList.contains('mars-surface-mode')||overInterface(e.target))return;dragBody=planetAt(e);if(!dragBody)return;e.preventDefault();dragging=true;lastX=e.clientX;lastY=e.clientY;interactionLayer.classList.add('planet-dragging');interactionLayer.setPointerCapture(e.pointerId)});
interactionLayer.addEventListener('pointermove',e=>{if(dragging&&dragBody){dragBody.rotation.y+=(e.clientX-lastX)*.006;dragBody.rotation.x+=(e.clientY-lastY)*.004;lastX=e.clientX;lastY=e.clientY;return}if(!overInterface(e.target))interactionLayer.classList.toggle('planet-hover',!!planetAt(e))});
function endDrag(){dragging=false;dragBody=null;interactionLayer.classList.remove('planet-dragging')}
interactionLayer.addEventListener('pointerup',endDrag);interactionLayer.addEventListener('pointercancel',endDrag);
interactionLayer.addEventListener('wheel',e=>{if(document.body.classList.contains('mars-surface-mode')||overInterface(e.target)||!planetAt(e))return;zoom=THREE.MathUtils.clamp(zoom+Math.sign(e.deltaY)*.55,-2,2.5);e.preventDefault()},{passive:false});

function resize(){const wall=document.body.classList.contains('wall-14820'),w=wall?innerWidth*(5330/9458):innerWidth,h=wall?innerHeight*(2150/4213):innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}addEventListener('resize',resize);addEventListener('space-layout-change',resize);resize();setScene(0);
const clock=new THREE.Clock();
function frame(){
  const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;requestAnimationFrame(frame);
  stars.rotation.y+=dt*.004;stars.rotation.x=Math.sin(t*.03)*.02;
  if(speedLines.visible){speedLines.position.z+=dt*(current===2?7:16);if(speedLines.position.z>24)speedLines.position.z=-24}
  if(!dragging){earth.rotation.y+=dt*.025;moon.rotation.y+=dt*.012;mars.rotation.y+=dt*.018}
  if(current===2){const age=launchStart<0?-1:performance.now()/1000-launchStart;if(age<0){rocket.position.y=-.7+Math.sin(t*1.2)*.035}else{const rise=Math.pow(Math.min(age/4.5,1),1.35)*10;rocket.position.y=-.7+rise;rocket.position.x=1.6+age*.12;rocket.rotation.z=-.12+Math.min(age/4,.08);rocket.scale.setScalar(1.15-Math.min(age/7,.22));speedLines.material.opacity=Math.min(.55,.12+age*.15)}launchSmoke.children.forEach((s,i)=>{const u=s.userData,a=Math.max(0,age);const spread=u.r+a*u.rate;s.position.x=Math.cos(u.a)*spread;s.position.z=Math.sin(u.a)*spread*.42;s.position.y=-3.6+a*.08+Math.sin(t*.5+u.seed)*.16;s.material.opacity=Math.max(.015,(.16+i%5*.015)*(1-Math.min(a/6,.72)));const z=(.8+i%7*.22)+a*.16;s.scale.set(z*1.6,z,z)})}
  if(current===3&&orion.visible){orion.position.y=-.2+Math.sin(t*.36)*.22;orion.position.x=3.45+Math.sin(t*.18)*.35;orion.rotation.y=-.35+Math.sin(t*.16)*.16;orion.rotation.z=.18+Math.sin(t*.22)*.04}
  capsule.rotation.y+=dt*.2;
  camera.position.lerp(new THREE.Vector3(targetCam.x,targetCam.y,targetCam.z+zoom),1-Math.pow(.001,dt));
  if(current===2&&launchStart>0){const age=performance.now()/1000-launchStart,shake=Math.max(0,1-age/3)*.055;camera.position.x+=Math.sin(t*71)*shake;camera.position.y+=Math.sin(t*53)*shake}
  look.lerp(targetLook,1-Math.pow(.001,dt));camera.lookAt(look);renderer.render(scene,camera);
}
frame();
