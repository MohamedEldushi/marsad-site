import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GamePoster } from "@/components/ui/GamePoster";
import { KufiPanel } from "@/components/ui/KufiPanel";
import { WordReveal } from "@/components/ui/WordReveal";
import { Link } from "@/i18n/navigation";
import { games } from "@/lib/games";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("heading"),
    description: t("intro"),
    alternates: { canonical: `/${locale}/about` },
  };
}

// A section with a `lead` is the page's emphasis band: the lead is set as
// display type on a raised surface, and the body follows at reading size.
type AboutSection = { heading: string; lead?: string; body: string };

// Structure borrowed from the Hazelight footer (references/NOTES.md): a
// quiet label column, a hairline rule, and generous space doing the work.
// No hero. Visual weight comes from the header's Kufi panel, the image
// slot in the Arabic-first band, and the games strip at the end.
//
// Scale steps: statement step-8 (lg) -> band lead step-5 -> headings/body
// step-3. The jump from the statement to everything else is the one
// decisive drop the page is built around.
//
// No numbering on sections: they are three facets of one argument, not a
// sequence, so 01/02/03 markers would imply an order that isn't there.
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("About");
  const tFooter = await getTranslations("Footer");
  const sections = t.raw("sections") as AboutSection[];

  // Body line length cap, section 4: 62ch Latin, 58ch Arabic.
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";
  const container = "mx-auto w-full max-w-[1280px] px-6 sm:px-12 lg:px-16";

  // 12-column row: heading in the start 4 columns, text from column 6.
  // Below lg the two stack, heading first.
  const row = "grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-8";
  const headingCell =
    "font-display text-step-3 font-semibold leading-display text-parchment lg:col-span-4";
  const textCell = "flex flex-col gap-8 lg:col-span-7 lg:col-start-6";

  return (
    <main aria-labelledby="about-heading">
      {/* Opening: title over a hairline, then the statement beside the
          Kufi panel on desktop; the panel drops below it on smaller
          screens. */}
      <header className={`${container} pt-16 sm:pt-24`}>
        <h1
          id="about-heading"
          className="border-b border-muted/40 pb-4 font-body text-step-3 font-medium text-muted"
        >
          {t("heading")}
        </h1>
        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-x-8">
          <p className="max-w-[20ch] font-display text-step-5 font-semibold leading-display text-parchment sm:text-step-7 lg:col-span-7">
            {t("statement")}
          </p>
          <KufiPanel
            id="about-kufi-panel"
            className="aspect-[16/9] w-full lg:col-span-5 lg:aspect-[4/3]"
          />
        </div>
      </header>

      {sections.map((section, index) => {
        const headingId = `about-section-${index}`;

        if (section.lead) {
          // Emphasis band: full-bleed raised surface, lead at display size.
          return (
            <section
              key={index}
              aria-labelledby={headingId}
              className="bg-ink-raised py-16 sm:py-24"
            >
              <div className={`${container} grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-x-8`}>
                {/* Image slot, CLAUDE.md section 5 placeholder treatment.
                    Real artwork: see LAUNCH-CHECKLIST.md. */}
                <div
                  role="img"
                  aria-label={t("artLabel")}
                  className="relative aspect-[4/5] w-full max-w-[420px] bg-ink lg:col-span-5 lg:max-w-none"
                >
                  <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-body text-step-1 text-muted">
                    about/arabic-first
                  </span>
                </div>
                <div className="flex flex-col gap-8 lg:col-span-7">
                  <h2 id={headingId} className={headingCell}>
                    {section.heading}
                  </h2>
                  {/* The page's signature moment: word by word, once. */}
                  <WordReveal
                    text={section.lead}
                    className="font-display text-step-4 font-semibold leading-display text-parchment sm:text-step-5"
                  />
                  <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted`}>
                    {section.body}
                  </p>
                </div>
              </div>
            </section>
          );
        }

        return (
          <section
            key={index}
            aria-labelledby={headingId}
            className={`${container} py-16 sm:py-24`}
          >
            <div className={`${row} border-t border-muted/40 pt-8`}>
              <h2 id={headingId} className={headingCell}>
                {section.heading}
              </h2>
              <div className={textCell}>
                <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted`}>
                  {section.body}
                </p>
              </div>
            </div>
          </section>
        );
      })}

      {/* Our games: every game as a GamePoster (pointer light, status
          line, tagline), linking to its page. */}
      <section
        aria-labelledby="about-games-heading"
        className={`${container} pb-16 sm:pb-24`}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-muted/40 pt-8">
          <h2 id="about-games-heading" className={headingCell}>
            {t("gamesHeading")}
          </h2>
          <Link
            href="/games"
            className="font-body text-step-2 text-lapis hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {tFooter("gamesAll")}
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:gap-x-8">
          {games.map((game) => (
            <li key={game.slug}>
              <GamePoster game={game} locale={locale} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
