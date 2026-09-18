import Image from "next/image";
import styles from "./Experience.module.scss";

type EnvironmentVariant = "identification" | "adequacy";

const environments = {
  identification: {
    src: "/images/cathedral-identification.webp",
    className: styles.identificationEnvironment,
  },
  adequacy: {
    src: "/images/altar-adequacy.webp",
    className: styles.adequacyEnvironment,
  },
} as const;

export function GothicEnvironment({ variant }: { variant: EnvironmentVariant }) {
  const environment = environments[variant];

  return (
    <div className={`${styles.gothicEnvironment} ${environment.className}`} aria-hidden="true">
      <Image src={environment.src} alt="" fill priority sizes="100vw" />
      <div className={styles.environmentVeil} />
      <div className={styles.environmentDepth} />
    </div>
  );
}
