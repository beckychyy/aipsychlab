import { readLocalEnv } from "./lib/tarot-auth.js";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const PHASES = [
  "Affect Validation & Empathy",
  "Scaling Question",
  "Exception Finding",
  "Micro-Action Planning",
];
const AGENCY = ["Low", "Emerging", "High"];
const CRISIS_TERMS = [
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

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

function roundRisk(value) {
  return Math.max(0, Math.min(1, Math.round(value * 100) / 100));
}

function includesAny(text, terms) {
  const lower = String(text || "").toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function coerceProtocol(candidate) {
  if (!candidate || typeof candidate !== "object") return null;
  const protocol = {
    detected_affect: candidate.detected_affect,
    sfbt_phase: candidate.sfbt_phase,
    risk_score: candidate.risk_score,
    client_agency_level: candidate.client_agency_level,
    conversational_response: candidate.conversational_response,
  };

  if (
    typeof protocol.detected_affect !== "string" ||
    !PHASES.includes(protocol.sfbt_phase) ||
    typeof protocol.risk_score !== "number" ||
    protocol.risk_score < 0 ||
    protocol.risk_score > 1 ||
    !AGENCY.includes(protocol.client_agency_level) ||
    typeof protocol.conversational_response !== "string"
  ) {
    return null;
  }

  return {
    ...protocol,
    risk_score: roundRisk(protocol.risk_score),
  };
}

function buildEnglishResponse(state, text) {
  if (state.risk_score > 0.7) {
    return "I'm really glad you said this here. This is beyond a coaching moment, so I want you connected with immediate human support right now.";
  }
  if (state.sfbt_phase === "Scaling Question") {
    return `It sounds like ${state.detected_affect.toLowerCase()} is making the work feel much heavier than one task. On a scale from 1 to 10, where 10 means you feel able to take the next academic step and 1 means completely paralyzed, where are you right now?`;
  }
  if (state.sfbt_phase === "Exception Finding") {
    return "Let's look for evidence that this pattern is not total. Can you remember one recent moment, even a tiny one, when you moved the work forward or felt less trapped by it?";
  }
  if (state.sfbt_phase === "Micro-Action Planning") {
    return "Let's make the next step deliberately small: what is one action you could complete in 10 minutes that would reduce avoidance without requiring confidence first?";
  }
  return `I hear how much pressure is sitting inside "${text.slice(0, 88)}${text.length > 88 ? "..." : ""}" Before we challenge the thought, let's validate the load you are carrying.`;
}

function buildChineseResponse(state, text) {
  if (state.risk_score > 0.7) {
    return "谢谢你把这句话说出来。这已经超出 coaching 模拟范围，我希望你现在立刻连接真实的人类支持。";
  }
  if (state.sfbt_phase === "Scaling Question") {
    return `听起来 ${state.detected_affect} 让这件事不只是一个任务，而变得很沉重。如果 10 分表示你能迈出下一步，1 分表示完全卡住，你现在大概在几分？`;
  }
  if (state.sfbt_phase === "Exception Finding") {
    return "我们找一个例外：最近有没有一个很小的时刻，你推进了一点点，或者没有完全被这个模式困住？";
  }
  if (state.sfbt_phase === "Micro-Action Planning") {
    return "我们把下一步刻意缩小：有没有一个 10 分钟内能完成的动作，可以减少回避，而且不需要你先有信心？";
  }
  return `我听到你这句话里有很大的压力：“${text.slice(0, 48)}${text.length > 48 ? "..." : ""}”。在挑战想法前，我们先承认你正在承受的重量。`;
}

function evaluateMock(text, turn, language) {
  const lower = text.toLowerCase();
  const crisis = includesAny(text, CRISIS_TERMS);
  const burnout = includesAny(lower, ["burnout", "exhausted", "tired", "overwhelmed", "sleep", "倦怠", "累", "睡"]);
  const imposter = includesAny(lower, ["imposter", "fraud", "not smart", "compare", "cohort", "冒名", "比较", "不够聪明"]);
  const procrastination = includesAny(lower, ["stuck", "procrastinat", "chapter", "revision", "draft", "卡", "拖延", "章节", "修改"]);
  const feedback = includesAny(lower, ["advisor", "feedback", "criticism", "revise", "导师", "反馈", "批评"]);
  const agencySignals = includesAny(lower, ["try", "can", "could", "next", "plan", "maybe", "会", "可以", "试", "计划", "下一步"]);
  const risk_score = roundRisk(
    crisis ? 0.92 : 0.12 + (burnout ? 0.16 : 0) + (imposter ? 0.08 : 0) + (procrastination ? 0.06 : 0),
  );
  const sfbt_phase = risk_score > 0.7 ? PHASES[0] : PHASES[Math.max(0, turn % PHASES.length)];
  const detected_affect = crisis
    ? "Acute Hopelessness Signal"
    : burnout
      ? "Burnout Overload"
      : imposter
        ? "Imposter Distress"
        : procrastination
          ? "Perfectionistic Paralysis"
          : feedback
            ? "Advisor Feedback Threat"
            : "Academic Stress Activation";
  const state = { detected_affect, sfbt_phase, risk_score };

  return {
    detected_affect,
    sfbt_phase,
    risk_score,
    client_agency_level: risk_score > 0.7 ? "Low" : agencySignals ? "High" : turn > 2 ? "Emerging" : "Low",
    conversational_response: language === "zh" ? buildChineseResponse(state, text) : buildEnglishResponse(state, text),
  };
}

async function evaluateWithDeepSeek(message, language, history) {
  const apiKey = process.env.DEEPSEEK_API_KEY || await readLocalEnv("DEEPSEEK_API_KEY");
  if (!apiKey) return null;

  const configuredModel = process.env.DEEPSEEK_MODEL || await readLocalEnv("DEEPSEEK_MODEL") || "";
  const model = ["deepseek-chat", "deepseek-reasoner"].includes(configuredModel)
    ? "deepseek-v4-flash"
    : configuredModel || "deepseek-v4-flash";
  const response = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: `You are MindBridge AI, a psychoeducational graduate-student resilience simulator. Use Solution-Focused Brief Therapy and CBT-informed coaching. This is not medical diagnosis or therapy. Assess academic burnout, imposter distress, procrastination, student agency, SFBT phase, and risk. If crisis risk appears, keep the response brief and direct the user to immediate human support. Return only valid JSON and no markdown.

Use the requested language for conversational_response: if language is "zh", write fluent Simplified Chinese; if language is "en", write English. Keep sfbt_phase and client_agency_level exactly in the allowed English enum values so the interface can localize them safely.

The JSON object must have exactly this shape:
{
  "detected_affect": "Perfectionistic Anxiety",
  "sfbt_phase": "Scaling Question",
  "risk_score": 0.2,
  "client_agency_level": "Emerging",
  "conversational_response": "It sounds like you are carrying a massive amount of weight around this submission. On a scale of 1 to 10, where 10 is feeling fully confident and 1 is feeling completely paralyzed, where would you say you are right now?"
}

Allowed sfbt_phase values: ${PHASES.join(", ")}.
Allowed client_agency_level values: ${AGENCY.join(", ")}.
risk_score must be a number from 0 to 1.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            language,
            latest_student_message: message,
            recent_history: Array.isArray(history) ? history.slice(-8) : [],
          }),
        },
      ],
      response_format: { type: "json_object" },
      thinking: { type: "disabled" },
      max_tokens: 900,
      stream: false,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || `DeepSeek request failed with ${response.status}`);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") throw new Error("DeepSeek response did not include content");
  return coerceProtocol(JSON.parse(text));
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  let body;
  try {
    body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
  } catch {
    sendJson(response, 400, { error: "Invalid JSON body" });
    return;
  }

  const message = String(body?.message || "").trim().slice(0, 1600);
  const language = body?.language === "zh" ? "zh" : "en";
  const history = Array.isArray(body?.history) ? body.history : [];
  if (!message) {
    sendJson(response, 400, { error: "message is required" });
    return;
  }

  if (includesAny(message, CRISIS_TERMS)) {
    sendJson(response, 200, {
      protocol: evaluateMock(message, history.length || 1, language),
      source: "safety-local",
    });
    return;
  }

  try {
    const protocol = await evaluateWithDeepSeek(message, language, history);
    if (protocol) {
      sendJson(response, 200, { protocol, source: "deepseek" });
      return;
    }
  } catch (error) {
    console.warn(error);
  }

  sendJson(response, 200, {
    protocol: evaluateMock(message, history.length || 1, language),
    source: "mock",
  });
}
