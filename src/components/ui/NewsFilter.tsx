"use client";

import { useState } from "react";
import type { NewsCardData, NewsType } from "@/types/news";
import { NewsCard } from "./NewsCard";

const ALL = "all";

type Option<T extends string> = { value: T; label: string };

/**
 * The /news filter row and the grid it controls. Two groups of toggle
 * buttons (type, game), each with aria-pressed; the active one is marked
 * in --lapis (section 4: lapis = active states). Colour changes are the
 * 200ms interaction band; the focus ring appears instantly.
 *
 * With both filters on "All", the featured post is left out of the grid
 * because it's already shown large above. Any active filter searches every
 * post, featured included.
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
  const [type, setType] = useState<NewsType | typeof ALL>(ALL);
  const [game, setGame] = useState<string>(ALL);

  const unfiltered = type === ALL && game === ALL;
  const visible = posts.filter(
    (post) =>
      (type === ALL || post.type === type) &&
      (game === ALL || post.game === game) &&
      !(unfiltered && post.slug === featuredSlug),
  );

  const button = (active: boolean) =>
    `rounded border px-4 py-2 font-body text-step-1 font-medium transition-colors duration-200 ease-[var(--ease-entrance)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
      active
        ? "border-lapis text-lapis"
        : "border-muted/40 text-muted hover:border-muted hover:text-parchment"
    }`;

  const group = <T extends string>(
    id: string,
    label: string,
    allLabel: string,
    options: Option<T>[],
    value: string,
    onChange: (next: T | typeof ALL) => void,
  ) => (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-6">
      <span id={id} className="shrink-0 font-body text-step-1 text-muted">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {[{ value: ALL, label: allLabel } as Option<T | typeof ALL>, ...options].map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={button(value === option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4 border-t border-muted/40 pt-8">
        {group("news-filter-type", labels.type, labels.all, typeOptions, type, setType)}
        {gameOptions.length > 0 &&
          group("news-filter-game", labels.game, labels.allGames, gameOptions, game, setGame)}
      </div>

      {visible.length > 0 ? (
        <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <li key={post.slug}>
              <NewsCard post={post} />
            </li>
          ))}
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
            className="font-body text-step-2 text-lapis underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
          >
            {labels.showAll}
          </button>
        </div>
      )}
    </div>
  );
}
