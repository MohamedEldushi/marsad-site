"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { liveStatus, useIsClient, useNow } from "@/lib/useNow";
import { formatCountdown } from "./LiveCards";

type Stream = { slug: string; start: string; end: string; title: string };

/**
 * Home's slim band linking to /live (approved by the studio). Decided by
 * the viewer's clock (useNow), like /live itself:
 * - a stream is live:   still --lapis dot, "Live now", its title;
 * - else one upcoming:  "Next stream", its title, a countdown;
 * - else:               nothing at all (the band is hidden).
 * The whole band is one link. Before hydration the countdown is left out
 * (it depends on the viewer's clock), so server and client HTML match.
 * The dot never pulses: no ambient motion (CLAUDE.md 4.5).
 */
export function LiveStrip({ streams, builtAt }: { streams: Stream[]; builtAt: number }) {
  const t = useTranslations("Home.live");
  const tLive = useTranslations("Live");
  const locale = useLocale();
  const now = useNow(builtAt);
  const isClient = useIsClient();

  const live = streams.find((s) => liveStatus({ kind: "stream", ...s }, now) === "live");
  const next = live
    ? undefined
    : streams
        .filter((s) => liveStatus({ kind: "stream", ...s }, now) === "upcoming")
        .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))[0];
  const item = live ?? next;
  if (!item) return null;

  const countdown =
    !live && isClient ? formatCountdown(Date.parse(item.start) - now, locale, tLive("startingSoon")) : "";

  return (
    <aside aria-label={tLive("heading")} className="border-y border-muted/20 bg-ink-raised">
      <Link
        href="/live"
        className="group mx-auto flex max-w-[1280px] flex-col gap-2 px-6 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lapis sm:flex-row sm:items-center sm:gap-6 sm:px-12 lg:px-16"
      >
        <span className="flex shrink-0 items-center gap-2 font-body text-step-1 font-medium text-parchment">
          {live && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-lapis" />}
          {live ? tLive("liveNow") : t("next")}
        </span>
        <span className="min-w-0 flex-1 font-display text-step-3 font-semibold leading-display text-parchment">
          {item.title}
        </span>
        <span className="flex shrink-0 items-center gap-4 font-body text-step-2">
          {countdown && <span className="font-medium tabular-nums text-lapis">{countdown}</span>}
          <span className="inline-flex items-center gap-2 text-muted transition-colors duration-200 ease-[var(--ease-entrance)] group-hover:text-parchment">
            {t("cta")}
            {/* Directional: mirrors in RTL (CLAUDE.md section 3). */}
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-200 ease-[var(--ease-entrance)] rtl:-scale-x-100 motion-safe:group-hover:translate-x-1 motion-safe:rtl:group-hover:-translate-x-1"
            >
              <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
            </svg>
          </span>
        </span>
      </Link>
    </aside>
  );
}
