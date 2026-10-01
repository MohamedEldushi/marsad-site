"use client";

import { useEffect, useState } from "react";

type Item = { id: string; number: number; heading: string };

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

/**
 * The legal pages' table of contents, two ways:
 * - "rail" (lg and up): sticky beside the text, with scroll-spy -- the
 *   section being read gets the --lapis underline the news tabs use,
 *   growing in at the 200ms interaction duration. It follows the
 *   reader's own scrolling; nothing moves on its own.
 * - "disclosure" (below lg): a native <details> "Contents" list at the
 *   top -- keyboard and screen-reader friendly with no script; opens
 *   instantly.
 * Links are plain anchors: the browser jumps to the section (no smooth
 * scroll), and the headings carry a scroll margin so they land clear of
 * the sticky header.
 */
export function LegalContents({
  items,
  label,
  summary,
  variant,
}: {
  items: Item[];
  label: string;
  summary: string;
  variant: "rail" | "disclosure";
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (variant !== "rail") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // The section being read: the last heading that has reached the
      // reading line just under the sticky header (where a heading lands
      // after a contents click, via its scroll margin); the first section
      // before any has; the last one once the page bottoms out.
      const line = 160;
      let current: string | null = items[0]?.id ?? null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? items[items.length - 1]?.id ?? current : current);
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
  }, [items, variant]);

  const list = (rail: boolean) => (
    <ol className={rail ? "flex flex-col gap-1" : "flex flex-col"}>
      {items.map((item) => {
        const current = rail && active === item.id;
        return (
          <li key={item.id} className={rail ? "" : "border-t border-muted/20"}>
            <a
              href={`#${item.id}`}
              aria-current={current ? "location" : undefined}
              className={`group flex gap-3 font-body leading-body transition-colors duration-200 ease-[var(--ease-entrance)] ${
                rail ? "py-2 text-step-1" : "py-3 text-step-2"
              } ${current ? "text-parchment" : "text-muted hover:text-parchment"} ${focus}`}
            >
              <span className="w-6 shrink-0 tabular-nums">{item.number}.</span>
              <span className="relative">
                {item.heading}
                {rail && (
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-lapis transition-transform duration-200 ease-[var(--ease-entrance)] rtl:origin-right ${
                      current ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                )}
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === "rail") {
    return (
      <nav aria-label={label} className="flex flex-col gap-4">
        <p className="font-body text-step-1 font-medium text-parchment">{summary}</p>
        {list(true)}
      </nav>
    );
  }

  return (
    <nav aria-label={label}>
      <details className="group/contents border border-muted/30">
        <summary
          className={`flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-body text-step-2 font-medium text-parchment [&::-webkit-details-marker]:hidden ${focus}`}
        >
          {summary}
          {/* Vertical chevron: the same in both directions, no mirroring. */}
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 group-open/contents:rotate-180">
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
          </svg>
        </summary>
        <div className="px-5 pb-2">{list(false)}</div>
      </details>
    </nav>
  );
}
