"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { NewsCardData, NewsType } from "@/types/news";
import { NewsCard } from "./NewsCard";
import { ScrollReveal } from "./ScrollReveal";

const ALL = "all";

type Option<T extends string> = { value: T; label: string };

/**
 * The /news filter bar and the grid it controls.
 *
 * Bar: one row, pinned under the site header while the list scrolls.
 * Post types are tabs (buttons with aria-pressed); the active tab gets a
 * --lapis underline that grows in, 200ms (lapis = active states). Games
 * are a dropdown. A live result count sits at the end.
 *
 * Grid: editorial. The first two posts are large, side by side from md
 * up; the rest are three across from lg. Cards reveal on scroll (News is
 * one of the two pages allowed scroll reveals, CLAUDE.md 4.5), staggered
 * 80ms across a row. The list is keyed on the filters, so changing a
 * filter re-runs the reveal: the new results fade up into place.
 *
 * With both filters on "All", the featured post is left out (it's shown
 * large above). Any active filter searches every post, featured included.
 */
export function NewsFilter({
  posts,
  featuredSlug,
  typeOptions,
  gameOptions,
  labels,
}: {
  posts: NewsCardData[];
  featuredSlug?: string;
  typeOptions: Option<NewsType>[];
  gameOptions: Option<string>[];
  labels: {
    type: string;
    game: string;
    all: string;
    allGames: string;
    empty: string;
    showAll: string;
  };
}) {
  const t = useTranslations("News.filter");
  const [type, setType] = useState<NewsType | typeof ALL>(ALL);
  const [game, setGame] = useState<string>(ALL);

  const unfiltered = type === ALL && game === ALL;
  const visible = posts.filter(
    (post) =>
      (type === ALL || post.type === type) &&
      (game === ALL || post.game === game) &&
      !(unfiltered && post.slug === featuredSlug),
  );

  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";
  const tabs: Option<NewsType | typeof ALL>[] = [{ value: ALL, label: labels.all }, ...typeOptions];

  return (
    <div className="flex flex-col gap-12">
      {/* Pinned bar. top-16 = the site header's height. */}
      <div className="sticky top-16 z-30 border-b border-muted/20 bg-ink">
        <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:gap-8 md:py-0">
          {/* Below lg the tabs wrap onto a second line, so none is ever
              hidden off the edge; from lg up they sit in one row. (At md,
              768px, six tabs plus the game dropdown don't fit one row.) */}
          <div
            role="group"
            aria-label={labels.type}
            className="-mb-px flex flex-wrap gap-x-6 lg:flex-nowrap lg:overflow-x-auto [scrollbar-width:none]"
          >
            {tabs.map((tab) => {
              const active = type === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setType(tab.value)}
                  className={`relative shrink-0 whitespace-nowrap py-3 font-body text-step-2 font-medium transition-colors duration-200 ease-[var(--ease-entrance)] md:py-5 ${
                    active ? "text-parchment" : "text-muted hover:text-parchment"
                  } ${focus}`}
                >
                  {tab.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-0.5 bg-lapis transition-transform duration-200 ease-[var(--ease-entrance)] ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-6 md:justify-end">
            {gameOptions.length > 0 && (
              <label className="flex items-center gap-3 font-body text-step-1 text-muted">
                {labels.game}
                <select
                  value={game}
                  onChange={(event) => setGame(event.target.value)}
                  className={`rounded border border-muted/40 bg-ink-raised px-3 py-2 font-body text-step-1 text-parchment [color-scheme:dark] ${focus}`}
                >
                  <option value={ALL}>{labels.allGames}</option>
                  {gameOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <span aria-live="polite" className="whitespace-nowrap font-body text-step-1 text-muted">
              {t("count", { count: visible.length, n: String(visible.length) })}
            </span>
          </div>
        </div>
      </div>

      {visible.length > 0 ? (
        <ul key={`${type}-${game}`} className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-6">
          {visible.map((post, index) => {
            const large = index < 2;
            // Stagger across a visual row: 2 per row for the large pair,
            // then 3 per row.
            const column = large ? index : (index - 2) % 3;
            return (
              <li key={post.slug} className={large ? "lg:col-span-3" : "lg:col-span-2"}>
                <ScrollReveal delay={column * 80} className="h-full">
                  <NewsCard post={post} size={large ? "large" : "default"} idPrefix="grid" />
                </ScrollReveal>
              </li>
            );
          })}
        </ul>
      ) : (
        <div role="status" className="flex flex-col items-start gap-4 border border-muted/20 px-6 py-12 sm:px-8">
          <p className="font-body text-step-3 leading-body text-parchment">{labels.empty}</p>
          <button
            type="button"
            onClick={() => {
              setType(ALL);
              setGame(ALL);
            }}
            className={`font-body text-step-2 text-lapis underline-offset-4 hover:underline ${focus}`}
          >
            {labels.showAll}
          </button>
        </div>
      )}
    </div>
  );
}
