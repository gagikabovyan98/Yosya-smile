import Image from "next/image";
import styles from "../Cinematic.module.scss";

const candleAssets = {
  tall: { src: "/media/objects/candle-tall.webp", width: 512, height: 768 },
  melted: { src: "/media/objects/candle-melted.webp", width: 512, height: 768 },
  candelabra: { src: "/media/objects/candelabra.webp", width: 768, height: 768 },
} as const;

export function Candle({ className = "", variant = "tall" }: { className?: string; variant?: keyof typeof candleAssets }) {
  const asset = candleAssets[variant];
  return (
    <div className={`${styles.candle} ${styles[`candle_${variant}`]} ${className}`} aria-hidden="true" data-candle>
      <span className={styles.candleGlow} data-candle-flame />
      <Image className={styles.candleLit} data-candle-lit src={asset.src} alt="" width={asset.width} height={asset.height} sizes="220px" loading="eager" />
      {variant === "tall" ? (
        <Image className={styles.candleUnlit} data-candle-unlit src="/media/objects/candle-tall-extinguished.webp" alt="" width={512} height={768} sizes="220px" />
      ) : null}
      <span className={styles.candleSmoke} data-candle-smoke />
    </div>
  );
}
