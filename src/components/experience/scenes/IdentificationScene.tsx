"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArtworkPuzzle } from "../cinematic/ArtworkPuzzle";
import { GothicEnvironment } from "../GothicEnvironment";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Cinematic.module.scss";

gsap.registerPlugin(useGSAP);

export function IdentificationScene({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced) return;
    const mm = gsap.matchMedia();

    mm.add({ desktop: "(min-width: 801px)", mobile: "(max-width: 800px)" }, (context) => {
      const mobile = context.conditions?.mobile;
      const pieces = gsap.utils.toArray<SVGGElement>("[data-fragment]").slice(0, 4);
      const timeline = gsap.timeline();

      timeline
        .from("[data-id-environment]", { autoAlpha: 0, scale: 1.08, duration: 2.6, ease: "sine.out" })
        .from(pieces, {
          autoAlpha: 0,
          scale: mobile ? 0.78 : 0.64,
          duration: 2.2,
          stagger: 0.78,
          ease: "power3.out",
        }, "-=1.2")
        .to(pieces[0], { x: 0, y: 0, rotation: 0, scale: 1, duration: 2.8, ease: "power2.inOut" }, "+=0.45")
        .to(pieces[1], { x: 0, y: 0, rotation: 0, scale: 1, duration: 3.1, ease: "power3.inOut" }, "-=2.2")
        .from("[data-recognition]", { autoAlpha: 0, y: 12, duration: 1.15, ease: "sine.out" }, "+=0.6")
        .from("[data-name]", { autoAlpha: 0, letterSpacing: mobile ? "0.46em" : "0.8em", filter: "blur(8px)", duration: 1.8, ease: "power2.out" })
        .from("[data-id-next]", { autoAlpha: 0, duration: 0.9 }, "+=0.55");
    });

    return () => mm.revert();
  }, { scope: root, dependencies: [reduced] });

  return (
    <section ref={root} className={styles.identificationScene} aria-labelledby="identification-title">
      <div className={styles.identificationEnvironment} data-id-environment>
        <GothicEnvironment variant="identification" />
      </div>
      <div className={styles.identificationShadow} aria-hidden="true" />
      <div className={styles.identificationPuzzle}>
        <ArtworkPuzzle state="DISCOVERING" scatterScale={0.72} />
      </div>
      <div className={styles.recognition}>
        <p data-recognition>совпадение найдено</p>
        <h1 id="identification-title" data-name>YOSYA</h1>
        <button data-id-next className={styles.cinematicButton} onClick={onComplete}>не отводить взгляд</button>
      </div>
    </section>
  );
}
