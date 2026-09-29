/**
 * The body of a news article: markdown already rendered to HTML by
 * src/lib/news.ts (raw HTML in the source is escaped there, so this is
 * only ever the markdown's own elements). The element styles live in
 * globals.css under .news-body, because the HTML comes from markdown and
 * can't carry utility classes.
 *
 * Reading width is capped per section 4: 58ch Arabic, 62ch Latin.
 */
export function NewsBody({ html, locale }: { html: string; locale: "ar" | "en" }) {
  return (
    <div
      className={`news-body ${locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]"}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
