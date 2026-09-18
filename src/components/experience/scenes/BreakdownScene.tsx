"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Experience.module.scss";

gsap.registerPlugin(useGSAP);

const debris = ["АНАЛИЗ", "СОВПАДЕНИЕ", "ЛИЧНОСТЬ", "РЕЗУЛЬТАТ", "АРХИВ", "ЗАКЛЮЧЕНИЕ", "НЕИЗВЕСТНО"];

export function BreakdownScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>("[data-debris]");
    if (!reduced) {
      gsap.timeline()
        .from(items, { autoAlpha: 0, scale: 0.8, stagger: 0.08, duration: 0.35 })
        .to(items, {
          y: (index) => 120 + index * 18,
          x: (index) => index % 2 ? 140 : -140,
          rotate: (index) => index % 2 ? 12 : -15,
          opacity: 0,
          filter: "blur(8px)",
          stagger: 0.1,
          duration: 1.6,
          ease: "power2.in",
        }, "+=0.35")
        .from("[data-breakdown-text]", { autoAlpha: 0, duration: 1 }, "-=0.3")
        .from("[data-breakdown-next]", { autoAlpha: 0, duration: 0.5 });
    }
  }, { scope: root, dependencies: [reduced] });

  return (
    <section ref={root} className={`${styles.scene} ${styles.breakdownScene}`} aria-labelledby="breakdown-title">
      <div className={styles.debrisField} aria-hidden="true">
        {debris.map((word, index) => (
          <span
            data-debris
            key={word}
            style={{
              "--debris-y": `${12 + index * 10}%`,
              "--debris-x": `${8 + index * 11}%`,
              "--debris-mobile-x": `${2 + index * 7}%`,
            } as React.CSSProperties}
          >
            {word}
          </span>
        ))}
      </div>
      <div data-breakdown-text className={styles.breakdownMessage}>
        <p>СТРУКТУРА СИСТЕМЫ УТРАЧЕНА</p>
        <h1 id="breakdown-title">Не всё должно быть объяснено.</h1>
        <button data-breakdown-next className={styles.continueButton} onClick={onComplete}>войти в темноту</button>
      </div>
    </section>
  );
}
