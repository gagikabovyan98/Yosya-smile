"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Experience.module.scss";

gsap.registerPlugin(useGSAP);

const entries = [
  ["ПОДЛИННОСТЬ", "НЕОСПОРИМА"],
  ["АДЕКВАТНОСТЬ", "ИЗБИРАТЕЛЬНА"],
  ["ТЕМПЕРАМЕНТ", "НЕЖНОСТЬ С ОСТРЫМИ КРАЯМИ"],
  ["ОПАСНОСТЬ", "ТОЛЬКО ДЛЯ СКУКИ"],
  ["СЛАБЫЕ МЕСТА", "ЗАПЕЧАТАНЫ ВЛАДЕЛИЦЕЙ"],
  ["ГЛАВНЫЙ СЛЕД", "ОСТАЁТСЯ ПОСЛЕ УХОДА"],
];

export function ReportScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    gsap.timeline()
      .from("[data-report-title]", { autoAlpha: 0, y: -20, duration: reduced ? 0 : 0.7 })
      .from("[data-report-row]", { autoAlpha: 0, x: -16, stagger: reduced ? 0 : 0.16, duration: reduced ? 0 : 0.45 })
      .from("[data-conclusion]", { autoAlpha: 0, duration: reduced ? 0 : 0.7 })
      .from("[data-no]", { autoAlpha: 0, filter: "blur(10px)", duration: reduced ? 0 : 0.9 }, "+=0.8")
      .from("[data-report-next]", { autoAlpha: 0, duration: reduced ? 0 : 0.5 });
  }, { scope: root, dependencies: [reduced] });

  return (
    <section ref={root} className={`${styles.scene} ${styles.reportScene} ${styles.psychoPassportScene}`} aria-labelledby="report-title">
      <div className={styles.passportArchitecture} aria-hidden="true" />
      <article className={styles.dossier}>
        <header data-report-title>
          <p>ЧАСТНЫЙ ПСИХОПАСПОРТ · ЭКЗЕМПЛЯР № 01</p>
          <h1 id="report-title">YOSYA</h1><span>художественный портрет · не диагноз</span>
        </header>
        <dl>
          {entries.map(([term, value]) => (
            <div data-report-row key={term}><dt>{term}</dt><dd>{value}</dd></div>
          ))}
        </dl>
        <div data-conclusion className={styles.conclusion}>
          <span>ОКОНЧАТЕЛЬНОЕ ЗАКЛЮЧЕНИЕ:</span>
          <i className={styles.cursor} aria-hidden="true" />
          <strong data-no>не подлежит упрощению.</strong>
        </div>
      </article>
      <div className={styles.reportAfterword}>
        <p data-no>Все проверки закончились там, где началось узнавание.</p>
        <button data-report-next className={styles.continueButton} onClick={onComplete}>принять последний знак</button>
      </div>
    </section>
  );
}
