"use client";

import { useEffect, useState } from "react";
import { cinematicConfig, sceneOrder, type CinematicSceneId } from "@/content/cinematic";
import { audioManager } from "@/lib/audio/AudioManager";
import { IntroScene } from "./scenes/IntroScene";
import { IdentificationScene } from "./scenes/IdentificationScene";
import { PaperScene } from "./scenes/PaperScene";
import { FramedArtworkScene } from "./scenes/FramedArtworkScene";
import { FullscreenArtworkScene } from "./scenes/FullscreenArtworkScene";
import { PhotoRevealScene } from "./scenes/PhotoRevealScene";
import { DotsScene } from "./scenes/DotsScene";
import { SystemFailureScene } from "./scenes/SystemFailureScene";
import { JourneyScene } from "./scenes/JourneyScene";
import { FinaleScene } from "./scenes/FinaleScene";
import { AnalysisScene } from "./scenes/AnalysisScene";
import { ReportScene } from "./scenes/ReportScene";
import { EndingScene } from "./scenes/EndingScene";
import { AlbumScene } from "./scenes/AlbumScene";
import styles from "./Experience.module.scss";
import cinematicStyles from "./Cinematic.module.scss";

const preloadByScene: Partial<Record<CinematicSceneId, string>> = {
  identification: cinematicConfig.artworks.puzzleA.src,
  character: cinematicConfig.artworks.characterI.src,
  paper: cinematicConfig.artworks.paperB.src,
  framedArtwork: cinematicConfig.artworks.framedC.src,
  detailReveal: cinematicConfig.artworks.detailD.src,
  photoReveal: cinematicConfig.photo.src,
  danger: cinematicConfig.artworks.dangerJ.src,
  weakness: cinematicConfig.artworks.weaknessK.src,
  systemFailure: cinematicConfig.artworks.typographyE.src,
  journey: cinematicConfig.artworks.printF.src,
  finale: cinematicConfig.artworks.traceH.src,
  albums: cinematicConfig.photos[0].src,
};

export function Experience() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [booting, setBooting] = useState(true);
  const [muted, setMuted] = useState(false);
  const scene = sceneOrder[sceneIndex] ?? "intro";
  const hidesChrome = ["detailReveal", "photoReveal", "dots", "finale", "ending", "albums"].includes(scene);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const jumpToPreviewScene = () => {
      const requested = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("scene") as CinematicSceneId | null;
      if (!requested) return;
      const index = sceneOrder.indexOf(requested);
      if (index >= 0) setSceneIndex(index);
    };
    window.addEventListener("hashchange", jumpToPreviewScene);
    jumpToPreviewScene();
    return () => window.removeEventListener("hashchange", jumpToPreviewScene);
  }, []);

  useEffect(() => {
    document.body.classList.add("experience-locked");
    window.scrollTo({ top: 0, behavior: "instant" });
    audioManager.enterScene(scene);
    const nextScene = sceneOrder[sceneIndex + 1];
    const nextAsset = nextScene ? preloadByScene[nextScene] : undefined;
    if (nextAsset) { const image = new window.Image(); image.src = nextAsset; }
    return () => document.body.classList.remove("experience-locked");
  }, [scene, sceneIndex]);

  function next() {
    void audioManager.activate();
    setSceneIndex((current) => Math.min(current + 1, sceneOrder.length - 1));
  }

  function toggleSound() {
    void audioManager.activate();
    setMuted(audioManager.toggleMuted());
  }

  if (booting) {
    return <main className={styles.preloader}><span className={styles.preloaderMark}>Y</span><p>ДВЕРЬ ОТКРЫВАЕТСЯ</p></main>;
  }

  return (
    <main className={`${styles.experience} ${cinematicStyles.cinematicExperience}`}>
      <div className={styles.grain} aria-hidden="true" />
      <header className={`${cinematicStyles.cinematicHeader} ${hidesChrome ? cinematicStyles.chromeHidden : ""}`}>
        <span>YOSYA · {String(sceneIndex + 1).padStart(2, "0")}</span>
        <div>
          <button type="button" onClick={toggleSound} aria-label={muted ? "Включить звук" : "Выключить звук"}>{muted ? "звук выключен" : "звук"}</button>
          <form action="/api/auth/logout" method="post"><button type="submit">выход</button></form>
        </div>
      </header>
      <Scene scene={scene} onNext={next} onRestart={() => setSceneIndex(0)} />
    </main>
  );
}

function Scene({ scene, onNext, onRestart }: { scene: CinematicSceneId; onNext: () => void; onRestart: () => void }) {
  switch (scene) {
    case "intro": return <IntroScene onComplete={onNext} />;
    case "identification": return <IdentificationScene onComplete={onNext} />;
    case "adequacy": return <AnalysisScene type="adequacy" onComplete={onNext} />;
    case "paper": return <PaperScene onComplete={onNext} />;
    case "character": return <AnalysisScene type="character" onComplete={onNext} />;
    case "framedArtwork": return <FramedArtworkScene onComplete={onNext} />;
    case "dots": return <DotsScene onComplete={onNext} />;
    case "danger": return <AnalysisScene type="danger" onComplete={onNext} />;
    case "detailReveal": return <FullscreenArtworkScene onComplete={onNext} />;
    case "photoReveal": return <PhotoRevealScene onComplete={onNext} />;
    case "weakness": return <AnalysisScene type="weakness" onComplete={onNext} />;
    case "systemFailure": return <SystemFailureScene onComplete={onNext} />;
    case "journey": return <JourneyScene onComplete={onNext} />;
    case "finale": return <FinaleScene onComplete={onNext} />;
    case "report": return <ReportScene onComplete={onNext} />;
    case "ending": return <EndingScene onComplete={onNext} />;
    case "albums": return <AlbumScene onRestart={onRestart} />;
  }
}
