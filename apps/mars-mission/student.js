const roles={
  nav:{no:'PORT 01',tag:'轨道导航',title:'导航员',order:'你的任务：判断飞船应该往哪边修正。',question:'预测线从火星上方掠过，飞船应该向哪个方向小推？',options:['向下修正','继续向上','只加快速度'],correct:'向下修正',learn:'太空航行中，很小的方向改变会在远距离后产生很大的位置变化。',code:'航-下-1',color:'#61e9ff'},
  lunar:{no:'PORT 02',tag:'月球科学',title:'月球观察员',order:'你的任务：分清“看见的证据”和“想到的解释”。',question:'下面哪一句是直接观察到的证据？',options:['环形山旁边有一条长阴影','这里一定藏着水冰','这个环形山非常古老'],correct:'环形山旁边有一条长阴影',learn:'“我看见长阴影”是观察；“这里有水冰”是推断。科学要先记录观察，再提出解释。',code:'月-影-2',color:'#d9e8ed'},
  propulsion:{no:'PORT 03',tag:'推进控制',title:'推进工程师',order:'你的任务：解释月球几乎没有空气，上升器为什么仍能起飞。',question:'月面上升器把燃气向下喷出，它会怎样运动？',options:['受到反作用力向上','因为变轻所以向上','月球风把它托上去'],correct:'受到反作用力向上',learn:'火箭自带燃料和氧化剂。燃气向下喷，飞行器受到方向相反的力而向上，即使月球没有空气也能飞行。',code:'推-反-3',color:'#ff845d'},
  landing:{no:'PORT 04',tag:'着陆安全',title:'着陆工程师',order:'你的任务：找出火星着陆的第一道保护。',question:'飞船高速冲进火星大气层时，首先依靠什么挡住高温？',options:['隔热盾','空中吊车','探测车车轮'],correct:'隔热盾',learn:'进入大气层时速度最快、温度最高，所以先用隔热盾保护飞船，再逐步减速。',code:'陆-盾-4',color:'#ff526c'},
  science:{no:'PORT 05',tag:'火星科学',title:'火星科学家',order:'你的任务：给古湖遗址选择最合适的工具。',question:'杰泽罗陨石坑曾经有湖。想研究一层层的古老沉积物，应带什么？',options:['岩芯钻机','天文望远镜','救生圈'],correct:'岩芯钻机',learn:'岩芯钻机可以取出不同深度的沉积层，帮助科学家阅读火星过去的环境记录。',code:'火-钻-5',color:'#ff9c63'}
};
const params=new URLSearchParams(location.search),key=params.get('role'),role=roles[key];
const $=s=>document.querySelector(s);let chosen='';
if(!role){document.body.classList.add('hub-mode');$('#portGrid').innerHTML=Object.entries(roles).map(([id,r])=>`<a href="student.html?role=${id}"><b>${r.no}</b><strong>${r.title}</strong><small>${r.order.replace('你的任务：','')}</small></a>`).join('')}else{
  document.documentElement.style.setProperty('--accent',role.color);$('#terminalNo').textContent=role.no;$('#portName').textContent=`${role.no} / ${role.title}`;$('#roleTag').textContent=role.tag;$('#roleTitle').textContent=role.title;$('#missionOrder').textContent=role.order;$('#question').textContent=role.question;
  $('#answers').innerHTML=role.options.map(x=>`<button type="button" data-answer="${x}">${x}</button>`).join('');
  document.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{chosen=btn.dataset.answer;document.querySelectorAll('[data-answer]').forEach(x=>x.classList.toggle('selected',x===btn));const ok=chosen===role.correct;$('#feedback').textContent=ok?'判断正确，可以提交。':'这个选择不能解决任务，再观察题目。';$('#feedback').className=`feedback ${ok?'good':'bad'}`;$('#submitTask').disabled=!ok}));
  $('#submitTask').addEventListener('click',()=>{const record={type:'terminal-complete',role:key,roleName:role.title,code:role.code,time:Date.now()};localStorage.setItem(`ares-terminal-${key}`,JSON.stringify(record));try{new BroadcastChannel('ares-classroom-v1').postMessage(record)}catch{}$('#terminal').style.display='none';$('#terminalDone').classList.add('show');$('#doneTitle').textContent=`${role.title}任务完成`;$('#doneLearn').textContent=role.learn;$('#missionCode').textContent=role.code;$('#linkState').textContent='已提交到大屏'});
}
