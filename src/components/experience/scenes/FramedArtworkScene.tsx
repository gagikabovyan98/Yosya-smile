"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cinematicConfig } from "@/content/cinematic";
import { audioManager } from "@/lib/audio/AudioManager";
import { AristocraticFrame } from "../cinematic/AristocraticFrame";
import { Candle } from "../cinematic/Candle";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Cinematic.module.scss";

gsap.registerPlugin(useGSAP);

export function FramedArtworkScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useGSAP(() => {
    if (reduced) return;
    const timeline = gsap.timeline()
      .from("[data-room-light]", { opacity: 0, duration: 2 })
      .from("[data-frame-build]", { autoAlpha: 0, scale: .72, filter: "blur(12px)", duration: 2.2, ease: "power3.out", onStart: () => { void audioManager.play("metalClank"); } }, "-=1.2")
      .from("[data-frame-copy], [data-frame-next]", { autoAlpha: 0, y: 14, duration: .9, stagger: .35 });
    return () => timeline.kill();
  }, { scope: root, dependencies: [reduced] });
  const art = cinematicConfig.artworks.framedC;
  return (
    <section ref={root} className={`${styles.sceneBase} ${styles.framedScene}`} aria-labelledby="framed-title">
      <div className={styles.aristocraticRoom} data-room-light aria-hidden="true" />
      <Candle className={styles.roomCandelabra} variant="candelabra" />
      <AristocraticFrame variant="gothicArch" className={styles.heroFrame}>
        <Image data-frame-build src={art.src} alt={art.alt} fill sizes="(max-width: 700px) 70vw, 42vw" />
      </AristocraticFrame>
      <p id="framed-title" className={styles.framedCopy} data-frame-copy>{cinematicConfig.text.framed}</p>
      <button data-frame-next className={`${styles.cinematicButton} ${styles.edgeButton}`} onClick={onComplete}>подойти ближе</button>
    </section>
  );
}
