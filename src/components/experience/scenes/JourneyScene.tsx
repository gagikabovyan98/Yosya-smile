"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cinematicConfig } from "@/content/cinematic";
import { audioManager } from "@/lib/audio/AudioManager";
import { AgedPaper } from "../cinematic/AgedPaper";
import { AristocraticFrame } from "../cinematic/AristocraticFrame";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Cinematic.module.scss";

gsap.registerPlugin(useGSAP);

export function JourneyScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useGSAP(() => {
    if (reduced) return;
    const sheets = gsap.utils.toArray<HTMLElement>("[data-wind-sheet]");
    const timeline = gsap.timeline()
      .from("[data-print]", { autoAlpha: 0, y: 40, rotation: -3, duration: 1.8, onStart: () => { void audioManager.play("paperTurn"); } })
      .from(sheets, { autoAlpha: 0, x: 80, rotation: 12, duration: 1.2, stagger: .2 }, "-=.8")
      .to(sheets, { x: (i) => i % 2 ? "115vw" : "-115vw", y: (i) => i * -30, rotation: (i) => i % 2 ? 24 : -18, duration: 2.5, stagger: .28, ease: "power3.in", onStart: () => { void audioManager.play("paperRustle"); } }, "+=.8")
      .from("[data-landscape-art]", { autoAlpha: 0, scale: .92, duration: 1.5 })
      .from("[data-journey-copy], [data-journey-next]", { autoAlpha: 0, duration: .9, stagger: .3 });
    return () => timeline.kill();
  }, { scope: root, dependencies: [reduced] });
  const print = cinematicConfig.artworks.printF;
  const landscape = cinematicConfig.artworks.sheetsG;
  return (
    <section ref={root} className={`${styles.sceneBase} ${styles.journeyScene}`} aria-labelledby="journey-title">
      <div className={styles.gardenDark} aria-hidden="true" />
      <AristocraticFrame variant="ovalVictorian" className={styles.printFrame}>
        <Image data-print src={print.src} alt={print.alt} fill sizes="(max-width: 700px) 58vw, 30vw" />
      </AristocraticFrame>
      <div className={styles.windStack} aria-hidden="true">
        {[0, 1, 2].map((index) => <div key={index} className={styles.windSheet} data-wind-sheet><AgedPaper variant="smallNote" rotation={index * 3 - 3}><span /></AgedPaper></div>)}
      </div>
      <AristocraticFrame variant="broken" className={styles.landscapeFrame}>
        <Image data-landscape-art src={landscape.src} alt={landscape.alt} fill sizes="(max-width: 700px) 82vw, 54vw" />
      </AristocraticFrame>
      <p id="journey-title" className={styles.journeyCopy} data-journey-copy>{cinematicConfig.text.journey}</p>
      <button data-journey-next className={`${styles.cinematicButton} ${styles.edgeButton}`} onClick={onComplete}>собрать следы</button>
    </section>
  );
}
