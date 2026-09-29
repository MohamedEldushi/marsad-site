import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { GameCard } from "@/components/ui/GameCard";
import { Hero } from "@/components/ui/Hero";
import { KufiDivider } from "@/components/ui/KufiDivider";
import { NewsCard } from "@/components/ui/NewsCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/i18n/navigation";
import { games } from "@/lib/games";
import { getAllNews, toCardData } from "@/lib/news";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const tBoot = await getTranslations("Boot");
  const tHome = await getTranslations("Home");
  const tPrimaryAction = await getTranslations("PrimaryAction");

  const tNews = await getTranslations("News");
  const latestNews = getAllNews().slice(0, 3);

  const featuredGame = games.find((game) => game.featured) ?? games[0];
  const otherGames = games.filter((game) => game.slug !== featuredGame.slug);

  // Body line length cap, section 4: 62ch Latin, 58ch Arabic.
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";

  return (
    <main>
      <Hero wordmark={tBoot("heading")} headline={tBoot("tagline")}>
        <Button as={Link} href="/games" variant="primary">
          {tHome("hero.cta")}
        </Button>
      </Hero>

      <KufiDivider id="divider-hero-featured" />

      <ScrollReveal>
        <section
          aria-labelledby="featured-heading"
          className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-6 py-24 sm:px-12 sm:py-32 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-16"
        >
          <div className="relative aspect-video w-full bg-ink-raised">
            <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-body text-step-1 text-muted">
              {featuredGame.keyArt}
            </span>
          </div>
          <div className="flex flex-col items-start gap-4 text-start">
            <p className="font-body text-step-1 font-medium text-muted">
              {tHome("featured.eyebrow")}
            </p>
            <h2
              id="featured-heading"
              className="font-display text-step-6 font-semibold leading-display text-parchment"
            >
              {featuredGame.title[locale]}
            </h2>
            <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted`}>
              {featuredGame.tagline[locale]}
            </p>
            {featuredGame.primaryAction.type !== "none" && (
              <Button as="a" href={featuredGame.primaryAction.url} variant="primary">
                {tPrimaryAction(featuredGame.primaryAction.type)}
              </Button>
            )}
          </div>
        </section>
      </ScrollReveal>

      <KufiDivider id="divider-featured-grid" />

      <ScrollReveal>
        <section
          aria-labelledby="grid-heading"
          className="mx-auto flex max-w-[1280px] flex-col gap-12 px-6 py-24 sm:px-12 sm:py-32 lg:px-16"
        >
          <h2
            id="grid-heading"
            className="font-display text-step-6 font-semibold leading-display text-parchment"
          >
            {tHome("grid.heading")}
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {otherGames.map((game) => (
              <GameCard key={game.slug} game={game} locale={locale} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Latest news. Not wrapped in ScrollReveal: section 4.5 limits
          Home's scroll reveal to Featured game, Games grid and Studio
          statement by name. */}
      {latestNews.length > 0 && (
        <>
          <KufiDivider id="divider-grid-news" />
          <section
            aria-labelledby="news-heading"
            className="mx-auto flex max-w-[1280px] flex-col gap-12 px-6 py-24 sm:px-12 sm:py-32 lg:px-16"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2
                id="news-heading"
                className="font-display text-step-6 font-semibold leading-display text-parchment"
              >
                {tHome("news.heading")}
              </h2>
              <Link
                href="/news"
                className="font-body text-step-2 text-lapis underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
              >
                {tHome("news.all")}
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {latestNews.map((post) => (
                <li key={post.slug}>
                  <NewsCard post={toCardData(post, locale, (type) => tNews(`types.${type}`))} />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <KufiDivider id="divider-grid-statement" />

      <ScrollReveal>
        <section
          aria-labelledby="statement-heading"
          className="mx-auto flex max-w-[1280px] flex-col items-center gap-4 px-6 py-24 text-center sm:px-12 sm:py-32 lg:px-16"
        >
          <h2
            id="statement-heading"
            className="font-display text-step-5 font-semibold leading-display text-parchment"
          >
            {tHome("statement.heading")}
          </h2>
          <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted`}>
            {tHome("statement.body")}
          </p>
        </section>
      </ScrollReveal>

      <KufiDivider id="divider-statement-footer" />
    </main>
  );
}
