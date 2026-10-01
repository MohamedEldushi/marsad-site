"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

/**
 * A game's screenshots: a grid of 16:9 thumbnails, each opening a
 * full-screen viewer (approved by the studio: the one place on the site a
 * viewer is justified).
 *
 * The viewer is the browser's own modal <dialog> (showModal): it traps
 * focus, makes the page behind it inert, and closes on Escape for free.
 * Previous / next by button or by arrow key; in Arabic the arrows follow
 * the reading direction (ArrowLeft = next). Focus returns to the
 * thumbnail that opened it. It opens and changes instantly -- no
 * animation, so there's nothing to reduce under reduced motion.
 *
 * Each screenshot is a public image path ("/art/...") once art exists;
 * until then it's a slot name, shown with the CLAUDE.md section 5
 * placeholder treatment (--ink-raised block + the slot name).
 */
export function ScreenshotGallery({ screenshots, gameTitle }: { screenshots: string[]; gameTitle: string }) {
  const t = useTranslations("GameDetail");
  const rtl = useLocale() === "ar";
  const dialog = useRef<HTMLDialogElement>(null);
  const openers = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  // Which thumbnail opened the viewer, so focus can go back to it.
  const opener = useRef<number | null>(null);
  const total = screenshots.length;

  const open = (i: number) => {
    opener.current = i;
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + total) % total));

  // However the viewer closes (button, Escape), return focus to the
  // thumbnail that opened it.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClose = () => {
      setIndex(null);
      if (opener.current !== null) openers.current[opener.current]?.focus();
    };
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") step(rtl ? -1 : 1);
    else if (event.key === "ArrowLeft") step(rtl ? 1 : -1);
  };

  const alt = (i: number) => t("screenshotAlt", { game: gameTitle, n: String(i + 1) });
  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";
  const control = `flex h-12 w-12 items-center justify-center rounded border border-muted/40 bg-ink text-parchment transition-colors duration-200 ease-[var(--ease-entrance)] hover:border-muted ${focus}`;

  const shot = (src: string, i: number, sizes: string, priority = false) =>
    src.startsWith("/") ? (
      <Image src={src} alt={alt(i)} fill sizes={sizes} priority={priority} className="object-cover" />
    ) : (
      <span role="img" aria-label={alt(i)} className="absolute inset-0 flex items-center justify-center px-4 text-center font-body text-step-1 text-muted">
        {src}
      </span>
    );

  // Directional chevron: mirrors in RTL (CLAUDE.md section 3).
  const chevron = (dir: "prev" | "next") => (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" className="rtl:-scale-x-100">
      <path d={dir === "next" ? "M7 4l6 6-6 6" : "M13 4l-6 6 6 6"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
    </svg>
  );

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {screenshots.map((src, i) => (
          <li key={`${src}-${i}`}>
            <button
              ref={(el) => {
                openers.current[i] = el;
              }}
              type="button"
              onClick={() => open(i)}
              aria-label={t("viewerOpen", { n: String(i + 1), total: String(total) })}
              aria-haspopup="dialog"
              className="group relative block aspect-video w-full overflow-hidden border border-muted/20 bg-ink-raised transition-colors duration-200 ease-[var(--ease-entrance)] hover:border-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
            >
              <span className="absolute inset-0 transition-transform duration-200 ease-[var(--ease-entrance)] motion-safe:group-hover:scale-[1.04]">
                {shot(src, i, "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw")}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={t("viewerLabel", { game: gameTitle })}
        onKeyDown={onKeyDown}
        className="screenshot-viewer m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-parchment"
      >
        {index !== null && (
          <div className="flex h-full flex-col gap-4 p-4 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <p aria-live="polite" className="font-body text-step-2 tabular-nums text-muted">
                {t("viewerCount", { n: String(index + 1), total: String(total) })}
              </p>
              <button type="button" onClick={() => dialog.current?.close()} className={control}>
                <span className="sr-only">{t("viewerClose")}</span>
                {/* Symmetric: identical in both directions. */}
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
                </svg>
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center">
              <div className="relative aspect-video max-h-full w-full max-w-[min(100%,calc((100svh-12rem)*16/9))] overflow-hidden border border-muted/20 bg-ink-raised">
                {shot(screenshots[index], index, "100vw", true)}
              </div>
            </div>

            {total > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button type="button" onClick={() => step(-1)} className={control}>
                  <span className="sr-only">{t("viewerPrevious")}</span>
                  {chevron("prev")}
                </button>
                <button type="button" onClick={() => step(1)} className={control}>
                  <span className="sr-only">{t("viewerNext")}</span>
                  {chevron("next")}
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
