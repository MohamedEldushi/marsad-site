export type GameStatus = "released" | "beta" | "coming-soon";
export type PrimaryActionType = "store" | "download" | "play" | "none";

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
  genres: string[];
  platforms: string[];
  releaseDate: string;
  keyArt: string;
  thumbnail: string;
  screenshots: string[];
  trailerUrl: string;
  featured: boolean;
}
