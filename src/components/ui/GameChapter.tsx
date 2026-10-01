import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Game } from "@/types/game";
import { Button } from "./Button";
import { NewsCover } from "./NewsCover";
import { ScrollReveal } from "./ScrollReveal";
import { Spotlight } from "./Spotlight";

/**
 * One game on /games, as its own "chapter": a large 3:4 poster beside the
 * game's details. Chapters alternate sides down the page (zig-zag), which
 * gives each of the studio's small, focused worlds real presence instead
 * of a narrow card in a row of three.
 *
 * Poster: the game's art, or a generated Marsad-style poster (NewsCover:
 * lit pool + Kufic tiling + the game's name) until art exists. The whole
 * poster links to the game page. Motion (CLAUDE.md 4.5, Games):
 * - the "shutter" reveal: the poster opens from the centre outward the
 *   first time it scrolls into view, the details fade up just after;
 * - a soft light follows the pointer across the poster (Spotlight);
 * - hover: the frame lightens, the art zooms 4%, the arrow slides on.
 *
 * Details: status line (always present, so every chapter's rhythm is the
 * same), title, tagline, description, genres and platforms, then the
 * game's own action (store / download / play) and a "discover" link.
 */
export async function GameChapter({
  game,
  locale,
  index,
}: {
  game: Game;
  locale: "ar" | "en";
  index: number;
}) {
  const t = await getTranslations("GamesIndex");
  const tStatus = await getTranslations("GameStatus");
  const tDetail = await getTranslations("GameDetail");
  const tAction = await getTranslations("PrimaryAction");
  const tGenre = await getTranslations("Genres");
  const tPlatform = await getTranslations("Platforms");

  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";
  const numberLocale = locale === "ar" ? "ar-u-nu-latn" : "en";
  const href = `/games/${game.slug}`;
  const flip = index % 2 === 1;

  const status =
    game.status === "beta" ? (
      // Brass is allowed on status labels (exempt from the brass budget).
      <span className="font-medium text-brass">{tStatus("beta")}</span>
    ) : game.status === "coming-soon" ? (
      <span>{tStatus("comingSoon")}</span>
    ) : game.releaseDate ? (
      <span>
        {t("released", {
          date: new Intl.DateTimeFormat(numberLocale, { month: "long", year: "numeric", timeZone: "UTC" }).format(
            new Date(`${game.releaseDate}T00:00:00Z`),
          ),
        })}
      </span>
    ) : null;

  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-ink";

  return (
    <article
      aria-labelledby={`game-${game.slug}`}
      className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-x-8 lg:gap-x-16"
    >
      {/* Poster */}
      <div className={`md:col-span-5 ${flip ? "md:order-last" : ""}`}>
        <Link href={href} tabIndex={-1} aria-hidden="true" className="group block">
          <Spotlight className="relative">
            <ScrollReveal variant="shutter">
              <div className="relative aspect-[3/4] w-full overflow-hidden border border-muted/20 bg-ink transition-colors duration-200 ease-[var(--ease-entrance)] group-hover:border-muted/60">
                <div className="shutter-art absolute inset-0">
                  {/* No artwork paths yet (thumbnails are placeholders): the
                      generated poster stands in. Pass the real image path
                      as `cover` when it lands. */}
                  <NewsCover
                    slug={game.slug}
                    label={game.title[locale]}
                    idPrefix="poster"
                    sizes="(min-width: 1280px) 460px, (min-width: 768px) 40vw, 100vw"
                    priority={index === 0}
                  />
                </div>
                <div className="spotlight-glow absolute inset-0" />
              </div>
            </ScrollReveal>
          </Spotlight>
        </Link>
      </div>

      {/* Details */}
      <ScrollReveal delay={150} className="md:col-span-7 lg:col-span-6">
        <div className="flex flex-col gap-5">
          <p className="min-h-[1.5em] font-body text-step-2 text-muted">{status}</p>
          <h2
            id={`game-${game.slug}`}
            className="font-display text-step-6 font-semibold leading-display text-parchment [text-wrap:balance] sm:text-step-7"
          >
            <Link href={href} className={`transition-colors duration-200 ease-[var(--ease-entrance)] hover:text-lapis ${focus}`}>
              {game.title[locale]}
            </Link>
          </h2>
          <p className={`${proseMaxWidth} font-body text-step-4 leading-body text-parchment [text-wrap:pretty]`}>
            {game.tagline[locale]}
          </p>
          <p className={`${proseMaxWidth} font-body text-step-2 leading-body text-muted [text-wrap:pretty]`}>
            {game.description[locale]}
          </p>

          <dl className="grid grid-cols-2 gap-6 border-t border-muted/30 pt-5 font-body text-step-2">
            <div className="flex flex-col gap-1">
              <dt className="text-step-1 text-muted">{tDetail("genresLabel")}</dt>
              <dd className="text-parchment">{game.genres.map((g) => tGenre(g)).join(locale === "ar" ? "، " : ", ")}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-step-1 text-muted">{tDetail("platformsLabel")}</dt>
              <dd className="text-parchment">{game.platforms.map((p) => tPlatform(p)).join(locale === "ar" ? "، " : ", ")}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
            {game.status !== "coming-soon" && game.primaryAction.type !== "none" && (
              <Button as="a" href={game.primaryAction.url} variant="secondary">
                {tAction(game.primaryAction.type)}
              </Button>
            )}
            <Link
              href={href}
              className={`group inline-flex items-center gap-2 font-body text-step-2 font-medium text-lapis ${focus}`}
            >
              {t("discover")}
              {/* Directional: mirrors in RTL (CLAUDE.md section 3). */}
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-200 ease-[var(--ease-entrance)] rtl:-scale-x-100 motion-safe:group-hover:translate-x-1 motion-safe:rtl:group-hover:-translate-x-1"
              >
                <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
              </svg>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </article>
  );
}
