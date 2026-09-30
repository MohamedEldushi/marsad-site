import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NewsCardData } from "@/types/news";
import { NewsCover } from "./NewsCover";

/**
 * One news post as a single link. Three sizes:
 * - "default": 16:9 cover, then tag · date · reading time, title,
 *   summary, and a "read" line with an arrow.
 * - "large": the same, bigger type (first two posts in the /news grid).
 * - "featured": the cinematic story at the top of /news. From md up the
 *   text sits over the bottom of a 21:9 cover on a dark scrim; below md
 *   it stacks under a 16:9 cover.
 *
 * Works in server and client components (useTranslations works in both),
 * because the /news filter renders cards on the client.
 *
 * Hover, 200ms, house easing (CLAUDE.md 4.5): the frame's border
 * lightens, the cover zooms 4% inside it, the arrow slides forward in the
 * reading direction. Motion is off under reduced motion; the focus ring
 * is never animated.
 */
export function NewsCard({
  post,
  size = "default",
  headingLevel = "h3",
  idPrefix = "card",
}: {
  post: NewsCardData;
  size?: "default" | "large" | "featured";
  headingLevel?: "h2" | "h3";
  idPrefix?: string;
}) {
  const t = useTranslations("News");
  const Heading = headingLevel;
  const featured = size === "featured";

  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-ink";
  const frame =
    "relative w-full overflow-hidden border border-muted/20 bg-ink transition-colors duration-200 ease-[var(--ease-entrance)] group-hover:border-muted/60";

  const meta = (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-body text-step-1 text-muted">
      {/* Filled tag: --lapis-deep surface with parchment text (section 4). */}
      <span className="rounded-sm bg-lapis-deep px-2 py-1 font-medium leading-none text-parchment">
        {post.typeLabel}
      </span>
      {/* Kept on one line so the dot can never start (or end) a line;
          only the tag may wrap onto its own line. */}
      <span className="inline-flex items-center gap-x-3 whitespace-nowrap">
        <time dateTime={post.date}>{post.dateLabel}</time>
        <span aria-hidden="true">·</span>
        <span>{t("readingTime", { count: post.readingMinutes, minutes: String(post.readingMinutes) })}</span>
      </span>
    </p>
  );

  const readLine = (
    <span className="inline-flex items-center gap-2 font-body text-step-2 font-medium text-lapis">
      {t("read")}
      {/* Directional, so it mirrors in RTL (CLAUDE.md section 3). */}
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="transition-transform duration-200 ease-[var(--ease-entrance)] rtl:-scale-x-100 motion-safe:group-hover:translate-x-1 motion-safe:rtl:group-hover:-translate-x-1"
      >
        <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
      </svg>
    </span>
  );

  if (featured) {
    return (
      <Link href={`/news/${post.slug}`} className={`group block ${focus}`}>
        <div className={`${frame} aspect-video md:aspect-[21/9]`}>
          <NewsCover
            slug={post.slug}
            cover={post.cover}
            label={post.coverLabel}
            idPrefix={idPrefix}
            sizes="(min-width: 1280px) 1152px, 100vw"
            priority
            showLabel={false}
            poolTop
          />
          {/* Scrim: keeps overlaid text readable over any artwork, and keeps
              the tiling out from behind it. md and up only. */}
          <div className="absolute inset-0 hidden bg-gradient-to-t from-ink via-ink/75 to-transparent md:block" />
          <div className="absolute inset-x-0 bottom-0 hidden flex-col gap-4 p-8 md:flex lg:p-12">
            {meta}
            <Heading className="max-w-[24ch] font-display text-step-6 font-semibold leading-display text-parchment lg:text-step-7">
              {post.title}
            </Heading>
            <p className="max-w-[58ch] font-body text-step-3 leading-body text-parchment/80">{post.summary}</p>
            {readLine}
          </div>
        </div>
        {/* Below md: the same content, stacked under the cover. The title
            is the same heading element as the overlay's: only one of the
            two is ever displayed, so screen readers get exactly one. */}
        <div className="mt-6 flex flex-col gap-3 md:hidden">
          {meta}
          <Heading className="font-display text-step-5 font-semibold leading-display text-parchment">{post.title}</Heading>
          <p className="font-body text-step-2 leading-body text-muted">{post.summary}</p>
          {readLine}
        </div>
      </Link>
    );
  }

  const large = size === "large";
  return (
    <Link href={`/news/${post.slug}`} className={`group flex h-full flex-col gap-4 ${focus}`}>
      <div className={`${frame} aspect-video`}>
        <NewsCover
          slug={post.slug}
          cover={post.cover}
          label={post.coverLabel}
          idPrefix={idPrefix}
          sizes={large ? "(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 370px, (min-width: 768px) 50vw, 100vw"}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {meta}
        <Heading
          className={`font-display font-semibold leading-display text-parchment ${large ? "text-step-4 sm:text-step-5" : "text-step-4"}`}
        >
          {post.title}
        </Heading>
        <p className={`font-body leading-body text-muted ${large ? "text-step-3" : "text-step-2"}`}>{post.summary}</p>
        <span className="mt-auto pt-2">{readLine}</span>
      </div>
    </Link>
  );
}
