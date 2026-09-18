"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cinematicConfig } from "@/content/cinematic";
import { audioManager } from "@/lib/audio/AudioManager";
import { AgedPaper } from "../cinematic/AgedPaper";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Cinematic.module.scss";

gsap.registerPlugin(useGSAP);

export function PhotoRevealScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-photo-card]");
    const timeline = gsap.timeline()
      .from("[data-photo-room]", { autoAlpha: 0, scale: 1.08, duration: 2.4, ease: "sine.out" })
      .from("[data-photo-envelope]", { autoAlpha: 0, y: 70, rotation: -6, duration: 1.4, onStart: () => { void audioManager.play("paperTurn"); } }, "-=1.2")
      .to("[data-photo-envelope]", { y: "52vh", rotation: 13, autoAlpha: 0, duration: 1.3, ease: "power2.in" }, "+=.7")
      .from(cards, { autoAlpha: 0, y: 90, scale: .7, rotation: 0, duration: 1.3, stagger: .48, ease: "power3.out", onStart: () => { void audioManager.play("paperRustle"); } }, "-=.5")
      .from("[data-photo-caption]", { autoAlpha: 0, y: 14, duration: .9 }, "+=.45")
      .from("[data-photo-next]", { autoAlpha: 0, duration: .8 });
    return () => timeline.kill();
  }, { scope: root, dependencies: [reduced] });

  return (
    <section ref={root} className={`${styles.sceneBase} ${styles.photoSalonScene}`} aria-labelledby="photo-title">
      <div className={styles.photoSalonRoom} data-photo-room aria-hidden="true" />
      <div className={styles.photoMirror} aria-hidden="true" />
      <div className={styles.photoEnvelope} data-photo-envelope aria-hidden="true">
        <AgedPaper variant="letter" rotation={0}>
          <span className={styles.oldPrintMark}>личное · не вскрывать</span>
          <i className={styles.waxSeal} />
        </AgedPaper>
      </div>
      <div className={styles.photoConstellation}>
        {cinematicConfig.photos.map((photo, index) => (
          <figure className={styles.photoCard} data-photo-card key={photo.id}>
            <div><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 42vw, 21vw" /></div>
            <figcaption>{String(index + 1).padStart(2, "0")} · найдено без подписи</figcaption>
          </figure>
        ))}
      </div>
      <p id="photo-title" className={styles.photoCaption} data-photo-caption>Архив ожидал доказательство. Вместо него нашёл присутствие.</p>
      <button data-photo-next className={`${styles.cinematicButton} ${styles.photoNext}`} onClick={onComplete}>оставить фотографии здесь</button>
    </section>
  );
}
