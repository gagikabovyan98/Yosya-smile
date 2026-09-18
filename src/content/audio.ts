export type AudioCategory = "MUSIC" | "TRANSITION" | "HORROR_STING" | "TEXTURE" | "OBJECT" | "FINALE";

export type AudioCue = {
  category: AudioCategory;
  volume: number;
  loop?: boolean;
  src: string;
};

export const audioManifest = {
  musicEarly: { category: "MUSIC", volume: 0.2, loop: true, src: "/audio/music/dark-theme.m4a" },
  musicMiddle: { category: "MUSIC", volume: 0.16, loop: true, src: "/audio/music/weird-strings.ogg" },
  musicFinale: { category: "MUSIC", volume: 0.22, loop: true, src: "/audio/music/dark-theme.m4a" },
  churchBell: { category: "HORROR_STING", volume: 0.35, src: "/audio/sfx/church-bell.mp3" },
  woodCreak: { category: "OBJECT", volume: 0.32, src: "/audio/sfx/wood-creak.ogg" },
  paperTurn: { category: "TEXTURE", volume: 0.24, src: "/audio/sfx/paper-move.mp3" },
  paperRustle: { category: "TEXTURE", volume: 0.22, src: "/audio/sfx/paper-rustle.wav" },
  artworkTear: { category: "TRANSITION", volume: 0.28, src: "/audio/sfx/paper-tear.mp3" },
  lowImpact: { category: "HORROR_STING", volume: 0.31, src: "/audio/sfx/low-impact.wav" },
  metalClank: { category: "OBJECT", volume: 0.22, src: "/audio/sfx/metal-clank.wav" },
  stringScrape: { category: "HORROR_STING", volume: 0.18, src: "/audio/sfx/string-scrape.wav" },
  candleOut: { category: "OBJECT", volume: 0.18, src: "/audio/sfx/paper-rustle.wav" },
  finalPiece: { category: "FINALE", volume: 0.26, src: "/audio/sfx/low-impact.wav" },
} satisfies Record<string, AudioCue>;

export type AudioCueId = keyof typeof audioManifest;
