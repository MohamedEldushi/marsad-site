"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/**
 * The observatory's secret. Typing the Konami code
 * (Up Up Down Down Left Right Left Right B A) sends a shower of shooting
 * stars -- the logo's star and streak -- across the night, right to left
 * like the logo's own star, and shows a short message. Plays once per
 * entry, then cleans itself up. Ignored while typing in a form field.
 *
 * Motion: each star streaks in the 1200ms band, staggered; triggered only
 * by the visitor, never ambient. Reduced motion: no stars, just the
 * message. The overlay never takes clicks or focus.
 */
const CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

// Fixed positions and delays so every shower looks composed, not random.
const STARS = [
  { top: "8%", delay: 0, scale: 1 },
  { top: "22%", delay: 140, scale: 0.7 },
  { top: "14%", delay: 300, scale: 0.85 },
  { top: "36%", delay: 420, scale: 0.6 },
  { top: "28%", delay: 600, scale: 1.1 },
  { top: "48%", delay: 760, scale: 0.75 },
  { top: "18%", delay: 900, scale: 0.9 },
];

export function EasterEgg() {
  const t = useTranslations("EasterEgg");
  const [run, setRun] = useState(0);

  useEffect(() => {
    let position = 0;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      position = key === CODE[position] ? position + 1 : key === CODE[0] ? 1 : 0;
      if (position === CODE.length) {
        position = 0;
        setRun((n) => n + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!run) return;
    const id = window.setTimeout(() => setRun(0), 4200);
    return () => window.clearTimeout(id);
  }, [run]);

  if (!run) return null;

  return (
    <div key={run} aria-hidden="false" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {STARS.map((star, index) => (
        <svg
          key={index}
          aria-hidden="true"
          viewBox="0 0 100 100"
          width="120"
          height="120"
          className="easter-star absolute"
          // Physical left, on purpose: the stars always fly right to left
          // (the logo's direction) in both languages.
          style={{ left: "100%", top: star.top, animationDelay: `${star.delay}ms`, ["--s" as string]: star.scale }}
        >
          <path fill="var(--parchment)" d="M85.5 28L29.4 62.5L25.6 55.5Z" />
          <path fill="var(--brass)" d="M27.5 46Q29.84 56.66 40.5 59Q29.84 61.34 27.5 72Q25.16 61.34 14.5 59Q25.16 56.66 27.5 46Z" />
        </svg>
      ))}
      <p
        role="status"
        className="easter-message absolute inset-x-0 bottom-24 mx-auto w-fit rounded border border-muted/30 bg-ink-raised px-6 py-3 font-body text-step-2 text-parchment"
      >
        {t("found")}
      </p>
    </div>
  );
}
