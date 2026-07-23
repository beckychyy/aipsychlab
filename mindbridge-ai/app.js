const phases = [
  "Affect Validation & Empathy",
  "Scaling Question",
  "Exception Finding",
  "Micro-Action Planning",
];
const crisisTerms = [
  "hopeless",
  "can't go on",
  "cannot go on",
  "end it all",
  "suicide",
  "kill myself",
  "self harm",
  "self-harm",
  "die",
  "绝望",
  "撑不下去",
  "不想活",
  "结束一切",
  "自杀",
  "伤害自己",
];
const copy = {
  en: {
    eyebrow: "Psychoeducational Simulation",
    deck: "Academic Resilience & Adaptive SFBT-CBT System",
    summary: "A psychoeducational simulation for graduate students navigating burnout, imposter distress, advisor feedback, and dissertation procrastination.",
    switch: "中文",
    userLabel: "Graduate Student",
    coachLabel: "MindBridge AI Coach",
    chat: "Active Chat Workspace",
    coachSub: "SFBT + CBT empathic coach",
    dashboard: "Metacognitive & Safety Dashboard",
    dashboardSub: "Asynchronous evaluator model",
    input: "Share what is happening academically or emotionally...",
    send: "Send",
    thinking: "MindBridge is evaluating...",
    locked: "Safety protocol active",
    sourceLabel: "Evaluator",
    source: {
      initial: "Demo baseline",
      deepseek: "DeepSeek API",
      mock: "Structured mock",
      "safety-local": "Safety pre-check",
      "offline-fallback": "Offline fallback",
    },
    quick: "Quick suggestions",
    wordCount: "words",
    stage: "Therapeutic Stage Indicator",
    affect: "Detected Emotional Affect",
    agency: "Student Agency Gauge",
    risk: "Real-Time Risk Meter",
    protocol: "Structured JSON Output",
    safety: "Emergency Safety Protocol",
    modalTitle: "Immediate Support Recommended",
    modalBody: "MindBridge detected language that may indicate elevated risk. This simulation is paused so the student can connect with real support now.",
    jhu: "JHU BHCST 410-516-9355",
    jhuSub: "Behavioral Health Crisis Support Team, available 24/7/365 for Johns Hopkins affiliates.",
    lifeline: "988 Suicide & Crisis Lifeline",
    counselor: "Connect with On-Call Counselor",
    disabled: "Input is disabled because the safety threshold was crossed. In a real deployment, this state should require human review or authenticated support handoff.",
    schemaCopy: "Production instructions force the model to return only valid JSON matching this protocol. Without an API key, the demo uses deterministic structured mock responses.",
    initialResponse: "It makes sense that doctoral work can feel heavy when your progress is measured in uncertain drafts and delayed feedback. Before we problem-solve, what would help you feel even 5% more steady in the next hour?",
    phaseLabels: {
      "Affect Validation & Empathy": "Affect Validation & Empathy",
      "Scaling Question": "Scaling Question",
      "Exception Finding": "Exception Finding",
      "Micro-Action Planning": "Micro-Action Planning",
    },
    affectLabels: {
      "Acute Hopelessness Signal": "Acute Hopelessness Signal",
      "Burnout Overload": "Burnout Overload",
      "Imposter Distress": "Imposter Distress",
      "Perfectionistic Paralysis": "Perfectionistic Paralysis",
      "Perfectionistic Anxiety": "Perfectionistic Anxiety",
      "Advisor Feedback Threat": "Advisor Feedback Threat",
      "Academic Stress Activation": "Academic Stress Activation",
    },
    agencyLabels: {
      Low: "Low",
      Emerging: "Emerging",
      High: "High",
    },
  },
  zh: {
    eyebrow: "心理教育模拟",
    deck: "学术韧性与自适应 SFBT-CBT 系统",
    summary: "面向研究生的心理教育模拟，用于应对倦怠、冒名顶替感、导师反馈和论文拖延。",
    switch: "English",
    userLabel: "研究生",
    coachLabel: "MindBridge AI 教练",
    chat: "主动对话工作区",
    coachSub: "SFBT + CBT 共情式教练",
    dashboard: "元认知与安全仪表盘",
    dashboardSub: "异步评估模型",
    input: "描述你正在经历的学术或情绪状态...",
    send: "发送",
    thinking: "MindBridge 正在评估...",
    locked: "安全协议已启动",
    sourceLabel: "评估来源",
    source: {
      initial: "演示基线",
      deepseek: "DeepSeek API",
      mock: "结构化 mock",
      "safety-local": "安全预检查",
      "offline-fallback": "离线回退",
    },
    quick: "快速建议",
    wordCount: "词",
    stage: "治疗阶段指示器",
    affect: "检测到的情绪状态",
    agency: "学生行动感量表",
    risk: "实时风险评分",
    protocol: "结构化 JSON 输出",
    safety: "紧急安全协议",
    modalTitle: "建议立即连接真实支持",
    modalBody: "MindBridge 检测到可能表示风险升高的语言。模拟已暂停，以便学生立刻联系真实支持。",
    jhu: "JHU BHCST 410-516-9355",
    jhuSub: "约翰霍普金斯行为健康危机支持团队为 Hopkins 成员提供 24/7/365 支持。",
    lifeline: "988 自杀与危机生命线",
    counselor: "联系值班咨询师",
    disabled: "由于安全阈值被触发，输入已禁用。真实部署中应要求人工复核或认证支持转接。",
    schemaCopy: "模型端会返回符合协议的 JSON；中文界面会保留英文字段名以匹配 API，同时本地化字段值。",
    initialResponse: "博士和研究生阶段的工作很容易变得沉重，因为进展常常被不确定的草稿和延迟的反馈衡量。在我们解决问题前，接下来一小时里，有什么能让你哪怕稳定 5%？",
    phaseLabels: {
      "Affect Validation & Empathy": "情绪确认与共情",
      "Scaling Question": "量表提问（1-10）",
      "Exception Finding": "例外发现",
      "Micro-Action Planning": "微行动计划",
    },
    affectLabels: {
      "Acute Hopelessness Signal": "急性无望信号",
      "Burnout Overload": "倦怠超载",
      "Imposter Distress": "冒名顶替困扰",
      "Perfectionistic Paralysis": "完美主义式卡住",
      "Perfectionistic Anxiety": "完美主义焦虑",
      "Advisor Feedback Threat": "导师反馈威胁感",
      "Academic Stress Activation": "学业压力激活",
    },
    agencyLabels: {
      Low: "低",
      Emerging: "正在形成",
      High: "高",
    },
  },
};
const suggestions = {
  en: [
    "I'm feeling stuck on Chapter 3",
    "My advisor gave tough feedback",
    "I cannot stop comparing myself to my cohort",
    "I keep procrastinating on revisions",
  ],
  zh: ["我卡在第三章了", "导师给了很重的反馈", "我总是和同届比较", "我一直拖延修改"],
};
const initialProtocol = {
  detected_affect: "Imposter Distress",
  sfbt_phase: "Affect Validation & Empathy",
  risk_score: 0.18,
  client_agency_level: "Emerging",
  conversational_response: "It makes sense that doctoral work can feel heavy when your progress is measured in uncertain drafts and delayed feedback. Before we problem-solve, what would help you feel even 5% more steady in the next hour?",
};
const state = {
  language: localStorage.getItem("mindbridge_language") || "en",
  messages: [{ id: 1, sender: "coach", text: initialProtocol.conversational_response, protocol: initialProtocol }],
  protocol: initialProtocol,
  source: "initial",
  locked: false,
  thinking: false,
};
const nodes = {};

function $(selector) {
  return document.querySelector(selector);
}

function countWords(text) {
  const clean = text.trim();
  if (!clean) return 0;
  const cjkCount = (clean.match(/[\u4e00-\u9fff]/g) || []).length;
  const latinText = clean.replace(/[\u4e00-\u9fff]/g, " ");
  const latinCount = (latinText.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)?/g) || []).length;
  return cjkCount + latinCount;
}

function includesAny(text, terms) {
  const lower = String(text || "").toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

function roundRisk(value) {
  return Math.max(0, Math.min(1, Math.round(value * 100) / 100));
}

function translateValue(group, value) {
  return copy[state.language][group]?.[value] || value;
}

function localizedProtocol(protocol) {
  return {
    detected_affect: translateValue("affectLabels", protocol.detected_affect),
    sfbt_phase: translateValue("phaseLabels", protocol.sfbt_phase),
    risk_score: protocol.risk_score,
    client_agency_level: translateValue("agencyLabels", protocol.client_agency_level),
    conversational_response: localizeCoachText({ sender: "coach", text: protocol.conversational_response, protocol }),
  };
}

function hasChinese(text) {
  return /[\u4e00-\u9fff]/.test(String(text || ""));
}

function localizeCoachText(message) {
  if (message.sender !== "coach" || !message.protocol) return message.text;
  if (message.id === 1 || message.protocol === initialProtocol) return translate("initialResponse");
  if (state.language === "zh" && !hasChinese(message.text)) {
    return buildResponse(message.protocol, message.prompt || "");
  }
  if (state.language === "en" && hasChinese(message.text)) {
    return buildResponse(message.protocol, message.prompt || "");
  }
  return message.text;
}

function buildResponse(protocol, text) {
  const affect = translateValue("affectLabels", protocol.detected_affect);
  if (protocol.risk_score > 0.7) {
    return state.language === "zh"
      ? "谢谢你把这句话说出来。这已经超出 coaching 模拟范围，我希望你现在立刻连接真实的人类支持。"
      : "I'm really glad you said this here. This is beyond a coaching moment, so I want you connected with immediate human support right now.";
  }
  if (protocol.sfbt_phase === "Scaling Question") {
    return state.language === "zh"
      ? `听起来“${affect}”让这件事不只是一个任务，而变得很沉重。如果 10 分表示你能迈出下一步，1 分表示完全卡住，你现在大概在几分？`
      : `It sounds like ${protocol.detected_affect.toLowerCase()} is making the work feel much heavier than one task. On a scale from 1 to 10, where 10 means you feel able to take the next academic step and 1 means completely paralyzed, where are you right now?`;
  }
  if (protocol.sfbt_phase === "Exception Finding") {
    return state.language === "zh"
      ? "我们找一个例外：最近有没有一个很小的时刻，你推进了一点点，或者没有完全被这个模式困住？"
      : "Let's look for evidence that this pattern is not total. Can you remember one recent moment, even a tiny one, when you moved the work forward or felt less trapped by it?";
  }
  if (protocol.sfbt_phase === "Micro-Action Planning") {
    return state.language === "zh"
      ? "我们把下一步刻意缩小：有没有一个 10 分钟内能完成的动作，可以减少回避，而且不需要你先有信心？"
      : "Let's make the next step deliberately small: what is one action you could complete in 10 minutes that would reduce avoidance without requiring confidence first?";
  }
  return state.language === "zh"
    ? `我听到你这句话里有很大的压力：“${text.slice(0, 48)}${text.length > 48 ? "..." : ""}”。在挑战想法前，我们先承认你正在承受的重量。`
    : `I hear how much pressure is sitting inside "${text.slice(0, 88)}${text.length > 88 ? "..." : ""}" Before we challenge the thought, let's validate the load you are carrying.`;
}

function evaluateOffline(text, turn) {
  const lower = text.toLowerCase();
  const crisis = includesAny(text, crisisTerms);
  const burnout = includesAny(lower, ["burnout", "exhausted", "tired", "overwhelmed", "sleep", "倦怠", "累", "睡"]);
  const imposter = includesAny(lower, ["imposter", "fraud", "not smart", "compare", "cohort", "冒名", "比较", "不够聪明"]);
  const procrastination = includesAny(lower, ["stuck", "procrastinat", "chapter", "revision", "draft", "卡", "拖延", "章节", "修改"]);
  const feedback = includesAny(lower, ["advisor", "feedback", "criticism", "revise", "导师", "反馈", "批评"]);
  const agencySignals = includesAny(lower, ["try", "can", "could", "next", "plan", "maybe", "会", "可以", "试", "计划", "下一步"]);
  const risk_score = roundRisk(
    crisis ? 0.92 : 0.12 + (burnout ? 0.16 : 0) + (imposter ? 0.08 : 0) + (procrastination ? 0.06 : 0),
  );
  const protocol = {
    detected_affect: crisis
      ? "Acute Hopelessness Signal"
      : burnout
        ? "Burnout Overload"
        : imposter
          ? "Imposter Distress"
          : procrastination
            ? "Perfectionistic Paralysis"
            : feedback
              ? "Advisor Feedback Threat"
              : "Academic Stress Activation",
    sfbt_phase: risk_score > 0.7 ? phases[0] : phases[Math.max(0, turn % phases.length)],
    risk_score,
    client_agency_level: risk_score > 0.7 ? "Low" : agencySignals ? "High" : turn > 2 ? "Emerging" : "Low",
    conversational_response: "",
  };
  protocol.conversational_response = buildResponse(protocol, text);
  return protocol;
}

function translate(key) {
  return copy[state.language][key] || key;
}

function renderLanguage() {
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = translate(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = state.locked ? translate("locked") : translate(node.dataset.i18nPlaceholder);
  });
  renderSuggestions();
  renderChat();
  renderDashboard();
}

function renderSuggestions() {
  nodes.suggestions.innerHTML = suggestions[state.language].map((item) => (
    `<button type="button" ${state.locked ? "disabled" : ""} data-suggestion="${item.replace(/"/g, "&quot;")}">${item}</button>`
  )).join("");
}

function renderChat() {
  nodes.chat.innerHTML = state.messages.map((message) => {
    const label = message.sender === "user" ? translate("userLabel") : translate("coachLabel");
    const phase = message.protocol ? `<small>${translateValue("phaseLabels", message.protocol.sfbt_phase)}</small>` : "";
    const text = localizeCoachText(message);
    return `<article class="bubble ${message.sender}">
      <div class="bubble-meta"><span>${label}</span>${phase}</div>
      <p>${text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]))}</p>
    </article>`;
  }).join("");
  nodes.chat.scrollTop = nodes.chat.scrollHeight;
}

function renderDashboard() {
  const protocol = state.protocol;
  const activeIndex = phases.indexOf(protocol.sfbt_phase);
  nodes.phaseList.innerHTML = phases.map((phase, index) => (
    `<div class="phase-step ${index <= activeIndex ? "active" : ""}">
      <span>${index + 1}</span>
      <p>${translateValue("phaseLabels", phase)}</p>
    </div>`
  )).join("");
  nodes.affect.textContent = translateValue("affectLabels", protocol.detected_affect);
  nodes.agency.textContent = translateValue("agencyLabels", protocol.client_agency_level);
  nodes.agencyBar.style.width = protocol.client_agency_level === "High" ? "92%" : protocol.client_agency_level === "Emerging" ? "58%" : "24%";
  nodes.riskValue.textContent = protocol.risk_score.toFixed(2);
  nodes.riskBar.style.width = `${protocol.risk_score * 100}%`;
  nodes.riskCard.classList.toggle("danger", state.locked || protocol.risk_score > 0.7);
  nodes.source.textContent = copy[state.language].source[state.source] || state.source;
  nodes.protocolJson.textContent = JSON.stringify(localizedProtocol(protocol), null, 2);
  nodes.safetyModal.hidden = !(state.locked || protocol.risk_score > 0.7);
  nodes.input.disabled = state.locked || state.thinking;
  nodes.send.disabled = state.locked || state.thinking || !nodes.input.value.trim();
  nodes.input.placeholder = state.locked ? translate("locked") : state.thinking ? translate("thinking") : translate("input");
  if (window.lucide) window.lucide.createIcons();
}

async function submitMessage(event) {
  event.preventDefault();
  const text = nodes.input.value.trim();
  if (!text || state.locked || state.thinking) return;

  state.messages.push({ id: Date.now(), sender: "user", text });
  nodes.input.value = "";
  state.thinking = true;
  renderChat();
  renderDashboard();

  try {
    const response = await fetch("/api/mindbridge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        language: state.language,
        history: state.messages.map((message) => ({ sender: message.sender, text: message.text })),
      }),
    });
    if (!response.ok) throw new Error("MindBridge API request failed");
    const payload = await response.json();
    if (!payload.protocol) throw new Error("MindBridge API response was empty");
    state.protocol = payload.protocol;
    state.source = payload.source || "mock";
  } catch {
    state.protocol = evaluateOffline(text, state.messages.length);
    state.source = "offline-fallback";
  }

  state.locked = state.protocol.risk_score > 0.7 || includesAny(text, crisisTerms);
  state.messages.push({
    id: Date.now() + 1,
    sender: "coach",
    text: state.protocol.conversational_response,
    prompt: text,
    protocol: state.protocol,
  });
  state.thinking = false;
  renderChat();
  renderDashboard();
}

function bind() {
  nodes.chat = $("[data-chat-history]");
  nodes.form = $("[data-chat-form]");
  nodes.input = $("[data-chat-input]");
  nodes.send = $("[data-send-button]");
  nodes.wordCount = $("[data-word-count]");
  nodes.suggestions = $("[data-suggestions]");
  nodes.phaseList = $("[data-phase-list]");
  nodes.affect = $("[data-affect]");
  nodes.agency = $("[data-agency]");
  nodes.agencyBar = $("[data-agency-bar]");
  nodes.riskCard = $("[data-risk-card]");
  nodes.riskValue = $("[data-risk-value]");
  nodes.riskBar = $("[data-risk-bar]");
  nodes.source = $("[data-source]");
  nodes.protocolJson = $("[data-protocol-json]");
  nodes.safetyModal = $("[data-safety-modal]");
  nodes.form.addEventListener("submit", submitMessage);
  nodes.input.addEventListener("input", () => {
    nodes.wordCount.textContent = countWords(nodes.input.value);
    renderDashboard();
  });
  nodes.suggestions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-suggestion]");
    if (!button || state.locked) return;
    nodes.input.value = button.dataset.suggestion;
    nodes.input.focus();
    nodes.wordCount.textContent = countWords(nodes.input.value);
    renderDashboard();
  });
  $("[data-language-toggle]").addEventListener("click", () => {
    state.language = state.language === "en" ? "zh" : "en";
    localStorage.setItem("mindbridge_language", state.language);
    renderLanguage();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bind();
  renderLanguage();
});
