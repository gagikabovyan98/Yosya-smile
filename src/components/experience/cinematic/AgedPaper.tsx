import type { CSSProperties, ReactNode } from "react";
import styles from "../Cinematic.module.scss";

export type AgedPaperVariant = "letter" | "bookPage" | "archiveSheet" | "smallNote" | "poster";

export function AgedPaper({
  children,
  variant = "letter",
  rotation = -1.5,
  className = "",
}: {
  children?: ReactNode;
  variant?: AgedPaperVariant;
  rotation?: number;
  className?: string;
}) {
  return (
    <div
      className={`${styles.agedPaper} ${styles[variant]} ${className}`}
      style={{ "--paper-rotation": `${rotation}deg` } as CSSProperties}
    >
      <span className={styles.paperFold} aria-hidden="true" />
      <span className={styles.paperStain} aria-hidden="true" />
      <div className={styles.paperContent}>{children}</div>
    </div>
  );
}

