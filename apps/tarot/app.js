const video = document.querySelector("#camera");
const canvas = document.querySelector("#overlay");
const ctx = canvas.getContext("2d");
const statusEl = document.querySelector("#cameraStatus");
const cameraGuideButton = document.querySelector("#cameraGuideButton");
const drawButton = document.querySelector("#drawButton");
const resetButton = document.querySelector("#resetButton");
const questionInput = document.querySelector("#question");
const readingQuestionInput = document.querySelector("#readingQuestion");
const questionPreview = document.querySelector("#questionPreview");
const readingCameraButton = document.querySelector("#readingCameraButton");
const readingEl = document.querySelector("#reading");
const deckOrbit = document.querySelector("#deckOrbit");
const deckTrack = document.querySelector("#deckTrack");
const screens = [...document.querySelectorAll(".guide-screen, .reader-screen")];

const majorArcana = [
  ["愚者", "The Fool", "0", "自由、冒险、信任直觉", "新的旅程已经打开，先行动再理解。", "轻率、逃避承诺", "sunrise", "✦", "#e7c76f", "#4f83a8"],
  ["魔术师", "The Magician", "I", "资源、表达、显化", "把手上的资源聚成一个清晰动作。", "分散、操控", "altar", "∞", "#d8b96a", "#9f5d78"],
  ["女祭司", "The High Priestess", "II", "潜意识、秘密、等待", "答案在安静处，不必急着向外确认。", "隐瞒、直觉失焦", "moon", "☾", "#8aa4d6", "#7562a9"],
  ["皇后", "The Empress", "III", "滋养、创造、丰盛", "让事情被照料，而不是被强行推动。", "过度付出、停滞", "garden", "✿", "#d8a067", "#74a56f"],
  ["皇帝", "The Emperor", "IV", "秩序、边界、责任", "清楚的边界会带来真正的安全感。", "控制、僵化", "throne", "♜", "#d79a5f", "#844c44"],
  ["教皇", "The Hierophant", "V", "传统、学习、承诺", "向成熟的方法借力，同时保留自己的判断。", "盲从、教条", "temple", "✚", "#d8b96a", "#6f7f9d"],
  ["恋人", "The Lovers", "VI", "选择、关系、价值一致", "真正的选择会让你的价值更完整地显现。", "犹豫、价值冲突", "union", "♡", "#d98aa0", "#789f73"],
  ["战车", "The Chariot", "VII", "意志、推进、方向", "把能量收束到一个方向，局势会开始前进。", "失控、急躁", "chariot", "⟡", "#83a8d6", "#d8b96a"],
  ["力量", "Strength", "VIII", "勇气、耐心、温柔掌控", "温柔地坚持，比用力压过局面更有力量。", "自我怀疑、过度压抑", "lion", "∞", "#e0b36c", "#9e6a58"],
  ["隐士", "The Hermit", "IX", "独处、寻找、内在灯火", "退后一步，你会看见更真实的线索。", "孤立、拒绝帮助", "lantern", "♢", "#b7c2a5", "#596d78"],
  ["命运之轮", "Wheel of Fortune", "X", "转机、周期、偶然", "风向正在换挡，观察节奏比硬推更重要。", "反复、抗拒变化", "wheel", "◎", "#d8b96a", "#6366a6"],
  ["正义", "Justice", "XI", "平衡、事实、因果", "回到事实本身，判断会从情绪里脱身。", "偏见、失衡", "scales", "⚖", "#e0c582", "#656f82"],
  ["倒吊人", "The Hanged Man", "XII", "暂停、换视角、臣服", "停顿不是失败，它在替你转换视角。", "拖延、无谓牺牲", "suspended", "▽", "#88b6a0", "#61768d"],
  ["死神", "Death", "XIII", "结束、更新、放手", "旧形态已经完成使命，告别会带来空间。", "执念、害怕结束", "reaper", "✕", "#c4c0b6", "#5a5262"],
  ["节制", "Temperance", "XIV", "调和、疗愈、节奏", "答案在两端之间，慢慢调配会更可靠。", "失衡、急于求成", "vessels", "♒", "#9fc6c4", "#b58a61"],
  ["恶魔", "The Devil", "XV", "欲望、束缚、清醒", "看见自己被什么牵住，便已经开始松绑。", "沉迷、被诱惑牵引", "chains", "♆", "#b45d62", "#5c4656"],
  ["塔", "The Tower", "XVI", "震动、真相、重建", "突然的破裂会暴露需要重建的地基。", "抗拒真相、危机升级", "tower", "⚡", "#d8b96a", "#5f6477"],
  ["星星", "The Star", "XVII", "希望、灵感、恢复", "微小但持续的亮光，正在修复你对未来的信任。", "失望、灵感枯竭", "star", "☆", "#a5c7ef", "#5d7fae"],
  ["月亮", "The Moon", "XVIII", "不确定、梦境、投射", "眼前有雾，先别把恐惧当作预言。", "混乱、误判", "lunar", "☽", "#b59cdc", "#607095"],
  ["太阳", "The Sun", "XIX", "清晰、喜悦、生命力", "把事情带到光下，坦率会让下一步变简单。", "过度乐观、忽视细节", "sun", "☉", "#e7c76f", "#e0945f"],
  ["审判", "Judgement", "XX", "召唤、复盘、重启", "你正被邀请回应更真实版本的自己。", "迟疑、旧账未清", "trumpet", "♬", "#d8b96a", "#7fa9a0"],
  ["世界", "The World", "XXI", "完成、整合、抵达", "一个阶段正在收束，庆祝之后再进入新的入口。", "未完成、循环未合", "world", "◌", "#d8b96a", "#7e9d8a"],
];

const suitInfo = {
  wands: ["权杖", "火", "行动、欲望、创造力", "♣", "#d79a5f", "#9b5142", "Wands"],
  cups: ["圣杯", "水", "情感、关系、疗愈", "♥", "#8fb9d8", "#9e6f9f", "Cups"],
  swords: ["宝剑", "风", "思想、沟通、判断", "♦", "#a8bdd8", "#59687f", "Swords"],
  pentacles: ["星币", "土", "资源、身体、现实", "●", "#a9bd76", "#6b7d52", "Pents"],
};

const rankInfo = [
  ["王牌", "A", "种子正在出现，先保护它的可能性。", "尚未落地、起点不稳"],
  ["二", "II", "两股力量正在对照，选择需要更清楚。", "犹豫、拉扯"],
  ["三", "III", "合作与扩张开始显形，别独自扛完。", "配合不足、期待落差"],
  ["四", "IV", "结构正在建立，也要避免把自己锁住。", "保守、停滞"],
  ["五", "V", "摩擦暴露真实需求，冲突里有信息。", "内耗、损耗"],
  ["六", "VI", "能量回流，支持与善意正在出现。", "旧模式、依赖"],
  ["七", "VII", "你需要守住位置，也要评估值不值得。", "防御过度、消耗"],
  ["八", "VIII", "速度加快，信息与行动会连续到来。", "急躁、失序"],
  ["九", "IX", "成果接近完成，最后阶段要照顾体力。", "疲惫、紧绷"],
  ["十", "X", "一个周期到达顶点，下一步是卸下多余负担。", "过载、结束困难"],
  ["侍从", "Page", "新的学习开始，保持好奇比装作成熟更有用。", "幼稚、信息不足"],
  ["骑士", "Knight", "能量正在推进，但方向感比速度重要。", "鲁莽、焦虑"],
  ["皇后", "Queen", "成熟的感受力会让资源自然聚拢。", "情绪化、过度照顾"],
  ["国王", "King", "把经验转成稳定的决策，你可以掌舵。", "强势、失去弹性"],
];

const tarotDeck = [
  ...majorArcana.map(([name, en, roman, keywords, message, shadow, scene, symbol, gold, accent], index) => ({
    name,
    en,
    roman,
    keywords,
    message,
    shadow,
    scene,
    symbol,
    gold,
    accent,
    arcana: "major",
    imageFile: `RWS Tarot ${String(index).padStart(2, "0")} ${en.replace("The ", "")}.jpg`,
  })),
  ...Object.entries(suitInfo).flatMap(([suit, [suitName, element, domain, symbol, gold, accent, filePrefix]]) =>
    rankInfo.map(([rank, roman, message, shadow], index) => ({
      name: `${suitName}${rank}`,
      en: `${rank} of ${suitName}`,
      roman,
      keywords: `${element}元素、${domain}`,
      message,
      shadow,
      scene: suit,
      symbol,
      gold,
      accent,
      arcana: "minor",
      suit,
      pipCount: Math.min(index + 1, 10),
      court: index > 9,
      imageFile: `${filePrefix}${String(index + 1).padStart(2, "0")}.jpg`,
    })),
  ),
];

const majorFileNames = {
  "命运之轮": "RWS Tarot 10 Wheel of Fortune.jpg",
  "倒吊人": "RWS Tarot 12 Hanged Man.jpg",
};

const visualDetails = {
  愚者: "维特牌面里，旅人站在悬崖边，白犬提醒他保持觉察。它不是盲目前进，而是带着天真的勇气迈入未知。",
  魔术师: "桌上的四元素工具说明你不是空手开始，头顶无限符号提示意志与专注会把资源转成现实。",
  女祭司: "女祭司坐在黑白柱之间，帷幕后是尚未揭开的真相。她要求你先听见潜意识，而不是急着问外界。",
  皇后: "皇后身处丰盛自然，象征滋养、身体感和创造力。牌面提醒你让事情生长，而不是只用脑袋控制。",
  皇帝: "皇帝坐在石质王座上，羊首象征意志与结构。它强调边界、责任和现实秩序。",
  教皇: "教皇在两根柱子前传授仪式与信念，表示传统、承诺、学习系统，也可能提示你正在寻求一种被认可的答案。",
  恋人: "恋人牌里的天使、太阳和两个人物，强调选择背后的价值一致，而不只是浪漫吸引。",
  战车: "战车前的黑白斯芬克斯象征两股力量，真正的胜利来自方向感，而不是蛮力。",
  力量: "女人轻抚狮子，说明柔软的掌控比压制更强。它问你能否不失温柔地保持坚定。",
  隐士: "隐士举灯独行，灯里是六芒星的智慧。它提示答案需要安静、距离和成熟观察。",
  命运之轮: "轮盘、天使与四圣兽同时出现，说明事件处在周期变化中。你能控制的是回应方式，不是整阵风。",
  正义: "天平与剑共同出现，代表事实、判断和因果。它要求你把感觉与证据分开。",
  倒吊人: "倒吊者头部发光，说明换个角度会产生新的领悟。暂停在这里不是惩罚，而是转化。",
  死神: "死神骑马而来，前方有太阳升起。牌面讲的是旧阶段结束后，新生命才有入口。",
  节制: "天使在两杯之间倒水，象征调配、疗愈和节奏。它提醒你把两端能量慢慢合成。",
  恶魔: "锁链松松挂在人物颈上，说明束缚常常来自未被看见的欲望与恐惧。",
  塔: "闪电击中高塔，旧结构被迫崩开。它带来震动，也带来真相。",
  星星: "裸身女子向水与土地倾倒生命之水，表示疗愈、希望和重新信任未来。",
  月亮: "月下小径穿过犬、狼和水中生物，说明本能、恐惧和潜意识正在影响判断。",
  太阳: "孩子骑白马在太阳下前进，代表清晰、生命力和坦诚带来的轻松。",
  审判: "号角唤醒沉睡的人，表示复盘、回应召唤和重新站起来。",
  世界: "花环中的舞者完成一个循环，四角圣兽守护整合。它是完成，也是新阶段前的门。",
};

function cardImageUrl(card, width = 520) {
  const file = majorFileNames[card.name] || card.imageFile;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${file.replaceAll(" ", "_")}?width=${width}`;
}

function visualDetail(card) {
  if (visualDetails[card.name]) return visualDetails[card.name];
  const suit = card.suit === "cups" ? "圣杯牌面把情感、记忆和关系需求画得很具体"
    : card.suit === "wands" ? "权杖牌面强调行动姿态、火元素与推动局面的意志"
      : card.suit === "swords" ? "宝剑牌面常出现风、剑与人物姿态，指向思想、沟通和心理压力"
        : "星币牌面落在身体、资源、工作与现实安全感";
  const rank = card.court ? "宫廷牌显示一种人物能量：你可能在扮演这个角色，也可能正遇见这样的人。"
    : `数字 ${card.roman} 说明这股能量正处在一个具体阶段，不是抽象命运，而是可以被调整的生活细节。`;
  return `${suit}。${rank}`;
}

const positions = ["过去的影响", "现在的能量", "下一步指引"];

let hasDrawn = false;
let camera = null;
let hands = null;
let fistStartedAt = 0;
let activeGesture = "idle";
let deckRendered = false;
let drawTimer = null;

function showScreen(id) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === id);
  });
  if (id === "screenReading") {
    if (!deckRendered) renderDeckBelt();
    if (readingQuestionInput && !readingQuestionInput.value.trim()) {
      readingQuestionInput.value = questionInput.value.trim();
    }
    const q = getQuestion();
    questionPreview.textContent = q || "你还没有输入问题，系统会给整体能量解读";
    requestAnimationFrame(resizeCanvas);
  }
}

function setStatus(message) {
  statusEl.textContent = message;
}

function getQuestion() {
  return (readingQuestionInput?.value || questionInput.value || "").trim();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function resizeCanvas() {
  const rect = video.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width));
  canvas.height = Math.max(1, Math.floor(rect.height));
}

function isFingerFolded(tip, pip, wrist) {
  const tipToWrist = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
  const pipToWrist = Math.hypot(pip.x - wrist.x, pip.y - wrist.y);
  return tipToWrist < pipToWrist * 1.06;
}

function isFist(landmarks) {
  const wrist = landmarks[0];
  const fingers = [[8, 6], [12, 10], [16, 14], [20, 18]];
  const folded = fingers.filter(([tip, pip]) => isFingerFolded(landmarks[tip], landmarks[pip], wrist)).length;
  const thumbNearPalm = Math.hypot(landmarks[4].x - landmarks[9].x, landmarks[4].y - landmarks[9].y) < 0.18;
  return folded >= 3 && thumbNearPalm;
}

function isOpenHand(landmarks) {
  const wrist = landmarks[0];
  const fingers = [[8, 6], [12, 10], [16, 14], [20, 18]];
  const extended = fingers.filter(([tip, pip]) => {
    const tipToWrist = Math.hypot(landmarks[tip].x - wrist.x, landmarks[tip].y - wrist.y);
    const pipToWrist = Math.hypot(landmarks[pip].x - wrist.x, landmarks[pip].y - wrist.y);
    return tipToWrist > pipToWrist * 1.14;
  }).length;
  return extended >= 4;
}

function setGestureState(state) {
  if (activeGesture === state) return;
  activeGesture = state;
  deckOrbit.classList.toggle("hand-open", state === "open");
  deckOrbit.classList.toggle("hand-fist", state === "fist");
}

function onHandResults(results) {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!results.multiHandLandmarks?.length || hasDrawn) {
    fistStartedAt = 0;
    setGestureState("idle");
    return;
  }

  const landmarks = results.multiHandLandmarks[0];
  if (window.drawConnectors && window.HAND_CONNECTIONS) {
    drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: "rgba(216,185,106,.72)", lineWidth: 2 });
    drawLandmarks(ctx, landmarks, { color: "rgba(245,239,227,.9)", lineWidth: 1, radius: 2 });
  }

  if (isFist(landmarks)) {
    setGestureState("fist");
    fistStartedAt ||= performance.now();
    const held = performance.now() - fistStartedAt;
    setStatus(`检测到攥拳，牌阵正在锁定：${(Math.max(0, 1000 - held) / 1000).toFixed(1)} 秒`);
    if (held >= 1000) drawCards("fist");
    return;
  }

  fistStartedAt = 0;
  if (isOpenHand(landmarks)) {
    setGestureState("open");
    setStatus("检测到张手，全部塔罗牌加速旋转。攥拳即可抽出三张。");
  } else {
    setGestureState("idle");
    setStatus("张手加速旋转，攥拳 1 秒抽出三张牌。");
  }
}

async function startCamera() {
  hasDrawn = false;
  deckOrbit.classList.add("is-shuffling");
  setStatus("正在请求摄像头权限...");

  try {
    if (window.self !== window.top) {
      throw new Error("摄像头手势建议在独立页面打开。请点击作品入口后新页面使用，或复制当前链接到浏览器地址栏。");
    }
    if (!window.Hands || !window.Camera) {
      throw new Error("手势模型还没有加载完成，请稍后重试。");
    }

    hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.68,
      minTrackingConfidence: 0.62,
    });
    hands.onResults(onHandResults);

    camera = new Camera(video, {
      onFrame: async () => {
        if (!hasDrawn) await hands.send({ image: video });
      },
      width: 960,
      height: 720,
    });
    await camera.start();
    cameraGuideButton.textContent = "摄像头已开启";
    setStatus("张手加速旋转，攥拳 1 秒抽出三张牌。");
    showScreen("screenQuestion");
  } catch (error) {
    cameraGuideButton.textContent = "摄像头暂不可用";
    setStatus(`摄像头或手势模型不可用：${error.message} 也可以点“抽三张牌”手动体验。`);
    showScreen("screenQuestion");
  }
}

function randomUnit() {
  return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
}

function pickCards() {
  return [...tarotDeck]
    .map((card) => ({ card, sort: randomUnit() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, 3)
    .map(({ card }) => ({
      ...card,
      reversed: crypto.getRandomValues(new Uint8Array(1))[0] > 174,
    }));
}

function cardFace(card, size = "compact") {
  return `
    <div class="face ${size} scene-${card.scene}" style="--gold:${card.gold};--accent:${card.accent}">
      <img class="rws-image" src="${cardImageUrl(card, size === "large" ? 760 : 260)}" alt="${card.name} Rider-Waite-Smith tarot card" loading="${size === "large" ? "eager" : "lazy"}" />
      <div class="holo-sheen"></div>
      <div class="corner top">${card.roman}</div>
      <div class="corner bottom">${card.roman}</div>
      <div class="inner-frame"></div>
      <div class="card-title">
        <strong>${card.name}</strong>
        <em>${card.en}</em>
      </div>
    </div>
  `;
}

function renderDeckBelt() {
  if (deckRendered) return;
  const belt = [...tarotDeck, ...tarotDeck].map((card, index) => `
    <article class="carousel-card" style="--delay:${index % tarotDeck.length};--gold:${card.gold};--accent:${card.accent}">
      ${cardFace(card, "compact")}
    </article>
  `).join("");
  deckTrack.innerHTML = belt;
  deckRendered = true;
}

function questionTone(question) {
  if (/爱|感情|关系|复合|喜欢|恋|婚|暧昧/.test(question)) return "关系";
  if (/工作|事业|钱|收入|offer|项目|职场|创业|学业/.test(question)) return "现实推进";
  if (/选择|要不要|是否|该不该|决定|还是/.test(question)) return "选择";
  if (/我|自己|成长|状态|未来|方向|焦虑|迷茫/.test(question)) return "自我状态";
  return "整体能量";
}

function analyzeQuestion(question) {
  const raw = question.trim();
  const tone = questionTone(raw);
  const timeframe = raw.match(/今天|明天|这周|本周|下周|这个月|未来一个月|三个月|半年|一年/)?.[0] || "接下来一段时间";
  const asksOutcome = /会不会|能不能|有没有|是否|结果|发展|未来|走向/.test(raw);
  const asksAction = /怎么办|如何|怎样|怎么|该不该|要不要|建议/.test(raw);
  const object = tone === "关系" ? "这段关系"
    : tone === "现实推进" ? "这件现实事务"
      : tone === "选择" ? "这个选择"
        : tone === "自我状态" ? "你的内在状态"
          : "你问的这件事";
  return {
    raw: raw || "这次抽牌",
    tone,
    timeframe,
    asksOutcome,
    asksAction,
    object,
  };
}

function synthesizeAnswer(cards, analysis) {
  const [past, present, future] = cards;
  const pressure = cards.filter((card) => card.reversed || /塔|死神|恶魔|月亮|宝剑/.test(card.name)).length;
  const support = cards.filter((card) => /太阳|星星|节制|世界|皇后|圣杯|星币/.test(card.name) && !card.reversed).length;
  const direction = support > pressure ? "整体不是坏牌，趋势偏向可以被修复、澄清或慢慢推进"
    : pressure > support ? "牌面显示阻力比较明显，这件事暂时不适合只靠期待往前推"
      : "牌面呈现出一半吸引、一半阻力的状态，关键会落在你接下来的选择";
  const direct = analysis.asksAction
    ? `所以如果你问“我该怎么做”，答案不是马上用力推进，而是先按「${present.name}」的主题处理当下最真实的卡点，再用「${future.name}」的方式行动。`
    : analysis.asksOutcome
      ? `所以如果你问“会怎样发展”，更准确的回答是：${analysis.timeframe}里它会沿着「${present.name}」到「${future.name}」的能量移动，不是完全静止，但也不是无条件顺利。`
      : `所以这次牌更像是在替你把问题拆开：过去由「${past.name}」影响，现在被「${present.name}」卡住或推动，下一步需要借用「${future.name}」的策略。`;
  return `${direction}。${direct}`;
}

function buildDeepReading(cards, question) {
  const analysis = analyzeQuestion(question);
  const tone = analysis.tone;
  const q = escapeHtml(analysis.raw);
  const [past, present, future] = cards;
  const reversedCount = cards.filter((card) => card.reversed).length;
  const arcanaCount = cards.filter((card) => card.arcana === "major").length;
  const directAnswer = synthesizeAnswer(cards, analysis);
  const toneAdvice = {
    关系: "关系题的核心不是立刻得到对方的确定答案，而是看见你在关系里如何保护自己、表达需求、承担选择。先把边界说清楚，再判断对方是否愿意同频回应。",
    现实推进: "现实事务需要落地动作。把目标拆成可验证的三步：今天能开始的动作、本周能交付的结果、必须向谁确认的信息。",
    选择: "这组牌建议你先排价值顺序。哪个选项让你更接近长期想成为的人，哪个选项只是短期缓解不安，答案会因此变得清楚。",
    自我状态: "你现在更需要理解自己的能量流向，而不是逼自己马上稳定。把注意力放回身体、节奏和真实欲望，行动会自然浮出来。",
    整体能量: "这组牌更像一次能量扫描：它不替你决定命运，而是把当下最值得看见的模式照亮。",
  }[tone];

  return `
    <div class="interpretation deep-reading">
      <h2>给「${q}」的深度解读</h2>
      <p><b>先直接回答你：</b>${directAnswer} 我会把这组三张牌当成一段动态过程，而不是一句“好/不好”的结论来看。</p>
      <p><b>我读到的问题类型：</b>你的问题更接近「${tone}」，时间感落在「${analysis.timeframe}」。这意味着解读重点不是抽象命运，而是 ${analysis.object} 在这个阶段的能量、阻力和可行动位置。</p>
      <p><b>整体牌势：</b>${arcanaCount ? `这组三张里有 ${arcanaCount} 张大阿尔卡那，说明你的问题背后不只是一个表面事件，而牵动了更深的成长主题、关系模式或人生阶段转换。` : "三张牌都落在小阿尔卡那，说明答案会通过现实生活里的具体行动、沟通、节奏和选择慢慢显现。"}${reversedCount ? `同时出现 ${reversedCount} 张逆位，表示能量不是不能走，而是中间有阻塞：可能是害怕、期待过高、信息不完整，或某个旧习惯还在拖住你。` : "牌面整体顺行，代表能量相对流畅，只要你愿意把看见的讯息落到行动里，事情会更容易往前走。"}</p>
      <p><b>${positions[0]} · ${past.name}${past.reversed ? "逆位" : "正位"}：</b>${past.reversed ? past.shadow : past.message} 这张牌说明过去的影响并没有完全消失，它像一个背景音，正在决定你现在如何理解这件事、如何期待别人回应、又如何保护自己。</p>
      <p><b>牌面细节：</b>${visualDetail(past)} 放在过去位时，它提醒你回头看：你不是突然走到这里的，之前的经验已经在你心里形成了一套判断方式。</p>
      <p><b>${positions[1]} · ${present.name}${present.reversed ? "逆位" : "正位"}：</b>${present.reversed ? present.shadow : present.message} 这是现在位，也是整组牌最有重量的位置。它显示你此刻真正面对的不是“结果会怎样”，而是你在当下是否能诚实看见自己的需求、恐惧和可用资源。</p>
      <p><b>牌面细节：</b>${visualDetail(present)} 放在现在位时，它要求你把注意力从猜测未来拉回此刻：哪些信息是真的，哪些只是你脑内补全的剧情。</p>
      <p><b>${positions[2]} · ${future.name}${future.reversed ? "逆位" : "正位"}：</b>${future.reversed ? future.shadow : future.message} 未来位不是命令式结局，而是一条趋势线：如果你继续沿着现在的能量行动，它会把你带向这个主题。你仍然可以通过选择改变走法。</p>
      <p><b>牌面细节：</b>${visualDetail(future)} 放在指引位时，它更像一盏路灯，告诉你下一步应该用哪一种姿态进入，而不是替你决定命运。</p>
      <p><b>针对你的问题：</b>${toneAdvice} 如果你问的是一个人、一段关系或一个机会，这组三张更建议你观察“对方真实行动”和“你自己的身体感受”是否一致。不要只听承诺，也不要只听焦虑。</p>
      <p><b>更深一层：</b>这组三张牌共同在问你：你真正想要的是确定感，还是一个能让你安心做自己的局面？如果你只是追逐确定感，任何答案都会很快变得不够；如果你开始建立内在秩序，你会更容易看清谁、什么事、哪条路值得你继续投入。</p>
      <p><b>行动建议：</b>接下来 24 小时内，做一件很小但明确的事：发出一次清楚沟通、整理一条事实线索、写下你的底线，或停止一个反复消耗你的猜测。塔罗给你的不是审判，而是让你把模糊的感受变成能握住的方向。</p>
    </div>
  `;
}

function markdownToHtml(markdown) {
  return escapeHtml(markdown)
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h3>$1</h3>")
    .replace(/^# (.*)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .split(/\n{2,}/)
    .map((block) => {
      if (block.startsWith("<h3>")) return block;
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

function cardsForApi(cards) {
  return cards.map((card) => ({
    name: card.name,
    reversed: card.reversed,
    keywords: card.keywords,
    meaning: card.reversed ? card.shadow : card.message,
  }));
}

async function fetchAIReading(cards) {
  const response = await fetch("/api/tarot-reading", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: getQuestion(),
      cards: cardsForApi(cards),
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.detail || payload?.error || "AI 解读接口暂时不可用");
  }
  return payload;
}

function renderSelectionRitual(cards) {
  const selectedHtml = cards.map((card, index) => `
    <article class="selected-card selected-${index + 1}" style="--gold:${card.gold};--accent:${card.accent}">
      <div class="selected-inner">
        <div class="card-back">
          <span></span>
        </div>
        <div class="selected-front">
          ${cardFace(card, "large")}
        </div>
      </div>
    </article>
  `).join("");

  return `
    <div class="selection-ritual">
      <div class="smoke-field"></div>
      <div class="deck-source">
        <i></i><i></i><i></i><i></i><i></i>
      </div>
      <div class="selected-spread">${selectedHtml}</div>
      <p>三张牌正在从牌堆中显现</p>
    </div>
  `;
}

function renderCardResults(cards, readingHtml, meta = "") {
  const cardHtml = cards.map((card, index) => `
    <article class="tarot-card ${card.reversed ? "is-reversed" : ""}" style="--gold:${card.gold};--accent:${card.accent}">
      ${cardFace(card, "large")}
      <div class="tarot-body">
        <small>${positions[index]} · ${card.reversed ? "逆位" : "正位"}</small>
        <h2>${card.name}</h2>
        <p>${card.keywords}。${card.reversed ? card.shadow : card.message}</p>
      </div>
    </article>
  `).join("");

  readingEl.innerHTML = `
    <div class="cards">${cardHtml}</div>
    <div class="interpretation deep-reading ai-reading">
      ${meta ? `<div class="ai-meta">${meta}</div>` : ""}
      ${readingHtml}
    </div>
  `;
}

function renderAIReadingLoading(cards) {
  renderCardResults(cards, `
    <h2>DeepSeek 正在读取你的问题</h2>
    <p>三张牌已经翻开。系统正在把你的问题、牌位、正逆位和维特牌面象征发送给 DeepSeek，生成更贴近你问题的解读。</p>
    <div class="ai-loader"><span></span><span></span><span></span></div>
  `, "AI reading · DeepSeek");
}

async function renderFinalReading(cards) {
  renderAIReadingLoading(cards);
  try {
    const payload = await fetchAIReading(cards);
    renderCardResults(cards, markdownToHtml(payload.reading), `AI reading · ${payload.provider || "deepseek"} · ${payload.model || "deepseek-chat"}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const apiHint = /DEEPSEEK_API_KEY|environment variable/i.test(message)
      ? "线上 DeepSeek API 还没有连接环境变量。牌已经正常抽出，下面先显示本地备用解读；配置好 DeepSeek 后会自动恢复 AI 深度解读。"
      : message;
    renderCardResults(cards, `
      <h2>本地备用解读</h2>
      <p><b>AI 接口暂时没有返回：</b>${escapeHtml(apiHint)}</p>
      ${buildDeepReading(cards, getQuestion())}
    `, "Local fallback · DeepSeek unavailable");
  }
}

function drawCards(source = "manual") {
  if (hasDrawn) return;
  hasDrawn = true;
  fistStartedAt = 0;
  setGestureState("idle");
  deckOrbit.classList.remove("is-shuffling", "hand-open", "hand-fist");
  deckOrbit.classList.add("locked");
  setStatus(source === "fist" ? "攥拳锁定，三张牌正在翻开。" : "三张牌正在从牌堆中翻开。");

  const cards = pickCards();
  readingEl.innerHTML = renderSelectionRitual(cards);
  readingEl.scrollIntoView({ behavior: "smooth", block: "start" });
  window.clearTimeout(drawTimer);
  drawTimer = window.setTimeout(() => {
    setStatus(source === "fist" ? "攥拳锁定，三张牌已抽出。" : "已手动停止，三张牌已抽出。");
    renderFinalReading(cards);
  }, 3100);
}

function resetReading() {
  hasDrawn = false;
  window.clearTimeout(drawTimer);
  fistStartedAt = 0;
  setGestureState("idle");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  deckOrbit.classList.add("is-shuffling");
  deckOrbit.classList.remove("locked", "hand-open", "hand-fist");
  setStatus(camera ? "重新洗牌中。张手加速，攥拳 1 秒抽出三张牌。" : "准备打开摄像头");
  readingEl.innerHTML = `
    <div class="reading__empty">
      <span></span>
      <p>抽出的三张牌会在这里展开。</p>
    </div>
  `;
  showScreen("screenQuestion");
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.next));
});

document.querySelectorAll("[data-prev]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.prev));
});

cameraGuideButton.addEventListener("click", startCamera);
readingCameraButton.addEventListener("click", startCamera);
drawButton.addEventListener("click", () => drawCards("manual"));
resetButton.addEventListener("click", resetReading);
readingQuestionInput.addEventListener("input", () => {
  questionInput.value = readingQuestionInput.value;
  questionPreview.textContent = getQuestion() || "你还没有输入问题，系统会给整体能量解读";
});
questionInput.addEventListener("input", () => {
  if (readingQuestionInput) readingQuestionInput.value = questionInput.value;
});
window.addEventListener("resize", resizeCanvas);
