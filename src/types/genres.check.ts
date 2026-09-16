import type { Genre } from "@/types/game";
import ar from "../../messages/ar.json";
import en from "../../messages/en.json";

/**
 * Not imported anywhere at runtime -- its only job is to fail `tsc`
 * (and therefore `next build`) if either locale file's Genres object is
 * missing a translation for a Genre added to the enum in game.ts, or
 * has a key that no longer matches one. A `Record<Genre, string>` type
 * requires every Genre key to be present; TypeScript included this file
 * in the project either way (tsconfig's "include": ["**\/*.ts", ...]
 * covers it, imported or not), so the check runs on every build without
 * needing to be wired into any page.
 */
const _enGenres: Record<Genre, string> = en.Genres;
const _arGenres: Record<Genre, string> = ar.Genres;

// Referenced so eslint's no-unused-vars doesn't flag them -- their
// value is never used, only their assignability.
void _enGenres;
void _arGenres;
