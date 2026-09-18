"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Candle } from "../experience/cinematic/Candle";
import { audioManager } from "@/lib/audio/AudioManager";
import styles from "./LoginScreen.module.scss";

type Status = "idle" | "loading" | "error" | "success";

export function LoginScreen() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading" || status === "success") return;
    const formData = new FormData(event.currentTarget);
    setStatus("loading");
    setMessage("СЛУШАЮ ТИШИНУ");
    void audioManager.activate();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: formData.get("login"), password: formData.get("password") }),
      });
      const result = (await response.json()) as { ok: boolean; message?: string; entryToken?: string };
      if (!response.ok || !result.ok || !result.entryToken) {
        setStatus("error");
        setMessage(result.message ?? "Совпадение не найдено.");
        return;
      }
      setStatus("success");
      setMessage("ДВЕРЬ УЗНАЛА ТЕБЯ");
      void audioManager.play("woodCreak");
      window.setTimeout(() => router.replace(`/experience?entry=${encodeURIComponent(result.entryToken!)}`), 1450);
    } catch {
      setStatus("error");
      setMessage("Дверь не отвечает. Попробуй ещё раз.");
    }
  }

  if (!mounted) {
    return (
      <main className={styles.page} aria-label="Загрузка входа">
        <div className={styles.cathedral} aria-hidden="true" />
        <div className={styles.vignette} aria-hidden="true" />
      </main>
    );
  }

  return (
    <main className={`${styles.page} ${status === "success" ? styles.opening : ""}`}>
      <div className={styles.cathedral} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <Image className={styles.botanical} src="/images/gothic-botanical-overlay.webp" alt="" fill priority sizes="100vw" />
      <Candle className={styles.loginCandelabra} variant="candelabra" />
      <Candle className={styles.loginCandle} variant="melted" />
      <section className={styles.letter} aria-labelledby="access-title">
        <span className={styles.letterFold} aria-hidden="true" />
        <p className={styles.eyebrow}>ЗАКРЫТАЯ КОМНАТА · I</p>
        <h1 id="access-title">Вход</h1>
        <p className={styles.hint}>Дверь откроется только для одного имени.</p>
        <form className={styles.form} onSubmit={submit}>
          <label suppressHydrationWarning><span>ИМЯ</span><input suppressHydrationWarning name="login" type="text" autoComplete="username" required maxLength={80} /></label>
          <label suppressHydrationWarning><span>ПАРОЛЬ</span><input suppressHydrationWarning name="password" type="password" autoComplete="current-password" required maxLength={256} /></label>
          <button type="submit" disabled={status === "loading" || status === "success"}>{status === "loading" ? "СЛУШАТЬ" : status === "success" ? "ОТКРЫВАЕТСЯ" : "ПОСТУЧАТЬ"}</button>
        </form>
        <p className={`${styles.status} ${status === "error" ? styles.error : ""}`} aria-live="polite">{message || "СВЕТ ЕЩЁ ГОРИТ"}</p>
      </section>
      <div className={styles.doorLight} aria-hidden="true" />
    </main>
  );
}
