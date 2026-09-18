export type CinematicSceneId =
  | "intro"
  | "identification"
  | "adequacy"
  | "paper"
  | "character"
  | "framedArtwork"
  | "dots"
  | "danger"
  | "detailReveal"
  | "photoReveal"
  | "weakness"
  | "systemFailure"
  | "journey"
  | "finale"
  | "report"
  | "ending"
  | "albums";

export type PuzzleState =
  | "SCATTERED"
  | "DISCOVERING"
  | "PARTIAL"
  | "ALMOST_COMPLETE"
  | "DISPERSED"
  | "FINAL_ASSEMBLY"
  | "COMPLETE";

const artwork = (id: number, width: number, height: number) => ({
  id: `yosya-artwork-${id}`,
  src: `/media/yosya/artwork-${id}-original.jpg`,
  width,
  height,
  alt: `Оригинальная работа YOSYA № ${id}`,
});

export const cinematicConfig = {
  sceneOrder: [
    "intro",
    "identification",
    "adequacy",
    "paper",
    "character",
    "framedArtwork",
    "dots",
    "danger",
    "detailReveal",
    "photoReveal",
    "weakness",
    "systemFailure",
    "journey",
    "finale",
    "report",
    "ending",
    "albums",
  ] satisfies CinematicSceneId[],
  artworks: {
    puzzleA: { ...artwork(19, 636, 676), fragmentCount: 20 },
    characterI: artwork(10, 960, 1280),
    paperB: artwork(13, 960, 1280),
    framedC: artwork(18, 1181, 1280),
    detailD: artwork(16, 1280, 905),
    typographyE: artwork(11, 960, 1280),
    printF: artwork(14, 905, 1280),
    sheetsG: artwork(15, 1280, 905),
    traceH: artwork(17, 905, 1280),
    dangerJ: artwork(17, 905, 1280),
    weaknessK: artwork(14, 905, 1280),
  },
  photo: {
    id: "yosya-photo-06",
    src: "/media/yosya/photo-06-original.jpg",
    width: 960,
    height: 1280,
    alt: "Фотография YOSYA",
  },
  photos: [
    { id: "yosya-photo-02", src: "/media/yosya/photo-02-original.jpg", width: 960, height: 1280, alt: "YOSYA в красно-чёрном образе" },
    { id: "yosya-photo-06", src: "/media/yosya/photo-06-original.jpg", width: 960, height: 1280, alt: "Портрет YOSYA с красными волосами" },
    { id: "yosya-photo-08", src: "/media/yosya/photo-08-original.jpg", width: 956, height: 1280, alt: "Портрет YOSYA в красном свете" },
    { id: "yosya-photo-09", src: "/media/yosya/photo-09-original.jpg", width: 1042, height: 1280, alt: "Тёплый портрет YOSYA" },
  ],
  text: {
    paper: "Она рисует не лица — следы, которые остаются после них.",
    framed: "Некоторые признания переживают тех, кто их произнёс.",
    detail: "Чем дольше смотришь, тем меньше это похоже на портрет.",
    failure: "Комната больше не помнит, кто здесь наблюдает.",
    journey: "Ветер унёс порядок, но оставил почерк.",
    final: "Все дороги этого дома вели к одной работе.",
  },
  timings: {
    photoHold: 2.1,
    finalPauseBeforeLastPiece: 2.1,
  },
} as const;

/** Backward-compatible alias used only by the single puzzle mechanic. */
export const puzzleArtwork = cinematicConfig.artworks.puzzleA;
export const sceneOrder = cinematicConfig.sceneOrder;
