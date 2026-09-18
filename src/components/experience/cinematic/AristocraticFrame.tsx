import type { ReactNode } from "react";
import styles from "./AristocraticFrame.module.scss";

export type FrameVariant = "brass" | "carvedWood" | "gothicArch" | "silver" | "ovalVictorian" | "paperOnly" | "broken";

export function AristocraticFrame({ variant, children, className = "" }: { variant: FrameVariant; children: ReactNode; className?: string }) {
  return (
    <div className={`${styles.frame} ${styles[variant]} ${className}`} data-frame-variant={variant}>
      <span className={styles.outer} aria-hidden="true" />
      <span className={styles.inner} aria-hidden="true" />
      <span className={styles.cornerA} aria-hidden="true" />
      <span className={styles.cornerB} aria-hidden="true" />
      <div className={styles.art}>{children}</div>
      {variant === "broken" ? <span className={styles.break} aria-hidden="true" /> : null}
    </div>
  );
}
