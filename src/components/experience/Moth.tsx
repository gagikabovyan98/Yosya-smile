import Image from "next/image";
import styles from "./Experience.module.scss";

export function Moth({ className = "" }: { className?: string }) {
  return (
    <Image
      className={`${styles.moth} ${className}`}
      src="/media/objects/deaths-head-moth.webp"
      width={1536}
      height={1024}
      sizes="(max-width: 700px) 72vw, 36vw"
      alt="Мотылёк с узором в форме черепа"
      priority
    />
  );
}
