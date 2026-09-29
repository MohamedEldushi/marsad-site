/**
 * A compact, whole-tile link for a game: 3:4 thumbnail slot, title, and
 * one line under it. Used by /support (the line is an email action and
 * the link is a pre-filled mailto:) and /about (the line is the tagline
 * and the link goes to the game page). Simpler than GameCard on purpose:
 * no status labels, no store buttons, no brass.
 *
 * Hover per CLAUDE.md 4.5 (cards): raise 4px and lighten the border,
 * 200ms, house easing. The focus ring is not transitioned.
 */
import type { ReactNode } from "react";

export function GameTile({
  thumbnail,
  title,
  line,
  lineTone = "muted",
  link,
}: {
  thumbnail: string;
  title: string;
  line: string;
  lineTone?: "muted" | "lapis";
  /** Render prop so callers choose <a> (mailto) or the locale-aware Link. */
  link: (className: string, children: ReactNode) => ReactNode;
}) {
  const className =
    "group flex flex-col gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-ink";

  return link(
    className,
    <>
      <div className="relative aspect-[3/4] w-full border border-muted/20 bg-ink-raised transition-[transform,border-color] duration-200 ease-[var(--ease-entrance)] group-hover:border-muted/60 motion-safe:group-hover:-translate-y-1">
        <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-body text-step-1 text-muted">
          {thumbnail}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-display text-step-3 font-semibold leading-display text-parchment sm:text-step-4">
          {title}
        </span>
        <span
          className={`font-body text-step-2 leading-body ${
            lineTone === "lapis" ? "text-lapis group-hover:underline" : "text-muted"
          }`}
        >
          {line}
        </span>
      </div>
    </>,
  );
}
