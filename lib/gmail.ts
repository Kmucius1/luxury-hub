import crypto from "node:crypto";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

function key() {
  const raw = process.env.GMAIL_TOKEN_ENCRYPTION_KEY;
  if (!raw) throw new Error("GMAIL_TOKEN_ENCRYPTION_KEY is not configured");
  const buf = Buffer.from(raw, "base64");
  if (buf.length !== 32) throw new Error("GMAIL_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  return buf;
}

export function encryptSecret(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((b) => b.toString("base64url")).join(".");
}

export function decryptSecret(value: string) {
  const [ivB64, tagB64, dataB64] = value.split(".");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB64, "base64url"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64url")), decipher.final()]).toString("utf8");
}

export async function refreshAccessToken(refreshToken: string) {
  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const res = await fetch(GOOGLE_TOKEN_URL, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
  if (!res.ok) throw new Error(`Google token refresh failed: ${res.status}`);
  return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

export async function gmailFetch(accessToken: string, path: string, init?: RequestInit) {
  return fetch(`${GMAIL_BASE}${path}`, { ...init, headers: { Authorization: `Bearer ${accessToken}`, "content-type": "application/json", ...(init?.headers ?? {}) } });
}

export function decodeBody(data?: string) {
  if (!data) return "";
  return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

export function classifyReply(text: string) {
  const s = text.toLowerCase();
  if (/approved|you(?:'|’)re in|happy to send|we(?:'|’)d love to send|selected|accepted/.test(s)) return "approved";
  if (/declined|not selected|unable to accommodate|not a fit|won't be able|will not be able/.test(s)) return "declined";
  if (/waitlist|waiting list/.test(s)) return "waitlisted";
  if (/campaign.*full|spots.*filled|capacity/.test(s)) return "campaign_full";
  if (/shipping address|mailing address|where should we send/.test(s)) return "address_requested";
  if (/more information|media kit|social links|analytics|insights/.test(s)) return "needs_info";
  return "replied";
}
