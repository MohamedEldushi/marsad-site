import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Game } from "@/types/game";
import { NewsCover } from "./NewsCover";
import { Spotlight } from "./Spotlight";

/**
 * A game as a single 3:4 poster link: the compact sibling of GameChapter,
 * for rows of games (Home's games row, the styleguide). The poster is the
 * game's art, or a generated Marsad-style poster (NewsCover: lit pool +
 * Kufic tiling + the game's name) until art exists.
 *
 * Under the poster: the status line (beta in brass -- status labels are
 * exempt from the brass budget -- or coming soon) and the tagline. The
 * title is set on the poster itself, so it's repeated as a screen-reader
 * heading rather than shown twice.
 *
 * Hover, same as the /games posters (CLAUDE.md 4.5): the pointer light
 * (Spotlight), the frame lightens, the art zooms 4%. 200ms, house easing,
 * off under reduced motion; the focus ring is never animated.
 */
export async function GamePoster({
  game,
  locale,
  headingLevel = "h3",
}: {
  game: Game;
  locale: "ar" | "en";
  headingLevel?: "h2" | "h3";
}) {
  const tStatus = await getTranslations("GameStatus");
  const Heading = headingLevel;

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex flex-col gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
    >
      <Spotlight className="relative">
        <div className="relative aspect-[3/4] w-full overflow-hidden border border-muted/20 bg-ink transition-colors duration-200 ease-[var(--ease-entrance)] group-hover:border-muted/60">
          {/* Pass the real image path as `cover` when art lands. */}
          <NewsCover
            slug={game.slug}
            label={game.title[locale]}
            idPrefix="game-poster"
            sizes="(min-width: 1024px) 340px, 70vw"
          />
          <div className="spotlight-glow absolute inset-0" />
        </div>
      </Spotlight>
      <div className="flex flex-col gap-1">
        <Heading className="sr-only">{game.title[locale]}</Heading>
        {game.status === "beta" && (
          <p className="font-body text-step-1 font-medium text-brass">{tStatus("beta")}</p>
        )}
        {game.status === "coming-soon" && (
          <p className="font-body text-step-1 text-muted">{tStatus("comingSoon")}</p>
        )}
        <p className="font-body text-step-2 leading-body text-muted">{game.tagline[locale]}</p>
      </div>
    </Link>
  );
}
