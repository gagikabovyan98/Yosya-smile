import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const ENTRY_TTL_SECONDS = 120;
type GlobalWithEntryStore = typeof globalThis & { __yosyaUsedEntryTokens?: Set<string> };

function getSecret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters");
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function usedTokens() {
  const scopedGlobal = globalThis as GlobalWithEntryStore;
  scopedGlobal.__yosyaUsedEntryTokens ??= new Set<string>();
  return scopedGlobal.__yosyaUsedEntryTokens;
}

export function createEntryToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + ENTRY_TTL_SECONDS;
  const nonce = randomBytes(24).toString("base64url");
  const payload = `${expiresAt}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function consumeEntryToken(token?: string | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || usedTokens().has(token)) return false;
  const [expiresAt, nonce, providedSignature] = parts;
  const payload = `${expiresAt}.${nonce}`;
  const expected = Buffer.from(sign(payload));
  const provided = Buffer.from(providedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return false;
  if (!Number.isFinite(Number(expiresAt)) || Number(expiresAt) <= Date.now() / 1000) return false;
  usedTokens().add(token);
  if (usedTokens().size > 512) usedTokens().clear();
  return true;
}
