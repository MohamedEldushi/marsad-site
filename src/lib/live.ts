import fs from "node:fs";
import path from "node:path";
import { games } from "@/lib/games";
import {
  LIVE_KINDS,
  PLATFORMS,
  type LiveCardData,
  type LiveItem,
  type LiveKind,
} from "@/types/live";

/**
 * Streams and podcast episodes, one JSON file each in content/live/
 * (CLAUDE.md section 6; LIVE-GUIDE.md explains every field). Checked
 * when the site builds: any problem stops the build with a plain-language
 * list naming the file and what to fix.
 *
 * Whether something is live, upcoming or a replay is NOT decided here:
 * that depends on the viewer's clock, so the page works it out in the
 * browser (see LiveHub). This file only loads and validates.
 *
 * Server-only (reads the file system).
 */

type Locale = "ar" | "en";

const LIVE_DIR = path.join(process.cwd(), "content", "live");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Date, time, and an explicit offset, so a time never shifts with the
// build machine's time zone.
const DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})$/;
const KEYS = ["kind", "start", "end", "duration", "episode", "game", "cover", "links", "ar", "en"];

let cache: LiveItem[] | null = null;

/**
 * When the site was built, to the minute. What pages show before the
 * viewer's clock takes over (src/lib/useNow.ts). Computed once, when this
 * module loads at build time -- not during rendering.
 */
export const BUILT_AT = Math.floor(Date.now() / 60_000) * 60_000;

export function getAllLive(): LiveItem[] {
  // Cached for production builds. In development it's re-read on every
  // call (like src/lib/news.ts), so a stream or episode added while
  // previewing shows up on refresh without restarting `npm run dev`.
  if (process.env.NODE_ENV === "production" && cache) return cache;
  if (!fs.existsSync(LIVE_DIR)) return (cache = []);

  const problems: string[] = [];
  const items: LiveItem[] = [];

  for (const file of fs.readdirSync(LIVE_DIR).filter((f) => f.endsWith(".json")).sort()) {
    if (file === "channels.json") continue;
    const slug = file.replace(/\.json$/, "");
    const where = `content/live/${file}`;
    const problem = (message: string) => problems.push(`- ${where}: ${message}`);

    if (!SLUG_PATTERN.test(slug)) {
      problem("the file name must be lowercase letters, numbers and hyphens only (e.g. dev-stream-3.json).");
      continue;
    }

    let raw: Record<string, unknown>;
    try {
      raw = JSON.parse(fs.readFileSync(path.join(LIVE_DIR, file), "utf8"));
    } catch {
      problem("isn't valid JSON. Check for a missing comma or quote.");
      continue;
    }

    for (const key of Object.keys(raw)) {
      if (!KEYS.includes(key)) problem(`unknown field "${key}". Allowed: ${KEYS.join(", ")}.`);
    }

    const kind = raw.kind as LiveKind;
    if (!LIVE_KINDS.includes(kind)) problem(`"kind" must be one of: ${LIVE_KINDS.join(", ")}.`);

    const start = raw.start as string;
    const end = raw.end as string | undefined;
    const validTime = (value: unknown) =>
      typeof value === "string" && DATETIME_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
    if (!validTime(start)) problem('"start" must be a date and time with a time zone, e.g. "2026-10-15T20:00:00+03:00".');
    if (kind === "stream") {
      if (!validTime(end)) problem('streams need an "end" time in the same format as "start".');
      else if (validTime(start) && Date.parse(end!) <= Date.parse(start)) problem('"end" must be after "start".');
    } else if (end !== undefined) {
      problem('"end" is only for streams. Remove it from podcast episodes.');
    }

    if (raw.duration !== undefined && !(Number.isInteger(raw.duration) && (raw.duration as number) > 0))
      problem('"duration" must be a whole number of minutes, e.g. 95.');
    if (raw.episode !== undefined) {
      if (kind !== "podcast") problem('"episode" is only for podcasts.');
      else if (!(Number.isInteger(raw.episode) && (raw.episode as number) > 0)) problem('"episode" must be a whole number, e.g. 3.');
    }

    const game = raw.game as string | undefined;
    if (game !== undefined && !games.some((g) => g.slug === game))
      problem(`"game" is "${game}", but there's no game with that slug in content/games.`);

    const cover = raw.cover as string | undefined;
    if (cover !== undefined && !fs.existsSync(path.join(PUBLIC_DIR, cover)))
      problem(`"cover" points to ${cover}, but that file isn't in the public folder.`);

    const links = raw.links as { platform: string; url: string }[] | undefined;
    if (!Array.isArray(links) || links.length === 0) {
      problem('needs at least one entry in "links", e.g. [{ "platform": "youtube", "url": "https://..." }].');
    } else {
      links.forEach((link, index) => {
        if (!PLATFORMS.includes(link?.platform as (typeof PLATFORMS)[number]))
          problem(`links[${index}].platform must be one of: ${PLATFORMS.join(", ")}.`);
        if (typeof link?.url !== "string" || !link.url.startsWith("https://"))
          problem(`links[${index}].url must be a full https:// address.`);
      });
    }

    for (const locale of ["ar", "en"] as const) {
      const text = raw[locale] as { title?: string; summary?: string } | undefined;
      if (!text?.title?.trim() || !text?.summary?.trim())
        problem(`needs "${locale}" with both a "title" and a "summary" (every item exists in both languages).`);
    }

    items.push({ ...(raw as unknown as Omit<LiveItem, "slug">), slug });
  }

  if (problems.length > 0) {
    throw new Error(
      `\n\nStreams & podcasts: some files need fixing before the site can build.\nSee LIVE-GUIDE.md for what each field means.\n\n${problems.join("\n")}\n`,
    );
  }

  // Newest first.
  items.sort((a, b) => Date.parse(b.start) - Date.parse(a.start));
  return (cache = items);
}

/** Only the time windows of streams: all the header needs for its marker. */
export function getStreamWindows() {
  return getAllLive()
    .filter((item) => item.kind === "stream")
    .map((item) => ({ start: item.start, end: item.end! }));
}

export type Channel = { platform: (typeof PLATFORMS)[number]; url: string };

/** The studio's channel on each platform (content/live/channels.json). */
export function getChannels(): Channel[] {
  const file = path.join(LIVE_DIR, "channels.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8")) as Channel[];
}

export function toLiveCardData(
  item: LiveItem,
  locale: Locale,
  kindLabel: (kind: LiveKind) => string,
): LiveCardData {
  return {
    slug: item.slug,
    kind: item.kind,
    start: item.start,
    end: item.end,
    duration: item.duration,
    episode: item.episode,
    cover: item.cover,
    links: item.links,
    title: item[locale].title,
    summary: item[locale].summary,
    coverLabel: item.game
      ? (games.find((g) => g.slug === item.game)?.title[locale] ?? kindLabel(item.kind))
      : kindLabel(item.kind),
  };
}
