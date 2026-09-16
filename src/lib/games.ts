import type { Game } from "@/types/game";
import echoAtlas from "../../content/games/echo-atlas.json";
import lanternKeep from "../../content/games/lantern-keep.json";
import saltAndSignal from "../../content/games/salt-and-signal.json";

// `as Game`, matching every other field on this type (status,
// primaryAction.type, ...): plain JSON imports widen string properties
// to `string`, so `satisfies Game` here would demand a real fix for all
// of those fields at once, not just genres. Out of scope for the genres
// fix this cast is part of -- content-level validation of genre values
// isn't guaranteed here any more than status already wasn't. What *is*
// guaranteed, independent of this cast: src/types/genres.check.ts fails
// the build if a Genre exists without a translation in both locales.
export const games: Game[] = [
  lanternKeep as Game,
  saltAndSignal as Game,
  echoAtlas as Game,
];
