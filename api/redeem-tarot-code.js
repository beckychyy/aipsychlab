import { codeMap, clientIp, rateLimit, signAccess } from "./lib/tarot-auth.js";

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const ip = clientIp(request);
  const limit = rateLimit(`redeem:${ip}`, 20, 60 * 60 * 1000);
  if (!limit.ok) {
    sendJson(response, 429, { error: "兑换尝试过多，请稍后再试。" });
    return;
  }

  let body;
  try {
    body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
  } catch {
    sendJson(response, 400, { error: "Invalid JSON body" });
    return;
  }

  const code = String(body?.code || "").trim().toUpperCase();
  const codes = await codeMap();
  const credits = codes.get(code);

  if (!credits) {
    sendJson(response, 400, { error: "兑换码无效，请检查大小写或联系购买入口。" });
    return;
  }

  const now = Date.now();
  const exp = now + 35 * 24 * 60 * 60 * 1000;
  const accessToken = await signAccess({
    kind: "paid",
    codeHash: code.slice(0, 8),
    credits,
    iat: now,
    exp,
  });

  sendJson(response, 200, {
    accessToken,
    credits,
    expiresAt: exp,
  });
}
