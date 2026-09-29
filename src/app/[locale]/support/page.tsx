import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { GameTile } from "@/components/ui/GameTile";
import { KufiDivider } from "@/components/ui/KufiDivider";
import { KufiPanel } from "@/components/ui/KufiPanel";
import { Link } from "@/i18n/navigation";
import { games } from "@/lib/games";

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

// A routing hub, after the Supercell support page's structure (per-game
// routing first), in our own design system:
//   1. Header: title + intro beside the Kufi panel.
//   2. Choose your game: one tile per playable game. Each is a mailto:
//      with the game in the subject and a short report template in the
//      body, so every email arrives already sorted and detailed.
//   3. Kufi divider band.
//   4. Anything else: contact (brass button, the page's only brass) +
//      FAQ with hairlines. Contact column is sticky on desktop.
//   5. See also: quiet text links to About / Privacy / Terms.
export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Support");
  const tFooter = await getTranslations("Footer");
  const email = t("email");
  const faq = t.raw("faq") as FaqEntry[];

  // Coming-soon games have no players yet, so no support tile.
  const supportedGames = games.filter((game) => game.status !== "coming-soon");

  const mailtoFor = (gameTitle: string) => {
    const subject = encodeURIComponent(t("mailSubject", { game: gameTitle }));
    // \r\n is what mail clients expect for line breaks in a mailto body.
    const body = encodeURIComponent(t("mailBody").replace(/\n/g, "\r\n"));
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  // Body line length cap, section 4: 62ch Latin, 58ch Arabic.
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";
  const container = "mx-auto w-full max-w-[1280px] px-6 sm:px-12 lg:px-16";
  const sectionHeading =
    "font-display text-step-4 font-semibold leading-display text-parchment sm:text-step-5";
  const quietLink =
    "font-body text-step-2 text-lapis hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

  return (
    <main aria-labelledby="support-heading">
      {/* 1. Header */}
      <header className={`${container} pt-16 sm:pt-24`}>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <h1
              id="support-heading"
              className="font-display text-step-6 font-semibold leading-display text-parchment sm:text-step-7"
            >
              {t("heading")}
            </h1>
            <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted`}>
              {t("intro")}
            </p>
          </div>
          <KufiPanel
            id="support-kufi-panel"
            className="aspect-[16/9] w-full lg:col-span-5 lg:aspect-[4/3]"
          />
        </div>
      </header>

      {/* 2. Choose your game */}
      <section aria-labelledby="support-games-heading" className={`${container} py-16 sm:py-24`}>
        <div className="border-t border-muted/40 pt-8">
          <h2 id="support-games-heading" className={sectionHeading}>
            {t("gamesHeading")}
          </h2>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {supportedGames.map((game) => (
            <li key={game.slug}>
              <GameTile
                thumbnail={game.thumbnail}
                title={game.title[locale]}
                line={t("gameAction")}
                lineTone="lapis"
                link={(className, children) => (
                  <a href={mailtoFor(game.title[locale])} className={className}>
                    {children}
                  </a>
                )}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Divider band */}
      <KufiDivider id="support-kufi-divider" />

      {/* 4. Anything else: contact + FAQ */}
      <div className={`${container} grid grid-cols-1 gap-y-16 py-16 sm:py-24 lg:grid-cols-12 lg:gap-x-8`}>
        <section
          aria-labelledby="support-other-heading"
          className="flex flex-col gap-8 lg:sticky lg:top-8 lg:col-span-5 lg:self-start"
        >
          <h2 id="support-other-heading" className={sectionHeading}>
            {t("otherHeading")}
          </h2>
          <div className="flex flex-col items-start gap-4 border-t border-muted/40 pt-8">
            <Button as="a" href={`mailto:${email}`} variant="primary">
              {t("emailCta")}
            </Button>
            <div className="flex flex-col gap-1">
              <span className="font-body text-step-1 text-muted">{t("emailLabel")}</span>
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
          <h2 id="faq-heading" className={sectionHeading}>
            {t("faqHeading")}
          </h2>
          <div className="border-b border-muted/40">
            {faq.map((entry, index) => (
              <div key={index} className="flex flex-col gap-3 border-t border-muted/40 py-6">
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

      {/* 5. See also */}
      <nav aria-labelledby="support-see-also" className={`${container} pb-16 sm:pb-24`}>
        <div className="flex flex-col gap-4 border-y border-muted/40 py-6 sm:flex-row sm:items-baseline sm:gap-12">
          <h2 id="support-see-also" className="font-body text-step-2 font-medium text-muted">
            {t("seeAlsoHeading")}
          </h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            <li>
              <Link href="/about" className={quietLink}>
                {tFooter("about")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={quietLink}>
                {tFooter("legal.privacy")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className={quietLink}>
                {tFooter("legal.terms")}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </main>
  );
}
