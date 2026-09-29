import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
// No hero, no texture, no imagery -- scale, columns and rules only.
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
      {/* Opening: small title over a hairline, then the statement large. */}
      <header className={`${container} pt-16 sm:pt-24`}>
        <h1
          id="about-heading"
          className="border-b border-muted/40 pb-4 font-body text-step-3 font-medium text-muted"
        >
          {t("heading")}
        </h1>
        <p className="mt-12 max-w-[20ch] font-display text-step-5 font-semibold leading-display text-parchment sm:text-step-7 lg:text-step-8">
          {t("statement")}
        </p>
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
              <div className={`${container} ${row}`}>
                <h2 id={headingId} className={headingCell}>
                  {section.heading}
                </h2>
                <div className={textCell}>
                  <p className="font-display text-step-4 font-semibold leading-display text-parchment sm:text-step-5">
                    {section.lead}
                  </p>
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
    </main>
  );
}
