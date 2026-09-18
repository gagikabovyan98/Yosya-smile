"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Moth } from "../Moth";
import { useReducedMotion } from "../useReducedMotion";
import { audioManager } from "@/lib/audio/AudioManager";
import styles from "../Experience.module.scss";

gsap.registerPlugin(useGSAP);

export function EndingScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [departing, setDeparting] = useState(false);

  useGSAP(() => {
    const value = { current: reduced ? 100 : 0 };
    const update = () => {
      const rounded = Math.round(value.current);
      if (progress.current) progress.current.textContent = String(rounded).padStart(3, "0");
      ring.current?.style.setProperty("--moth-progress", `${rounded * 3.6}deg`);
    };
    gsap.set("[data-ending-reveal]", { autoAlpha: reduced ? 1 : 0, y: reduced ? 0 : 18 });
    update();
    if (reduced) return;
    const timeline = gsap.timeline()
      .from("[data-ending-moth]", { autoAlpha: 0, scale: .42, filter: "blur(16px)", duration: 2.4, ease: "expo.out" })
      .to("[data-ending-moth]", { y: -8, rotation: 1.5, duration: 1.5, yoyo: true, repeat: 1, ease: "sine.inOut" })
      .to(value, { current: 100, duration: 4.2, ease: "power1.inOut", onUpdate: update }, "-=2.6")
      .to("[data-ending-loader]", { autoAlpha: .55, scale: 1.03, duration: 1.2 })
      .to("[data-ending-reveal]", { autoAlpha: 1, y: 0, duration: 1.2, stagger: .34 }, "-=.6");
    return () => timeline.kill();
  }, { scope: root, dependencies: [reduced] });

  function followMoth() {
    if (departing) return;
    setDeparting(true);
    void audioManager.play("paperRustle", { volume: .2 });
    if (reduced) {
      onComplete();
      return;
    }
    gsap.timeline({ onComplete })
      .to("[data-ending-reveal]", { autoAlpha: 0, y: 16, duration: .45, stagger: .04, ease: "power2.in" })
      .to("[data-ending-loader]", { autoAlpha: 0, scale: 1.18, duration: .7, ease: "power2.in" }, "<")
      .to("[data-ending-moth]", { x: "48vw", y: "-34vh", rotation: 17, scale: .34, autoAlpha: 0, duration: 1.45, ease: "power3.in" }, "-=.52");
  }

  return (
    <section ref={root} className={`${styles.scene} ${styles.mothEnding}`} aria-labelledby="ending-title">
      <div className={styles.endingRoseWindow} aria-hidden="true" />
      <div ref={ring} className={styles.mothLoader} data-ending-loader>
        <div className={styles.mothSpecimen} data-ending-moth><Moth /></div>
        <p><span ref={progress}>000</span><small>%</small></p>
        <i>ПОСЛЕДНИЙ ЗНАК ЗАГРУЖАЕТСЯ</i>
      </div>
      <div className={styles.endingRevelation}>
        <p data-ending-reveal>АРХИВ ЗАКРЫТ · ПРИСУТСТВИЕ ОСТАЛОСЬ</p>
        <h1 data-ending-reveal id="ending-title">Тебя невозможно закончить<br />одним выводом.</h1>
        <blockquote data-ending-reveal>Поэтому вместо точки — мотылёк.</blockquote>
        <div data-ending-reveal className={styles.endingActions}>
          <button className={styles.continueButton} onClick={followMoth} disabled={departing}>последовать за мотыльком</button>
          <form action="/api/auth/logout" method="post"><button type="submit">закрыть дверь</button></form>
        </div>
      </div>
    </section>
  );
}
