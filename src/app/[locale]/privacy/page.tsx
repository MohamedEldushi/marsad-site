import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });

  return {
    title: t("title"),
    description: t("intro"),
    alternates: { canonical: `/${locale}/privacy` },
  };
}

type Section = { heading: string; body: string };

// Full structure now -- headings, a last-updated slot, a placeholder
// body per section -- so the studio's real policy is a paste into
// messages/{ar,en}.json's Privacy.sections, not a rebuild of this page.
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Privacy");
  const tLegal = await getTranslations("Legal");
  const sections = t.raw("sections") as Section[];

  // Body line length cap, section 4: 62ch Latin, 58ch Arabic.
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";

  return (
    <main>
      <section
        aria-labelledby="privacy-heading"
        className="mx-auto flex max-w-[1280px] flex-col gap-12 px-6 py-16 sm:px-12 sm:py-24 lg:px-16"
      >
        <div className="flex flex-col gap-3">
          <h1
            id="privacy-heading"
            className="font-display text-step-7 font-semibold leading-display text-parchment"
          >
            {t("title")}
          </h1>
          <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted`}>
            {t("intro")}
          </p>
          <p className="font-body text-step-1 text-muted">
            <span className="font-medium">{tLegal("lastUpdatedLabel")}: </span>
            {tLegal("lastUpdatedValue")}
          </p>
        </div>

        <div className={`${proseMaxWidth} border border-muted/40 px-6 py-4`}>
          <p className="font-body text-step-2 leading-body text-muted">
            {tLegal("noticeBody")}
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col gap-2">
              <h2 className="font-display text-step-4 font-semibold leading-display text-parchment">
                {section.heading}
              </h2>
              <p className={`${proseMaxWidth} font-body text-step-2 leading-body text-muted`}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
