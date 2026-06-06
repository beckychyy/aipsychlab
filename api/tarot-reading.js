import { clientIp, rateLimit, readLocalEnv, signAccess, verifyAccess } from "./lib/tarot-auth.js";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

function buildPrompt({ question, cards }) {
  const cardLines = cards.map((card, index) => {
    const position = ["过去的影响", "现在的能量", "下一步指引"][index] || `第 ${index + 1} 张`;
    return `${position}: ${card.name} ${card.reversed ? "逆位" : "正位"}。关键词：${card.keywords}。本地牌义：${card.meaning}`;
  }).join("\n");

  return `用户问题：${question || "用户没有输入具体问题，请做整体能量解读。"}

抽出的三张维特塔罗牌：
${cardLines}

请你像一位成熟、温柔、细腻的塔罗师兼心理教练一样解读。要求：
1. 先直接回答用户的问题，不要只解释牌义。
2. 用三张牌形成一个动态故事：过去如何影响现在，现在卡点是什么，下一步如何行动。
3. 每张牌都结合正逆位、牌面象征和用户问题解释。
4. 如果问题是关系，要讲清楚对方行动、用户感受、边界与沟通建议。
5. 如果问题是事业/选择/自我状态，要给出具体可执行建议。
6. 不要说得绝对，不要承诺命运结果，不做医疗、法律、财务诊断。
7. 输出中文，语气亲密但不夸张，内容要具体、有画面、有洞察。
8. 使用 Markdown，包含这些小标题：
   - 直接回答
   - 三张牌的故事
   - 过去的影响
   - 现在的能量
   - 下一步指引
   - 你真正需要注意的地方
   - 24小时行动建议`;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY || await readLocalEnv("DEEPSEEK_API_KEY");
  if (!apiKey) {
    sendJson(response, 500, { error: "Missing DEEPSEEK_API_KEY environment variable" });
    return;
  }

  let body;
  try {
    body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
  } catch {
    sendJson(response, 400, { error: "Invalid JSON body" });
    return;
  }

  const question = String(body?.question || "").slice(0, 800);
  const cards = Array.isArray(body?.cards) ? body.cards.slice(0, 3) : [];
  const access = await verifyAccess(body?.accessToken);
  const isFreeTrial = body?.freeTrial === true && !access;
  const ip = clientIp(request);

  if (cards.length !== 3) {
    sendJson(response, 400, { error: "Exactly three tarot cards are required" });
    return;
  }

  const perMinute = rateLimit(`tarot-minute:${ip}`, 5, 60 * 1000);
  if (!perMinute.ok) {
    sendJson(response, 429, { error: "请求太频繁，请稍等一分钟再占卜。" });
    return;
  }

  if (!access && !isFreeTrial) {
    sendJson(response, 402, { error: "请输入兑换码解锁 AI 解读。", paymentRequired: true });
    return;
  }

  if (isFreeTrial) {
    const freeLimit = rateLimit(`tarot-free:${ip}`, 6, 24 * 60 * 60 * 1000);
    if (!freeLimit.ok) {
      sendJson(response, 402, { error: "免费体验次数已用完，请输入兑换码继续。", paymentRequired: true });
      return;
    }
  }

  if (access && access.credits <= 0) {
    sendJson(response, 402, { error: "兑换码次数已用完，请重新购买新的 100 次包。", paymentRequired: true, remaining: 0 });
    return;
  }

  try {
    const deepseekResponse = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || await readLocalEnv("DEEPSEEK_MODEL") || "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是 AIPsychLab 的互动塔罗解读助手。你用塔罗作为自我反思工具，回答要具体、温柔、有洞察，但不能制造宿命论或替代专业建议。",
          },
          {
            role: "user",
            content: buildPrompt({ question, cards }),
          },
        ],
        temperature: 0.86,
        max_tokens: 1800,
      }),
    });

    const result = await deepseekResponse.json();

    if (!deepseekResponse.ok) {
      sendJson(response, deepseekResponse.status, {
        error: "DeepSeek API request failed",
        detail: result?.error?.message || result,
      });
      return;
    }

    let nextAccessToken = body?.accessToken || "";
    let remaining = isFreeTrial ? 0 : access?.credits;
    if (access) {
      remaining = Math.max(0, Number(access.credits || 0) - 1);
      nextAccessToken = await signAccess({
        ...access,
        credits: remaining,
        iat: Date.now(),
      });
    }

    sendJson(response, 200, {
      reading: result?.choices?.[0]?.message?.content || "",
      provider: "deepseek",
      model: result?.model || process.env.DEEPSEEK_MODEL || await readLocalEnv("DEEPSEEK_MODEL") || "deepseek-chat",
      accessToken: nextAccessToken,
      remaining,
      freeTrialUsed: isFreeTrial,
    });
  } catch (error) {
    sendJson(response, 500, {
      error: "DeepSeek API request failed",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
