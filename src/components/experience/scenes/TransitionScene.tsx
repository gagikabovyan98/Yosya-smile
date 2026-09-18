"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Moth } from "../Moth";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Experience.module.scss";

gsap.registerPlugin(useGSAP);

export function TransitionScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced) return;
    gsap.timeline()
      .from("[data-moth]", { autoAlpha: 0, x: -180, y: 90, rotate: -15, scale: 0.4, duration: 1.5, ease: "power2.out" })
      .to("[data-moth]", { y: -22, x: 35, rotate: 8, duration: 1.2, ease: "sine.inOut" })
      .from("[data-transition-copy]", { autoAlpha: 0, y: 12, duration: 0.8 }, "-=0.4")
      .from("[data-transition-next]", { autoAlpha: 0, duration: 0.5 });
  }, { scope: root, dependencies: [reduced] });

  return (
    <section ref={root} className={`${styles.scene} ${styles.transitionScene}`} aria-labelledby="transition-title">
      <div data-moth className={styles.transitionMoth}><Moth /></div>
      <div data-transition-copy className={styles.transitionCopy}>
        <p>ЗДЕСЬ СИСТЕМА ЗАКАНЧИВАЕТСЯ</p>
        <h1 id="transition-title">Дальше — только след.</h1>
        <button data-transition-next className={styles.continueButton} onClick={onComplete}>следовать</button>
      </div>
    </section>
  );
}
