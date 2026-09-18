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

export function FullscreenArtworkScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useGSAP(() => {
    if (reduced) return;
    const timeline = gsap.timeline()
      .fromTo("[data-detail-art]", { scale: 2.65, xPercent: -20, yPercent: 12 }, { scale: 1, xPercent: 0, yPercent: 0, duration: 4.2, ease: "power2.inOut" })
      .from("[data-detail-frame]", { autoAlpha: 0, scale: 1.06, duration: 1.4, onStart: () => { void audioManager.play("stringScrape"); } }, "-=1.3")
      .from("[data-detail-copy], [data-detail-next]", { autoAlpha: 0, duration: .9, stagger: .25 });
    return () => timeline.kill();
  }, { scope: root, dependencies: [reduced] });
  const art = cinematicConfig.artworks.detailD;
  return (
    <section ref={root} className={`${styles.sceneBase} ${styles.detailScene}`} aria-labelledby="detail-title">
      <div className={styles.abstractField} aria-hidden="true" />
      <AristocraticFrame variant="silver" className={styles.detailFrame}>
        <div className={styles.detailImage} data-detail-frame>
          <Image data-detail-art src={art.src} alt={art.alt} fill sizes="92vw" />
        </div>
      </AristocraticFrame>
      <p id="detail-title" className={styles.detailCopy} data-detail-copy>{cinematicConfig.text.detail}</p>
      <button data-detail-next className={`${styles.cinematicButton} ${styles.edgeButton}`} onClick={onComplete}>отступить</button>
    </section>
  );
}
