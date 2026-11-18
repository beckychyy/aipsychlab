import {setScene as setSpaceScene,setLightAngle,setEDLProgress,triggerLaunch} from './space-scene.js?v=20261117u';
import {AudioEngine} from './audio-engine-20261117c.js';
import * as MissionTransit from './mission-transit-module-20261117.js';

const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const audio=new AudioEngine();
const names=['系统唤醒','月球证据与选址','月面发射窗口','地火巡航修正','火星进入下降着陆','火星科研选址','任务复盘'];
const state={scene:0,unlocked:0,roles:new Set(),evidence:new Set(),surfaceEvidence:new Set(),baseExteriorSystems:new Set(),baseInteriorSystems:new Set(),baseInteriorSeen:false,baseInteriorStep:0,lunarSite:null,launch:null,course:null,burns:0,courseError:30,edlStep:-1,edlDone:false,site:null,equipment:null,settled:new Set(),score:0};
let toastTimer,missionStart=Date.now(),edlRunning=false,pendingSiteLesson=null;
const displayNames={standard:'标准横屏',ultrawide:'10K 超宽屏',wall:'左中右下四屏',kv:'KV 主视觉'};
let displayMode='standard';

addEventListener('warp:engage',async()=>{
  audio.setMode('neon');
  if(!audio.enabled)await audio.start();
  $('#soundBtn').classList.add('active');$('#soundBtn b').textContent='声场开启';
  audio.impact();
});

function applyDisplayMode(mode,{persist=true,updateUrl=true}={}){
  if(!displayNames[mode])mode='standard';displayMode=mode;
  const projectorReportsWide=innerWidth/innerHeight>=2.1,isWall=mode==='wall';document.body.classList.toggle('ultra-wide',mode==='ultrawide'||isWall);document.body.classList.toggle('ultra-forced',mode==='ultrawide'&&!projectorReportsWide);document.body.classList.toggle('wall-14820',isWall);document.body.classList.toggle('kv-mode',mode==='kv');document.body.dataset.displayMode=mode;document.body.dataset.output=isWall?'14820 × 2150 · LEFT / FRONT / RIGHT / FLOOR':mode==='ultrawide'?`10K FORCE · ${innerWidth} × ${innerHeight}`:'';
  $('#kvStage').setAttribute('aria-hidden',mode!=='kv');$('#displayModeBtn').textContent=displayNames[mode];
  $$('[data-display-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.displayMode===mode));
  if(mode==='kv')setSpaceScene(3);else setSpaceScene(state.scene);dispatchEvent(new Event('space-layout-change'));
  if(persist)localStorage.setItem('ares-display-mode',mode);
  if(updateUrl){const url=new URL(location.href);if(mode==='standard')url.searchParams.delete('mode');else url.searchParams.set('mode',mode);history.replaceState(null,'',url)}
  $('#displayModeMenu').classList.remove('open');$('#displayModeMenu').setAttribute('aria-hidden','true');$('#displayModeBtn').setAttribute('aria-expanded','false');
}

function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400)}
function renderNavLocks(){$$('.timeline>button[data-goto]').forEach((b,i)=>{const locked=i>state.unlocked;b.classList.toggle('locked',locked);b.setAttribute('aria-disabled',locked?'true':'false')})}
function unlock(n){state.unlocked=Math.max(state.unlocked,n);renderNavLocks()}
function commitScene(index){
  state.scene=index;document.body.dataset.scene=String(index);$$('.scene').forEach((s,i)=>s.classList.toggle('active',i===index));$$('.timeline>button[data-goto]').forEach((b,i)=>b.classList.toggle('active',i===index));
  if(index!==5){document.body.classList.remove('mars-surface-mode');$('.mars').classList.remove('surface-active')}
  $('#sceneName').textContent=names[index];$('#progressBar').style.width=`${index/6*100}%`;$('#taskVoiceBtn').textContent=index>0?`任务 ${String(index).padStart(2,'0')} 播报`:'任务播报';setSpaceScene(index);audio.setScene(index);renderNavLocks();
  if(index===6)renderDebrief();if(index===5&&audio.enabled)$('#marsAudioState').textContent='正在播放：毅力号 SuperCam 火星风声实录';
}
function go(index,force=false){
  index=Math.max(0,Math.min(6,index));
  if(document.body.classList.contains('mission-transitioning'))return;
  if(index>state.unlocked&&!force){toast('不能跳关：请先完成当前任务和过关题');audio.feedback('error');return}
  if(index>state.scene+1&&!force){toast('请按任务顺序前进，不能直接跳到后面的场景');audio.feedback('error');return}
  if(index===2&&(!state.lunarSite?.safe||state.evidence.size<3)&&!force){toast(state.evidence.size<3?`还缺 ${3-state.evidence.size} 条月球证据`:'先选择安全的月面发射点');audio.feedback('error');return}
  if(index===3&&!state.launch&&!force){toast('先完成发射窗口并点火');return}
  if(index===4&&state.burns<2&&!force){toast('必须完成两次航向修正');return}
  if(index===5&&!state.edlDone&&!force){toast('先完成进入、下降与着陆序列');return}
  if(index===6&&!state.equipment&&!force){toast('先完成地点对应的科学工具任务');return}
  if(index===state.scene)return;
  const cinematic=!force&&index>state.scene&&index>0;
  if(cinematic)MissionTransit.play(index,()=>commitScene(index));else commitScene(index);
}
function next(){go(state.scene+1)}

const lessons={
  lunar:{level:'第 1 关完成',title:'本关知识：怎样选择月面发射点',did:'转动月球寻找三条地形证据，再比较三个区域，选择了沙克尔顿外缘平坦光照区。',learn:'选择发射点不能只看资源，还要同时比较地面坡度、光照时间和通信条件。平坦、光照稳定并远离陡坡的地方更安全。',question:'哪种地点更适合作为月面发射点？',answers:['地面平坦、光照稳定、远离陡坡','水冰最多但没有阳光的坑底','视野很高但非常陡的山壁'],correct:'地面平坦、光照稳定、远离陡坡'},
  launch:{level:'第 2 关完成',title:'本关知识：月球没有空气，火箭也能升空',did:'调整月面上升器的推力和离轨角度，让它进入安全月球轨道。',learn:'火箭不需要借助空气向上飞。发动机向下高速喷出燃气，飞行器受到方向相反的作用力；燃料和氧化剂都由火箭自己携带。',question:'月球几乎没有空气，火箭为什么还能升空？',answers:['火箭自带燃料和氧化剂，并靠喷气的反作用力','月球风会把火箭吹上去','地球会像磁铁一样把火箭吸走'],correct:'火箭自带燃料和氧化剂，并靠喷气的反作用力'},
  cruise:{level:'第 3 关完成',title:'本关知识：怎样修正太空航线',did:'只用两次短暂的小推力，把预测轨迹送进了火星捕获圈。',learn:'太空距离非常远，早一点修正很小的方向，抵达时就会产生很大的位置变化。',question:'为什么远距离航行要尽早修正方向？',answers:['小角度经过远距离会变成大偏差','越早修正飞船就越重','火星会停下来等待'],correct:'小角度经过远距离会变成大偏差'},
  edl:{level:'第 4 关完成',title:'本关知识：火星着陆为什么要分步骤',did:'依次完成热盾、降落伞、地形导航和空中吊车四个节点。',learn:'火星大气很薄，单靠降落伞不够。不同装置要在合适的高度和速度下接力工作。',question:'飞船高速进入火星大气层时，首先需要什么保护？',answers:['隔热盾','探测车车轮','太阳能板'],correct:'隔热盾'}
};
let settlementTarget=0;
function showSettlement(key,target,custom){
  if(state.settled.has(key))return;state.settled.add(key);settlementTarget=target;const d=custom||lessons[key];
  $('#settleLevel').textContent=d.level;$('#settleTitle').textContent=d.title;$('#settleDid').textContent=d.did;$('#settleLearn').textContent=d.learn;$('#settleQuestion').textContent=d.question;$('#settleAnswers').innerHTML=d.answers.map(x=>`<button type="button" data-answer="${x}">${x}</button>`).join('');$('#settleFeedback').textContent='请选择答案';$('#settleFeedback').className='';$('#settleNext').disabled=true;$('#settleNext b').textContent='先回答过关题';
  $$('#settleAnswers button').forEach(btn=>btn.addEventListener('click',()=>{const ok=btn.dataset.answer===d.correct;$$('#settleAnswers button').forEach(x=>x.classList.remove('correct','wrong'));btn.classList.add(ok?'correct':'wrong');$('#settleFeedback').textContent=ok?'回答正确，下一关已解锁。':'回答不正确，请再读一遍本关知识。';$('#settleFeedback').className=ok?'correct':'wrong';$('#settleNext').disabled=!ok;$('#settleNext b').textContent=ok?'已通过本关测试':'先回答过关题';audio.feedback(ok?'success':'error')}));
  $('#settleNext span').textContent=target===6?'查看全班任务报告':'进入下一关';$('#settlement').classList.add('open');$('#settlement').setAttribute('aria-hidden','false');audio.feedback('success');
}
$('#settleNext').addEventListener('click',()=>{$('#settlement').classList.remove('open');$('#settlement').setAttribute('aria-hidden','true');go(settlementTarget)});

async function ensureTaskAudio(){if(audio.enabled)return true;audio.calloutPlayed=true;try{await audio.start();$('#soundBtn').classList.add('active');$('#soundBtn b').textContent='声场开启';return true}catch{return false}}
$$('[data-goto]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();go(+b.dataset.goto)}));$('#prevBtn').addEventListener('click',()=>go(state.scene-1,true));$('#nextBtn').addEventListener('click',next);$('#startBtn').addEventListener('click',async()=>{const audioReady=await ensureTaskAudio();unlock(1);go(1);toast(audioReady?'豆包任务语音已连接 · 每关自动播报':'已进入任务 · 点击右上角“任务播报”开启语音')});$('#restartBtn').addEventListener('click',()=>location.reload());

function selectRole(role,button){state.roles.add(role);button.classList.add('selected');button.innerHTML=`<kbd>✓</kbd><span>${role}</span>`;audio.feedback('success',Math.random()*1.4-.7);toast(`${role}席位已上线`)}
function openTerminal(button){window.open(`student.html?role=${button.dataset.terminal}`,`ares-${button.dataset.terminal}`,'noopener')}
$$('[data-role]').forEach(b=>b.addEventListener('click',()=>openTerminal(b)));
try{
  const terminalChannel=new BroadcastChannel('ares-classroom-v1');terminalChannel.onmessage=e=>{if(e.data?.type!=='terminal-complete')return;const button=$(`[data-terminal="${e.data.role}"]`);if(button)selectRole(button.dataset.role,button)};
  $$('[data-terminal]').forEach(button=>{const saved=localStorage.getItem(`ares-terminal-${button.dataset.terminal}`);if(saved)selectRole(button.dataset.role,button)});
}catch{}

$('#lightRange').addEventListener('input',e=>{const v=+e.target.value;$('#lightOut').textContent=`${v<0?'−':'+'}${Math.abs(v)}°`;setLightAngle(v);audio.feedback('tap',(v+80)/135*2-1)});
$$('[data-feature]').forEach((b,i)=>b.addEventListener('click',()=>{
  if(!state.evidence.has(b.dataset.feature)){state.evidence.add(b.dataset.feature);b.classList.add('done');$('b',b).textContent='已记录';audio.feedback('success',i/2*1.4-.7)}
  $('#observation').innerHTML=`<small>证据 ${String(i+1).padStart(2,'0')} / 已记录</small><b>${b.dataset.feature}：${b.dataset.look}</b>`;$('#evidenceCount').textContent=state.evidence.size;$('#evidenceBar').style.width=`${state.evidence.size/3*100}%`;
  if(state.evidence.size===3&&!$('.lunar').classList.contains('site-choice')){$('.lunar').classList.add('site-choice');toast('证据齐全：现在选择月面发射点')}
}));

$$('[data-lunar-site]').forEach((btn,i)=>btn.addEventListener('click',()=>{
  const safe=btn.dataset.safe==='true';state.lunarSite={name:btn.dataset.lunarSite,safe,reason:btn.dataset.reason};$$('[data-lunar-site]').forEach(x=>x.classList.toggle('selected',x===btn));$('#lunarSiteFeedback').textContent=btn.dataset.reason;$('#lunarSiteFeedback').className=`lunar-site-feedback ${safe?'safe':'risk'}`;$('#confirmLunarSite').disabled=!safe;audio.feedback(safe?'success':'error',i/2*1.4-.7)
}));
$('#confirmLunarSite').addEventListener('click',()=>{if(!state.lunarSite?.safe)return;unlock(2);$('.lunar').classList.add('site-locked');$('#launchSiteLabel').textContent=`${state.lunarSite.name} / PAD LOCKED`;toast('发射点已锁定：完成过关题后进入月面起飞');audio.impact();setTimeout(()=>showSettlement('lunar',2),550)});

function launchCalc(){
  const thrust=+$('#thrustRange').value,pitch=+$('#pitchRange').value;const apogee=Math.round(100+(thrust-92)*1.7-(Math.abs(pitch-38))*1.3);const error=+((pitch-37.2)*.55+(thrust-94)*.05).toFixed(1);const safe=apogee>=95&&apogee<=110&&Math.abs(error)<=2.2;
  $('#thrustOut').textContent=`${thrust}%`;$('#pitchOut').textContent=`${pitch}°`;$('#apogeeValue').textContent=apogee;$('#launchError').textContent=`${error>=0?'+':''}${error}`;$('#windowState').textContent=safe?'窗口内':'调整中';$('#windowState').className=safe?'ok':'warn';$('#corridorMarker').style.bottom=`${Math.max(2,Math.min(96,(apogee-70)/50*100))}%`;return{thrust,pitch,apogee,error,safe};
}
$('#thrustRange').addEventListener('input',launchCalc);$('#pitchRange').addEventListener('input',launchCalc);launchCalc();
$('#igniteBtn').addEventListener('click',()=>{const result=launchCalc();if(!result.safe){audio.feedback('error');toast('还没有变绿：再调一调推力和角度');return}state.launch=result;state.courseError=Math.round(state.launch.error*22+30);unlock(3);audio.impact();triggerLaunch();document.body.classList.add('ignited');toast('月面点火成功：上升器正在离开发射台');MissionTransit.launch().then(()=>showSettlement('launch',3))});

function renderCourse(){const y=180+state.courseError;$('#livePath').setAttribute('d',`M120 410 C350 70 700 90 900 ${y}`);const ok=Math.abs(state.courseError)<=56;$('#courseStatus').textContent=ok?'成功：蓝线进入圆圈':'还差一点：让蓝线进入圆圈';$('#courseStatus').className=`course-status ${ok?'ok':'warn'}`;$('#burnsLeft').textContent=`还有 ${2-state.burns} 次`;if(state.burns>0)$('#burnDot1').classList.add('done');if(state.burns>1)$('#burnDot2').classList.add('done');if(state.burns===2){if(ok){state.course={error:state.courseError,ok};unlock(4);toast('航向修正成功');setTimeout(()=>showSettlement('cruise',4),650)}else{toast('没有进入圆圈，任务计算机给你们再试一次');audio.feedback('error');setTimeout(()=>{state.burns=0;state.courseError=Math.round((state.launch?.error||.3)*22+30);$('#burnDot1').classList.remove('done');$('#burnDot2').classList.remove('done');renderCourse()},1300)}}}
function burn(dir){if(state.scene!==3||state.burns>=2)return;const amount={up:-28,down:28,left:-12,right:12}[dir];state.courseError+=amount;state.burns++;audio.impact();renderCourse()}
$$('[data-burn]').forEach(b=>b.addEventListener('click',()=>burn(b.dataset.burn)));renderCourse();

const edlData=[['热盾已定向','等离子体黑障 / 峰值加热开始','03:45','Mach 2.1'],['降落伞已展开','速度骤降 / 热盾分离','02:20','410 m/s'],['地形相对导航上线','正在比对着陆区危险地形','00:48','78 m/s'],['空中吊车已授权','轮式着陆器接地 / 绳索切断','00:00','0.0 m/s']];
$('#edlStart').addEventListener('click',()=>{if(edlRunning)return;edlRunning=true;state.edlStep=0;$('.edl').classList.add('engaged');$$('[data-edl]')[0].classList.add('ready');$('#edlCallout').textContent='界面进入：请授权热盾定向';audio.impact()});
$$('[data-edl]').forEach((b,i)=>b.addEventListener('click',()=>{
  if(!edlRunning||i!==state.edlStep){audio.feedback('error');toast(i<state.edlStep?'该节点已完成':'顺序错误：任务计算机拒绝授权');return}
  b.classList.remove('ready');b.classList.add('done');$('b',b).textContent='完成';audio.feedback('success',(i/3)*1.4-.7);const d=edlData[i];$('#edlCallout').textContent=`${d[0]}｜${d[1]}`;$('#edlTimer').textContent=d[2];$('#edlSpeed').textContent=d[3];setEDLProgress((i+1)/4);state.edlStep++;
  if(state.edlStep<4)$$('[data-edl]')[state.edlStep].classList.add('ready');else{state.edlDone=true;edlRunning=false;unlock(5);$('.edl').classList.remove('engaged');audio.impact();toast('安全着陆！');setTimeout(()=>showSettlement('edl',5),950)}
}));

const siteMissions={
  '杰泽罗陨石坑':{evidence:['层状沉积岩','古河道砾石','三角洲坡面'],challenge:'这里曾经有湖。要寻找古老生命线索，应该带什么？',correct:'岩芯钻机',options:['岩芯钻机','天文望远镜','降落伞'],why:'岩芯钻机能取出一层层沉积物，像翻阅火星过去的“历史书”。',learn:'河流把泥沙带进湖里，沉积层可能保存古老环境甚至生命留下的线索。'},
  '水手峡谷':{evidence:['层状岩壁','崩塌斜坡','古水流沟槽'],challenge:'峡谷又长又陡。探测车出发前，应该先用什么找安全路线？',correct:'侦察无人机',options:['侦察无人机','岩芯钻机','雨量筒'],why:'无人机能从高处看坡度和障碍，先画出安全路线。',learn:'水手峡谷绵延约4000千米。地形很有研究价值，但陡坡会增加行驶和通信风险。'},
  '奥林帕斯山':{evidence:['熔岩流纹理','火山灰层','火山口坡面'],challenge:'这里海拔极高、空气更稀薄。登山前最先检查什么？',correct:'气压供氧仪',options:['气压供氧仪','小铲子','救生圈'],why:'气压供氧仪先判断环境能不能保障设备和人员安全。',learn:'奥林帕斯山是太阳系最大的火山。高度带来独特科学价值，也带来低气压和长距离爬坡风险。'}
};
function openSurfaceMission(){
  const m=siteMissions[state.site.name];state.surfaceEvidence=new Set();document.body.classList.add('mars-surface-mode');$('.mars').classList.add('surface-active');$('#surfaceSiteName').textContent=`${state.site.name} / 地表勘察`;$('#surfaceCount').textContent='0';$('#surfaceBar').style.width='0';$('#siteDecision').innerHTML=`<small>现场任务 1 / 2</small><b>找到 3 处地质证据</b><p>点击真实火星地表图中的三个标记。</p>`;
  $$('#surfaceHotspots button').forEach((btn,i)=>{btn.classList.remove('found');$('span',btn).textContent=m.evidence[i]});
}
$('#surfaceHotspots').addEventListener('click',e=>{const btn=e.target.closest('button');if(!btn||!state.site||btn.classList.contains('found'))return;const i=+btn.dataset.evidence;btn.classList.add('found');const found=$$('#surfaceHotspots button.found');state.surfaceEvidence=new Set(found.map(x=>+x.dataset.evidence));$('#surfaceCount').textContent=state.surfaceEvidence.size;$('#surfaceBar').style.width=`${state.surfaceEvidence.size/3*100}%`;audio.feedback('success',i/2*1.4-.7);if(state.surfaceEvidence.size===3){$('#siteDecision').innerHTML=`<small>现场任务 1 / 2 完成</small><b>3 处地质证据已记录</b><p>下一步：选择解决本区问题的科学工具。</p>`;setTimeout(openSiteMission,700)}});
function openSiteMission(){
  const m=siteMissions[state.site.name],panel=$('#siteEquipment');state.equipment=null;$('#siteDecision').classList.add('hidden');panel.classList.add('open');
  panel.innerHTML=`<small>${state.site.name} / 专属任务</small><h3>${m.challenge}</h3><p>请小队讨论后选择。</p><div class="equipment-buttons">${m.options.map(x=>`<button type="button" data-tool="${x}">${x}</button>`).join('')}</div><p class="equipment-feedback">等待选择……</p><button class="confirm-site" type="button" disabled>确认方案</button>`;
  $$('.equipment-buttons button',panel).forEach(btn=>btn.addEventListener('click',()=>{const ok=btn.dataset.tool===m.correct;$$('.equipment-buttons button',panel).forEach(x=>x.classList.remove('wrong','correct'));btn.classList.add(ok?'correct':'wrong');$('.equipment-feedback',panel).textContent=ok?`选择正确：${m.why}`:`这个工具解决不了这里最大的困难，再想想。`;$('.confirm-site',panel).disabled=!ok;audio.feedback(ok?'success':'error')}));
  $('.confirm-site',panel).addEventListener('click',()=>{state.equipment=m.correct;state.baseExteriorSystems=new Set();state.baseInteriorSystems=new Set();state.baseInteriorSeen=false;state.baseInteriorStep=0;panel.classList.remove('open');document.body.classList.add('base-ready');document.body.classList.remove('base-interior','airlock-cycling');$('#baseExploration').setAttribute('aria-hidden','false');$$('[data-base-view]').forEach(x=>x.classList.toggle('active',x.dataset.baseView==='exterior'));$('#marsBaseName').textContent=`${state.site.name}科研基地`;$('#siteDecision').classList.remove('hidden');$('#siteDecision').innerHTML=`<small>基地建设方案已确认</small><b>${state.site.name} + ${m.correct}</b><p>${m.why}</p>`;pendingSiteLesson={level:'第 5 关完成',title:'本关知识：火星基地怎样维持运行',did:`驾驶巡视车修复了基地外部设施，又按顺序恢复了内部生命保障系统。`,learn:`${m.learn} 火星基地还必须可靠供电、循环空气、控制温度并保持通信。`,question:'火星基地突然断电后，恢复系统的第一步是什么？',answers:['先接通主电源','先打开所有舱门','先关闭制氧系统'],correct:'先接通主电源'};initBaseGame();renderBaseTour();toast('外部任务开始：驾驶巡视车修复 3 处设施')});
}
$$('[data-site]').forEach((b,i)=>b.addEventListener('click',()=>{$$('[data-site]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.site={name:b.dataset.site,science:+b.dataset.science,risk:+b.dataset.risk,note:b.dataset.note};audio.feedback('success',i/2*1.4-.7);openSurfaceMission()}));
$('#changeSite').addEventListener('click',()=>{document.body.classList.remove('mars-surface-mode','base-ready','base-interior','airlock-cycling');$('.mars').classList.remove('surface-active');state.site=null;state.equipment=null;state.surfaceEvidence=new Set();state.baseExteriorSystems=new Set();state.baseInteriorSystems=new Set();state.baseInteriorSeen=false;state.baseInteriorStep=0;$('#baseExploration').setAttribute('aria-hidden','true');$$('[data-site]').forEach(x=>x.classList.remove('selected'));$('#siteEquipment').classList.remove('open');$('#siteDecision').classList.remove('hidden');$('#siteDecision').innerHTML='<small>先选择一个地点</small><b>不同地点，会出现不同任务</b><p>选择后先勘察地表，再挑选科学工具。</p>'});

const roverTargets={
  '1,1':{key:'power',label:'太阳能阵列'},'4,2':{key:'greenhouse',label:'生态温室'},'5,0':{key:'comms',label:'通信塔'}
},roverRocks=new Set(['2,0','2,2','3,1','4,3']);
const habSequence=[{key:'power',label:'主电源',info:'配电核心上线，基地获得稳定电力。'},{key:'oxygen',label:'制氧循环',info:'制氧与空气循环启动，氧气浓度正在上升。'},{key:'thermal',label:'温控系统',info:'舱内温度从火星低温恢复到适居范围。'},{key:'comms',label:'深空通信',info:'通信阵列已对准轨道器，基地链路恢复。'}];
let airlockTimer,rover={x:0,y:3,energy:100};
function initBaseGame(){
  rover={x:0,y:3,energy:100};state.baseExteriorSystems=new Set();state.baseInteriorSystems=new Set();state.baseInteriorStep=0;state.baseInteriorSeen=false;document.body.classList.remove('base-interior','airlock-cycling');
  $$('[data-base-view]').forEach(b=>{const inside=b.dataset.baseView==='interior';b.disabled=inside;b.classList.toggle('active',!inside)});$$('[data-hab-step]').forEach((b,i)=>{b.classList.remove('done','ready','wrong');$('small',b).textContent=i===0?'待启动':'锁定';if(i===0)b.classList.add('ready')});
  $('#oxygenGauge').style.width='0';$('#tempGauge').style.width='0';$('#oxygenValue').textContent='0%';$('#tempValue').textContent='−55°C';$('#habReadout').textContent='先接通主电源，其他系统才能工作。';renderRover();
}
function renderRover(){
  const cells=[];for(let y=0;y<4;y++)for(let x=0;x<6;x++){const key=`${x},${y}`,target=roverTargets[key],repaired=target&&state.baseExteriorSystems.has(target.key),classes=['rover-cell'];if(roverRocks.has(key))classes.push('rock');if(target)classes.push('target');if(repaired)classes.push('repaired');if(x===rover.x&&y===rover.y)classes.push('has-rover');cells.push(`<span class="${classes.join(' ')}" data-x="${x}" data-y="${y}">${target?`<b>${target.label}</b>`:''}${x===rover.x&&y===rover.y?'<i class="rover-token"><em></em></i>':''}</span>`)}
  $('#roverGrid').innerHTML=cells.join('');$('#roverEnergy').style.width=`${rover.energy}%`;const left=3-state.baseExteriorSystems.size;$('#roverReadout').textContent=left?`巡视车坐标 ${rover.x+1}-${rover.y+1} · 还需维修 ${left} 处`:'外部维修完成 · 气闸权限已解锁';renderBaseTour();
}
function moveRover(dir){
  if(!document.body.classList.contains('base-ready')||document.body.classList.contains('base-interior'))return;const delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir],nx=rover.x+delta[0],ny=rover.y+delta[1],key=`${nx},${ny}`;if(nx<0||nx>5||ny<0||ny>3){toast('巡视车到达地图边界');audio.feedback('error');return}if(roverRocks.has(key)){toast('前方有岩石，请绕行');audio.feedback('error');return}rover.x=nx;rover.y=ny;rover.energy=Math.max(18,rover.energy-3);const target=roverTargets[key];if(target&&!state.baseExteriorSystems.has(target.key)){state.baseExteriorSystems.add(target.key);audio.impact();toast(`${target.label}维修完成`)}else audio.feedback('tap',(nx/5)*2-1);if(state.baseExteriorSystems.size===3){const door=$('[data-base-view="interior"]');door.disabled=false;$('#baseSystemInfo').textContent='外部维修完成。第二步：进入气闸，恢复内部系统。'}renderRover();
}
function renderBaseTour(){
  const outside=state.baseExteriorSystems.size,insideCount=state.baseInteriorSystems.size,inside=document.body.classList.contains('base-interior'),total=outside+insideCount,ready=outside===3&&insideCount===4&&state.baseInteriorSeen;$('#baseTourCount').textContent=`外部 ${outside}/3 · 内部 ${insideCount}/4`;$('#baseTourBar').style.width=`${total/7*100}%`;$('#finishBaseTour').disabled=!ready;$('#finishBaseTour').textContent=ready?'基地恢复完成 · 参加过关题':outside<3?`驾驶巡视车 · 还需维修 ${3-outside} 处`:!state.baseInteriorSeen?'外部完成 · 进入气闸':`恢复内部系统 · 还剩 ${4-insideCount} 项`;if(inside)$('#baseSystemInfo').textContent=ready?'基地所有关键系统已恢复。':'按控制台提示依次启动内部系统。';
}
function setBaseView(inside){
  if(!document.body.classList.contains('base-ready'))return;if(!inside){clearTimeout(airlockTimer);document.body.classList.remove('airlock-cycling','base-interior');$('#baseAirlock').setAttribute('aria-hidden','true');$$('[data-base-view]').forEach(x=>x.classList.toggle('active',x.dataset.baseView==='exterior'));$('#marsBaseName').textContent=`${state.site?.name||'火星'}科研基地`;$('#baseSystemInfo').textContent='驾驶巡视车修复 3 处发光设施。';renderBaseTour();audio.impact();return}if(state.baseExteriorSystems.size<3){toast('先完成基地外部三处维修');audio.feedback('error');return}if(document.body.classList.contains('base-interior')||document.body.classList.contains('airlock-cycling'))return;document.body.classList.add('airlock-cycling');$('#baseAirlock').setAttribute('aria-hidden','false');$('#baseSystemInfo').textContent='气闸关闭，正在把压力提升到基地标准……';audio.impact();airlockTimer=setTimeout(()=>{document.body.classList.remove('airlock-cycling');document.body.classList.add('base-interior');$('#baseAirlock').setAttribute('aria-hidden','true');state.baseInteriorSeen=true;$$('[data-base-view]').forEach(x=>x.classList.toggle('active',x.dataset.baseView==='interior'));$('#marsBaseName').textContent='基地内部控制舱';renderBaseTour();audio.feedback('success')},2400)
}
$$('[data-rover-move]').forEach(btn=>btn.addEventListener('click',()=>moveRover(btn.dataset.roverMove)));
$$('[data-hab-step]').forEach((btn,i)=>btn.addEventListener('click',()=>{if(!document.body.classList.contains('base-interior')){toast('请先完成外部任务并穿过气闸');return}if(i!==state.baseInteriorStep){btn.classList.add('wrong');setTimeout(()=>btn.classList.remove('wrong'),500);toast(i<state.baseInteriorStep?'这个系统已经启动':'上一步还没完成，系统拒绝启动');audio.feedback('error');return}const step=habSequence[i];state.baseInteriorSystems.add(step.key);state.baseInteriorStep++;btn.classList.remove('ready');btn.classList.add('done');$('small',btn).textContent='运行中';const next=$$('[data-hab-step]')[i+1];if(next){next.classList.add('ready');$('small',next).textContent='可启动'}$('#habReadout').textContent=step.info;$('#oxygenGauge').style.width=`${[0,72,84,96][i]}%`;$('#tempGauge').style.width=`${[0,15,78,100][i]}%`;$('#oxygenValue').textContent=`${[0,18,20,21][i]}%`;$('#tempValue').textContent=`${[-55,-42,18,22][i]}°C`;audio.impact();renderBaseTour();if(state.baseInteriorStep===4)toast('基地恢复完成：可以参加过关题')}));
$$('[data-base-view]').forEach(btn=>btn.addEventListener('click',()=>setBaseView(btn.dataset.baseView==='interior')));
$('#finishBaseTour').addEventListener('click',()=>{if(!pendingSiteLesson||!state.site||state.baseExteriorSystems.size<3||state.baseInteriorSystems.size<4||!state.baseInteriorSeen)return;unlock(6);showSettlement(`site-${state.site.name}`,6,pendingSiteLesson)});
$('.mars').addEventListener('pointermove',e=>{if(!document.body.classList.contains('base-ready'))return;const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;e.currentTarget.style.setProperty('--base-shift-x',`${(-x*1.4).toFixed(2)}vw`);e.currentTarget.style.setProperty('--base-shift-y',`${(-y*.8).toFixed(2)}vh`)});$('.mars').addEventListener('pointerleave',e=>{e.currentTarget.style.setProperty('--base-shift-x','0vw');e.currentTarget.style.setProperty('--base-shift-y','0vh')});

function renderDebrief(){
  let score=state.evidence.size*8+(state.launch?.safe?20:8)+(state.course?.ok?20:10)+(state.edlDone?20:0)+(state.site?Math.round((state.site.science*1.2-state.site.risk*.35)/5):0);score=Math.min(100,score);state.score=score;
  $('#scoreValue').textContent=score;$('#scoreArc').style.strokeDashoffset=421*(1-score/100);$('#logEvidence').textContent=`${state.evidence.size} / 3`;$('#logEvidenceText').textContent=state.evidence.size===3?'证据链完整':'证据不足';$('#logLaunch').textContent=state.launch?`${state.launch.apogee} km`:'—';$('#logLaunchText').textContent=state.launch?.safe?'命中窗口':'带偏差离轨';$('#logCourse').textContent=state.course?`${Math.abs(state.course.error*720).toLocaleString()} km`:'—';$('#logCourseText').textContent=state.course?.ok?'捕获成立':'备用策略';$('#logEdl').textContent=state.edlDone?'TOUCHDOWN':'—';$('#logEdlText').textContent=state.edlDone?'四节点完成':'未执行';$('#logSite').textContent=state.site?.name||'—';$('#logSiteText').textContent=state.site?`SCI ${state.site.science} / RISK ${state.site.risk}`:'等待决定';$('#finalRoles').innerHTML=state.roles.size?[...state.roles].map(r=>`<span>${r} / ONLINE</span>`).join(''):'<span>未记录小队席位</span>';
}

function closeAudioGate(){const gate=$('#audioGate');gate.classList.remove('open');gate.setAttribute('aria-hidden','true')}
async function enableAudio(){const selected=$('[data-audio-mode].active');audio.setMode(selected?.dataset.audioMode||'neon');await audio.start();$('#soundBtn').classList.add('active');$('#soundBtn b').textContent='声场开启';closeAudioGate();if(state.scene===5)$('#marsAudioState').textContent='正在播放：毅力号 SuperCam 火星风声实录';toast(`${selected?.querySelector('b')?.textContent||'霓虹脉冲'}声场已开启`)}
$$('[data-audio-mode]').forEach(btn=>btn.addEventListener('click',()=>{$$('[data-audio-mode]').forEach(x=>x.classList.toggle('active',x===btn));audio.setMode(btn.dataset.audioMode);audio.feedback('success')}));
$('#soundStartBtn').addEventListener('click',()=>{const gate=$('#audioGate');gate.classList.add('open');gate.setAttribute('aria-hidden','false')});$('#audioEnable').addEventListener('click',enableAudio);$('#audioSkip').addEventListener('click',closeAudioGate);$('#audioGateClose').addEventListener('click',closeAudioGate);$('#audioGate').addEventListener('click',e=>{if(e.target===e.currentTarget)closeAudioGate()});$('#soundBtn').addEventListener('click',async()=>{const on=await audio.toggle();$('#soundBtn').classList.toggle('active',on);$('#soundBtn b').textContent=on?'声场开启':'声场关闭';if(state.scene===5)$('#marsAudioState').textContent=on?'正在播放：毅力号 SuperCam 火星风声实录':'火星实录已静音'});
$('#taskVoiceBtn').addEventListener('click',async()=>{const audioReady=await ensureTaskAudio();const played=audioReady&&audio.playNarration(state.scene,true);toast(played?`正在播放任务 ${String(state.scene).padStart(2,'0')} 的豆包讲解`:state.scene===0?'进入第一关后会自动播报任务':'语音暂未启动，请再点击一次任务播报')});

$('#fullBtn').addEventListener('click',()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen());const help=$('#helpPanel');$('#helpBtn').addEventListener('click',()=>{help.classList.toggle('open');help.setAttribute('aria-hidden',!help.classList.contains('open'))});$('#helpPanel>button').addEventListener('click',()=>help.classList.remove('open'));
$('#displayModeBtn').addEventListener('click',()=>{const menu=$('#displayModeMenu'),open=!menu.classList.contains('open');menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',!open);$('#displayModeBtn').setAttribute('aria-expanded',open)});
$$('[data-display-mode]').forEach(btn=>btn.addEventListener('click',()=>applyDisplayMode(btn.dataset.displayMode)));
$('#kvEnterBtn').addEventListener('click',async()=>{applyDisplayMode('ultrawide');if(state.scene===0){await ensureTaskAudio();unlock(1);go(1)}});$('#kvExitBtn').addEventListener('click',()=>applyDisplayMode('standard'));
document.addEventListener('click',e=>{if(!e.target.closest('.display-switch')){$('#displayModeMenu').classList.remove('open');$('#displayModeMenu').setAttribute('aria-hidden','true');$('#displayModeBtn').setAttribute('aria-expanded','false')}});addEventListener('resize',()=>applyDisplayMode(displayMode,{persist:false,updateUrl:false}));
document.addEventListener('keydown',e=>{if(['INPUT','BUTTON'].includes(document.activeElement.tagName)&&e.code!=='Escape')return;if(e.code==='KeyK'){applyDisplayMode(displayMode==='kv'?'standard':'kv');return}if(displayMode==='kv'&&e.code==='Space'){e.preventDefault();$('#kvEnterBtn').click();return}if(e.code==='Space'){e.preventDefault();next()}else if(e.code==='ArrowLeft'){if(state.scene===3)burn('left');else go(state.scene-1,true)}else if(e.code==='ArrowRight'){if(state.scene===3)burn('right');else next()}else if(e.code==='ArrowUp'&&state.scene===3)burn('up');else if(e.code==='ArrowDown'&&state.scene===3)burn('down');else if(/^Digit[1-5]$/.test(e.code)){const b=$$('[data-role]')[+e.code.slice(-1)-1];openTerminal(b)}else if(e.code==='KeyM')$('#soundBtn').click();else if(e.code==='Escape'){help.classList.remove('open');closeAudioGate();if(displayMode==='kv')applyDisplayMode('standard')}});

setInterval(()=>{const elapsed=Math.floor((Date.now()-missionStart)/1000),remain=Math.max(0,720-elapsed),m=String(Math.floor(remain/60)).padStart(2,'0'),s=String(remain%60).padStart(2,'0');$('#missionClock').textContent=`T−00:${m}:${s}`;if(state.scene===3){const km=38440+elapsed*18620;$('#distanceValue').textContent=`${km.toLocaleString()} km`;$('#delayValue').textContent=`00:${String(Math.min(59,Math.floor(km/299792))).padStart(2,'0')}.${Math.floor(km%10)}`}},1000);
renderNavLocks();go(0,true);
const requestedMode=new URL(location.href).searchParams.get('mode'),savedMode=localStorage.getItem('ares-display-mode'),autoMode=innerWidth/innerHeight>=6.2?'wall':innerWidth/innerHeight>=2.8?'ultrawide':'standard';
applyDisplayMode(displayNames[requestedMode]?requestedMode:(displayNames[savedMode]?savedMode:autoMode),{persist:false,updateUrl:false});
