import { puzzleArtwork } from "@/content/cinematic";
import styles from "../Cinematic.module.scss";

const pieces = [styles.tearPieceOne, styles.tearPieceTwo, styles.tearPieceThree, styles.tearPieceFour];

export function ArtworkTear({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.artworkTear} ${className}`} aria-hidden="true">
      {pieces.map((piece) => (
        <span
          className={`${styles.tearPiece} ${piece}`}
          data-tear-piece
          style={{ backgroundImage: `url(${puzzleArtwork.src})` }}
          key={piece}
        />
      ))}
    </div>
  );
}
