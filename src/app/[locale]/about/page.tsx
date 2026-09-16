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

// Quiet and typographic, per the brief -- no hero, no texture, no image
// slots. Start-aligned like every other body-copy page rather than
// centred: Home's studio statement is centred as a one-off "quiet
// pause" within a longer page rhythm, not a general pattern for a page
// that's entirely paragraphs.
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("About");
  const paragraphs = t.raw("paragraphs") as string[];

  // Body line length cap, section 4: 62ch Latin, 58ch Arabic.
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";

  return (
    <main>
      <section
        aria-labelledby="about-heading"
        className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-16 sm:px-12 sm:py-24 lg:px-16"
      >
        <div className="flex flex-col gap-3">
          <h1
            id="about-heading"
            className="font-display text-step-7 font-semibold leading-display text-parchment"
          >
            {t("heading")}
          </h1>
          <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted`}>
            {t("intro")}
          </p>
        </div>

        <div className={`${proseMaxWidth} flex flex-col gap-6`}>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="font-body text-step-2 leading-body text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
