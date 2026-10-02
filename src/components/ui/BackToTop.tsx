"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/**
 * Back to top: the logo's shooting star, turned to point up. Appears once
 * the reader is about a screen down (most pages, including short ones, get there); on click the star
 * "launches" (a quick 200ms streak upward) while the page glides back to
 * the top, and focus moves to the page content so keyboard users aren't
 * stranded on a button that has just disappeared.
 *
 * Sits in the bottom end corner: bottom-left in Arabic, bottom-right in
 * English (logical `end`). The star itself is a brand mark: not mirrored.
 * Reduced motion: no launch, and the jump to the top is instant.
 */
export function BackToTop() {
  const t = useTranslations("BackToTop");
  const [visible, setVisible] = useState(false);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * 0.9);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      setLaunching(true);
      window.setTimeout(() => setLaunching(false), 600);
    }
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label={t("label")}
      title={t("label")}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`group fixed end-4 z-40 flex h-12 w-12 items-center justify-center overflow-hidden rounded border border-muted/30 bg-ink-raised text-parchment transition-[opacity,translate,border-color] duration-200 ease-[var(--ease-entrance)] hover:border-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:end-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      {/* The logo's small-size mark (bigger star, short stub; made for
          sizes like this), turned so the star leads upward. The viewBox
          re-centres the rotated mark. Not mirrored: it's a brand mark. */}
      <svg
        aria-hidden="true"
        viewBox="14 15 80 80"
        width="32"
        height="32"
        className={`transition-transform duration-200 ease-[var(--ease-entrance)] motion-safe:group-hover:-translate-y-0.5 ${
          launching ? "motion-safe:animate-[star-launch_600ms_var(--ease-entrance)]" : ""
        }`}
      >
        <g transform="rotate(122.5 50 50)">
          <path fill="currentColor" d="M84 24L43.2 57.1L36.8 46.9Z" />
          <path fill="var(--brass)" d="M40 28Q46.72 45.28 64 52Q46.72 58.72 40 76Q33.28 58.72 16 52Q33.28 45.28 40 28Z" />
        </g>
      </svg>
    </button>
  );
}
