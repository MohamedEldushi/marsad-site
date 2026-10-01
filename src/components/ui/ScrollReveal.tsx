"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll reveal, allowed on Home, News, Streams & Podcasts and Games only (CLAUDE.md 4.5's scoped
 * exception to "no scroll-triggered reveals"). Fades a section up 16px
 * the first time it enters the viewport, then disconnects its observer
 * so it can never re-trigger on scrolling back past it.
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  variant = "fade",
}: {
  children: ReactNode;
  className?: string;
  /** Stagger, in ms, for items revealed together (e.g. a grid row). */
  delay?: number;
  /** "fade": fade up 16px. "shutter": opens from the centre outward, like
   *  an observatory's viewing slit (Games posters). */
  variant?: "fade" | "shutter";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-revealed={revealed}
      className={`${variant === "shutter" ? "reveal-shutter" : "reveal"} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
