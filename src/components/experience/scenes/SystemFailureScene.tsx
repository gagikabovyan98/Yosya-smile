"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cinematicConfig } from "@/content/cinematic";
import { audioManager } from "@/lib/audio/AudioManager";
import { Candle } from "../cinematic/Candle";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Cinematic.module.scss";

gsap.registerPlugin(useGSAP);

export function SystemFailureScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useGSAP(() => {
    if (reduced) return;
    const timeline = gsap.timeline()
      .from("[data-failure-art]", { autoAlpha: 0, scale: 1.15, duration: 2.4 })
      .from("[data-failure-copy]", { autoAlpha: 0, letterSpacing: ".18em", duration: 1.5 }, "-=1")
      .to("[data-failure-copy]", { autoAlpha: 0, duration: 1.8 }, "+=1")
      .to("[data-candle-flame], [data-candle-lit]", { autoAlpha: 0, duration: .24, onStart: () => { void audioManager.play("candleOut"); } })
      .to("[data-candle-unlit]", { autoAlpha: 1, duration: .35 }, "-=.18")
      .fromTo("[data-candle-smoke]", { autoAlpha: 0, y: 8 }, { autoAlpha: .35, y: -24, duration: 2.2 }, "-=.15")
      .to("[data-failure-art]", { opacity: .35, filter: "grayscale(1) contrast(1.3)", duration: 2.2, onStart: () => { void audioManager.play("lowImpact"); } }, "-=1.6")
      .from("[data-failure-next]", { autoAlpha: 0, duration: .9 });
    return () => timeline.kill();
  }, { scope: root, dependencies: [reduced] });
  const art = cinematicConfig.artworks.typographyE;
  return (
    <section ref={root} className={`${styles.sceneBase} ${styles.failureScene}`} aria-labelledby="failure-title">
      <Image className={styles.failureArtwork} data-failure-art src={art.src} alt={art.alt} fill sizes="100vw" />
      <div className={styles.failureVeil} aria-hidden="true" />
      <Candle className={styles.failureCandle} variant="tall" />
      <h1 id="failure-title" className={styles.failureCopy} data-failure-copy>{cinematicConfig.text.failure}</h1>
      <button data-failure-next className={`${styles.cinematicButton} ${styles.edgeButton}`} onClick={onComplete}>войти в тишину</button>
    </section>
  );
}
