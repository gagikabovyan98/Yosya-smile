import { artworkPlaceholders } from "@/content/experience";
import styles from "./Experience.module.scss";

type ArtworkVariant = "contained" | "floating" | "fullscreen";

export function ArtworkFragments({
  artworkIndex = 0,
  assembled = false,
  variant = "contained",
}: {
  artworkIndex?: number;
  assembled?: boolean;
  variant?: ArtworkVariant;
}) {
  const artwork = artworkPlaceholders[artworkIndex];

  return (
    <div
      className={`${styles.artworkFragments} ${assembled ? styles.assembled : ""} ${styles[`artwork${variant[0].toUpperCase()}${variant.slice(1)}`]}`}
      data-artwork={artwork.id}
      aria-label={`${artwork.title}: место для будущего рисунка YOSYA`}
    >
      {Array.from({ length: 6 }, (_, index) => (
        <span
          className={styles.artworkPiece}
          data-piece={index + 1}
          key={index}
          style={
            {
              "--piece-a": artwork.palette[index % artwork.palette.length],
              "--piece-b": artwork.palette[(index + 1) % artwork.palette.length],
            } as React.CSSProperties
          }
        >
          <small>{String(index + 1).padStart(2, "0")}</small>
        </span>
      ))}
      {variant === "contained" && <strong>{artwork.title}</strong>}
    </div>
  );
}
