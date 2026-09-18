"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { analysisContent } from "@/content/experience";
import { cinematicConfig } from "@/content/cinematic";
import { GothicEnvironment } from "../GothicEnvironment";
import { AristocraticFrame } from "../cinematic/AristocraticFrame";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Experience.module.scss";

gsap.registerPlugin(useGSAP);

type AnalysisType = keyof typeof analysisContent;

export function AnalysisScene({ type, onComplete }: { type: AnalysisType; onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const value = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const content = analysisContent[type];

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(
      { desktop: "(min-width: 901px)", mobile: "(max-width: 900px)" },
      (context) => {
        const mobile = context.conditions?.mobile;
        const timeline = gsap.timeline();

        if (type === "adequacy") {
          timeline.from("[data-adequacy-environment]", { autoAlpha: 0, scale: mobile ? 1.03 : 1.08, duration: reduced ? 0 : 2.2, ease: "sine.out" });
        }
        timeline.from("[data-analysis-header]", { autoAlpha: 0, y: -12, duration: reduced ? 0 : 0.9 }, type === "adequacy" ? "-=1" : 0);

        if (type === "adequacy" && value.current) {
          const counter = { value: 0 };
          timeline
            .from("[data-adequacy-mark]", { autoAlpha: 0, scale: 0.78, duration: reduced ? 0 : 1.15 })
            .to(counter, { value: 72, duration: reduced ? 0 : 1.65, ease: "sine.inOut", onUpdate: () => { if (value.current) value.current.textContent = String(Math.round(counter.value)); } })
            .to(counter, { value: 61, duration: reduced ? 0 : 0.85, ease: "sine.inOut", onUpdate: () => { if (value.current) value.current.textContent = String(Math.round(counter.value)); } })
            .to(counter, { value: 89, duration: reduced ? 0 : 1.1, ease: "power2.out", onUpdate: () => { if (value.current) value.current.textContent = String(Math.round(counter.value)); } });
        } else if (type === "character") {
          timeline.from("[data-character-word]", { autoAlpha: 0, y: 22, rotate: 2, stagger: reduced ? 0 : 0.16, duration: reduced ? 0 : 0.6 });
          if (!reduced) timeline.to("[data-character-word='false']", { opacity: 0.12, textDecoration: "line-through", duration: 0.7, stagger: 0.12 });
        } else if (type === "danger") {
          timeline.fromTo("[data-needle]", { rotate: -58 }, { rotate: 48, duration: reduced ? 0 : 2.1, ease: "elastic.out(1, 0.35)" });
        } else {
          timeline.from("[data-shard]", {
            autoAlpha: 0,
            x: (index) => (index % 2 ? 90 : -90),
            y: (index) => (index - 3) * 18,
            rotation: (index) => (index % 2 ? 8 : -8),
            duration: reduced ? 0 : 1.3,
            stagger: reduced ? 0 : .14,
            ease: "power3.out",
          });
          timeline.from("[data-lock]", { autoAlpha: 0, scale: 1.25, duration: reduced ? 0 : 0.6 });
        }

        timeline
          .from("[data-analysis-result]", { autoAlpha: 0, y: 14, duration: reduced ? 0 : 0.85 })
          .from("[data-analysis-next]", { autoAlpha: 0, duration: reduced ? 0 : 0.55 });
      },
    );

    return () => mm.revert();
  }, { scope: root, dependencies: [reduced, type] });

  return (
    <section ref={root} className={`${styles.scene} ${styles.analysisScene} ${type === "adequacy" ? styles.adequacyScene : ""}`} data-analysis={type} aria-labelledby={`${type}-title`}>
      {type === "adequacy" && <div className={styles.environmentMount} data-adequacy-environment><GothicEnvironment variant="adequacy" /></div>}
      <header data-analysis-header className={styles.analysisHeader}>
        <span>ЛИЧНЫЙ АНАЛИЗ / {content.index}</span>
        <h1 id={`${type}-title`}>{content.title}</h1>
      </header>

      <div className={styles.analysisVisual}>
        {type === "adequacy" && (
          <div className={styles.adequacyDial} data-adequacy-mark>
            <div className={styles.dialRings} aria-hidden="true" />
            <p><span ref={value}>0</span><small>%</small></p>
            <i>ПЕРЕСЧЁТ</i>
          </div>
        )}

        {type === "character" && (
          <div className={`${styles.analysisArtworkStage} ${styles.characterArtworkStage}`}>
            <AristocraticFrame variant="broken" className={styles.analysisArtworkFrame}>
              <Image data-analysis-art src={cinematicConfig.artworks.characterI.src} alt={cinematicConfig.artworks.characterI.alt} fill sizes="(max-width: 700px) 72vw, 32vw" />
            </AristocraticFrame>
            <div className={styles.characterCloud}>
              <span data-character-word="true">нежная</span>
              <span data-character-word="false">предсказуемая</span>
              <span data-character-word="true">вредная</span>
              <span data-character-word="true">сильная</span>
              <span data-character-word="false">простая</span>
              <span data-character-word="true">настоящая</span>
              <span data-character-word="false">понятная</span>
            </div>
          </div>
        )}

        {type === "danger" && (
          <div className={`${styles.analysisArtworkStage} ${styles.dangerArtworkStage}`}>
            <AristocraticFrame variant="ovalVictorian" className={styles.dangerPortrait}>
              <Image data-analysis-art src={cinematicConfig.artworks.dangerJ.src} alt={cinematicConfig.artworks.dangerJ.alt} fill sizes="(max-width: 700px) 64vw, 27vw" />
            </AristocraticFrame>
            <div className={styles.dangerScale}>
              <span>БЕЗОПАСНА</span><span>НЕИЗВЕСТНО</span><span>ОПАСНА</span>
              <div className={styles.scaleArc}><i data-needle /></div>
            </div>
          </div>
        )}

        {type === "weakness" && (
          <div className={styles.weaknessArtwork}>
            <div className={styles.shardField} role="img" aria-label={cinematicConfig.artworks.weaknessK.alt}>
              {Array.from({ length: 7 }, (_, index) => (
                <i
                  data-shard
                  key={index}
                  style={{ backgroundImage: `url(${cinematicConfig.artworks.weaknessK.src})` }}
                />
              ))}
            </div>
            <div className={styles.dataLock} data-lock><span>×</span>ДАННЫЕ ЗАПЕЧАТАНЫ</div>
          </div>
        )}
      </div>

      <div data-analysis-result className={styles.analysisResult}>
        <strong>{content.result}</strong>
        <p>{content.note}</p>
        <button data-analysis-next className={styles.continueButton} onClick={onComplete}>
          {type === "adequacy" ? "увидеть найденное" : "следующая проверка"}
        </button>
      </div>
    </section>
  );
}
