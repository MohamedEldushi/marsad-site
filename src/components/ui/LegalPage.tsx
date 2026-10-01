import { getTranslations } from "next-intl/server";
import { LegalContents } from "./LegalContents";
import { ReadingProgress } from "./ReadingProgress";

type Section = { heading: string; body: string };

/**
 * The shared layout for /privacy and /terms: comfortable legal reading.
 * - Header: title, intro, "last updated", and the placeholder notice
 *   (kept visible until the studio's real text is published).
 * - Numbered sections (approved by the studio: legal sections are
 *   referred to by number). Western digits in both languages.
 * - Contents: a sticky rail with scroll-spy beside the text from lg up; a
 *   collapsible list above it below lg (LegalContents).
 * - The news articles' reading-progress line under the site header.
 * - Reading measure at the section 4 caps (58ch Arabic, 62ch Latin) with
 *   generous leading and space between sections.
 *
 * Copy lives in messages/*.json (Privacy / Terms, and Legal for the shared
 * strings), so the real policy is a paste, not a rebuild. A body may hold
 * several paragraphs separated by a blank line.
 */
export async function LegalPage({
  namespace,
  locale,
}: {
  namespace: "Privacy" | "Terms";
  locale: "ar" | "en";
}) {
  const t = await getTranslations(namespace);
  const tLegal = await getTranslations("Legal");
  const sections = t.raw("sections") as Section[];
  const items = sections.map((section, index) => ({
    id: `section-${index + 1}`,
    number: index + 1,
    heading: section.heading,
  }));

  const container = "mx-auto w-full max-w-[1280px] px-6 sm:px-12 lg:px-16";
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";

  return (
    <main aria-labelledby="legal-heading">
      <ReadingProgress targetId="legal-body" />

      <header className={`${container} pt-12 sm:pt-16`}>
        <div className="flex flex-col gap-4 border-b border-muted/30 pb-10">
          <h1
            id="legal-heading"
            className="font-display text-step-6 font-semibold leading-display text-parchment sm:text-step-7"
          >
            {t("title")}
          </h1>
          <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted`}>{t("intro")}</p>
          <p className="font-body text-step-1 text-muted">
            <span className="font-medium text-parchment">{tLegal("lastUpdatedLabel")}: </span>
            {tLegal("lastUpdatedValue")}
          </p>
        </div>
      </header>

      <div className={`${container} grid grid-cols-1 gap-12 pt-10 pb-16 sm:pb-24 lg:grid-cols-12 lg:gap-x-8 lg:pt-16`}>
        {/* Contents: collapsible above the text below lg, a sticky rail
            beside it from lg. */}
        <div className="lg:hidden">
          <LegalContents items={items} label={tLegal("contentsLabel")} summary={tLegal("contents")} variant="disclosure" />
        </div>
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28">
            <LegalContents items={items} label={tLegal("contentsLabel")} summary={tLegal("contents")} variant="rail" />
          </div>
        </aside>

        <div id="legal-body" className="flex flex-col gap-12 lg:col-span-8 lg:col-start-5">
          {/* The placeholder notice stays visible until the real text is
              published (LAUNCH-CHECKLIST.md). */}
          <p role="note" className={`${proseMaxWidth} border border-muted/40 px-6 py-4 font-body text-step-2 leading-body text-muted`}>
            {tLegal("noticeBody")}
          </p>

          {sections.map((section, index) => (
            <section
              key={index}
              id={items[index].id}
              aria-labelledby={`${items[index].id}-heading`}
              className="flex scroll-mt-28 flex-col gap-4 border-t border-muted/20 pt-8"
            >
              <h2
                id={`${items[index].id}-heading`}
                className="flex gap-3 font-display text-step-4 font-semibold leading-display text-parchment"
              >
                <span className="shrink-0 tabular-nums text-muted">{index + 1}.</span>
                <span>{section.heading}</span>
              </h2>
              {section.body.split(/\n\s*\n/).map((paragraph, i) => (
                <p key={i} className={`${proseMaxWidth} font-body text-step-3 leading-body text-parchment/85 [text-wrap:pretty]`}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
