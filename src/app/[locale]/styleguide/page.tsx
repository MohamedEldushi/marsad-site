import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { GameCard } from "@/components/ui/GameCard";
import { Hero } from "@/components/ui/Hero";
import { games } from "@/lib/games";

type Pairing = { fg: string; bg: string; ratio: number };
type ColourToken = {
  key: string;
  cssVar: string;
  hex: string;
  roleKey: string;
  pairings: Pairing[];
};

const COLOUR_TOKENS: ColourToken[] = [
  {
    key: "ink",
    cssVar: "--ink",
    hex: "#0A1228",
    roleKey: "ink",
    pairings: [{ fg: "parchment", bg: "ink", ratio: 14.96 }],
  },
  {
    key: "inkRaised",
    cssVar: "--ink-raised",
    hex: "#131E3A",
    roleKey: "inkRaised",
    pairings: [{ fg: "parchment", bg: "ink-raised", ratio: 13.27 }],
  },
  {
    key: "lapis",
    cssVar: "--lapis",
    hex: "#4A7BE8",
    roleKey: "lapis",
    pairings: [
      { fg: "lapis", bg: "ink", ratio: 4.68 },
      { fg: "lapis", bg: "ink-raised", ratio: 4.15 },
    ],
  },
  {
    key: "lapisDeep",
    cssVar: "--lapis-deep",
    hex: "#2449C4",
    roleKey: "lapisDeep",
    pairings: [{ fg: "parchment", bg: "lapis-deep", ratio: 5.99 }],
  },
  {
    key: "brass",
    cssVar: "--brass",
    hex: "#C9953F",
    roleKey: "brass",
    pairings: [{ fg: "ink", bg: "brass", ratio: 6.95 }],
  },
  {
    key: "parchment",
    cssVar: "--parchment",
    hex: "#EDE6D8",
    roleKey: "parchment",
    pairings: [
      { fg: "parchment", bg: "ink", ratio: 14.96 },
      { fg: "parchment", bg: "ink-raised", ratio: 13.27 },
    ],
  },
  {
    key: "muted",
    cssVar: "--muted",
    hex: "#8A94AE",
    roleKey: "muted",
    pairings: [{ fg: "muted", bg: "ink", ratio: 6.13 }],
  },
  {
    key: "error",
    cssVar: "--error",
    hex: "#E5484D",
    roleKey: "error",
    pairings: [{ fg: "error", bg: "ink", ratio: 4.75 }],
  },
  {
    key: "success",
    cssVar: "--success",
    hex: "#46A758",
    roleKey: "success",
    pairings: [{ fg: "success", bg: "ink", ratio: 6.13 }],
  },
];

const TYPE_STEPS = [
  { step: 8, rem: "3.815rem" },
  { step: 7, rem: "3.052rem" },
  { step: 6, rem: "2.441rem" },
  { step: 5, rem: "1.953rem" },
  { step: 4, rem: "1.563rem" },
  { step: 3, rem: "1.25rem" },
  { step: 2, rem: "1rem" },
  { step: 1, rem: "0.8rem" },
];

export default async function StyleguidePage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Styleguide");
  const tTokens = await getTranslations("Styleguide.colourTokens");
  const tBoot = await getTranslations("Boot");

  const sampleLatin = t("type.sampleLatin");
  const sampleArabic = t("type.sampleArabic");

  return (
    <main className="flex flex-col gap-24 pb-32">
      <div className="flex flex-col gap-3 px-6 pt-16 sm:px-12">
        <h1 className="font-display text-step-6 font-semibold leading-display text-parchment">
          {t("title")}
        </h1>
        <p className="max-w-[62ch] font-body text-step-3 leading-body text-muted">
          {t("intro")}
        </p>
      </div>

      {/* Colour */}
      <section aria-labelledby="colour-heading" className="flex flex-col gap-8 px-6 sm:px-12">
        <h2 id="colour-heading" className="font-display text-step-5 font-semibold leading-display text-parchment">
          {t("colour.heading")}
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {COLOUR_TOKENS.map((token) => (
            <div key={token.key} className="flex flex-col gap-3">
              <div
                className="h-20 w-full"
                style={{ background: `var(${token.cssVar})` }}
              />
              <div className="flex flex-col gap-1">
                <p dir="ltr" className="text-start font-body text-step-2 font-medium text-parchment">
                  {token.cssVar}
                  <span className="text-muted"> · {token.hex}</span>
                </p>
                <p className="font-body text-step-1 text-muted">
                  {tTokens(token.roleKey)}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                {token.pairings.map((pairing) => {
                  const pass = pairing.ratio >= 4.5;
                  return (
                    <div key={`${pairing.fg}-${pairing.bg}`} className="flex flex-col">
                      <div
                        dir="ltr"
                        className="flex items-center justify-between px-3 py-2 font-body text-step-1"
                        style={{
                          background: `var(--${pairing.bg})`,
                          color: `var(--${pairing.fg})`,
                        }}
                      >
                        <span>
                          {pairing.fg} / {pairing.bg}
                        </span>
                        <span>{pairing.ratio.toFixed(2)}:1</span>
                      </div>
                      {!pass && (
                        <p className="px-3 py-1 font-body text-step-1 text-error">
                          {t("colour.avoid")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Type scale */}
      <section aria-labelledby="type-heading" className="flex flex-col gap-8 px-6 sm:px-12">
        <div className="flex flex-col gap-2">
          <h2 id="type-heading" className="font-display text-step-5 font-semibold leading-display text-parchment">
            {t("type.heading")}
          </h2>
          <p className="font-body text-step-2 text-muted">{t("type.sub")}</p>
        </div>
        <div className="flex flex-col">
          {TYPE_STEPS.map(({ step, rem }) => {
            const isDisplay = step >= 5;
            return (
              <div
                key={step}
                className="flex flex-col gap-3 border-b border-muted/20 py-6 md:flex-row md:items-center md:gap-8"
              >
                <span className="w-28 shrink-0 font-body text-step-1 text-muted">
                  step-{step} · {rem}
                </span>
                <span
                  dir="ltr"
                  lang="en"
                  className={isDisplay ? "font-display-en font-semibold" : "font-body-en"}
                  style={{
                    fontSize: `var(--text-step-${step})`,
                    lineHeight: isDisplay ? 1.05 : 1.5,
                    color: "var(--parchment)",
                  }}
                >
                  {sampleLatin}
                </span>
                <span
                  dir="rtl"
                  lang="ar"
                  className={isDisplay ? "font-display-ar font-semibold" : "font-body-ar"}
                  style={{
                    fontSize: `var(--text-step-${step})`,
                    lineHeight: isDisplay ? 1.2 : 1.7,
                    color: "var(--parchment)",
                  }}
                >
                  {sampleArabic}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Wordmark */}
      <section aria-labelledby="wordmark-heading" className="flex flex-col gap-8 px-6 sm:px-12">
        <div className="flex flex-col gap-2">
          <h2 id="wordmark-heading" className="font-display text-step-5 font-semibold leading-display text-parchment">
            {t("wordmark.heading")}
          </h2>
          <p className="max-w-[62ch] font-body text-step-2 text-muted">{t("wordmark.sub")}</p>
        </div>
        <div className="flex flex-col flex-wrap gap-12 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <span
              dir="rtl"
              lang="ar"
              className="font-display-ar font-black leading-display text-parchment"
              style={{ fontSize: "var(--text-step-8)" }}
            >
              مرصد
            </span>
            <span className="font-body text-step-1 text-muted">Noto Kufi Arabic · 900</span>
          </div>
          <div className="flex flex-col gap-2">
            <span
              dir="ltr"
              lang="en"
              className="font-display-en font-black leading-display text-parchment"
              style={{ fontSize: "var(--text-step-8)" }}
            >
              Marsad
            </span>
            <span className="font-body text-step-1 text-muted">Archivo · 900</span>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section aria-labelledby="buttons-heading" className="flex flex-col gap-8 px-6 sm:px-12">
        <h2 id="buttons-heading" className="font-display text-step-5 font-semibold leading-display text-parchment">
          {t("buttons.heading")}
        </h2>
        <div className="flex flex-wrap items-center gap-6">
          <Button variant="primary">{t("buttons.primary")}</Button>
          <Button variant="secondary">{t("buttons.secondary")}</Button>
          <Button variant="primary" disabled>
            {t("buttons.disabled")}
          </Button>
        </div>
      </section>

      {/* Game card */}
      <section aria-labelledby="cards-heading" className="flex flex-col gap-8 px-6 sm:px-12">
        <div className="flex flex-col gap-2">
          <h2 id="cards-heading" className="font-display text-step-5 font-semibold leading-display text-parchment">
            {t("cards.heading")}
          </h2>
          <p className="font-body text-step-2 text-muted">{t("cards.sub")}</p>
        </div>
        <div className="flex flex-wrap gap-8">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} locale={locale} />
          ))}
        </div>
      </section>

      {/* Hero */}
      <section aria-labelledby="hero-heading" className="flex flex-col gap-8">
        <h2 id="hero-heading" className="px-6 font-display text-step-5 font-semibold leading-display text-parchment sm:px-12">
          {t("hero.heading")}
        </h2>
        <Hero headline={tBoot("tagline")}>
          <Button as="a" href="#" variant="primary">
            {t("hero.cta")}
          </Button>
        </Hero>
      </section>
    </main>
  );
}
