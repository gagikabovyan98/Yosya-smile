"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cinematicConfig } from "@/content/cinematic";
import { audioManager } from "@/lib/audio/AudioManager";
import { AristocraticFrame } from "../cinematic/AristocraticFrame";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Cinematic.module.scss";

gsap.registerPlugin(useGSAP);

export function FinaleScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced) return;
    const timeline = gsap.timeline()
      .from("[data-final-room]", { autoAlpha: 0, scale: 1.1, duration: 3.2, ease: "sine.out", onStart: () => { void audioManager.play("churchBell"); } })
      .from("[data-final-side]", { autoAlpha: 0, y: 70, rotation: 0, duration: 1.8, stagger: .35, ease: "power3.out" }, "-=1.4")
      .from("[data-final-altar]", { autoAlpha: 0, scale: .72, filter: "blur(14px)", duration: 2.4, ease: "expo.out", onStart: () => { void audioManager.play("metalClank"); } }, "-=1.15")
      .to("[data-final-curtain='left']", { xPercent: -104, duration: 2.2, ease: "power3.inOut" }, "+=.55")
      .to("[data-final-curtain='right']", { xPercent: 104, duration: 2.2, ease: "power3.inOut" }, "<")
      .from("[data-final-art]", { autoAlpha: 0, scale: 1.08, duration: 2.2, ease: "sine.out", onStart: () => { void audioManager.play("finalPiece"); } }, "-=1.55")
      .from("[data-final-copy]", { autoAlpha: 0, y: 18, duration: 1.1 }, "+=.75")
      .from("[data-final-next]", { autoAlpha: 0, duration: .8 });
    return () => timeline.kill();
  }, { scope: root, dependencies: [reduced] });

  const central = cinematicConfig.artworks.framedC;
  return (
    <section ref={root} className={`${styles.sceneBase} ${styles.grandFinale}`} aria-labelledby="grand-finale-title">
      <div className={styles.finalSalon} data-final-room aria-hidden="true" />
      <div className={`${styles.finalSideWork} ${styles.finalSideLeft}`} data-final-side>
        <AristocraticFrame variant="broken">
          <Image src={cinematicConfig.artworks.puzzleA.src} alt={cinematicConfig.artworks.puzzleA.alt} fill sizes="20vw" />
        </AristocraticFrame>
      </div>
      <div className={`${styles.finalSideWork} ${styles.finalSideRight}`} data-final-side>
        <AristocraticFrame variant="silver">
          <Image src={cinematicConfig.artworks.detailD.src} alt={cinematicConfig.artworks.detailD.alt} fill sizes="20vw" />
        </AristocraticFrame>
      </div>
      <div className={styles.finalAltar} data-final-altar>
        <AristocraticFrame variant="brass" className={styles.finalMasterFrame}>
          <Image data-final-art src={central.src} alt={central.alt} fill sizes="(max-width: 700px) 72vw, 38vw" />
          <span className={styles.velvetCurtainLeft} data-final-curtain="left" aria-hidden="true" />
          <span className={styles.velvetCurtainRight} data-final-curtain="right" aria-hidden="true" />
        </AristocraticFrame>
      </div>
      <div className={styles.finalPlaque} data-final-copy>
        <span>ПОСЛЕДНЕЕ СОВПАДЕНИЕ</span>
        <p id="grand-finale-title">{cinematicConfig.text.final}</p>
      </div>
      <button data-final-next className={`${styles.cinematicButton} ${styles.finalNext}`} onClick={onComplete}>получить психопаспорт</button>
    </section>
  );
}
