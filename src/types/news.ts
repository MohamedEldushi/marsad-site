// News content model, per CLAUDE.md section 6. Kept separate from
// src/lib/news.ts (which reads the file system) so client components can
// import these types without pulling in Node APIs.

// "livestream" is a planned type for a later task -- not accepted yet.
export const NEWS_TYPES = [
  "announcement",
  "devlog",
  "update",
  "studio",
  "event",
] as const;

export type NewsType = (typeof NEWS_TYPES)[number];

export interface NewsText {
  title: string;
  summary: string;
  /** Body rendered from markdown to HTML at build time. */
  html: string;
}

export interface NewsPost {
  slug: string;
  /** YYYY-MM-DD */
  date: string;
  type: NewsType;
  /** Slug of a game in content/games, when the post is about one. */
  game?: string;
  /** Public path, e.g. /news/<slug>/cover.jpg */
  cover?: string;
  featured: boolean;
  ar: NewsText;
  en: NewsText;
}

/** Everything a NewsCard needs, already localised -- safe to pass to the client. */
export interface NewsCardData {
  slug: string;
  type: NewsType;
  typeLabel: string;
  game?: string;
  /** YYYY-MM-DD, for <time dateTime>. */
  date: string;
  dateLabel: string;
  title: string;
  summary: string;
  cover?: string;
}
