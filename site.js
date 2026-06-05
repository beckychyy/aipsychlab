function setLang(lang){document.body.classList.toggle("lang-en",lang==="en");document.documentElement.lang=lang==="en"?"en":"zh";document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));localStorage.setItem("aipsychlab_lang",lang)}
function boot(){const saved=localStorage.getItem("aipsychlab_lang");if(saved)setLang(saved);document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));document.querySelector(".menu-btn")?.addEventListener("click",()=>document.querySelector(".nav")?.classList.toggle("open"));particles();scrollFx();reveal();accordion();contactForm();productModal();workFilters();journey();fitCheck();aiPlayground();evaluationFlow();copyButtons()}
function particles(){const box=document.querySelector(".particles");if(!box||box.children.length)return;for(let i=0;i<16;i++){const p=document.createElement("span");p.className="particle";p.style.left=Math.random()*100+"%";p.style.animationDuration=18+Math.random()*22+"s";p.style.animationDelay=-Math.random()*24+"s";p.style.opacity=.12+Math.random()*.18;if(Math.random()>.72)p.style.background="var(--magenta)";box.appendChild(p)}}
function scrollFx(){const nav=document.querySelector(".nav"),bar=document.querySelector(".progress");let ticking=false;function run(){const y=scrollY;if(nav)nav.classList.toggle("scrolled",y>40);if(bar){const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(max>0?y/max*100:0)+"%"}ticking=false}addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(run);ticking=true}});run()}
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>io.observe(el))}
function accordion(){document.querySelectorAll(".research-item button").forEach(btn=>btn.addEventListener("click",()=>btn.closest(".research-item")?.classList.toggle("open")))}
function contactForm(){const form=document.querySelector("[data-contact-form]");if(!form)return;form.addEventListener("submit",async e=>{const key=form.querySelector("[name=access_key]")?.value||"";if(key.includes("REPLACE")){e.preventDefault();document.querySelector("[data-form-status]").textContent="在线表单暂未开放，请先添加微信 Beckychyy 或发送邮件到 beckychyy@163.com。";return}document.querySelector("[data-form-status]").textContent="提交中..."})}
function productModal(){const links=document.querySelectorAll("[data-app]");if(!links.length)return;const modal=document.createElement("div");modal.className="product-modal";modal.innerHTML='<div class="product-backdrop" data-close-product></div><div class="product-shell"><button class="product-close" type="button" data-close-product>×</button><div class="device-frame product-device"><div class="device-bar"><i></i><i></i><i></i><span data-product-title>Product</span></div><iframe loading="lazy" title="AIPsychLab product preview" sandbox="allow-scripts allow-same-origin" allow="camera *; microphone *"></iframe></div></div>';document.body.appendChild(modal);const frame=modal.querySelector("iframe"),title=modal.querySelector("[data-product-title]");function close(){modal.classList.remove("open");setTimeout(()=>{if(!modal.classList.contains("open"))frame.removeAttribute("src")},260)}function open(link){const slug=link.dataset.app,url=link.getAttribute("href")||`apps/${slug}/index.html`;if(innerWidth<640||slug==="tarot"){window.open(url,"_blank","noopener");return}title.textContent=link.dataset.title||slug;frame.title=link.dataset.title||"AIPsychLab product preview";frame.src=url;modal.classList.add("open")}links.forEach(link=>link.addEventListener("click",e=>{e.preventDefault();open(link)}));modal.querySelectorAll("[data-close-product]").forEach(el=>el.addEventListener("click",close));addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))close()})}
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

function evaluationFlow(){
  const form=document.querySelector("[data-eval-form]");
  if(!form)return;
  const output=document.querySelector("[data-eval-output]");
  const hidden=form.querySelector("[data-eval-hidden]");
  const status=document.querySelector("[data-eval-status]");
  const copyBtn=document.querySelector("[data-copy-eval]");
  const mail=document.querySelector("[data-mail-eval]");
  let lastSummary="";

  form.querySelectorAll("[data-range]").forEach(r=>{
    const b=r.parentElement.querySelector("[data-range-value]");
    function sync(){if(b)b.textContent=r.value}
    r.addEventListener("input",sync);
    sync();
  });

  function val(name){return (form.elements[name]?.value||"").trim()}
  function num(name){return Number(val(name)||0)}
  function checked(name){return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(i=>i.value)}
  function esc(s){return String(s||"").replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}

  function levelText(n,kind){
    n=Number(n);
    const low={
      drive:"内驱力偏低，需要先用低压力作品重启“我能做成”的感觉",
      communication:"沟通偏关闭，第一次评估要减少说教感，先找到孩子愿意谈的话题",
      emotion:"情绪承载力偏低，不适合一上来高强度追产出，需要先稳住节奏",
      ai:"AI 基础较弱，适合从可视化网页、互动小工具和提示词开始",
      autonomy:"自主感偏低，孩子可能长期处在被安排状态，需要先练习自己选择",
      curiosity:"好奇心暂时被压住，需要从很小的兴趣反应重新点火",
      execution:"执行落地偏弱，适合把任务拆成很短的可完成闭环",
      creativity:"创造表达偏少，需要先用低门槛方式让孩子敢表达想法",
      resilience:"抗挫力偏弱，项目需要降低失败成本，让孩子能反复试"
    };
    const mid={
      drive:"内驱力有波动，可以从兴趣入口开始观察",
      communication:"沟通中等，需要找到孩子愿意共同讨论的项目话题",
      emotion:"情绪有一定波动，需要温和节奏和清晰边界",
      ai:"有一点 AI / 编程基础，适合做一个可访问的小产品",
      autonomy:"自主感正在形成，需要把选择权交还给孩子一部分",
      curiosity:"好奇心还在，但需要具体问题把它牵出来",
      execution:"能完成一部分任务，但需要外部节奏和阶段反馈",
      creativity:"有想法，但需要被翻译成可执行的作品方向",
      resilience:"遇到难题会卡住，但通过小胜利可以逐渐恢复"
    };
    const high={
      drive:"内驱力较好，适合更快进入作品打磨和公开表达",
      communication:"沟通基础较好，可以共同规划作品路径",
      emotion:"情绪较稳定，可以承接更清晰的项目挑战",
      ai:"AI 基础较好，适合进入 Claude Code / 产品化作品",
      autonomy:"自主感较好，适合让孩子担任项目 owner",
      curiosity:"好奇心较强，适合从真实问题研究进入",
      execution:"执行力较好，可以直接进入产品迭代",
      creativity:"创造表达明显，适合做内容、叙事或体验型产品",
      resilience:"抗挫力较好，适合挑战更复杂的作品闭环"
    };
    if(n<=2)return low[kind];
    if(n===3)return mid[kind];
    return high[kind];
  }

  function profileType(data){
    const t=data.traits.join(" ");
    const empathy=t.includes("共情强");
    const system=t.includes("系统")||data.aiBase>=4&&data.execution>=4;
    const expressive=t.includes("表达欲强")||data.creativity>=4;
    const arranged=t.includes("被安排太多")||data.autonomy<=2;
    const perfection=t.includes("害怕失败")||data.resilience<=2;
    const manyIdeas=t.includes("想法很多")||data.creativity>=4&&data.execution<=3;
    if(data.emotion<=2||data.communication<=2||perfection){
      return {
        name:"高敏感深潜型",
        tag:"先安全，再启动",
        desc:"孩子不是没有能力，而是对失败、评价或被安排很敏感。越催越退，越讲道理越关闭。适合先建立信任，再用一个低压力 AI 小作品重新获得掌控感。",
        project:"低压力 AI 情绪地图 / 个人兴趣小宇宙 / 不公开的互动原型"
      };
    }
    if(arranged||data.drive<=2){
      return {
        name:"内驱力唤醒型",
        tag:"把选择权还给孩子",
        desc:"孩子可能习惯了被推着走，所以看起来懒、拖、没方向。真正需要的不是更多安排，而是一次由自己选择、自己做成、能被看见的作品体验。",
        project:"兴趣扫描小实验 / AI 个人网页 / 能快速完成的微型 App"
      };
    }
    if(system){
      return {
        name:"系统建造型",
        tag:"从会用工具到搭建系统",
        desc:"孩子对规则、结构、工具或技术有反应，适合把 AI 当成工程伙伴，做出一个可以运行、可以访问、可以迭代的真实产品。",
        project:"AI 学习工具 / 数据看板 / Claude Code 网页应用"
      };
    }
    if(empathy){
      return {
        name:"共情问题解决型",
        tag:"把感受变成产品",
        desc:"孩子能注意到人和人的需要，适合从心理、陪伴、公益、校园关系等真实问题切入，用 AI 做一个能帮助别人的作品。",
        project:"AI 陪伴类产品 / 公益议题工具 / 情绪支持互动页"
      };
    }
    if(expressive||manyIdeas){
      return {
        name:"表达创造型",
        tag:"把想法变成可体验作品",
        desc:"孩子并不缺点子，缺的是把想法落到结构、交互和发布上的方法。适合把内容表达升级成 AI 产品、故事体验或作品集资产。",
        project:"AI 故事生成器 / 影像互动页 / 游戏机制原型"
      };
    }
    return {
      name:"AI 创造型先驱",
      tag:"从兴趣进入未来能力",
      desc:"孩子有可启动的基础，最需要的是一个足够具体的方向：用 AI 把兴趣变成真实作品，再通过展示和迭代建立未来掌控力。",
      project:"可访问网页 App / 作品集网站 / Demo Day 展示作品"
    };
  }

  function aiEntry(data){
    if(data.concerns.includes("沉迷屏幕"))return"把屏幕兴趣转成创造：从游戏机制、互动网页或 AI 小工具切入，让孩子从“消费内容”转向“创造内容”。";
    if(data.concerns.includes("不沟通"))return"用项目绕开说教：先做一个孩子愿意展示的小作品，让沟通围绕作品自然发生。";
    if(data.concerns.includes("AI 焦虑"))return"先建立 AI 掌控感：用一个简单想法做成网页 Demo，让孩子看到 AI 是可以被自己使用的工具。";
    if(data.concerns.includes("没有爱好"))return"从微弱兴趣扫描开始：用 2–3 个小实验找出孩子有反应的方向，而不是要求他立刻说出热爱。";
    if(data.aiBase>=4)return"可直接进入 AI 产品化：Claude Code、网页应用、作品集展示和 Demo 表达。";
    return `可以从“${data.interest||"一个微小兴趣"}”开始，先做低门槛网页或 AI 互动原型。`;
  }

  function path(data){
    let risk=data.concerns.length+(data.drive<=2?2:0)+(data.communication<=2?2:0)+(data.emotion<=2?2:0)+(data.resilience<=2?1:0);
    if(risk>=8)return"建议先做 Becky 1v1 深度评估：先看状态、沟通和孩子能承受的节奏，再设计 AI 作品入口。";
    if(risk>=5)return"建议进入 1v1 初评：孩子有启动空间，但需要把心理状态、兴趣入口和作品路径放在一起设计。";
    return"适合从轻评估开始：先做一个小作品入口，观察孩子是否愿意重新投入。";
  }

  function makeData(){
    const data={
      filledBy:val("filled_by"),
      currentState:val("current_state"),
      concerns:checked("concerns"),
      traits:checked("traits"),
      drive:num("drive"),
      communication:num("communication"),
      emotion:num("emotion"),
      aiBase:num("ai_base"),
      autonomy:num("autonomy"),
      curiosity:num("curiosity"),
      execution:num("execution"),
      creativity:num("creativity"),
      resilience:num("resilience"),
      interest:val("interest"),
      dreamProject:val("dream_project"),
      goal:val("goal"),
      supportDislike:val("support_dislike"),
      notes:val("notes")
    };
    const interestBonus=data.interest.length>6?6:data.interest.length?3:0;
    const dreamBonus=data.dreamProject.length>8?6:data.dreamProject.length?3:0;
    const traitBonus=Math.min(8,data.traits.length*2);
    const concernPenalty=Math.min(20,data.concerns.length*3)+(data.concerns.includes("没有内驱力")?6:0)+(data.concerns.includes("不沟通")?5:0);
    data.score=Math.max(16,Math.min(97,Math.round(
      data.drive*10+data.aiBase*10+data.autonomy*9+data.curiosity*9+data.execution*8+data.creativity*8+data.resilience*7+data.communication*5+data.emotion*5+interestBonus+dreamBonus+traitBonus-concernPenalty-8
    )));
    data.band=data.score>=80?"高潜启动型":data.score>=62?"可启动发展型":data.score>=42?"陪伴唤醒型":"先稳定状态型";
    data.scoreText=data.score>=80?"孩子已经有明显的 AI 启动潜力，适合进入真实产品、作品集和公开表达。":data.score>=62?"孩子有可启动空间，但需要一个具体、有意义、能快速看到成果的项目入口。":data.score>=42?"孩子不是没有潜力，而是内驱力、掌控感或沟通被卡住，需要先从小闭环重新启动。":"当前不建议一开始追求高强度产出，更适合先稳定情绪和信任关系，再轻量引入 AI。";
    data.aiDecision=data.score>=62?"建议 AI 介入":data.emotion<=2||data.communication<=2||data.resilience<=2?"建议低压力 AI 轻介入":"可以先做轻量 AI 体验";
    data.aiReason=data.score>=62?"AI 可以成为孩子把兴趣变成现实的工具，重点不是学工具，而是用 AI 建立未来掌控力。":data.emotion<=2||data.communication<=2||data.resilience<=2?"孩子目前更需要安全感、选择权和小胜利，AI 适合以低压力作品形式进入，不宜一开始高强度教学。":"可以先用一个简单 AI 互动页面测试孩子的投入感，再决定是否进入深度陪跑。";
    data.profile=profileType(data);
    data.entry=aiEntry(data);
    data.path=path(data);
    data.dims=[
      ["内驱力",data.drive*20,levelText(data.drive,"drive")],
      ["AI 掌控力",data.aiBase*20,levelText(data.aiBase,"ai")],
      ["自主感",data.autonomy*20,levelText(data.autonomy,"autonomy")],
      ["好奇心",data.curiosity*20,levelText(data.curiosity,"curiosity")],
      ["执行落地",data.execution*20,levelText(data.execution,"execution")],
      ["创造表达",data.creativity*20,levelText(data.creativity,"creativity")],
      ["沟通开放度",data.communication*20,levelText(data.communication,"communication")],
      ["情绪承载力",data.emotion*20,levelText(data.emotion,"emotion")],
      ["抗挫力",data.resilience*20,levelText(data.resilience,"resilience")]
    ];
    data.questions=[
      data.filledBy==="孩子自己填写"?"孩子自己最想先做的作品是什么？这个想法背后真正想表达什么？":"这份评估中，哪些内容是家长观察，哪些是孩子亲口表达？",
      data.concerns.includes("没有内驱力")?"孩子的动力是一直偏低，还是某个阶段后突然下降？":"孩子在哪些场景里会短暂变得主动、有光或愿意投入？",
      data.concerns.includes("不沟通")?"孩子最抗拒家长谈哪类话题？有没有一个他愿意信任的大人？":"孩子愿意被怎样支持？哪些支持方式会让他立刻关门？",
      data.dreamProject?`孩子提到的“${data.dreamProject.slice(0,32)}”能否发展成第一个 AI 作品？`:"如果从一个很小的 AI 作品开始，孩子更愿意做心理、游戏、学习工具、影像还是公益方向？",
      data.aiBase<=2?"孩子是否愿意从一个 30–60 分钟能看到结果的 AI 网页开始？":"孩子已有的 AI / 编程经验里，哪一次最有成就感，哪一次最容易放弃？"
    ];
    return data;
  }

  function summary(data){
    return [
      "【AIPsychLab 孩子状态 Evaluation】",
      `家长：${val("parent_name")}`,
      `联系方式：${val("parent_contact")}`,
      `孩子年级/年龄：${val("student_grade")}`,
      `学校类型：${val("school_type")}`,
      `填写方式：${data.filledBy}`,
      `当前状态：${data.currentState}`,
      "",
      `AI 驱动力评分：${data.score}/100（${data.band}）`,
      data.scoreText,
      `孩子画像类型：${data.profile.name}｜${data.profile.tag}`,
      data.profile.desc,
      `AI 介入判断：${data.aiDecision}`,
      `判断原因：${data.aiReason}`,
      "",
      "一、目前最关心的问题",
      data.concerns.length?data.concerns.join(" / "):"未勾选具体困惑",
      "",
      "二、孩子反应方式",
      data.traits.length?data.traits.join(" / "):"未勾选具体反应方式",
      "",
      "三、九个关键维度",
      ...data.dims.map(d=>`${d[0]} ${d[1]}/100：${d[2]}`),
      "",
      "四、孩子可能的 AI 进入点",
      data.entry,
      "",
      "五、建议路径",
      data.path,
      "",
      "六、建议 Becky 一对一初评重点回复的问题",
      ...data.questions.map((q,i)=>`${i+1}. ${q}`),
      "",
      "七、补充信息",
      `孩子还愿意聊的兴趣：${data.interest||"未填写"}`,
      `孩子可能想解决的问题：${data.dreamProject||"未填写"}`,
      `希望 3–12 个月看到的变化：${data.goal||"未填写"}`,
      `孩子不喜欢的帮助方式：${data.supportDislike||"未填写"}`,
      `Becky 需要提前知道：${data.notes||"无"}`,
      `希望沟通时间：${val("preferred_time")}`,
      `紧急程度：${val("urgency")}`,
      "",
      "下一步：请下载 PDF 报告，添加微信 Beckychyy，并把报告发给 Becky 做一对一初评。"
    ].join("\n");
  }

  function reportHtml(data,text){
    const rows=data.dims.map(d=>`<div class="r-dim"><span>${esc(d[0])}</span><i><em style="width:${d[1]}%"></em></i><b>${d[1]}/100</b><p>${esc(d[2])}</p></div>`).join("");
    const qs=data.questions.map((q,i)=>`<li><b>0${i+1}</b>${esc(q)}</li>`).join("");
    return `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AIPsychLab Evaluation Report</title><style>
      :root{color-scheme:dark;--bg:#0a0710;--panel:#18121f;--line:#1ee6ff;--gold:#ffbd73;--pink:#ff5cb8;--text:#f7f1ff;--muted:#cbbdd6}
      *{box-sizing:border-box}body{margin:0;background:#0a0710;color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Noto Sans SC","PingFang SC",Arial,sans-serif;line-height:1.65}.report{width:980px;margin:0 auto;padding:42px 32px 54px;background:radial-gradient(circle at 20% 0%,rgba(30,230,255,.18),transparent 30%),radial-gradient(circle at 80% 20%,rgba(255,92,184,.16),transparent 34%),var(--bg)}.hero{border:1px solid rgba(30,230,255,.45);border-radius:22px;padding:34px;background:linear-gradient(145deg,rgba(24,18,31,.94),rgba(10,7,16,.86));box-shadow:0 28px 90px rgba(0,0,0,.35)}.k{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--line)}h1{font-size:42px;line-height:1.08;margin:12px 0 16px}.meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}.meta span{border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:8px 12px;color:var(--muted);font-size:13px}.score{display:grid;grid-template-columns:170px 1fr;gap:24px;align-items:center;margin-top:26px}.ring{width:160px;height:160px;border-radius:50%;display:grid;place-items:center;position:relative;background:conic-gradient(var(--line) ${data.score}%,rgba(255,255,255,.09) 0)}.ring:before{content:"";position:absolute;inset:12px;border-radius:50%;background:#0d0914}.ring b{position:relative;font-size:54px}.decision{font-size:30px;color:var(--gold);font-weight:800}.profile{margin-top:20px;border:1px solid rgba(255,92,184,.4);border-radius:18px;background:linear-gradient(135deg,rgba(255,92,184,.16),rgba(30,230,255,.08));padding:22px}.profile h2{font-size:32px;margin:4px 0}.profile strong{color:var(--pink)}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:20px}.card{break-inside:avoid;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:rgba(24,18,31,.72);padding:22px}.card h2{font-size:22px;margin:0 0 12px}.card p,.profile p{color:var(--muted);margin:0}.r-dim{display:grid;grid-template-columns:92px 1fr 72px;gap:10px;align-items:center;margin:11px 0}.r-dim i{height:9px;background:rgba(255,255,255,.1);border-radius:999px;overflow:hidden}.r-dim em{display:block;height:100%;background:linear-gradient(90deg,var(--line),var(--gold));border-radius:999px}.r-dim p{grid-column:1/-1;font-size:13px;color:var(--muted)}ol{padding:0;list-style:none}li{display:grid;grid-template-columns:42px 1fr;gap:10px;margin:10px 0;padding:12px;border-left:2px solid var(--line);background:rgba(255,255,255,.04)}li b{color:var(--line)}pre{white-space:pre-wrap;background:rgba(0,0,0,.32);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:18px;color:var(--muted)}.footer{margin-top:22px;color:var(--muted);font-size:13px}
    </style></head><body><main class="report"><section class="hero"><div class="k">AIPsychLab Evaluation Report</div><h1>孩子状态与 AI 介入评估报告</h1><p>本报告用于预约前理解孩子状态，不构成医学诊断。请将 PDF 发给 Becky，并添加微信 Beckychyy 预约一对一初评。</p><div class="meta"><span>家长：${esc(val("parent_name"))}</span><span>孩子：${esc(val("student_grade"))}</span><span>填写：${esc(data.filledBy)}</span><span>微信：Beckychyy</span></div><div class="score"><div class="ring"><b>${data.score}</b></div><div><div class="decision">${esc(data.aiDecision)}</div><h2>${esc(data.band)}</h2><p>${esc(data.aiReason)}</p></div></div><div class="profile"><strong>孩子画像类型</strong><h2>${esc(data.profile.name)}</h2><p>${esc(data.profile.desc)}</p></div></section><section class="grid"><div class="card"><h2>九个关键维度</h2>${rows}</div><div class="card"><h2>Becky 需要重点回复</h2><ol>${qs}</ol></div><div class="card"><h2>适合的 AI 项目入口</h2><p>${esc(data.profile.project)}</p></div><div class="card"><h2>建议路径</h2><p>${esc(data.path)}</p></div></section><section class="card" style="margin-top:18px"><h2>完整 Evaluation 文本</h2><pre>${esc(text)}</pre></section><div class="footer">AIPsychLab · Becky Chen · Psychology × AI × Education</div></main></body></html>`;
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
      output.innerHTML=`<div class="score-console"><div class="score-ring" style="--score:${data.score}"><b>${data.score}</b><span>AI 驱动力</span></div><div><strong>${esc(data.band)}</strong><p>${esc(data.scoreText)}</p></div></div><div class="profile-card"><span>孩子画像类型</span><b>${esc(data.profile.name)}</b><small>${esc(data.profile.tag)}</small><p>${esc(data.profile.desc)}</p></div><div class="ai-decision-card"><b>${esc(data.aiDecision)}</b><p>${esc(data.aiReason)}</p></div><div class="dimension-stack">${data.dims.map(d=>`<div class="dimension-row"><span>${esc(d[0])}</span><i><em style="width:${d[1]}%"></em></i><b>${d[1]}</b><small>${esc(d[2])}</small></div>`).join("")}</div><div class="eval-insight"><b>适合的 AI 项目入口</b><p>${esc(data.profile.project)}</p></div><div class="eval-insight"><b>AI 进入点</b><p>${esc(data.entry)}</p></div><div class="eval-insight accent"><b>建议路径</b><p>${esc(data.path)}</p></div><div class="becky-questions"><b>建议 Becky 回复的 5 个问题</b>${data.questions.map(q=>`<span>${esc(q)}</span>`).join("")}</div><details class="eval-text"><summary>展开可复制的完整 Evaluation 文本</summary><pre>${esc(text)}</pre></details><div class="wechat-next"><b>下一步：下载 PDF 报告，发给 Becky</b><span>微信号 Beckychyy</span><p>下载这份 AI 驱动力与孩子画像评估 PDF，直接发给 Becky。她会根据报告判断是否需要 AI 介入，以及适合从哪一种 1v1 项目开始。</p><button class="btn primary" type="button" data-download-report>下载 PDF 报告</button><button class="btn" type="button" data-copy-wechat>复制微信号 Beckychyy</button></div>`;
      output.closest("[data-eval-result]")?.classList.add("ready");
      output.querySelector("[data-copy-wechat]")?.addEventListener("click",()=>copyText("Beckychyy",status));
      output.querySelector("[data-download-report]")?.addEventListener("click",()=>downloadReport(data,text));
    }
    if(mail)mail.href=`mailto:beckychyy@163.com?subject=${encodeURIComponent("AIPsychLab 孩子状态 Evaluation")}&body=${encodeURIComponent(text)}`;
    if(status)status.textContent="Evaluation 已生成。请下载 PDF，并添加微信 Beckychyy 发给 Becky。";
    setTimeout(()=>document.querySelector("[data-eval-result]")?.scrollIntoView({behavior:"smooth",block:"start"}),160);
  }

  form.addEventListener("submit",()=>render(makeData()));
  copyBtn?.addEventListener("click",()=>copyText(lastSummary||summary(makeData()),status));
}
