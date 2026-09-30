"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { liveStatus, useIsClient, useNow } from "@/lib/useNow";
import type { LiveCardData, LiveKind } from "@/types/live";
import { LiveNowCard, ReplayCard, UpcomingCard } from "./LiveCards";
import { ScrollReveal } from "./ScrollReveal";

const ALL = "all";

/**
 * The /live page body. Sorts every item by the viewer's clock (useNow),
 * re-checked each minute, so a stream moves from "Coming up" to "Live
 * now" to the replays on its own:
 *   1. Live now   -- cinematic banner(s), only while something is live.
 *   2. Coming up  -- soonest first, up to 3, local time + countdown.
 *   3. Filter bar -- All / Streams / Podcasts tabs (same pinned bar and
 *                    lapis underline as /news) with a live count.
 *   4. Grid       -- replays and episodes, newest first, scroll reveals
 *                    (approved for this page, CLAUDE.md 4.5), re-run when
 *                    the filter changes.
 */
export function LiveHub({ items, builtAt }: { items: LiveCardData[]; builtAt: number }) {
  const t = useTranslations("Live");
  const now = useNow(builtAt);
  const isClient = useIsClient();
  const [kind, setKind] = useState<LiveKind | typeof ALL>(ALL);

  const live = items.filter((item) => liveStatus(item, now) === "live");
  const upcoming = items
    .filter((item) => liveStatus(item, now) === "upcoming")
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
    .slice(0, 3);
  const past = items.filter((item) => liveStatus(item, now) === "past");
  const visible = past.filter((item) => kind === ALL || item.kind === kind);

  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";
  const sectionHeading = "font-display text-step-4 font-semibold leading-display text-parchment sm:text-step-5";
  const tabs: { value: LiveKind | typeof ALL; label: string }[] = [
    { value: ALL, label: t("tabs.all") },
    { value: "stream", label: t("tabs.streams") },
    { value: "podcast", label: t("tabs.podcasts") },
  ];

  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {live.length > 0 && (
        <section aria-label={t("liveNow")} className="flex flex-col gap-8">
          {live.map((item) => (
            <LiveNowCard key={item.slug} item={item} />
          ))}
        </section>
      )}

      {upcoming.length > 0 && (
        <section aria-labelledby="live-upcoming" className="flex flex-col gap-8">
          <h2 id="live-upcoming" className={sectionHeading}>
            {t("comingUp")}
          </h2>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((item, index) => (
              <li key={item.slug}>
                <ScrollReveal delay={index * 80} className="h-full">
                  <UpcomingCard item={item} now={now} isClient={isClient} />
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="live-past" className="flex flex-col gap-12">
        <h2 id="live-past" className="sr-only">
          {t("pastHeading")}
        </h2>
        {/* Pinned bar. top-16 = the site header's height. */}
        <div className="sticky top-16 z-30 border-b border-muted/20 bg-ink">
          <div className="flex items-center justify-between gap-6">
            <div role="group" aria-label={t("pastHeading")} className="-mb-px flex gap-6">
              {tabs.map((tab) => {
                const active = kind === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setKind(tab.value)}
                    className={`relative shrink-0 whitespace-nowrap py-4 font-body text-step-2 font-medium transition-colors duration-200 ease-[var(--ease-entrance)] md:py-5 ${
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
            <span aria-live="polite" className="whitespace-nowrap font-body text-step-1 text-muted">
              {t("count", { count: visible.length, n: String(visible.length) })}
            </span>
          </div>
        </div>

        {visible.length > 0 ? (
          <ul key={kind} className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, index) => (
              <li key={item.slug}>
                <ScrollReveal delay={(index % 3) * 80} className="h-full">
                  <ReplayCard item={item} isClient={isClient} />
                </ScrollReveal>
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" className="border border-muted/20 px-6 py-12 font-body text-step-3 leading-body text-parchment sm:px-8">
            {t("empty")}
          </p>
        )}
      </section>
    </div>
  );
}
