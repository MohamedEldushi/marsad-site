"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Home-only exception to CLAUDE.md 4.5's "no scroll-triggered reveals"
 * rule — see that section for the amendment. Fades a section up 16px
 * the first time it enters the viewport, then disconnects its observer
 * so it can never re-trigger on scrolling back past it.
 */
export function ScrollReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
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
    <div ref={ref} data-revealed={revealed} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
