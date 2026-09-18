"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArtworkFragments } from "../ArtworkFragments";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Experience.module.scss";

gsap.registerPlugin(useGSAP);

export function ArtworkTransitionScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced) return;

    const mm = gsap.matchMedia();
    mm.add(
      { desktop: "(min-width: 701px)", mobile: "(max-width: 700px)" },
      (context) => {
        const mobile = context.conditions?.mobile;
        const pieces = gsap.utils.toArray<HTMLElement>("[data-piece]");
        gsap.timeline()
          .from(pieces, {
            autoAlpha: 0,
            scale: mobile ? 1.35 : 1.75,
            xPercent: (index) => [-36, 28, -22, 24, -18, 31][index] ?? 0,
            yPercent: (index) => [-28, -20, 17, 26, -12, 22][index] ?? 0,
            rotate: (index) => [-7, 5, -4, 6, -3, 4][index] ?? 0,
            duration: 1.9,
            stagger: 0.2,
            ease: "power3.out",
          })
          .to({}, { duration: 1.8 })
          .to(pieces, {
            xPercent: (index) => [-70, 62, -55, 58, -48, 67][index] ?? 0,
            yPercent: (index) => [-42, -36, 54, 48, 36, 52][index] ?? 0,
            rotate: (index) => [-12, 9, -8, 10, -6, 8][index] ?? 0,
            filter: "brightness(0.48) saturate(0.55)",
            duration: 2.2,
            ease: "power2.inOut",
          })
          .from("[data-artwork-copy]", { autoAlpha: 0, y: 18, duration: 1.1 }, "-=0.55")
          .from("[data-artwork-next]", { autoAlpha: 0, duration: 0.7 });
      },
    );

    return () => mm.revert();
  }, { scope: root, dependencies: [reduced] });

  return (
    <section ref={root} className={`${styles.scene} ${styles.artworkTransitionScene}`} aria-labelledby="artwork-transition-title">
      <div className={styles.artworkTransitionField}>
        <ArtworkFragments variant="fullscreen" />
      </div>
      <div className={styles.artworkTransitionCopy} data-artwork-copy>
        <p>ФРАГМЕНТЫ УДЕРЖИВАЮТ ОБРАЗ</p>
        <h1 id="artwork-transition-title">На мгновение — почти целиком.</h1>
        <button data-artwork-next className={styles.continueButton} onClick={onComplete}>отпустить</button>
      </div>
    </section>
  );
}
