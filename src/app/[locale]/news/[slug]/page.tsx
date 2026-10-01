import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { NewsBody } from "@/components/ui/NewsBody";
import { NewsCard } from "@/components/ui/NewsCard";
import { NewsCover } from "@/components/ui/NewsCover";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { Link } from "@/i18n/navigation";
import { games } from "@/lib/games";
import {
  formatNewsDate,
  getAllNews,
  getNewsPost,
  getRelatedNews,
  getAdjacentNews,
  readingMinutes,
  toCardData,
} from "@/lib/news";
import type { NewsType } from "@/types/news";

// Every post is built ahead of time, in both languages (the locale comes
// from the layout's own generateStaticParams). Any other slug is a 404 via
// notFound() below. dynamicParams is deliberately left at its default:
// with `false`, `next dev` keeps serving a stale slug list, so a post
// added while previewing 404s until the list refreshes.
export function generateStaticParams() {
  return getAllNews().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "en"; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getNewsPost(slug);
  if (!post) return {};

  const tBoot = await getTranslations({ locale, namespace: "Boot" });
  const title = `${post[locale].title} — ${tBoot("heading")}`;
  const description = post[locale].summary;
  const path = `/news/${slug}`;
  // The cover is the sharing image when there is one; otherwise the site's
  // default card for this language.
  const image = post.cover
    ? { url: post.cover, alt: post[locale].title }
    : { url: `/og/${locale}.png`, width: 1200, height: 630, alt: title };

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ar: `/ar${path}`, en: `/en${path}`, "x-default": `/ar${path}` },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}${path}`,
      type: "article",
      publishedTime: post.date,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en"; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getNewsPost(slug);
  if (!post) notFound();

  const t = await getTranslations("News");
  const typeLabel = (type: NewsType) => t(`types.${type}`);
  const game = post.game ? games.find((g) => g.slug === post.game) : undefined;
  const related = getRelatedNews(post);
  const { newer, older } = getAdjacentNews(post);
  const minutes = readingMinutes(post[locale].html);
  const text = post[locale];

  const container = "mx-auto w-full max-w-[1280px] px-6 sm:px-12 lg:px-16";
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";
  const quietLink =
    "text-lapis underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

  return (
    <main>
      <ReadingProgress targetId="article" />
      <div className={`${container} pt-8`}>
        <Link href="/news" className={`inline-flex font-body text-step-2 ${quietLink}`}>
          {t("article.back")}
        </Link>
      </div>

      <article id="article" aria-labelledby="article-title" className={`${container} pt-12 pb-16 sm:pt-16 sm:pb-24`}>
        <header className="flex max-w-[960px] flex-col gap-6">
          {/* Tag, then "date · reading time", then "· game". Each group
              carries a 16px lead in front of it (a dot where one belongs),
              and the row is pulled 16px past its start edge with overflow
              hidden: whichever group starts a line has its lead clipped
              away. So a dot can never start or end a line, whatever wraps.
              py-1/-my-1 keep the game link's focus ring inside the clip. */}
          <p className="-my-1 overflow-hidden py-1 font-body text-step-2 text-muted">
            <span className="-ms-4 flex flex-wrap items-center gap-y-2">
              <span className="ps-4">
                <span className="inline-block rounded-sm bg-lapis-deep px-2 py-1 text-step-1 font-medium leading-none text-parchment">
                  {typeLabel(post.type)}
                </span>
              </span>
              <span className="inline-flex items-center whitespace-nowrap">
                <span aria-hidden="true" className="w-4 shrink-0" />
                <time dateTime={post.date}>{formatNewsDate(post.date, locale)}</time>
                <span aria-hidden="true" className="w-4 shrink-0 text-center">·</span>
                <span>{t("readingTime", { count: minutes, minutes: String(minutes) })}</span>
              </span>
              {game && (
                <span className="inline-flex items-center whitespace-nowrap">
                  <span aria-hidden="true" className="w-4 shrink-0 text-center">·</span>
                  <Link href={`/games/${game.slug}`} className={quietLink}>
                    {game.title[locale]}
                  </Link>
                </span>
              )}
            </span>
          </p>
          <h1
            id="article-title"
            className="font-display text-step-6 font-semibold leading-display text-parchment sm:text-step-7"
          >
            {text.title}
          </h1>
          <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted sm:text-step-4`}>
            {text.summary}
          </p>
          <div className="relative mt-6 aspect-video w-full overflow-hidden border border-muted/20 bg-ink">
            <NewsCover
              slug={post.slug}
              cover={post.cover}
              label={game ? game.title[locale] : typeLabel(post.type)}
              idPrefix="article"
              sizes="(min-width: 1024px) 960px, 100vw"
              priority
            />
          </div>
        </header>

        <div className="mt-12 sm:mt-16">
          <NewsBody html={text.html} locale={locale} />
        </div>

        {/* The page's one brass element, and only for posts about a game. */}
        {game && (
          <div className={`${proseMaxWidth} mt-16 border-t border-muted/40 pt-8`}>
            <Button as={Link} href={`/games/${game.slug}`} variant="primary">
              {t("article.gameCta", { game: game.title[locale] })}
            </Button>
          </div>
        )}
      </article>

      {(newer || older) && (
        <nav aria-label={t("article.moreNews")} className={`${container} pb-16 sm:pb-24`}>
          <div className="grid grid-cols-1 gap-4 border-y border-muted/40 py-6 sm:grid-cols-2">
            {[
              { post: older, label: t("article.older"), end: false },
              { post: newer, label: t("article.newer"), end: true },
            ].map(({ post: other, label, end }) =>
              other ? (
                <Link
                  key={label}
                  href={`/news/${other.slug}`}
                  className={`group flex flex-col gap-1 ${end ? "sm:items-end sm:text-end" : ""} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-ink`}
                >
                  <span className="font-body text-step-1 text-muted">{label}</span>
                  <span className="font-display text-step-3 font-semibold leading-display text-parchment transition-colors duration-200 ease-[var(--ease-entrance)] group-hover:text-lapis">
                    {other[locale].title}
                  </span>
                </Link>
              ) : (
                <span key={label} aria-hidden="true" />
              ),
            )}
          </div>
        </nav>
      )}

      {related.length > 0 && (
        <section aria-labelledby="more-news-heading" className={`${container} pb-16 sm:pb-24`}>
          <h2
            id="more-news-heading"
            className="border-t border-muted/40 pt-8 font-display text-step-4 font-semibold leading-display text-parchment sm:text-step-5"
          >
            {t("article.moreNews")}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {related.map((other) => (
              <li key={other.slug}>
                <NewsCard post={toCardData(other, locale, typeLabel)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
