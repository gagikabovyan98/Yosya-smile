"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cinematicConfig } from "@/content/cinematic";
import { audioManager } from "@/lib/audio/AudioManager";
import { AristocraticFrame, type FrameVariant } from "../cinematic/AristocraticFrame";
import { useReducedMotion } from "../useReducedMotion";
import styles from "../Experience.module.scss";

gsap.registerPlugin(useGSAP);

type BookId = "portrait" | "art";
type AlbumImage = { src: string; width: number; height: number; alt: string; frame: FrameVariant };
type Spread = {
  eyebrow: string;
  title: string;
  text: string;
  note: string;
  images: [AlbumImage, AlbumImage?];
};

const photos = cinematicConfig.photos;
const works = cinematicConfig.artworks;

const portraitSpreads: Spread[] = [
  {
    eyebrow: "ПОРТРЕТ I · ПРИСУТСТВИЕ",
    title: "Красивую замечают. Тебя — запоминают.",
    text: "Не из-за цвета волос и не из-за того, как на тебя падает свет. Просто после тебя пространство уже не выглядит прежним.",
    note: "Пометка на полях: эффект сохраняется даже после закрытия страницы.",
    images: [{ ...photos[0], frame: "ovalVictorian" }],
  },
  {
    eyebrow: "ПОРТРЕТ II · РЕВНОСТЬ",
    title: "Да, я иногда ревную.",
    text: "Не потому, что не верю тебе. Просто слишком хорошо понимаю, как легко тебя заметить — и как трудно потом сделать вид, будто не заметил.",
    note: "Это не запрет. Это честное признание в том, насколько ты мне дорога.",
    images: [{ ...photos[1], frame: "brass" }],
  },
  {
    eyebrow: "ПОРТРЕТ III · НЕЖНОСТЬ",
    title: "Ты умеешь быть нежной так, будто это тоже форма опасности.",
    text: "Именно поэтому рядом с тобой хочется не защищаться, а остаться. Даже когда вокруг темно и всё выглядит немного неправильным.",
    note: "Улика № 03: рядом с тобой страшное почему-то становится красивым.",
    images: [{ ...photos[2], frame: "silver" }],
  },
  {
    eyebrow: "ПОРТРЕТ IV · ТИШИНА",
    title: "Даже когда ты молчишь, у комнаты меняется характер.",
    text: "Ты не обязана быть громкой, чтобы занимать всё внимание. Иногда достаточно одного взгляда — и у вечера появляется сюжет.",
    note: "Последняя запись: твоя тишина никогда не бывает пустой.",
    images: [{ ...photos[3], frame: "paperOnly" }],
  },
];

const artSpreads: Spread[] = [
  {
    eyebrow: "ЛИСТ I · ЛИНИЯ",
    title: "Сначала кажется, что это просто линия.",
    text: "Потом замечаешь: она уже что-то о тебе знает. В твоих рисунках люди не позируют — они на секунду забывают спрятаться.",
    note: "Две работы. Два разных молчания.",
    images: [{ ...works.characterI, frame: "carvedWood" }, { ...works.paperB, frame: "paperOnly" }],
  },
  {
    eyebrow: "ЛИСТ II · ВЗГЛЯД",
    title: "У каждой работы свой голос.",
    text: "Ни одна не просит разрешения остаться в памяти. Некоторые смотрят прямо, другие отворачиваются — но равнодушных среди них нет.",
    note: "Архив не смог определить, кто здесь наблюдатель.",
    images: [{ ...works.sheetsG, frame: "silver" }, { ...works.detailD, frame: "broken" }],
  },
  {
    eyebrow: "ЛИСТ III · ПОЧЕРК",
    title: "Ты видишь их на секунду раньше, чем они успевают спрятаться.",
    text: "Поэтому в этих лицах есть что-то слишком настоящее. Не идеальное — живое. И от этого намного красивее.",
    note: "Поля намеренно оставлены неровными: так честнее.",
    images: [{ ...works.traceH, frame: "gothicArch" }, { ...works.framedC, frame: "brass" }],
  },
  {
    eyebrow: "ЛИСТ IV · КОМНАТА",
    title: "Я собрал их не для архива.",
    text: "Мне просто хотелось, чтобы у твоего мира была ещё одна комната. Та, где ни одна работа не потеряется и каждой достанется собственная рама.",
    note: "Продолжение следует — столько раз, сколько ты ещё нарисуешь.",
    images: [{ ...works.puzzleA, frame: "ovalVictorian" }, { ...works.typographyE, frame: "carvedWood" }],
  },
];

const books = {
  portrait: { numeral: "I", label: "Ты", subtitle: "то, что невозможно измерить", spreads: portraitSpreads },
  art: { numeral: "II", label: "Твои работы", subtitle: "то, что остаётся после взгляда", spreads: artSpreads },
} as const;

export function AlbumScene({ onRestart }: { onRestart: () => void }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [activeBook, setActiveBook] = useState<BookId | null>(null);
  const [page, setPage] = useState(0);
  const [completed, setCompleted] = useState<Record<BookId, boolean>>({ portrait: false, art: false });

  const allComplete = completed.portrait && completed.art;
  const book = activeBook ? books[activeBook] : null;
  const spread = book?.spreads[page];

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const preview = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const previewBook = preview.get("book");
    if (previewBook !== "portrait" && previewBook !== "art") return;
    const previewPage = Number(preview.get("page") ?? 0);
    setActiveBook(previewBook);
    setPage(Math.max(0, Math.min(books[previewBook].spreads.length - 1, Number.isFinite(previewPage) ? previewPage : 0)));
  }, []);

  useGSAP(() => {
    if (reduced) return;
    if (activeBook) {
      gsap.fromTo("[data-album-spread]", { autoAlpha: 0, rotateY: page % 2 ? -7 : 7, y: 20 }, { autoAlpha: 1, rotateY: 0, y: 0, duration: .85, ease: "power3.out" });
      gsap.from("[data-album-art]", { autoAlpha: 0, scale: .94, y: 12, duration: .75, stagger: .14, delay: .18, ease: "power2.out" });
    } else {
      gsap.from("[data-album-cover]", { autoAlpha: 0, y: 60, rotateX: -14, duration: 1.2, stagger: .18, ease: "power3.out" });
      gsap.from("[data-library-copy]", { autoAlpha: 0, y: 14, duration: .9, delay: .35, ease: "power2.out" });
    }
  }, { scope: root, dependencies: [activeBook, page, reduced, allComplete] });

  function openBook(id: BookId) {
    void audioManager.play("woodCreak", { volume: .16 });
    setPage(0);
    setActiveBook(id);
  }

  function turn(direction: -1 | 1) {
    if (!book || !activeBook) return;
    void audioManager.play("paperTurn", { volume: .18 });
    const nextPage = Math.max(0, Math.min(book.spreads.length - 1, page + direction));
    setPage(nextPage);
    if (nextPage === book.spreads.length - 1) {
      setCompleted((current) => ({ ...current, [activeBook]: true }));
    }
  }

  function closeBook() {
    void audioManager.play("paperRustle", { volume: .15 });
    setActiveBook(null);
    setPage(0);
  }

  return (
    <section ref={root} className={`${styles.scene} ${styles.albumScene}`} aria-labelledby="album-title">
      <div className={styles.libraryArchitecture} aria-hidden="true"><span /><span /><span /></div>
      <div className={styles.albumMothTrail} aria-hidden="true"><i /><i /><i /><i /></div>

      {!activeBook ? (
        <div className={styles.albumLibrary}>
          <header data-library-copy className={styles.albumIntro}>
            <p>ЭПИЛОГ · ЛИЧНАЯ БИБЛИОТЕКА</p>
            <h1 id="album-title">Мотылёк знал ещё одну дверь.</h1>
            <span>{allComplete ? "Обе истории прочитаны. Теперь можно закрыть дом." : "Здесь две книги. Каждую нужно открыть."}</span>
          </header>

          <div className={styles.albumCovers}>
            {(Object.keys(books) as BookId[]).map((id) => {
              const item = books[id];
              return (
                <button
                  key={id}
                  type="button"
                  data-album-cover
                  className={`${styles.albumCover} ${id === "portrait" ? styles.portraitCover : styles.artCover}`}
                  onClick={() => openBook(id)}
                  aria-label={`Открыть книгу «${item.label}»`}
                >
                  <span className={styles.bookPages} aria-hidden="true" />
                  <span className={styles.coverBorder} aria-hidden="true" />
                  <span className={styles.coverNumeral}>{item.numeral}</span>
                  <strong>{item.label}</strong>
                  <em>{item.subtitle}</em>
                  <span className={styles.coverSeal}>{completed[id] ? "прочитано" : "открыть"}</span>
                </button>
              );
            })}
          </div>

          {allComplete ? (
            <div data-library-copy className={styles.albumFarewell}>
              <p>Теперь действительно всё.</p>
              <blockquote>Кроме того, что ещё будет.</blockquote>
              <div className={styles.endingActions}>
                <button type="button" className={styles.continueButton} onClick={onRestart}>открыть дом сначала</button>
                <form action="/api/auth/logout" method="post"><button type="submit">сохранить и закрыть</button></form>
              </div>
            </div>
          ) : null}
        </div>
      ) : spread && book ? (
        <div className={styles.openAlbum} data-album-spread key={`${activeBook}-${page}`}>
          <button type="button" className={styles.albumClose} onClick={closeBook}>закрыть книгу</button>
          <div className={styles.albumSpread}>
            <div className={`${styles.albumPaper} ${styles.albumVisualPage}`}>
              <span className={styles.pageNumber}>— {String(page * 2 + 1).padStart(2, "0")} —</span>
              <div className={`${styles.albumArtworkLayout} ${spread.images[1] ? styles.albumArtworkPair : ""}`}>
                {spread.images.map((image, index) => image ? (
                  <AristocraticFrame key={image.src} variant={image.frame} className={styles.albumArtworkFrame}>
                    <Image
                      data-album-art
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes={spread.images[1] ? "(max-width: 700px) 32vw, 22vw" : "(max-width: 700px) 55vw, 31vw"}
                      priority={index === 0}
                    />
                  </AristocraticFrame>
                ) : null)}
              </div>
            </div>

            <article className={`${styles.albumPaper} ${styles.albumTextPage}`}>
              <span className={styles.pageNumber}>— {String(page * 2 + 2).padStart(2, "0")} —</span>
              <p className={styles.albumEyebrow}>{spread.eyebrow}</p>
              <h2>{spread.title}</h2>
              <p className={styles.albumBody}>{spread.text}</p>
              <blockquote>{spread.note}</blockquote>
              <span className={styles.albumSignature}>Y · {book.numeral}</span>
            </article>
          </div>

          <nav className={styles.albumNav} aria-label="Страницы альбома">
            <button type="button" onClick={() => turn(-1)} disabled={page === 0}>предыдущая</button>
            <span>{book.label} · {page + 1} / {book.spreads.length}</span>
            {page < book.spreads.length - 1
              ? <button type="button" onClick={() => turn(1)}>перевернуть страницу</button>
              : <button type="button" onClick={closeBook}>закрыть книгу</button>}
          </nav>
        </div>
      ) : null}
    </section>
  );
}
