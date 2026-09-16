import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { games } from "@/lib/games";

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

function findGame(slug: string) {
  return games.find((game) => game.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "en"; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const game = findGame(slug);
  if (!game) return {};

  const tBoot = await getTranslations({ locale, namespace: "Boot" });
  const title = `${game.title[locale]} — ${tBoot("heading")}`;
  const description = game.tagline[locale];
  const ogImage = {
    url: `/og/${locale}.png`,
    width: 1200,
    height: 630,
    alt: title,
  };

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/games/${slug}` },
    openGraph: {
      title,
      description,
      url: `/${locale}/games/${slug}`,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en"; slug: string }>;
}) {
  const { locale, slug } = await params;
  const game = findGame(slug);
  if (!game) {
    notFound();
  }

  const t = await getTranslations("GameDetail");
  const tStatus = await getTranslations("GameStatus");
  const tPrimaryAction = await getTranslations("PrimaryAction");
  const tPlatforms = await getTranslations("Platforms");
  const tGenres = await getTranslations("Genres");

  // Body line length cap, section 4: 62ch Latin, 58ch Arabic.
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";

  // Arabic month names, Western digits (section 3: numbers stay 0-9 in
  // both languages) via the -u-nu-latn numbering-system subtag.
  const dateFormatter = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-u-nu-latn" : "en",
    { year: "numeric", month: "long", day: "numeric" },
  );
  const releaseDateLabel = game.releaseDate
    ? dateFormatter.format(new Date(game.releaseDate))
    : t("releaseTba");

  return (
    <main>
      <div className="mx-auto max-w-[1280px] px-6 pt-8 sm:px-12 lg:px-16">
        <Link
          href="/games"
          className="inline-flex font-body text-step-2 text-lapis underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
        >
          {t("backToGames")}
        </Link>
      </div>

      {/* Art at inline-start, text at inline-end -- the same asymmetric
          two-column pattern as Home's featured section (references/NOTES.md:
          "art on one side, title, tags, short paragraph, one button"). */}
      <section
        aria-labelledby="game-title"
        className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-16"
      >
        <div className="relative aspect-video w-full bg-ink-raised">
          <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-body text-step-1 text-muted">
            {game.keyArt}
          </span>
        </div>

        <div className="flex flex-col items-start gap-4 text-start">
          {game.status === "beta" && (
            <p className="font-body text-step-1 font-medium text-brass">
              {tStatus("beta")}
            </p>
          )}
          {game.status === "coming-soon" && (
            <p className="font-body text-step-1 text-muted">
              {tStatus("comingSoon")}
            </p>
          )}

          <h1
            id="game-title"
            className="font-display text-step-6 font-semibold leading-display text-parchment"
          >
            {game.title[locale]}
          </h1>

          <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted`}>
            {game.tagline[locale]}
          </p>

          {game.genres.length > 0 && (
            <p className="font-body text-step-1 text-muted">
              <span className="font-medium">{t("genresLabel")}: </span>
              {game.genres.map((genre) => tGenres(genre)).join(" · ")}
            </p>
          )}

          <p className={`${proseMaxWidth} font-body text-step-2 leading-body text-muted`}>
            {game.description[locale]}
          </p>

          <div className="flex flex-col gap-1">
            <p className="font-body text-step-1 text-muted">
              <span className="font-medium">{t("platformsLabel")}: </span>
              {game.platforms.map((platform) => tPlatforms(platform)).join(" · ")}
            </p>
            <p className="font-body text-step-1 text-muted">
              <span className="font-medium">{t("releaseLabel")}: </span>
              {releaseDateLabel}
            </p>
          </div>

          {game.status === "coming-soon" ? (
            <Button variant="secondary" disabled>
              {tStatus("comingSoon")}
            </Button>
          ) : game.primaryAction.type !== "none" ? (
            <Button as="a" href={game.primaryAction.url} variant="primary">
              {tPrimaryAction(game.primaryAction.type)}
            </Button>
          ) : null}
        </div>
      </section>

      <section
        aria-labelledby="screenshots-heading"
        className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16"
      >
        <h2
          id="screenshots-heading"
          className="font-display text-step-5 font-semibold leading-display text-parchment"
        >
          {t("screenshotsHeading")}
        </h2>

        {game.screenshots.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {game.screenshots.map((screenshot) => (
              <div
                key={screenshot}
                className="relative aspect-video w-full max-w-[560px] bg-ink-raised"
              >
                <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-body text-step-1 text-muted">
                  {screenshot}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-step-2 text-muted">
            {t("screenshotsEmpty")}
          </p>
        )}
      </section>
    </main>
  );
}
