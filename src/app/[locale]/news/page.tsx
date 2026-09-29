import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NewsCard } from "@/components/ui/NewsCard";
import { NewsFilter } from "@/components/ui/NewsFilter";
import { games } from "@/lib/games";
import { getAllNews, getFeaturedNews, toCardData } from "@/lib/news";
import { NEWS_TYPES } from "@/types/news";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "News" });
  const tBoot = await getTranslations({ locale, namespace: "Boot" });
  const title = `${t("heading")} — ${tBoot("heading")}`;

  return {
    title,
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/news`,
      languages: { ar: "/ar/news", en: "/en/news", "x-default": "/ar/news" },
    },
    openGraph: {
      title,
      description: t("intro"),
      url: `/${locale}/news`,
      type: "website",
      images: [{ url: `/og/${locale}.png`, width: 1200, height: 630, alt: title }],
    },
  };
}

// A compact title row (title at the start, the intro line at the end),
// so the first screen is a story, not a heading. Then the cinematic
// featured story, then the pinned filter bar and the editorial grid.
export default async function NewsIndexPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("News");

  const posts = getAllNews();
  const featured = getFeaturedNews(posts);
  const typeLabel = (type: (typeof NEWS_TYPES)[number]) => t(`types.${type}`);
  const cards = posts.map((post) => toCardData(post, locale, typeLabel));

  // Only games that actually have posts get a filter button.
  const gameOptions = games
    .filter((game) => posts.some((post) => post.game === game.slug))
    .map((game) => ({ value: game.slug, label: game.title[locale] }));

  const container = "mx-auto w-full max-w-[1280px] px-6 sm:px-12 lg:px-16";

  return (
    <main aria-labelledby="news-heading">
      <header className={`${container} pt-12 sm:pt-16`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
          <h1
            id="news-heading"
            className="font-display text-step-6 font-semibold leading-display text-parchment sm:text-step-7"
          >
            {t("heading")}
          </h1>
          <p className="max-w-[40ch] font-body text-step-3 leading-body text-muted md:pb-2">{t("intro")}</p>
        </div>
      </header>

      {featured ? (
        <>
          <section aria-label={featured[locale].title} className={`${container} pt-8 pb-16 sm:pt-12 sm:pb-24`}>
            <NewsCard post={toCardData(featured, locale, typeLabel)} size="featured" headingLevel="h2" idPrefix="featured" />
          </section>

          <section aria-labelledby="news-list-heading" className={`${container} pb-16 sm:pb-24`}>
            <h2
              id="news-list-heading"
              className="sr-only"
            >
              {t("listHeading")}
            </h2>
            <NewsFilter
              posts={cards}
              featuredSlug={featured.slug}
              typeOptions={NEWS_TYPES.map((type) => ({ value: type, label: typeLabel(type) }))}
              gameOptions={gameOptions}
              labels={{
                type: t("filter.type"),
                game: t("filter.game"),
                all: t("filter.all"),
                allGames: t("filter.allGames"),
                empty: t("filter.empty"),
                showAll: t("filter.showAll"),
              }}
            />
          </section>
        </>
      ) : (
        <p className={`${container} py-16 font-body text-step-3 leading-body text-muted sm:py-24`}>
          {t("noPosts")}
        </p>
      )}
    </main>
  );
}
