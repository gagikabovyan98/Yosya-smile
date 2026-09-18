"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { audioManager } from "@/lib/audio/AudioManager";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Cinematic.module.scss";

gsap.registerPlugin(useGSAP);

export function DotsScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useGSAP(() => {
    if (reduced) return;
    const timeline = gsap.timeline()
      .from("[data-dot]", { autoAlpha: 0, y: 12, duration: 1.1, stagger: 1.15, onStart: () => { void audioManager.play("churchBell"); } })
      .to("[data-dot]", { opacity: .38, duration: 1.8 })
      .from("[data-empty-next]", { autoAlpha: 0, duration: .8, onStart: () => { void audioManager.play("woodCreak"); } });
    return () => timeline.kill();
  }, { scope: root, dependencies: [reduced] });
  return (
    <section ref={root} className={`${styles.sceneBase} ${styles.dotsRitual}`} aria-label="Пауза из трёх точек">
      <div className={styles.ritualDots} aria-hidden="true"><i data-dot /><i data-dot /><i data-dot /></div>
      <p className={styles.dotsWhisper}>система впервые не знает, что сказать</p>
      <button data-empty-next className={`${styles.cinematicButton} ${styles.emptyButton}`} onClick={onComplete}>нарушить тишину</button>
    </section>
  );
}
