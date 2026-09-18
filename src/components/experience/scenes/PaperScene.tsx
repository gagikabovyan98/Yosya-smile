"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cinematicConfig } from "@/content/cinematic";
import { audioManager } from "@/lib/audio/AudioManager";
import { AgedPaper } from "../cinematic/AgedPaper";
import { AristocraticFrame } from "../cinematic/AristocraticFrame";
import { Candle } from "../cinematic/Candle";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Cinematic.module.scss";

gsap.registerPlugin(useGSAP);

export function PaperScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    const timeline = gsap.timeline();
    if (!reduced) {
      timeline
        .from("[data-paper-stage]", { autoAlpha: 0, y: 60, rotation: -5, duration: 1.6, ease: "power3.out" })
        .fromTo("[data-paper-leaf]", { rotationY: -86 }, { rotationY: 0, duration: 1.7, stagger: 0.28, ease: "power3.inOut", onStart: () => { void audioManager.play("paperRustle"); } }, "-=.8")
        .from("[data-paper-art]", { autoAlpha: 0, scale: .96, duration: 1.2 })
        .from("[data-paper-copy], [data-paper-next]", { autoAlpha: 0, y: 10, duration: .8, stagger: .3 });
    }
    return () => timeline.kill();
  }, { scope: root, dependencies: [reduced] });

  const art = cinematicConfig.artworks.paperB;
  return (
    <section ref={root} className={`${styles.sceneBase} ${styles.paperScene}`} aria-labelledby="paper-title">
      <div className={styles.paperRoom} aria-hidden="true" />
      <Candle className={styles.paperCandle} variant="melted" />
      <div className={styles.paperStage} data-paper-stage>
        <div className={`${styles.paperLeaf} ${styles.paperLeafLeft}`} data-paper-leaf>
          <AgedPaper variant="bookPage" rotation={0}>
            <div className={styles.paperLetterContent}>
              <span>ЛИСТ ИЗ НЕСУЩЕСТВУЮЩЕЙ КНИГИ · 13</span>
              <p id="paper-title" data-paper-copy>{cinematicConfig.text.paper}</p>
              <i aria-hidden="true">Y</i>
            </div>
          </AgedPaper>
        </div>
        <div className={`${styles.paperLeaf} ${styles.paperLeafRight}`} data-paper-leaf>
          <AgedPaper variant="archiveSheet" rotation={0}>
            <AristocraticFrame variant="paperOnly" className={styles.paperArtwork}>
              <Image data-paper-art src={art.src} alt={art.alt} fill sizes="(max-width: 700px) 46vw, 31vw" />
            </AristocraticFrame>
          </AgedPaper>
        </div>
      </div>
      <button data-paper-next className={`${styles.cinematicButton} ${styles.edgeButton}`} onClick={onComplete}>перевернуть страницу</button>
    </section>
  );
}
