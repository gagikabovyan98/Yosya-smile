import "server-only";

import argon2 from "argon2";

type Attempt = { count: number; resetAt: number };

const attempts = new Map<string, Attempt>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 7;

export function canAttempt(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 0, resetAt: now + WINDOW_MS });
    return true;
  }

  return current.count < MAX_ATTEMPTS;
}

export function recordFailure(key: string) {
  const current = attempts.get(key) ?? { count: 0, resetAt: Date.now() + WINDOW_MS };
  attempts.set(key, { ...current, count: current.count + 1 });
}

export function clearFailures(key: string) {
  attempts.delete(key);
}

export async function verifyCredentials(login: string, password: string) {
  const expectedLogin = process.env.YOSYA_LOGIN ?? "YOSYA";
  const passwordHash = process.env.YOSYA_PASSWORD_HASH;

  if (!passwordHash) {
    throw new Error("YOSYA_PASSWORD_HASH is not configured");
  }

  const passwordMatches = await argon2.verify(passwordHash, password);
  return login.trim().toLocaleUpperCase() === expectedLogin.toLocaleUpperCase() && passwordMatches;
}
