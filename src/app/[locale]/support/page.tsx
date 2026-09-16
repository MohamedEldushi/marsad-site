import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Support" });

  return {
    title: t("heading"),
    description: t("intro"),
    alternates: { canonical: `/${locale}/support` },
  };
}

type FaqEntry = { question: string; answer: string };

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Support");
  const email = t("email");
  const faq = t.raw("faq") as FaqEntry[];

  // Body line length cap, section 4: 62ch Latin, 58ch Arabic.
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";

  return (
    <main>
      <section
        aria-labelledby="support-heading"
        className="mx-auto flex max-w-[1280px] flex-col gap-12 px-6 py-16 sm:px-12 sm:py-24 lg:px-16"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1
              id="support-heading"
              className="font-display text-step-7 font-semibold leading-display text-parchment"
            >
              {t("heading")}
            </h1>
            <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted`}>
              {t("intro")}
            </p>
          </div>

          {/* An email address is always Latin/ASCII regardless of locale,
              so it's marked dir="ltr" to keep the @ and . in the right
              visual order inside an RTL page -- the same treatment the
              styleguide already uses for hex codes. Shown as plain large
              text rather than inside a button: it needs to be genuinely
              selectable, not just clickable. */}
          <a
            href={`mailto:${email}`}
            dir="ltr"
            className="inline-flex w-fit max-w-full break-words font-body text-step-4 font-semibold text-lapis underline decoration-2 underline-offset-8 hover:brightness-110 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:text-step-5"
          >
            {email}
          </a>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="font-display text-step-5 font-semibold leading-display text-parchment">
            {t("faqHeading")}
          </h2>
          <div className="flex flex-col gap-8">
            {faq.map((entry, index) => (
              <div key={index} className="flex flex-col gap-2">
                <h3 className="font-body text-step-3 font-medium text-parchment">
                  {entry.question}
                </h3>
                <p className={`${proseMaxWidth} font-body text-step-2 leading-body text-muted`}>
                  {entry.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
