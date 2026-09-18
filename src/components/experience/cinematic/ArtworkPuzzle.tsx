"use client";

import { useId } from "react";
import { puzzleArtwork, type PuzzleState } from "@/content/cinematic";
import styles from "../Cinematic.module.scss";

type Fragment = {
  id: number;
  points: string;
  scatterX: number;
  scatterY: number;
  rotation: number;
  scale: number;
  depth: "foreground" | "midground" | "background";
};

const revealOrder = [9, 10, 5, 14, 6, 13, 2, 17, 8, 11, 1, 18, 4, 15, 7, 12, 0, 19, 3, 16];
const scatters = [
  [-8, 5, -9, 1.2], [9, -7, 7, 0.86], [-16, -9, -13, 1.35], [17, 10, 10, 0.8],
  [-8, 25, 6, 1.08], [22, 4, -7, 0.92], [-35, 10, 12, 1.35], [9, -25, -5, 0.82],
  [26, -20, 8, 1.16], [-4, 12, -4, 1], [18, 22, 5, 0.94], [-24, -7, -10, 1.22],
  [33, -3, 9, 0.78], [-12, -23, 4, 0.9], [6, 28, -8, 1.3], [-31, 24, 11, 0.84],
  [38, 11, -6, 1.05], [-20, 18, 8, 0.96], [12, -30, -11, 1.12], [-39, -16, 7, 1.42],
] as const;

const depthOrder: Fragment["depth"][] = [
  "midground", "background", "foreground", "background", "midground",
  "midground", "foreground", "background", "midground", "midground",
  "background", "foreground", "background", "midground", "foreground",
  "background", "midground", "background", "midground", "foreground",
];

function edge(seed: number, amplitude: number) {
  const values = [-1, 0.55, -0.35, 0.8, -0.7, 0.25, 0.65, -0.5];
  return values[seed % values.length] * amplitude;
}

function polygonFor(cell: number) {
  const column = cell % 4;
  const row = Math.floor(cell / 4);
  const width = 25;
  const height = 106.29 / 5;
  const x0 = column * width;
  const x1 = x0 + width;
  const y0 = row * height;
  const y1 = y0 + height;
  const bleed = 0.72;
  const seed = cell * 3 + 1;

  return [
    [x0 - bleed, y0 - bleed],
    [x0 + width * 0.31, y0 + edge(seed, 1.35)],
    [x0 + width * 0.68, y0 + edge(seed + 1, 1.2)],
    [x1 + bleed, y0 - bleed],
    [x1 + edge(seed + 2, 1.1), y0 + height * 0.33],
    [x1 + edge(seed + 3, 1.25), y0 + height * 0.69],
    [x1 + bleed, y1 + bleed],
    [x0 + width * 0.66, y1 + edge(seed + 4, 1.3)],
    [x0 + width * 0.29, y1 + edge(seed + 5, 1.15)],
    [x0 - bleed, y1 + bleed],
    [x0 + edge(seed + 6, 1.2), y0 + height * 0.67],
    [x0 + edge(seed + 7, 1.05), y0 + height * 0.32],
  ].map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

const fragments: Fragment[] = revealOrder.map((cell, index) => ({
  id: cell,
  points: polygonFor(cell),
  scatterX: scatters[index][0],
  scatterY: scatters[index][1],
  rotation: scatters[index][2],
  scale: scatters[index][3],
  depth: depthOrder[index],
}));

const defaultVisible: Record<PuzzleState, number> = {
  SCATTERED: 1,
  DISCOVERING: 4,
  PARTIAL: 9,
  ALMOST_COMPLETE: 19,
  DISPERSED: 12,
  FINAL_ASSEMBLY: 20,
  COMPLETE: 20,
};

const joinedByState: Record<PuzzleState, number> = {
  SCATTERED: 0,
  DISCOVERING: 0,
  PARTIAL: 3,
  ALMOST_COMPLETE: 19,
  DISPERSED: 0,
  FINAL_ASSEMBLY: 20,
  COMPLETE: 20,
};

export function ArtworkPuzzle({
  state,
  visibleCount = defaultVisible[state],
  scatterScale = 1,
  className = "",
}: {
  state: PuzzleState;
  visibleCount?: number;
  scatterScale?: number;
  className?: string;
}) {
  const prefix = useId().replaceAll(":", "");
  const joinedCount = joinedByState[state];

  return (
    <svg
      className={`${styles.artworkPuzzle} ${className}`}
      viewBox="0 0 100 106.29"
      role="img"
      aria-label={puzzleArtwork.alt}
      data-puzzle-state={state}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {fragments.map((fragment) => (
          <clipPath id={`${prefix}-fragment-${fragment.id}`} clipPathUnits="userSpaceOnUse" key={fragment.id}>
            <polygon points={fragment.points} />
          </clipPath>
        ))}
      </defs>
      {fragments.map((fragment, index) => {
        const visible = index < visibleCount;
        const joined = index < joinedCount;
        const column = fragment.id % 4;
        const row = Math.floor(fragment.id / 4);
        const centerX = column * 25 + 12.5;
        const centerY = row * (106.29 / 5) + (106.29 / 10);
        const fragmentTransform = joined
          ? undefined
          : [
              `translate(${fragment.scatterX * scatterScale} ${fragment.scatterY * scatterScale})`,
              `translate(${centerX} ${centerY})`,
              `rotate(${fragment.rotation})`,
              `scale(${fragment.scale})`,
              `translate(${-centerX} ${-centerY})`,
            ].join(" ");

        return (
          <g
            className={`${styles.puzzleFragment} ${visible ? styles.fragmentVisible : ""} ${joined ? styles.fragmentJoined : ""} ${styles[fragment.depth]}`}
            clipPath={`url(#${prefix}-fragment-${fragment.id})`}
            data-fragment
            data-fragment-index={index}
            data-scatter-x={fragment.scatterX}
            data-scatter-y={fragment.scatterY}
            data-scatter-r={fragment.rotation}
            data-depth={fragment.depth}
            transform={fragmentTransform}
            key={fragment.id}
          >
            <image
              href={puzzleArtwork.src}
              x="0"
              y="0"
              width="100"
              height="106.29"
              preserveAspectRatio="none"
            />
          </g>
        );
      })}
    </svg>
  );
}
