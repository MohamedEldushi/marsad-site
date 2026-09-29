import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { NewsBody } from "@/components/ui/NewsBody";
import { NewsCard } from "@/components/ui/NewsCard";
import { Link } from "@/i18n/navigation";
import { games } from "@/lib/games";
import {
  formatNewsDate,
  getAllNews,
  getNewsPost,
  getRelatedNews,
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
  const text = post[locale];

  const container = "mx-auto w-full max-w-[1280px] px-6 sm:px-12 lg:px-16";
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";
  const quietLink =
    "text-lapis underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis";

  return (
    <main>
      <div className={`${container} pt-8`}>
        <Link href="/news" className={`inline-flex font-body text-step-2 ${quietLink}`}>
          {t("article.back")}
        </Link>
      </div>

      <article aria-labelledby="article-title" className={`${container} pt-12 pb-16 sm:pt-16 sm:pb-24`}>
        <header className="flex max-w-[960px] flex-col gap-6">
          <p className="font-body text-step-2 text-muted">
            <span className="font-medium">{typeLabel(post.type)}</span>
            <span aria-hidden="true"> · </span>
            <time dateTime={post.date}>{formatNewsDate(post.date, locale)}</time>
            {game && (
              <>
                <span aria-hidden="true"> · </span>
                <Link href={`/games/${game.slug}`} className={quietLink}>
                  {game.title[locale]}
                </Link>
              </>
            )}
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
          <div className="relative mt-6 aspect-video w-full bg-ink-raised">
            {post.cover ? (
              <Image
                src={post.cover}
                alt={text.title}
                fill
                priority
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-body text-step-1 text-muted">
                {`news/${post.slug}/cover`}
              </span>
            )}
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
