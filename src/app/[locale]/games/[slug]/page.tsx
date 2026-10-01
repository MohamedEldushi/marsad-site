import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { ExternalIcon } from "@/components/ui/LiveCards";
import { NewsCard } from "@/components/ui/NewsCard";
import { NewsCover } from "@/components/ui/NewsCover";
import { ScreenshotGallery } from "@/components/ui/ScreenshotGallery";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/i18n/navigation";
import { games } from "@/lib/games";
import { getAllNews, toCardData } from "@/lib/news";

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

// One template for every game (CLAUDE.md section 7):
//   1. Key-art banner -- 21:9 desktop, 16:9 tablet, 4:5 phone; the art or a
//      generated cover, with status, title, tagline and the game's primary
//      action (the page's one brass button) over a dark scrim. Signature
//      moment: it opens with the /games shutter reveal.
//   2. About the game beside an info rail (genres, platforms, release).
//   3. Trailer -- a play-style card linking out to YouTube (no embed), only
//      when the game has one.
//   4. Screenshots -- a gallery opening a full-screen viewer, or a
//      friendly empty state.
//   5. The game's news, when there is any.
//   6. Previous / next world.
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
  const tIndex = await getTranslations("GamesIndex");
  const tStatus = await getTranslations("GameStatus");
  const tPrimaryAction = await getTranslations("PrimaryAction");
  const tPlatforms = await getTranslations("Platforms");
  const tGenres = await getTranslations("Genres");
  const tNews = await getTranslations("News");
  const gameNews = getAllNews().filter((post) => post.game === game.slug);

  const title = game.title[locale];
  const position = games.findIndex((g) => g.slug === game.slug);
  const previous = games[position - 1];
  const next = games[position + 1];

  const container = "mx-auto w-full max-w-[1280px] px-6 sm:px-12 lg:px-16";
  // Body line length cap, section 4: 62ch Latin, 58ch Arabic.
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";
  const sectionHeading = "font-display text-step-5 font-semibold leading-display text-parchment";
  const numberLocale = locale === "ar" ? "ar-u-nu-latn" : "en";
  const list = (items: string[]) => items.join(locale === "ar" ? "، " : ", ");
  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

  const releaseDate = game.releaseDate
    ? new Intl.DateTimeFormat(numberLocale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(
        new Date(`${game.releaseDate}T00:00:00Z`),
      )
    : null;

  const status =
    game.status === "beta" ? (
      // Brass is allowed on status labels (exempt from the brass budget).
      <span className="font-medium text-brass">{tStatus("beta")}</span>
    ) : game.status === "coming-soon" ? (
      <span>{tStatus("comingSoon")}</span>
    ) : game.releaseDate ? (
      <span>
        {tIndex("released", {
          date: new Intl.DateTimeFormat(numberLocale, { month: "long", year: "numeric", timeZone: "UTC" }).format(
            new Date(`${game.releaseDate}T00:00:00Z`),
          ),
        })}
      </span>
    ) : null;

  // Real art is a public path; until then the generated cover stands in.
  const keyArt = game.keyArt.startsWith("/") ? game.keyArt : undefined;

  const arrow = (
    // Directional: mirrors in RTL (CLAUDE.md section 3).
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 rtl:-scale-x-100">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
    </svg>
  );

  return (
    <main>
      <div className={`${container} pt-8`}>
        <Link href="/games" className={`inline-flex font-body text-step-2 text-lapis hover:underline ${focus}`}>
          {t("backToGames")}
        </Link>
      </div>

      {/* 1. Key-art banner. The shutter wraps the whole frame: art, scrim
          and text open together, once. The scrim keeps the tiling of a
          generated cover out from behind the text (CLAUDE.md section 4). */}
      <header className={`${container} pt-8`}>
        <ScrollReveal variant="shutter">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-muted/20 bg-ink sm:aspect-video lg:aspect-[21/9]">
            <div className="shutter-art absolute inset-0">
              <NewsCover
                slug={game.slug}
                cover={keyArt}
                label={title}
                idPrefix="key-art"
                sizes="(min-width: 1280px) 1152px, 100vw"
                priority
                showLabel={false}
                poolTop
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 sm:p-8 lg:p-12">
              {status && <p className="font-body text-step-2 text-muted">{status}</p>}
              <h1 className="max-w-[20ch] font-display text-step-6 font-semibold leading-display text-parchment [text-wrap:balance] sm:text-step-7 lg:text-step-8">
                {title}
              </h1>
              <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-parchment/85 [text-wrap:pretty] sm:text-step-4`}>
                {game.tagline[locale]}
              </p>
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
          </div>
        </ScrollReveal>
      </header>

      {/* 2. About + info rail */}
      <section aria-labelledby="about-heading" className={`${container} py-16 sm:py-24`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <h2 id="about-heading" className={sectionHeading}>
              {t("aboutHeading")}
            </h2>
            <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted [text-wrap:pretty]`}>
              {game.description[locale]}
            </p>
          </div>
          <dl className="flex flex-col border-t border-muted/30 font-body text-step-2 lg:col-span-4 lg:col-start-9">
            {[
              [t("genresLabel"), list(game.genres.map((g) => tGenres(g)))],
              [t("platformsLabel"), list(game.platforms.map((p) => tPlatforms(p)))],
              [t("releaseLabel"), releaseDate ?? t("releaseTba")],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1 border-b border-muted/30 py-5">
                <dt className="text-step-1 text-muted">{label}</dt>
                <dd className="tabular-nums text-parchment">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. Trailer: a link out, never an embed -- no third-party player
          loads on the site. The play mark is never mirrored. */}
      {game.trailerUrl && (
        <section aria-labelledby="trailer-heading" className={`${container} flex flex-col gap-8 pb-16 sm:pb-24`}>
          <h2 id="trailer-heading" className={sectionHeading}>
            {t("trailerHeading")}
          </h2>
          <a
            href={game.trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex max-w-[960px] flex-col gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
          >
            <div className="relative aspect-video w-full overflow-hidden border border-muted/20 bg-ink transition-colors duration-200 ease-[var(--ease-entrance)] group-hover:border-muted/60">
              <NewsCover slug={`${game.slug}-trailer`} cover={keyArt} label={title} idPrefix="trailer" sizes="(min-width: 1024px) 960px, 100vw" showLabel={false} />
              <div className="absolute inset-0 bg-ink/40" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded border border-parchment/40 bg-ink/85 text-parchment transition-transform duration-200 ease-[var(--ease-entrance)] motion-safe:group-hover:scale-110 sm:h-20 sm:w-20">
                  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </div>
            <span className="inline-flex items-center gap-2 font-body text-step-2 font-medium text-lapis">
              {t("watchTrailer")}
              <ExternalIcon />
              <span className="sr-only">{t("newTab")}</span>
            </span>
          </a>
        </section>
      )}

      {/* 4. Screenshots */}
      <section aria-labelledby="screenshots-heading" className={`${container} flex flex-col gap-8 pb-16 sm:pb-24`}>
        <h2 id="screenshots-heading" className={sectionHeading}>
          {t("screenshotsHeading")}
        </h2>
        {game.screenshots.length > 0 ? (
          <ScreenshotGallery screenshots={game.screenshots} gameTitle={title} />
        ) : (
          <div className="flex flex-col items-start gap-3 border border-muted/20 px-6 py-10 sm:px-8">
            <p className="font-body text-step-3 leading-body text-parchment">{t("screenshotsEmpty")}</p>
            {gameNews.length > 0 && (
              <a href="#game-news-heading" className={`font-body text-step-2 text-lapis hover:underline ${focus}`}>
                {t("newsHeading")}
              </a>
            )}
          </div>
        )}
      </section>

      {/* 5. This game's news, newest first. Only when there is some. */}
      {gameNews.length > 0 && (
        <section aria-labelledby="game-news-heading" className={`${container} flex flex-col gap-8 pb-16 sm:pb-24`}>
          <h2 id="game-news-heading" className={sectionHeading}>
            {t("newsHeading")}
          </h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {gameNews.map((post) => (
              <li key={post.slug}>
                <NewsCard post={toCardData(post, locale, (type) => tNews(`types.${type}`))} idPrefix="game-news" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 6. Previous / next world, in catalogue order (no wrap-around). */}
      {(previous || next) && (
        <nav aria-label={t("worldsLabel")} className={`${container} pb-16 sm:pb-24`}>
          <div className="grid grid-cols-1 gap-4 border-y border-muted/40 py-6 sm:grid-cols-2">
            {[
              { other: previous, label: t("previousWorld"), end: false },
              { other: next, label: t("nextWorld"), end: true },
            ].map(({ other, label, end }) =>
              other ? (
                <Link
                  key={label}
                  href={`/games/${other.slug}`}
                  className={`group flex flex-col gap-1 ${end ? "sm:col-start-2 sm:items-end sm:text-end" : ""} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-ink`}
                >
                  <span className="font-body text-step-1 text-muted">{label}</span>
                  <span className="inline-flex items-center gap-2 font-display text-step-4 font-semibold leading-display text-parchment transition-colors duration-200 ease-[var(--ease-entrance)] group-hover:text-lapis">
                    {end ? (
                      <>
                        {other.title[locale]}
                        {arrow}
                      </>
                    ) : (
                      <>
                        <span className="inline-flex -scale-x-100">{arrow}</span>
                        {other.title[locale]}
                      </>
                    )}
                  </span>
                </Link>
              ) : null,
            )}
          </div>
        </nav>
      )}
    </main>
  );
}
