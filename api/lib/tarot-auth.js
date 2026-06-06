import crypto from "node:crypto";
import { readFile } from "node:fs/promises";

export async function readLocalEnv(name) {
  try {
    const envText = await readFile(`${process.cwd()}/.env.local`, "utf8");
    const line = envText.split(/\r?\n/).find((item) => item.startsWith(`${name}=`));
    return line ? line.slice(name.length + 1).trim().replace(/^["']|["']$/g, "") : "";
  } catch {
    return "";
  }
}

function b64url(input) {
  return Buffer.from(input).toString("base64url");
}

function fromB64url(input) {
  return Buffer.from(input, "base64url").toString("utf8");
}

export async function tokenSecret() {
  return process.env.TAROT_TOKEN_SECRET || await readLocalEnv("TAROT_TOKEN_SECRET") || "dev-only-change-me";
}

export async function signAccess(payload) {
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", await tokenSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export async function verifyAccess(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", await tokenSecret()).update(body).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const payload = JSON.parse(fromB64url(body));
  if (!payload.exp || payload.exp < Date.now()) return null;
  return payload;
}

export async function codeMap() {
  const raw = process.env.TAROT_CODES || await readLocalEnv("TAROT_CODES");
  const map = new Map();
  raw.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean).forEach((item) => {
    const [code, credits = "100"] = item.split(":").map((part) => part.trim());
    if (code) map.set(code.toUpperCase(), Number(credits) || 100);
  });
  return map;
}

export function clientIp(request) {
  const forwarded = request.headers["x-forwarded-for"] || request.headers["x-real-ip"] || "";
  return String(Array.isArray(forwarded) ? forwarded[0] : forwarded).split(",")[0].trim() || "unknown";
}

const buckets = new Map();

export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const item = buckets.get(key);
  if (!item || item.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  item.count += 1;
  return { ok: item.count <= limit, remaining: Math.max(0, limit - item.count), resetAt: item.resetAt };
}
