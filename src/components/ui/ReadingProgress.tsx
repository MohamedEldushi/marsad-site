"use client";

import { useEffect, useRef } from "react";

/**
 * A 2px --lapis line pinned under the site header, filling as the reader
 * moves through the article (lapis = active states). It tracks the
 * reader's own scrolling directly -- no transition, no autoplay -- so it
 * is user-driven motion (CLAUDE.md 4.5) and needs no reduced-motion
 * variant. Fills from the start edge: right to left in Arabic.
 * Decorative: screen readers get nothing from it.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const target = document.getElementById(targetId);
      if (!target || !bar.current) return;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total));
      bar.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [targetId]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-[63px] z-[60] h-0.5">
      {/* Starts empty via inline transform (not a scale-x class: Tailwind's
          scale utilities set the separate `scale` property, which would
          multiply with the transform written above and pin it at 0). */}
      <div ref={bar} className="h-full origin-left bg-lapis rtl:origin-right" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
