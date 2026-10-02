"use client";

import { useEffect, useRef, useState } from "react";

/**
 * /about's signature moment (approved by the studio, CLAUDE.md 4.5): the
 * Arabic-first band's line arrives word by word, in reading order, the
 * first time it scrolls into view. 600ms in total -- each word fades up
 * 8px over the 200ms interaction band, their starts spread across the
 * remaining 400ms. Once only; the observer disconnects after it fires.
 *
 * Words are split on spaces only, so Arabic letters keep joining inside
 * each word. The spaces stay real text, so screen readers and copy/paste
 * get the sentence unchanged. Visible by default (no JS, reduced motion):
 * only under no-preference motion does it wait hidden (globals.css).
 */
export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
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
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(/\s+/).filter(Boolean);
  const step = words.length > 1 ? 400 / (words.length - 1) : 0;

  return (
    <p ref={ref} data-revealed={revealed} className={`word-reveal ${className}`}>
      {words.map((word, index) => (
        <span key={index}>
          <span className="word-reveal-word" style={{ animationDelay: `${Math.round(index * step)}ms` }}>
            {word}
          </span>
          {index < words.length - 1 && " "}
        </span>
      ))}
    </p>
  );
}
