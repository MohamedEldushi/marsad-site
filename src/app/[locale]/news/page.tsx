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

// Same opening as /about: a small title over a hairline, then one large
// line. No Kufi panel here. Then the featured story large, then every
// post in a filterable grid.
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
      <header className={`${container} pt-16 sm:pt-24`}>
        <h1
          id="news-heading"
          className="border-b border-muted/40 pb-4 font-body text-step-3 font-medium text-muted"
        >
          {t("heading")}
        </h1>
        <p className="mt-12 max-w-[20ch] font-display text-step-5 font-semibold leading-display text-parchment sm:text-step-7">
          {t("intro")}
        </p>
      </header>

      {featured ? (
        <>
          <section aria-label={featured[locale].title} className={`${container} py-16 sm:py-24`}>
            <NewsCard post={toCardData(featured, locale, typeLabel)} featured headingLevel="h2" />
          </section>

          <section aria-labelledby="news-list-heading" className={`${container} pb-16 sm:pb-24`}>
            <h2
              id="news-list-heading"
              className="mb-8 font-display text-step-4 font-semibold leading-display text-parchment sm:text-step-5"
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
