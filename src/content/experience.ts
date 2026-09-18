export type SceneId =
  | "intro"
  | "identification"
  | "adequacy"
  | "artworkReveal"
  | "character"
  | "dots"
  | "danger"
  | "weakness"
  | "report"
  | "breakdown"
  | "transition"
  | "journey"
  | "finale"
  | "ending";

export const sceneOrder: SceneId[] = [
  "intro",
  "identification",
  "adequacy",
  "artworkReveal",
  "character",
  "dots",
  "danger",
  "weakness",
  "report",
  "breakdown",
  "transition",
  "journey",
  "finale",
  "ending",
];

export const analysisContent = {
  adequacy: {
    index: "01",
    title: "Проверка адекватности",
    result: "НОРМА ОТКАЗАЛАСЬ СРАБАТЫВАТЬ",
    note: "здравый смысл присутствует, но выбирает не вмешиваться.",
  },
  character: {
    index: "02",
    title: "Распознавание характера",
    result: "КЛАССИФИКАЦИЯ СОРВАНА",
    note: "нежность и вредность обнаружены в одном образце.",
  },
  danger: {
    index: "03",
    title: "Уровень опасности",
    result: "БЕЗОПАСНА · ЕСЛИ НЕ ЛГАТЬ",
    note: "стрелка дрогнула на слове «вероятно».",
  },
  weakness: {
    index: "04",
    title: "Поиск слабых мест",
    result: "ДОСТУП ЗАПЕЧАТАН",
    note: "слабость найдена, но не принадлежит наблюдаемой.",
  },
} as const;

// Replace only these placeholders when YOSYA's real artwork is available.
export const artworkPlaceholders = [
  { id: "artwork-01", title: "ЕЁ РАБОТА · I", palette: ["#243657", "#6f2640", "#a89471"] },
  { id: "artwork-02", title: "ЕЁ РАБОТА · II", palette: ["#182a35", "#725a74", "#9c7f67"] },
  { id: "artwork-03", title: "ЕЁ РАБОТА · III", palette: ["#34243e", "#244852", "#a25c55"] },
] as const;
