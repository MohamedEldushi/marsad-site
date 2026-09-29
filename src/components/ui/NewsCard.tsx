import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { NewsCardData } from "@/types/news";

/**
 * One news post as a single link: 16:9 cover, type · date, title, summary.
 * Works in server and client components alike (no hooks), because the
 * news index's filter renders it on the client.
 *
 * `featured` is the large version at the top of /news: cover and text side
 * by side from lg up, stacked below.
 *
 * Hover per CLAUDE.md 4.5 (cards): the cover raises 4px and its border
 * lightens, 200ms, house easing. The focus ring is not transitioned.
 * No cover yet: the section 5 placeholder (--ink-raised block + slot name).
 */
export function NewsCard({
  post,
  featured = false,
  headingLevel = "h3",
}: {
  post: NewsCardData;
  featured?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <Link
      href={`/news/${post.slug}`}
      className={`group grid gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-ink ${
        featured ? "grid-cols-1 lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:gap-y-0" : "grid-cols-1"
      }`}
    >
      <div
        className={`relative aspect-video w-full overflow-hidden border border-muted/20 bg-ink-raised transition-[transform,border-color] duration-200 ease-[var(--ease-entrance)] group-hover:border-muted/60 motion-safe:group-hover:-translate-y-1 ${
          featured ? "lg:col-span-7" : ""
        }`}
      >
        {post.cover ? (
          <Image
            src={post.cover}
            alt=""
            fill
            sizes={featured ? "(min-width: 1024px) 700px, 100vw" : "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"}
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-body text-step-1 text-muted">
            {`news/${post.slug}/cover`}
          </span>
        )}
      </div>

      <div className={`flex flex-col gap-2 ${featured ? "lg:col-span-5 lg:gap-4" : ""}`}>
        <p className="font-body text-step-1 text-muted">
          <span className="font-medium">{post.typeLabel}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={post.date}>{post.dateLabel}</time>
        </p>
        <Heading
          className={`font-display font-semibold leading-display text-parchment ${
            featured ? "text-step-5 sm:text-step-6" : "text-step-4"
          }`}
        >
          {post.title}
        </Heading>
        <p
          className={`font-body leading-body text-muted ${
            featured ? "text-step-3" : "text-step-2"
          }`}
        >
          {post.summary}
        </p>
      </div>
    </Link>
  );
}
