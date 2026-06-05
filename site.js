function setLang(lang){document.body.classList.toggle("lang-en",lang==="en");document.documentElement.lang=lang==="en"?"en":"zh";document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));localStorage.setItem("aipsychlab_lang",lang)}
function boot(){const saved=localStorage.getItem("aipsychlab_lang");if(saved)setLang(saved);document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));document.querySelector(".menu-btn")?.addEventListener("click",()=>document.querySelector(".nav")?.classList.toggle("open"));particles();scrollFx();reveal();accordion();contactForm();productModal();workFilters();journey();fitCheck();aiPlayground();evaluationFlow();copyButtons()}
function particles(){const box=document.querySelector(".particles");if(!box||box.children.length)return;for(let i=0;i<16;i++){const p=document.createElement("span");p.className="particle";p.style.left=Math.random()*100+"%";p.style.animationDuration=18+Math.random()*22+"s";p.style.animationDelay=-Math.random()*24+"s";p.style.opacity=.12+Math.random()*.18;if(Math.random()>.72)p.style.background="var(--magenta)";box.appendChild(p)}}
function scrollFx(){const nav=document.querySelector(".nav"),bar=document.querySelector(".progress");let ticking=false;function run(){const y=scrollY;if(nav)nav.classList.toggle("scrolled",y>40);if(bar){const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(max>0?y/max*100:0)+"%"}ticking=false}addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(run);ticking=true}});run()}
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>io.observe(el))}
function accordion(){document.querySelectorAll(".research-item button").forEach(btn=>btn.addEventListener("click",()=>btn.closest(".research-item")?.classList.toggle("open")))}
function contactForm(){const form=document.querySelector("[data-contact-form]");if(!form)return;form.addEventListener("submit",async e=>{const key=form.querySelector("[name=access_key]")?.value||"";if(key.includes("REPLACE")){e.preventDefault();document.querySelector("[data-form-status]").textContent="在线表单暂未开放，请先添加微信 Beckychyy 或发送邮件到 beckychyy@163.com。";return}document.querySelector("[data-form-status]").textContent="提交中..."})}
function productModal(){const links=document.querySelectorAll("[data-app]");if(!links.length)return;const modal=document.createElement("div");modal.className="product-modal";modal.innerHTML='<div class="product-backdrop" data-close-product></div><div class="product-shell"><button class="product-close" type="button" data-close-product>×</button><div class="device-frame product-device"><div class="device-bar"><i></i><i></i><i></i><span data-product-title>Product</span></div><iframe loading="lazy" title="AIPsychLab product preview" sandbox="allow-scripts allow-same-origin" allow="camera *; microphone *"></iframe></div></div>';document.body.appendChild(modal);const frame=modal.querySelector("iframe"),title=modal.querySelector("[data-product-title]");function close(){modal.classList.remove("open");setTimeout(()=>{if(!modal.classList.contains("open"))frame.removeAttribute("src")},260)}function open(link){const slug=link.dataset.app,url=link.getAttribute("href")||`apps/${slug}/index.html`;if(innerWidth<640){window.open(url,"_blank","noopener");return}title.textContent=link.dataset.title||slug;frame.title=link.dataset.title||"AIPsychLab product preview";frame.src=url;modal.classList.add("open")}links.forEach(link=>link.addEventListener("click",e=>{e.preventDefault();open(link)}));modal.querySelectorAll("[data-close-product]").forEach(el=>el.addEventListener("click",close));addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))close()})}
function workFilters(){const filters=document.querySelectorAll("[data-work-filter]"),cards=document.querySelectorAll("[data-work]");if(!filters.length||!cards.length)return;filters.forEach(btn=>btn.addEventListener("click",()=>{const key=btn.dataset.workFilter;filters.forEach(b=>b.classList.toggle("active",b===btn));cards.forEach(card=>{card.hidden=key!=="all"&&card.dataset.work!==key})}))}
function journey(){const box=document.querySelector("[data-journey]");if(!box)return;const steps=[{zh:["从孩子真实兴趣开始","先判断孩子对什么有反应：情绪、游戏、影像、音乐、学习工具或生活观察。项目不是硬塞出来的，而是从能点亮他的地方开始。","输出：项目方向 + 第一版功能清单"],en:["Start from the student's real interest.","We first notice what the student reacts to: emotion, games, media, music, study tools or everyday observations. The project starts where the student lights up.","Output: project direction + first feature list"]},{zh:["把想法变成可点击原型","用 AI 辅助拆功能、写页面、做交互。孩子会看到自己的想法第一次变成可以打开、可以点击的东西。","输出：可运行 MVP + 交互页面"],en:["Turn the idea into a clickable prototype.","AI helps split features, build pages and shape interaction. The student sees an idea become something clickable for the first time.","Output: working MVP + interaction page"]},{zh:["打磨体验和作品叙事","继续优化视觉、流程、使用感和说明方式。这里开始从“做出来”走向“别人能看懂、愿意使用”。","输出：作品说明 + 体验优化清单"],en:["Refine experience and product story.","We improve visuals, flow, usability and explanation. The work moves from built to understandable and usable.","Output: product story + refinement list"]},{zh:["路演、作品集与未来资产","把项目放进作品集、Demo Day 或申请故事里。孩子练习讲清楚问题、产品、选择和成长。","输出：作品集页面 + 路演表达"],en:["Demo, portfolio and future asset.","The project enters a portfolio, Demo Day or application story. The student practices explaining the problem, product, choices and growth.","Output: portfolio page + demo narrative"]}];const title=box.querySelector("[data-journey-title]"),copy=box.querySelector("[data-journey-copy]"),out=box.querySelector("[data-journey-output]"),bar=box.querySelector(".journey-progress i"),buttons=box.querySelectorAll("[data-journey-step]");function render(i){const lang=document.body.classList.contains("lang-en")?"en":"zh",data=steps[i][lang];buttons.forEach((b,n)=>b.classList.toggle("active",n===i));title.textContent=data[0];copy.textContent=data[1];out.textContent=data[2];if(bar)bar.style.width=(25+i*25)+"%"}buttons.forEach(btn=>btn.addEventListener("click",()=>render(Number(btn.dataset.journeyStep)||0)));document.querySelectorAll("[data-lang]").forEach(btn=>btn.addEventListener("click",()=>setTimeout(()=>render(Number(box.querySelector(".journey-steps .active")?.dataset.journeyStep)||0),0)))}
function fitCheck(){const box=document.querySelector("[data-fit-check]");if(!box)return;const inputs=box.querySelectorAll("[data-fit-option]"),meter=box.querySelector("[data-fit-meter]"),result=box.querySelector("[data-fit-result]");function render(){const count=[...inputs].filter(i=>i.checked).length,lang=document.body.classList.contains("lang-en")?"en":"zh";if(meter)meter.style.width=Math.min(100,count*22)+"%";const text=count===0?{zh:"请选择 1–2 个信号，看看更适合从哪里开始。",en:"Choose 1-2 signals to see where to start."}:count<3?{zh:"更适合从轻评估开始：先看孩子是否愿意用一个小作品重新启动。",en:"A light assessment is a good start: see whether a small project can restart movement."}:count<5?{zh:"建议进入深度评估：需要同时处理状态、亲子沟通和作品路径。",en:"A deeper assessment is recommended: state, family communication and product path should be considered together."}:{zh:"建议尽快沟通：信号较集中，先稳定状态，再设计低压力的 AI 作品入口。",en:"A conversation is recommended soon: signals are clustered, so stabilize state first and design a low-pressure AI entry."};result.textContent=text[lang]}inputs.forEach(i=>i.addEventListener("change",render));document.querySelectorAll("[data-lang]").forEach(btn=>btn.addEventListener("click",()=>setTimeout(render,0)));render()}
function aiPlayground(){const input=document.querySelector("[data-ai-input]"),btn=document.querySelector("[data-ai-generate]"),output=document.querySelector("[data-ai-output]");if(!input||!btn||!output)return;function render(){const lang=document.body.classList.contains("lang-en")?"en":"zh",raw=input.value.trim(),topic=raw|| (lang==="en"?"music":"音乐");const zh=`作品方向：${topic}情绪地图。核心交互：让用户输入一天里的状态，AI 生成可视化时间线和一个小建议。展示方式：网页 Demo + 作品说明 + 路演 60 秒介绍。`;const en=`Product direction: ${topic} mood map. Core interaction: the user enters daily states and AI creates a visual timeline with one small suggestion. Showcase: web demo + product note + 60-second pitch.`;output.textContent=lang==="en"?en:zh;output.classList.add("active")}btn.addEventListener("click",render);input.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter")render()});document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>setTimeout(()=>{if(output.classList.contains("active"))render()},0)))}
function copyText(text,status){navigator.clipboard?.writeText(text).then(()=>{if(status)status.textContent="已复制，可以直接粘贴给 Becky。"}).catch(()=>{if(status)status.textContent="复制失败，请手动选中文字复制。"})}
function copyButtons(){document.querySelectorAll("[data-copy-link]").forEach(btn=>btn.addEventListener("click",()=>copyText(btn.dataset.copyLink,document.querySelector("[data-copy-status]"))))}
function evaluationFlow(){const form=document.querySelector("[data-eval-form]");if(!form)return;const output=document.querySelector("[data-eval-output]"),hidden=form.querySelector("[data-eval-hidden]"),status=document.querySelector("[data-eval-status]"),copyBtn=document.querySelector("[data-copy-eval]"),mail=document.querySelector("[data-mail-eval]");let lastSummary="";form.querySelectorAll("[data-range]").forEach(r=>{const b=r.parentElement.querySelector("[data-range-value]");function sync(){if(b)b.textContent=r.value}r.addEventListener("input",sync);sync()});function val(name){return (form.elements[name]?.value||"").trim()}function checked(name){return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(i=>i.value)}function levelText(n,kind){n=Number(n);if(kind==="drive")return n<=2?"内驱力偏低，需要先用低压力作品重启掌控感":n===3?"内驱力有波动，可以从兴趣入口开始": "内驱力较好，适合更快进入作品打磨";if(kind==="communication")return n<=2?"亲子沟通偏关闭，第一次评估要先降低说教感":n===3?"沟通中等，需要找到孩子愿意谈的项目话题":"沟通基础较好，可以共同规划作品路径";if(kind==="emotion")return n<=2?"情绪波动较明显，建议先稳定状态再推进产出":n===3?"情绪有一定波动，需要节奏温和":"情绪较稳定，可以承接更清晰的项目挑战";return n<=2?"AI 基础较弱，适合从可视化网页和简单 AI 互动开始":n===3?"有一点基础，适合做一个可访问的小产品":"AI 基础较好，适合进入 Claude Code / 产品化作品"}function track(concerns,drive,communication,emotion,aiBase){let score=concerns.length+((drive<=2)?2:0)+((communication<=2)?1:0)+((emotion<=2)?2:0)+((aiBase<=2)?1:0);if(score>=7)return"建议先做 Becky 1v1 深度评估：先看状态和沟通，再定 AI 作品入口。";if(score>=4)return"建议进入 1v1 初评：孩子有可启动空间，但需要把兴趣、状态和作品路径放在一起设计。";return"适合从轻评估开始：先做一个小作品入口，观察孩子是否愿意重新投入。"}function aiEntry(interest,concerns,aiBase){const base=Number(aiBase);if(concerns.includes("沉迷屏幕"))return"把屏幕兴趣转成创造：从游戏机制、互动网页或 AI 小工具切入。";if(concerns.includes("不沟通"))return"用非说教式项目打开沟通：先做孩子愿意展示的小作品。";if(concerns.includes("AI 焦虑"))return"先建立 AI 掌控感：用一个简单想法做成网页 Demo，让孩子看到 AI 是可用的工具。";if(concerns.includes("没有爱好"))return"从微弱兴趣扫描开始：用 2–3 个小实验找出孩子有反应的方向。";if(base>=4)return"可直接进入 AI 产品化：Claude Code、网页应用、作品集展示和 Demo 表达。";return`可以从“${interest||"一个微小兴趣"}”开始，先做低门槛网页或 AI 互动原型。`}function buildSummary(){const concerns=checked("concerns"),drive=Number(val("drive")),communication=Number(val("communication")),emotion=Number(val("emotion")),aiBase=Number(val("ai_base")),interest=val("interest"),goal=val("goal"),notes=val("notes");const summary=[
"【AIPsychLab 孩子状态 Evaluation】",
`家长：${val("parent_name")}`,
`联系方式：${val("parent_contact")}`,
`孩子年级/年龄：${val("student_grade")}`,
`学校类型：${val("school_type")}`,
"",
"一、家长目前最关心的问题",
concerns.length?concerns.join(" / "):"未勾选具体困惑",
"",
"二、状态刻度",
`内驱力 ${drive}/5：${levelText(drive,"drive")}`,
`亲子沟通 ${communication}/5：${levelText(communication,"communication")}`,
`情绪稳定 ${emotion}/5：${levelText(emotion,"emotion")}`,
`AI / 编程基础 ${aiBase}/5：${levelText(aiBase,"ai")}`,
"",
"三、孩子可能的 AI 进入点",
aiEntry(interest,concerns,aiBase),
"",
"四、建议路径",
track(concerns,drive,communication,emotion,aiBase),
"",
"五、家长补充",
`孩子还愿意聊的兴趣：${interest||"未填写"}`,
`希望 3–12 个月看到的变化：${goal||"未填写"}`,
`Becky 需要提前知道：${notes||"无"}`,
`希望沟通时间：${val("preferred_time")}`,
`紧急程度：${val("urgency")}`,
"",
"下一步：请把这份 evaluation 复制给 Becky，并添加微信 Beckychyy 预约一对一初评。"
].join("\n");return summary}function render(summary){lastSummary=summary;if(hidden)hidden.value=summary;if(output){output.innerHTML=`<pre>${summary.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}</pre><div class="wechat-next"><b>下一步：加微信做 1v1 初评</b><span>微信号 Beckychyy</span><p>复制上面的 evaluation，发给 Becky。她会根据孩子状态判断是否适合进入 1v1 深度评估。</p><button class="btn primary" type="button" data-copy-wechat>复制微信号 Beckychyy</button></div>`;output.closest("[data-eval-result]")?.classList.add("ready");output.querySelector("[data-copy-wechat]")?.addEventListener("click",()=>copyText("Beckychyy",status))}if(mail)mail.href=`mailto:beckychyy@163.com?subject=${encodeURIComponent("AIPsychLab 孩子状态 Evaluation")}&body=${encodeURIComponent(summary)}`;if(status)status.textContent="Evaluation 已生成。请复制 evaluation 并添加微信 Beckychyy 做一对一初评；页面也会尝试邮件发送给 Becky。";setTimeout(()=>document.querySelector("[data-eval-result]")?.scrollIntoView({behavior:"smooth",block:"start"}),160)}form.addEventListener("submit",e=>{const summary=buildSummary();render(summary)});copyBtn?.addEventListener("click",()=>copyText(lastSummary||buildSummary(),status))}
document.addEventListener("DOMContentLoaded",boot);
// 困惑 → 带走：滚动到该行后自动显示转化结果
(function(){
  var rows=document.querySelectorAll(".trow");
  if(!rows.length)return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  },{threshold:.4});
  rows.forEach(function(row){
    io.observe(row);
  });
})();

function evaluationFlow(){
  const form=document.querySelector("[data-eval-form]");
  if(!form)return;
  const output=document.querySelector("[data-eval-output]"),hidden=form.querySelector("[data-eval-hidden]"),status=document.querySelector("[data-eval-status]"),copyBtn=document.querySelector("[data-copy-eval]"),mail=document.querySelector("[data-mail-eval]");
  let lastSummary="";
  form.querySelectorAll("[data-range]").forEach(r=>{
    const b=r.parentElement.querySelector("[data-range-value]");
    function sync(){if(b)b.textContent=r.value}
    r.addEventListener("input",sync);
    sync();
  });
  function val(name){return (form.elements[name]?.value||"").trim()}
  function checked(name){return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(i=>i.value)}
  function esc(s){return String(s||"").replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}
  function scoreBand(score){return score>=78?"高潜启动型":score>=58?"可启动观察型":score>=38?"需要陪伴启动型":"先稳定状态型"}
  function scoreCopy(score){return score>=78?"孩子已经具备较好的 AI 启动力，适合直接进入作品化和表达训练。":score>=58?"孩子有启动空间，但需要一个足够具体、低压力、能快速看到成果的作品入口。":score>=38?"孩子目前不是没有潜力，而是驱动力和掌控感被卡住，需要先被看见，再慢慢启动。":"当前更重要的是先稳定情绪和沟通，不急着追求产出，适合从轻量项目和信任关系开始。"}
  function levelText(n,kind){
    n=Number(n);
    if(kind==="drive")return n<=2?"内驱力偏低，需要用低压力作品重启掌控感":n===3?"内驱力有波动，可以从兴趣入口开始":"内驱力较好，适合更快进入作品打磨";
    if(kind==="communication")return n<=2?"亲子沟通偏关闭，第一次评估要先降低说教感":n===3?"沟通中等，需要找到孩子愿意谈的项目话题":"沟通基础较好，可以共同规划作品路径";
    if(kind==="emotion")return n<=2?"情绪波动较明显，建议先稳定状态再推进产出":n===3?"情绪有一定波动，需要节奏温和":"情绪较稳定，可以承接更清晰的项目挑战";
    return n<=2?"AI 基础较弱，适合从可视化网页和简单 AI 互动开始":n===3?"有一点基础，适合做一个可访问的小产品":"AI 基础较好，适合进入 Claude Code / 产品化作品";
  }
  function track(concerns,drive,communication,emotion,aiBase){
    let risk=concerns.length+(drive<=2?2:0)+(communication<=2?1:0)+(emotion<=2?2:0)+(aiBase<=2?1:0);
    if(risk>=7)return"建议先做 Becky 1v1 深度评估：先看状态和沟通，再定 AI 作品入口。";
    if(risk>=4)return"建议进入 1v1 初评：孩子有可启动空间，但需要把兴趣、状态和作品路径放在一起设计。";
    return"适合从轻评估开始：先做一个小作品入口，观察孩子是否愿意重新投入。";
  }
  function aiEntry(interest,concerns,aiBase){
    const base=Number(aiBase);
    if(concerns.includes("沉迷屏幕"))return"把屏幕兴趣转成创造：从游戏机制、互动网页或 AI 小工具切入。";
    if(concerns.includes("不沟通"))return"用非说教式项目打开沟通：先做孩子愿意展示的小作品。";
    if(concerns.includes("AI 焦虑"))return"先建立 AI 掌控感：用一个简单想法做成网页 Demo，让孩子看到 AI 是可用的工具。";
    if(concerns.includes("没有爱好"))return"从微弱兴趣扫描开始：用 2–3 个小实验找出孩子有反应的方向。";
    if(base>=4)return"可直接进入 AI 产品化：Claude Code、网页应用、作品集展示和 Demo 表达。";
    return`可以从“${interest||"一个微小兴趣"}”开始，先做低门槛网页或 AI 互动原型。`;
  }
  function makeData(){
    const concerns=checked("concerns"),drive=Number(val("drive")),communication=Number(val("communication")),emotion=Number(val("emotion")),aiBase=Number(val("ai_base")),interest=val("interest"),goal=val("goal"),notes=val("notes");
    const interestBonus=interest.length>5?8:interest.length?4:0;
    const concernPenalty=Math.min(18,concerns.length*3)+(concerns.includes("没有内驱力")?7:0)+(concerns.includes("不沟通")?5:0);
    const score=Math.max(18,Math.min(96,Math.round(drive*13+aiBase*14+communication*8+emotion*7+interestBonus-concernPenalty+18)));
    const aiDecision=score>=58?"建议 AI 介入":emotion<=2||communication<=2?"建议低压力 AI 轻介入":"可以先做轻量 AI 体验";
    const aiReason=score>=58?"孩子已有可启动空间，AI 可以成为把兴趣变成真实作品的工具。":emotion<=2||communication<=2?"孩子目前更需要先获得安全感和掌控感，AI 不宜一上来高强度教学，而适合从低压力、可完成的小作品开始。":"暂时不需要复杂工具训练，可以先用一个小 AI 互动页面测试孩子是否愿意投入。";
    const dims=[
      ["内驱力",drive*20,levelText(drive,"drive")],
      ["AI 掌控力",aiBase*20,levelText(aiBase,"ai")],
      ["沟通开放度",communication*20,levelText(communication,"communication")],
      ["情绪承载力",emotion*20,levelText(emotion,"emotion")]
    ];
    const questions=[
      concerns.includes("没有内驱力")?"孩子的动力是一直偏低，还是最近突然下降？":"孩子在哪些时刻会短暂变得主动？",
      concerns.includes("不沟通")?"孩子最抗拒家长谈哪类话题？有没有一个他愿意听的大人？":"家长最希望 Becky 先帮孩子打开哪一种表达？",
      aiBase<=2?"孩子是否愿意从一个很小的 AI 网页或互动作品开始？":"孩子已有的 AI / 编程经验里，哪一次最有成就感？"
    ];
    return {concerns,drive,communication,emotion,aiBase,interest,goal,notes,score,dims,questions,aiDecision,aiReason,entry:aiEntry(interest,concerns,aiBase),path:track(concerns,drive,communication,emotion,aiBase),band:scoreBand(score),scoreText:scoreCopy(score)};
  }
  function summary(data){
    return [
      "【AIPsychLab 孩子状态 Evaluation】",
      `家长：${val("parent_name")}`,
      `联系方式：${val("parent_contact")}`,
      `孩子年级/年龄：${val("student_grade")}`,
      `学校类型：${val("school_type")}`,
      "",
      `AI 驱动力评分：${data.score}/100（${data.band}）`,
      data.scoreText,
      `AI 介入判断：${data.aiDecision}`,
      `判断原因：${data.aiReason}`,
      "",
      "一、家长目前最关心的问题",
      data.concerns.length?data.concerns.join(" / "):"未勾选具体困惑",
      "",
      "二、四个关键维度",
      ...data.dims.map(d=>`${d[0]} ${d[1]}/100：${d[2]}`),
      "",
      "三、孩子可能的 AI 进入点",
      data.entry,
      "",
      "四、建议路径",
      data.path,
      "",
      "五、建议 Becky 一对一初评重点回复的问题",
      ...data.questions.map((q,i)=>`${i+1}. ${q}`),
      "",
      "六、家长补充",
      `孩子还愿意聊的兴趣：${data.interest||"未填写"}`,
      `希望 3–12 个月看到的变化：${data.goal||"未填写"}`,
      `Becky 需要提前知道：${data.notes||"无"}`,
      `希望沟通时间：${val("preferred_time")}`,
      `紧急程度：${val("urgency")}`,
      "",
      "下一步：请把这份 evaluation 复制给 Becky，并添加微信 Beckychyy 预约一对一初评。"
    ].join("\n");
  }
  function reportHtml(data,text){
    const rows=data.dims.map(d=>`<div class="r-dim"><span>${esc(d[0])}</span><i><em style="width:${d[1]}%"></em></i><b>${d[1]}/100</b><p>${esc(d[2])}</p></div>`).join("");
    const qs=data.questions.map((q,i)=>`<li><b>0${i+1}</b>${esc(q)}</li>`).join("");
    return `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AIPsychLab Evaluation Report</title><style>
      :root{color-scheme:dark;--bg:#0a0710;--panel:#18121f;--line:#1ee6ff;--gold:#ffbd73;--text:#f7f1ff;--muted:#cbbdd6}
      *{box-sizing:border-box}body{margin:0;background:#0a0710;color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Noto Sans SC","PingFang SC",Arial,sans-serif;line-height:1.65}
      .report{width:980px;margin:0 auto;padding:42px 32px 54px;background:radial-gradient(circle at 20% 0%,rgba(30,230,255,.18),transparent 30%),radial-gradient(circle at 80% 20%,rgba(255,45,154,.16),transparent 34%),var(--bg)}.hero{border:1px solid rgba(30,230,255,.45);border-radius:22px;padding:34px;background:linear-gradient(145deg,rgba(24,18,31,.94),rgba(10,7,16,.86));box-shadow:0 28px 90px rgba(0,0,0,.35)}
      .k{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--line)}h1{font-size:42px;line-height:1.08;margin:12px 0 16px}.meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}.meta span{border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:8px 12px;color:var(--muted);font-size:13px}
      .score{display:grid;grid-template-columns:170px 1fr;gap:24px;align-items:center;margin-top:26px}.ring{width:160px;height:160px;border-radius:50%;display:grid;place-items:center;position:relative;background:conic-gradient(var(--line) ${data.score}%,rgba(255,255,255,.09) 0)}.ring:before{content:"";position:absolute;inset:12px;border-radius:50%;background:#0d0914}.ring b{position:relative;font-size:54px}.decision{font-size:30px;color:var(--gold);font-weight:800}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:20px}.card{break-inside:avoid;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:rgba(24,18,31,.72);padding:22px}.card h2{font-size:22px;margin:0 0 12px}.card p{color:var(--muted);margin:0}.r-dim{display:grid;grid-template-columns:92px 1fr 72px;gap:10px;align-items:center;margin:13px 0}.r-dim i{height:9px;background:rgba(255,255,255,.1);border-radius:999px;overflow:hidden}.r-dim em{display:block;height:100%;background:linear-gradient(90deg,var(--line),var(--gold));border-radius:999px}.r-dim p{grid-column:1/-1;font-size:14px;color:var(--muted)}ol{padding:0;list-style:none}li{display:grid;grid-template-columns:42px 1fr;gap:10px;margin:10px 0;padding:12px;border-left:2px solid var(--line);background:rgba(255,255,255,.04)}li b{color:var(--line)}pre{white-space:pre-wrap;background:rgba(0,0,0,.32);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:18px;color:var(--muted)}.footer{margin-top:22px;color:var(--muted);font-size:13px}
    </style></head><body><main class="report"><section class="hero"><div class="k">AIPsychLab Evaluation Report</div><h1>孩子状态与 AI 介入评估报告</h1><p>本报告用于预约前理解孩子状态，不构成医学诊断。请将 PDF 发给 Becky，并添加微信 Beckychyy 预约一对一初评。</p><div class="meta"><span>家长：${esc(val("parent_name"))}</span><span>孩子：${esc(val("student_grade"))}</span><span>学校：${esc(val("school_type"))}</span><span>微信：Beckychyy</span></div><div class="score"><div class="ring"><b>${data.score}</b></div><div><div class="decision">${esc(data.aiDecision)}</div><h2>${esc(data.band)}</h2><p>${esc(data.aiReason)}</p></div></div></section><section class="grid"><div class="card"><h2>四个核心维度</h2>${rows}</div><div class="card"><h2>Becky 需要重点回复</h2><ol>${qs}</ol></div><div class="card"><h2>AI 进入点</h2><p>${esc(data.entry)}</p></div><div class="card"><h2>建议路径</h2><p>${esc(data.path)}</p></div></section><section class="card" style="margin-top:18px"><h2>完整 Evaluation 文本</h2><pre>${esc(text)}</pre></section><div class="footer">AIPsychLab · Becky Chen · Psychology × AI × Education</div></main></body></html>`;
  }
  async function downloadReport(data,text){
    const filename=`AIPsychLab-Evaluation-${(val("student_grade")||"student").replace(/[\\/:*?"<>|\\s]+/g,"-")}.pdf`;
    if(!window.html2pdf){
      const w=window.open("","_blank");
      if(w){w.document.write(reportHtml(data,text));w.document.close();setTimeout(()=>w.print(),500)}
      if(status)status.textContent="PDF 生成库暂未加载，已打开打印窗口，请选择“另存为 PDF”。";
      return;
    }
    const box=document.createElement("div");
    box.className="pdf-render-root";
    box.innerHTML=reportHtml(data,text);
    document.body.appendChild(box);
    const el=box.querySelector(".report");
    await window.html2pdf().set({margin:0,filename,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:true,backgroundColor:"#0a0710"},jsPDF:{unit:"px",format:[980,1386],orientation:"portrait"},pagebreak:{mode:["avoid-all","css","legacy"]}}).from(el).save();
    box.remove();
    if(status)status.textContent="PDF 报告已下载。请把 PDF 发给 Becky，并添加微信 Beckychyy 预约一对一初评。";
  }
  function render(data){
    const text=summary(data);
    lastSummary=text;
    if(hidden)hidden.value=text;
    if(output){
      output.innerHTML=`<div class="score-console"><div class="score-ring" style="--score:${data.score}"><b>${data.score}</b><span>AI 驱动力</span></div><div><strong>${esc(data.band)}</strong><p>${esc(data.scoreText)}</p></div></div><div class="ai-decision-card"><b>${esc(data.aiDecision)}</b><p>${esc(data.aiReason)}</p></div><div class="dimension-stack">${data.dims.map(d=>`<div class="dimension-row"><span>${esc(d[0])}</span><i><em style="width:${d[1]}%"></em></i><b>${d[1]}</b><small>${esc(d[2])}</small></div>`).join("")}</div><div class="eval-insight"><b>AI 进入点</b><p>${esc(data.entry)}</p></div><div class="eval-insight accent"><b>建议路径</b><p>${esc(data.path)}</p></div><div class="becky-questions"><b>建议 Becky 回复的 3 个问题</b>${data.questions.map(q=>`<span>${esc(q)}</span>`).join("")}</div><details class="eval-text"><summary>展开可复制的完整 Evaluation 文本</summary><pre>${esc(text)}</pre></details><div class="wechat-next"><b>下一步：下载 PDF 报告，发给 Becky</b><span>微信号 Beckychyy</span><p>下载这份 AI 介入评估 PDF，直接发给 Becky。她会根据报告判断孩子是否适合进入 1v1 深度评估，并给家长更具体的回复。</p><button class="btn primary" type="button" data-download-report>下载 PDF 报告</button><button class="btn" type="button" data-copy-wechat>复制微信号 Beckychyy</button></div>`;
      output.closest("[data-eval-result]")?.classList.add("ready");
      output.querySelector("[data-copy-wechat]")?.addEventListener("click",()=>copyText("Beckychyy",status));
      output.querySelector("[data-download-report]")?.addEventListener("click",()=>downloadReport(data,text));
    }
    if(mail)mail.href=`mailto:beckychyy@163.com?subject=${encodeURIComponent("AIPsychLab 孩子状态 Evaluation")}&body=${encodeURIComponent(text)}`;
    if(status)status.textContent="Evaluation 已生成。请复制 evaluation 并添加微信 Beckychyy 做一对一初评。";
    setTimeout(()=>document.querySelector("[data-eval-result]")?.scrollIntoView({behavior:"smooth",block:"start"}),160);
  }
  form.addEventListener("submit",()=>render(makeData()));
  copyBtn?.addEventListener("click",()=>copyText(lastSummary||summary(makeData()),status));
}
// data-fx 动画触发器：进入视区后一次性触发，可用 data-fx-delay 错峰
(function(){
  var els=[].slice.call(document.querySelectorAll("[data-fx]"));
  if(!els.length)return;
  if(!("IntersectionObserver" in window)){
    els.forEach(function(el){el.classList.add("in")});
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var delay=parseInt(entry.target.getAttribute("data-fx-delay"),10)||0;
        setTimeout(function(){entry.target.classList.add("in")},delay);
        io.unobserve(entry.target);
      }
    });
  },{threshold:.35});
  els.forEach(function(el){io.observe(el)});
})();
