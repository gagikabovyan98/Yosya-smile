import styles from "../Cinematic.module.scss";

export function BlueFlowers({ side = "left" }: { side?: "left" | "right" }) {
  return (
    <div className={`${styles.blueFlowers} ${side === "right" ? styles.flowersRight : styles.flowersLeft}`} aria-hidden="true" data-blue-flowers>
      <i className={styles.flowerStem} />
      {[0, 1, 2].map((flower) => (
        <span className={styles.flower} key={flower}>
          {[0, 1, 2, 3, 4].map((petal) => <i key={petal} />)}
          <b />
        </span>
      ))}
    </div>
  );
}

