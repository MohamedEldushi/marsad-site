import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Game } from "@/types/game";
import { NewsCover } from "./NewsCover";
import { Spotlight } from "./Spotlight";

/**
 * The featured game in the Home hero (approved by the studio): a 3:4
 * poster -- the art, or a generated NewsCover poster until art exists --
 * with the pointer light, linking to the game's page, and its title and
 * status beneath.
 *
 * Step 6 of the hero load sequence (CLAUDE.md 4.5): the poster opens with
 * the /games shutter, on load rather than on scroll, 80ms after the CTA
 * starts. The title and status fade up with it. Under reduced motion it
 * is simply there.
 */
export async function HeroFeature({ game, locale }: { game: Game; locale: "ar" | "en" }) {
  const t = await getTranslations("GamesIndex");
  const tStatus = await getTranslations("GameStatus");
  const numberLocale = locale === "ar" ? "ar-u-nu-latn" : "en";

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

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex flex-col gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
    >
      <Spotlight className="relative">
        <div className="hero-shutter">
          <div className="relative aspect-[3/4] w-full overflow-hidden border border-muted/20 bg-ink transition-colors duration-200 ease-[var(--ease-entrance)] group-hover:border-muted/60">
            <div className="shutter-art absolute inset-0">
              {/* Pass the real image path as `cover` when art lands. */}
              <NewsCover
                slug={game.slug}
                label={game.title[locale]}
                idPrefix="hero-poster"
                sizes="(min-width: 1024px) 320px, 192px"
                priority
              />
            </div>
            <div className="spotlight-glow absolute inset-0" />
          </div>
        </div>
      </Spotlight>
      <div className="flex flex-col gap-1 motion-safe:[animation:hero-fade-up_var(--duration-entrance)_var(--ease-entrance)_620ms_both]">
        <span className="font-display text-step-3 font-semibold leading-display text-parchment">
          {game.title[locale]}
        </span>
        {status && <span className="font-body text-step-1 text-muted">{status}</span>}
      </div>
    </Link>
  );
}
