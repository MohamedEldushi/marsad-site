import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { GameChapter } from "@/components/ui/GameChapter";
import { GamePoster } from "@/components/ui/GamePoster";
import { Hero } from "@/components/ui/Hero";
import { HeroFeature } from "@/components/ui/HeroFeature";
import { KufiDivider } from "@/components/ui/KufiDivider";
import { LiveStrip } from "@/components/ui/LiveStrip";
import { LogoStar } from "@/components/ui/Logo";
import { NewsCard } from "@/components/ui/NewsCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/i18n/navigation";
import { games } from "@/lib/games";
import { BUILT_AT, getAllLive } from "@/lib/live";
import { getAllNews, toCardData } from "@/lib/news";

// Home, below the hero (CLAUDE.md section 7):
//   1. Featured game -- the /games chapter (GameChapter): shutter reveal on
//      the poster, pointer light, details fading up beside it.
//   2. More games    -- a row of 3:4 posters (GamePoster), scrolling
//      sideways when they don't fit (always on phones).
//   3. Live strip    -- a slim band to /live: "Live now", else the next
//      stream with its countdown; hidden when there's neither.
//   4. Latest news   -- NewsCards, as on /news.
//   5. Studio statement -- a calm typographic close.
export default async function Home({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const tBoot = await getTranslations("Boot");
  const tHome = await getTranslations("Home");
  const tFooter = await getTranslations("Footer");
  const tNews = await getTranslations("News");

  const latestNews = getAllNews().slice(0, 3);
  const featuredGame = games.find((game) => game.featured) ?? games[0];
  const otherGames = games.filter((game) => game.slug !== featuredGame.slug);
  const streams = getAllLive()
    .filter((item) => item.kind === "stream")
    .map((item) => ({ slug: item.slug, start: item.start, end: item.end!, title: item[locale].title }));

  const container = "mx-auto w-full max-w-[1280px] px-6 sm:px-12 lg:px-16";
  const sectionHeading = "font-display text-step-6 font-semibold leading-display text-parchment";
  const quietLink =
    "font-body text-step-2 text-lapis hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

  return (
    <main>
      <Hero
        wordmark={tBoot("heading")}
        locale={locale}
        headline={tBoot("tagline")}
        underHeader
        feature={<HeroFeature game={featuredGame} locale={locale} />}
      >
        <Button as={Link} href="/games" variant="primary">
          {tHome("hero.cta")}
        </Button>
      </Hero>

      <KufiDivider id="divider-hero-featured" />

      {/* 1. Featured game. GameChapter brings its own reveals (the poster
          shutter, then the details fading up), so it isn't wrapped again. */}
      <div className={`${container} py-24 sm:py-32`}>
        <GameChapter game={featuredGame} locale={locale} index={0} />
      </div>

      <KufiDivider id="divider-featured-grid" />

      {/* 2. More games */}
      {otherGames.length > 0 && (
        <ScrollReveal>
          <section aria-labelledby="grid-heading" className={`${container} flex flex-col gap-12 py-24 sm:py-32`}>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="grid-heading" className={sectionHeading}>
                {tHome("grid.heading")}
              </h2>
              <Link href="/games" className={quietLink}>
                {tFooter("gamesAll")}
              </Link>
            </div>
            {/* Native sideways scrolling (no scroll-jacking): on phones the
                row bleeds to the screen edge and the next poster peeks in.
                py-2 keeps focus rings inside the scroll area; scroll-ps keeps
                the page gutter when a poster snaps into place. Logical
                padding, so in Arabic the row starts at the right. */}
            <ul className="-mx-6 flex snap-x snap-mandatory scroll-ps-6 gap-6 overflow-x-auto px-6 py-2 sm:-mx-12 sm:scroll-ps-12 sm:px-12 lg:mx-0 lg:scroll-ps-0 lg:gap-8 lg:px-0">
              {otherGames.map((game) => (
                <li key={game.slug} className="w-[70%] shrink-0 snap-start sm:w-[45%] md:w-[300px] lg:w-[340px]">
                  <GamePoster game={game} locale={locale} />
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>
      )}

      {/* 3. Live strip (renders nothing when there's nothing to show) */}
      <LiveStrip streams={streams} builtAt={BUILT_AT} />

      {/* 4. Latest news. Not wrapped in ScrollReveal: section 4.5 limits
          Home's scroll reveal to Featured game, Games and Studio statement
          by name. */}
      {latestNews.length > 0 && (
        <>
          <KufiDivider id="divider-grid-news" />
          <section aria-labelledby="news-heading" className={`${container} flex flex-col gap-12 py-24 sm:py-32`}>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="news-heading" className={sectionHeading}>
                {tHome("news.heading")}
              </h2>
              <Link href="/news" className={quietLink}>
                {tHome("news.all")}
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {latestNews.map((post) => (
                <li key={post.slug}>
                  <NewsCard post={toCardData(post, locale, (type) => tNews(`types.${type}`))} idPrefix="home-news" />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <KufiDivider id="divider-grid-statement" />

      {/* 5. Studio statement: a calm close. The logo's star (brand mark,
          exempt from the brass budget), the heading, and the studio's one
          paragraph set large in the body face, centred, with room around
          it. No motion beyond the Home fade-up. */}
      <ScrollReveal>
        <section
          aria-labelledby="statement-heading"
          className={`${container} flex flex-col items-center py-32 text-center`}
        >
          <LogoStar size={24} />
          <h2
            id="statement-heading"
            className="mt-8 font-display text-step-5 font-semibold leading-display text-parchment"
          >
            {tHome("statement.heading")}
          </h2>
          <p
            className={`mt-6 font-body text-step-3 leading-body text-parchment/85 [text-wrap:pretty] sm:text-step-4 ${
              locale === "ar" ? "max-w-[44ch]" : "max-w-[48ch]"
            }`}
          >
            {tHome("statement.body")}
          </p>
        </section>
      </ScrollReveal>

      <KufiDivider id="divider-statement-footer" />
    </main>
  );
}
