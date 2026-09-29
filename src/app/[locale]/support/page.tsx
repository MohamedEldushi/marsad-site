import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";

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

// Two columns from lg up: contact at the start (5 of 12 columns), FAQ at
// the end (6 columns from column 7). Below lg they stack, contact first.
// The contact column is sticky on desktop so the email stays in reach
// while reading the answers, most of which end in "email us".
//
// The email is the page's primary action, so it gets the brass primary
// button -- the only brass on this page. The address itself is also
// shown as plain, selectable text underneath for people who copy it into
// their own mail app instead of clicking.
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
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-y-16 px-6 py-16 sm:px-12 sm:py-24 lg:grid-cols-12 lg:gap-x-8 lg:px-16">
        <section
          aria-labelledby="support-heading"
          className="flex flex-col gap-8 lg:sticky lg:top-8 lg:col-span-5 lg:self-start"
        >
          <h1
            id="support-heading"
            className="font-display text-step-6 font-semibold leading-display text-parchment sm:text-step-7"
          >
            {t("heading")}
          </h1>
          <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted`}>
            {t("intro")}
          </p>

          <div className="flex flex-col items-start gap-4 border-t border-muted/40 pt-8">
            <Button as="a" href={`mailto:${email}`} variant="primary">
              {t("emailCta")}
            </Button>
            <div className="flex flex-col gap-1">
              <span className="font-body text-step-1 text-muted">
                {t("emailLabel")}
              </span>
              {/* Always Latin, so dir="ltr" keeps the @ and . in order
                  inside an RTL page. break-all guards long real addresses
                  at 320px. */}
              <span
                dir="ltr"
                className="select-all break-all font-body text-step-3 font-medium text-parchment sm:text-step-4"
              >
                {email}
              </span>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="faq-heading"
          className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7"
        >
          <h2
            id="faq-heading"
            className="font-display text-step-4 font-semibold leading-display text-parchment sm:text-step-5"
          >
            {t("faqHeading")}
          </h2>
          <div className="border-b border-muted/40">
            {faq.map((entry, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 border-t border-muted/40 py-6"
              >
                <h3 className="font-body text-step-3 font-medium leading-body text-parchment">
                  {entry.question}
                </h3>
                <p className={`${proseMaxWidth} font-body text-step-2 leading-body text-muted`}>
                  {entry.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
