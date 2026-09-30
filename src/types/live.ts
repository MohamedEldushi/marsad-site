// Streams & podcasts content model (CLAUDE.md section 6). Kept separate
// from src/lib/live.ts (which reads the file system) so client
// components can import these types.

export const LIVE_KINDS = ["stream", "podcast"] as const;
export type LiveKind = (typeof LIVE_KINDS)[number];

export const PLATFORMS = ["youtube", "tiktok", "twitch", "kick"] as const;
export type Platform = (typeof PLATFORMS)[number];

export interface LiveLink {
  platform: Platform;
  url: string;
}

export interface LiveText {
  title: string;
  summary: string;
}

export interface LiveItem {
  slug: string;
  kind: LiveKind;
  /** ISO 8601 with a time-zone offset, e.g. 2026-10-15T20:00:00+03:00.
   *  Streams: when it goes live. Podcasts: when the episode is published. */
  start: string;
  /** Streams only: when it ends. Required for streams. */
  end?: string;
  /** Length in minutes, shown on replays and episodes. */
  duration?: number;
  /** Podcasts only: the episode number. */
  episode?: number;
  /** Slug of a game in content/games, when it's about one. */
  game?: string;
  /** Public path, e.g. /live/<slug>/cover.jpg. Optional. */
  cover?: string;
  /** First link is the main one (the card's click). */
  links: LiveLink[];
  ar: LiveText;
  en: LiveText;
}

/** Everything a card needs, already localised: safe for the client. */
export interface LiveCardData {
  slug: string;
  kind: LiveKind;
  start: string;
  end?: string;
  duration?: number;
  episode?: number;
  cover?: string;
  links: LiveLink[];
  title: string;
  summary: string;
  /** Big text on a generated cover: the game's name, else the kind. */
  coverLabel: string;
}
