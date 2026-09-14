import type { Game } from "@/types/game";
import echoAtlas from "../../content/games/echo-atlas.json";
import lanternKeep from "../../content/games/lantern-keep.json";
import saltAndSignal from "../../content/games/salt-and-signal.json";

export const games: Game[] = [
  lanternKeep as Game,
  saltAndSignal as Game,
  echoAtlas as Game,
];
