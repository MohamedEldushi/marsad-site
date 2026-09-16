export type GameStatus = "released" | "beta" | "coming-soon";
export type PrimaryActionType = "store" | "download" | "play" | "none";

// Fixed catalogue vocabulary, per CLAUDE.md section 6. "exploration" is
// added to the eight standard buckets (puzzle/adventure/strategy/action/
// simulation/narrative/arcade/roguelike) because without it, two of the
// three seed games -- one built entirely around sailing out to trace a
// signal, one about mapping a world as you discover it -- would both
// collapse to the identical single tag "adventure," losing the only
// thing that distinguished them in the catalogue.
export const GENRES = [
  "puzzle",
  "adventure",
  "strategy",
  "action",
  "simulation",
  "narrative",
  "arcade",
  "roguelike",
  "exploration",
] as const;

export type Genre = (typeof GENRES)[number];

export interface LocalizedString {
  ar: string;
  en: string;
}

export interface Game {
  slug: string;
  status: GameStatus;
  primaryAction: { type: PrimaryActionType; url: string };
  title: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  genres: Genre[];
  platforms: string[];
  releaseDate: string;
  keyArt: string;
  thumbnail: string;
  screenshots: string[];
  trailerUrl: string;
  featured: boolean;
}
