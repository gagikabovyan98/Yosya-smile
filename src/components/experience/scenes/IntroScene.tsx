"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Experience.module.scss";

gsap.registerPlugin(useGSAP);

export function IntroScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced) return;

    const mm = gsap.matchMedia();
    mm.add(
      { desktop: "(min-width: 701px)", mobile: "(max-width: 700px)" },
      (context) => {
        const mobile = context.conditions?.mobile;
        gsap.timeline()
          .from("[data-intro-bloom]", { autoAlpha: 0, scale: mobile ? 1.04 : 1.12, duration: 2.6, ease: "sine.out" })
          .from("[data-intro-cross]", { autoAlpha: 0, filter: "blur(10px)", duration: 2.4, ease: "sine.out" }, "-=1.6")
          .from("[data-intro-line]", { autoAlpha: 0, y: 10, duration: 1.25, stagger: 0.75, ease: "power2.out" }, "-=0.7")
          .from("[data-intro-button]", { autoAlpha: 0, duration: 0.9 }, "+=0.4");
      },
    );

    return () => mm.revert();
  }, { scope: root, dependencies: [reduced] });

  return (
    <section ref={root} className={`${styles.scene} ${styles.introScene}`} aria-labelledby="intro-title">
      <div data-intro-bloom className={styles.introBloom} aria-hidden="true" />
      <div className={styles.introLightCut} aria-hidden="true" />
      <div data-intro-cross className={styles.introCross} aria-hidden="true" />
      <div className={styles.introCopy}>
        <p data-intro-line className={styles.sceneCode}>ДВЕРЬ ТЕБЯ ПОМНИТ</p>
        <h1 id="intro-title" data-intro-line>ты всё-таки сюда зашла.</h1>
        <p data-intro-line className={styles.introPause}>тише. здесь всё ещё ждут.</p>
        <button data-intro-button className={styles.continueButton} onClick={onComplete}>открыть дверь</button>
      </div>
    </section>
  );
}
