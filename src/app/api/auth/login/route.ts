import { NextResponse } from "next/server";
import { canAttempt, clearFailures, recordFailure, verifyCredentials } from "@/lib/auth";
import { createEntryToken } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!canAttempt(key)) return NextResponse.json({ ok: false, message: "Слишком много попыток. Подожди немного." }, { status: 429 });
  let payload: { login?: unknown; password?: unknown };
  try { payload = await request.json(); }
  catch { return NextResponse.json({ ok: false, message: "Запрос не удалось прочитать." }, { status: 400 }); }
  if (typeof payload.login !== "string" || typeof payload.password !== "string") return NextResponse.json({ ok: false, message: "Данные не распознаны." }, { status: 400 });
  const isValid = await verifyCredentials(payload.login.slice(0, 80), payload.password.slice(0, 256));
  if (!isValid) {
    recordFailure(key);
    return NextResponse.json({ ok: false, message: "Совпадение не найдено." }, { status: 401 });
  }
  clearFailures(key);
  return NextResponse.json({ ok: true, entryToken: createEntryToken() });
}
