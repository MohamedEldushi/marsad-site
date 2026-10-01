"use client";

import { useLocale, useTranslations } from "next-intl";
import type { LiveCardData, Platform } from "@/types/live";
import { Button } from "./Button";
import { NewsCover } from "./NewsCover";

/**
 * Cards for /live. Every link opens the platform (YouTube, TikTok, Twitch,
 * Kick) in a new tab -- nothing is embedded, so no third-party player or
 * tracking loads on the site. External links carry an external-link icon
 * (never mirrored, CLAUDE.md section 3) and a screen-reader note.
 *
 * Covers are the item's artwork, or a generated cover (NewsCover: lit pool
 * + Kufic tiling + the game's name, approved for Streams & Podcasts too).
 * Hover per CLAUDE.md 4.5 news cards: frame lightens, cover zooms 4%,
 * arrow/icon nudges. 200ms, house easing, off under reduced motion.
 */

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-ink";
const frame =
  "relative w-full overflow-hidden border border-muted/20 bg-ink transition-colors duration-200 ease-[var(--ease-entrance)] group-hover:border-muted/60";
const chip = "rounded-sm bg-ink/85 px-2 py-1 font-body text-step-1 font-medium leading-none text-parchment";

const numberLocale = (locale: string) => (locale === "ar" ? "ar-u-nu-latn" : "en");

export function ExternalIcon({ className = "" }: { className?: string }) {
  // Not mirrored in RTL: external-link icons point up and out in every
  // language (CLAUDE.md section 3).
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M5 2H2v10h10V9M8 2h4v4M12 2L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

function usePlatform() {
  const t = useTranslations("Live.platforms");
  return (platform: Platform) => t(platform);
}

/** 95 -> "1:35:00", 48 -> "48:00". Language-neutral, like a video player. */
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:00` : `${m}:00`;
}

function actionLabel(t: ReturnType<typeof useTranslations>, kind: string, platform: string) {
  return kind === "podcast" ? t("listenOn", { platform }) : t("watchOn", { platform });
}

/* ---------- Live now: the cinematic banner ---------- */

export function LiveNowCard({ item }: { item: LiveCardData }) {
  const t = useTranslations("Live");
  const platformName = usePlatform();
  const main = item.links[0];

  return (
    <article className={`${frame} aspect-[4/5] sm:aspect-video lg:aspect-[21/9]`}>
      <NewsCover slug={item.slug} cover={item.cover} label={item.coverLabel} idPrefix="live-now" sizes="(min-width: 1280px) 1152px, 100vw" priority showLabel={false} poolTop />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 sm:p-8 lg:p-12">
        <p className="flex items-center gap-2 font-body text-step-2 font-medium text-parchment">
          {/* Still, not pulsing: CLAUDE.md 4.5 allows no ambient motion here. */}
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-lapis" />
          {t("liveNow")}
        </p>
        <h2 className="max-w-[24ch] font-display text-step-5 font-semibold leading-display text-parchment sm:text-step-6 lg:text-step-7">
          {item.title}
        </h2>
        <p className="max-w-[58ch] font-body text-step-2 leading-body text-parchment/80 sm:text-step-3">{item.summary}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* The page's one brass element while something is live. */}
          <Button as="a" href={main.url} target="_blank" rel="noopener noreferrer" variant="primary">
            <span className="inline-flex items-center gap-2">
              {t("watchNowOn", { platform: platformName(main.platform) })}
              <ExternalIcon />
              <span className="sr-only">{t("newTab")}</span>
            </span>
          </Button>
          {item.links.slice(1).map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 font-body text-step-2 text-lapis hover:underline ${focus}`}>
              {t("alsoOn", { platform: platformName(link.platform) })}
              <ExternalIcon />
              <span className="sr-only">{t("newTab")}</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ---------- Coming up: date tile + local time + countdown ---------- */

export function UpcomingCard({ item, now, isClient }: { item: LiveCardData; now: number; isClient: boolean }) {
  const t = useTranslations("Live");
  const locale = useLocale();
  const platformName = usePlatform();
  const start = new Date(item.start);
  const loc = numberLocale(locale);
  // Before the browser takes over, dates are shown in UTC (identical on
  // server and client); after, in the visitor's own time zone.
  const tz = isClient ? undefined : "UTC";

  const day = new Intl.DateTimeFormat(loc, { day: "numeric", timeZone: tz }).format(start);
  const month = new Intl.DateTimeFormat(loc, { month: "short", timeZone: tz }).format(start);
  const when = new Intl.DateTimeFormat(loc, {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
    ...(isClient ? { timeZoneName: "short" } : {}),
  }).format(start);

  let countdown = "";
  if (isClient) {
    const minutes = Math.round((start.getTime() - now) / 60_000);
    const rtf = new Intl.RelativeTimeFormat(loc, { numeric: "auto" });
    countdown =
      minutes < 1
        ? t("startingSoon")
        : minutes < 60
          ? rtf.format(minutes, "minute")
          : minutes < 60 * 24
            ? rtf.format(Math.round(minutes / 60), "hour")
            : rtf.format(Math.round(minutes / (60 * 24)), "day");
  }

  const main = item.links[0];
  return (
    <a href={main.url} target="_blank" rel="noopener noreferrer" className={`group flex h-full gap-5 border border-muted/20 bg-ink-raised p-5 transition-colors duration-200 ease-[var(--ease-entrance)] hover:border-muted/60 ${focus}`}>
      {/* Calendar tile */}
      <div className="flex w-16 shrink-0 flex-col items-center justify-center gap-1 self-start border border-muted/30 bg-ink py-3">
        <span className="font-display text-step-5 font-semibold leading-none text-parchment tabular-nums">{day}</span>
        <span className="font-body text-step-1 text-muted">{month}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-step-1 text-muted">
          <span className="rounded-sm bg-lapis-deep px-2 py-1 font-medium leading-none text-parchment">
            {t(`kinds.${item.kind}`)}
          </span>
          <time dateTime={item.start}>{when}</time>
        </p>
        <h3 className="font-display text-step-3 font-semibold leading-display text-parchment">{item.title}</h3>
        {countdown && <p className="font-body text-step-2 font-medium text-lapis tabular-nums">{countdown}</p>}
        <span className="mt-auto inline-flex items-center gap-2 pt-1 font-body text-step-1 text-muted transition-colors duration-200 ease-[var(--ease-entrance)] group-hover:text-parchment">
          {actionLabel(t, item.kind, platformName(main.platform))}
          <ExternalIcon className="transition-transform duration-200 ease-[var(--ease-entrance)] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
          <span className="sr-only">{t("newTab")}</span>
        </span>
      </div>
    </a>
  );
}

/* ---------- Replays and episodes: the grid card ---------- */

export function ReplayCard({ item, isClient }: { item: LiveCardData; isClient: boolean }) {
  const t = useTranslations("Live");
  const locale = useLocale();
  const platformName = usePlatform();
  const main = item.links[0];
  const date = new Intl.DateTimeFormat(numberLocale(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: isClient ? undefined : "UTC",
  }).format(new Date(item.start));

  return (
    <article className="flex h-full flex-col gap-4">
      <a href={main.url} target="_blank" rel="noopener noreferrer" className={`group flex flex-col gap-4 ${focus}`}>
        <div className={`${frame} aspect-video`}>
          <NewsCover slug={item.slug} cover={item.cover} label={item.coverLabel} idPrefix="replay" sizes="(min-width: 1024px) 370px, (min-width: 768px) 50vw, 100vw" />
          <span className={`absolute start-3 top-3 ${chip}`}>
            {/* A past stream is a replay: never label it "live". */}
            {item.kind === "podcast"
              ? item.episode
                ? t("episode", { n: String(item.episode) })
                : t("kinds.podcast")
              : t("replay")}
          </span>
          {item.duration && (
            // dir="ltr" only on the digits: on the badge itself it would
            // also flip its end-3 position to the wrong side in Arabic.
            <span className={`absolute end-3 bottom-3 ${chip}`}>
              <span dir="ltr" className="tabular-nums">{formatDuration(item.duration)}</span>
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-body text-step-1 text-muted">
            <time dateTime={item.start}>{date}</time>
          </p>
          <h3 className="font-display text-step-4 font-semibold leading-display text-parchment transition-colors duration-200 ease-[var(--ease-entrance)] group-hover:text-parchment">
            {item.title}
          </h3>
          <p className="line-clamp-2 font-body text-step-2 leading-body text-muted">{item.summary}</p>
          <span className="inline-flex items-center gap-2 pt-1 font-body text-step-2 font-medium text-lapis">
            {actionLabel(t, item.kind, platformName(main.platform))}
            <ExternalIcon className="transition-transform duration-200 ease-[var(--ease-entrance)] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
            <span className="sr-only">{t("newTab")}</span>
          </span>
        </div>
      </a>
      {item.links.length > 1 && (
        <p className="flex flex-wrap gap-x-4 gap-y-2 font-body text-step-1 text-muted">
          {item.links.slice(1).map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 hover:text-parchment ${focus}`}>
              {t("alsoOn", { platform: platformName(link.platform) })}
              <ExternalIcon />
              <span className="sr-only">{t("newTab")}</span>
            </a>
          ))}
        </p>
      )}
    </article>
  );
}
