import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CopyButton } from "@/components/ui/CopyButton";
import { Logo } from "@/components/ui/Logo";
import { Link } from "@/i18n/navigation";
import { games } from "@/lib/games";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Press" });
  return {
    title: t("heading"),
    description: t("intro"),
    alternates: { canonical: `/${locale}/press`, languages: { ar: "/ar/press", en: "/en/press" } },
  };
}

// The press kit: what journalists, streamers and festivals look for --
// studio facts, a ready-to-paste description, logo downloads, colours,
// type, the games, and who to contact. Quiet and reference-like: no
// signature motion, only hover and focus states.
const LOGO_FILES = [
  { file: "marsad-logo-for-dark-backgrounds.svg", key: "logoDark", variant: "primary", tone: "color", bg: "bg-ink" },
  { file: "marsad-logo-for-light-backgrounds.svg", key: "logoLight", variant: "primary", tone: "color", bg: "bg-parchment text-ink" },
  { file: "marsad-symbol-for-dark-backgrounds.svg", key: "symbolDark", variant: "symbol", tone: "color", bg: "bg-ink" },
  { file: "marsad-symbol-for-light-backgrounds.svg", key: "symbolLight", variant: "symbol", tone: "color", bg: "bg-parchment text-ink" },
  { file: "marsad-logo-white.svg", key: "logoWhite", variant: "primary", tone: "mono", bg: "bg-ink-raised" },
  { file: "marsad-logo-black.svg", key: "logoBlack", variant: "primary", tone: "mono", bg: "bg-parchment text-black" },
] as const;

// Names are translated (Press.colourNames); the hex codes are the same in
// both languages.
const COLOURS = [
  { key: "ink", hex: "#0A1228", swatch: "bg-ink" },
  { key: "inkRaised", hex: "#131E3A", swatch: "bg-ink-raised" },
  { key: "parchment", hex: "#EDE6D8", swatch: "bg-parchment" },
  { key: "brass", hex: "#C9953F", swatch: "bg-brass" },
  { key: "lapis", hex: "#5A8AEB", swatch: "bg-lapis" },
] as const;

export default async function PressPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Press");
  const tSupport = await getTranslations("Support");
  const tStatus = await getTranslations("GameStatus");
  const email = tSupport("email");

  const container = "mx-auto w-full max-w-[1280px] px-6 sm:px-12 lg:px-16";
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";
  const sectionHeading = "font-display text-step-4 font-semibold leading-display text-parchment sm:text-step-5";
  const section = "flex flex-col gap-8 border-t border-muted/30 pt-12";
  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";
  const facts = t.raw("facts") as { label: string; value: string }[];

  return (
    <main aria-labelledby="press-heading">
      <header className={`${container} pt-12 sm:pt-16`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h1 id="press-heading" className="font-display text-step-6 font-semibold leading-display text-parchment sm:text-step-7">
            {t("heading")}
          </h1>
          <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted lg:max-w-[44ch] lg:pb-2`}>{t("intro")}</p>
        </div>
      </header>

      <div className={`${container} flex flex-col gap-24 pt-12 pb-24 sm:pt-16 sm:pb-32`}>
        {/* Facts + contact */}
        <section aria-labelledby="press-facts" className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <h2 id="press-facts" className={sectionHeading}>{t("factsHeading")}</h2>
            <dl className="grid grid-cols-1 border-t border-muted/30 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1 border-b border-muted/30 py-4 sm:pe-8">
                  <dt className="font-body text-step-1 text-muted">{fact.label}</dt>
                  <dd className="font-body text-step-2 text-parchment">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col gap-4 self-start border border-muted/30 bg-ink-raised p-6 lg:col-span-4 lg:col-start-9">
            <h2 className="font-display text-step-3 font-semibold leading-display text-parchment">{t("contactHeading")}</h2>
            <p className="font-body text-step-2 leading-body text-muted">{t("contactBody")}</p>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(t("contactSubject"))}`}
              dir="ltr"
              className={`w-fit break-all font-body text-step-2 font-medium text-lapis hover:underline ${focus}`}
            >
              {email}
            </a>
          </div>
        </section>

        {/* Boilerplate */}
        <section aria-labelledby="press-about" className={section}>
          <h2 id="press-about" className={sectionHeading}>{t("aboutHeading")}</h2>
          {(["short", "long"] as const).map((length) => (
            <div key={length} className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-body text-step-2 font-medium text-parchment">{t(`about.${length}Label`)}</h3>
                <CopyButton value={t(`about.${length}`)} label={t("copy")} copiedLabel={t("copied")} />
              </div>
              <p className={`${proseMaxWidth} border-s border-muted/40 ps-6 font-body text-step-3 leading-body text-parchment`}>
                {t(`about.${length}`)}
              </p>
            </div>
          ))}
        </section>

        {/* Logos */}
        <section aria-labelledby="press-logos" className={section}>
          <div className="flex flex-col gap-2">
            <h2 id="press-logos" className={sectionHeading}>{t("logosHeading")}</h2>
            <p className={`${proseMaxWidth} font-body text-step-2 leading-body text-muted`}>{t("logosNote")}</p>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LOGO_FILES.map((logo) => (
              <li key={logo.file} className="flex flex-col border border-muted/30">
                <div className={`flex aspect-[16/9] items-center justify-center ${logo.bg} ${logo.bg.includes("text-") ? "" : "text-parchment"}`}>
                  <Logo variant={logo.variant} tone={logo.tone} height={logo.variant === "symbol" ? 72 : 64} />
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-muted/30 px-4 py-3">
                  <span className="font-body text-step-1 text-parchment">{t(`files.${logo.key}`)}</span>
                  <a
                    href={`/press/${logo.file}`}
                    download
                    className={`font-body text-step-1 font-medium text-lapis hover:underline ${focus}`}
                  >
                    {t("downloadSvg")}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Colours + type */}
        <section aria-labelledby="press-colours" className={`${section} lg:grid lg:grid-cols-12 lg:gap-x-8`}>
          <div className="flex flex-col gap-6 lg:col-span-7">
            <h2 id="press-colours" className={sectionHeading}>{t("coloursHeading")}</h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {COLOURS.map((colour) => (
                <li key={colour.hex} className="flex flex-col border border-muted/30">
                  <div className={`h-20 ${colour.swatch}`} />
                  <div className="flex items-center justify-between gap-2 px-3 py-2">
                    <span className="flex flex-col">
                      <span className="font-body text-step-1 text-parchment">{t(`colourNames.${colour.key}`)}</span>
                      <span dir="ltr" className="font-body text-step-1 tabular-nums text-muted">{colour.hex}</span>
                    </span>
                    <CopyButton value={colour.hex} label={t("copy")} copiedLabel={t("copied")} className="px-2 py-1" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-12 flex flex-col gap-6 lg:col-span-4 lg:col-start-9 lg:mt-0">
            <h2 className={sectionHeading}>{t("typeHeading")}</h2>
            <dl className="flex flex-col border-t border-muted/30">
              {(t.raw("typefaces") as { role: string; name: string }[]).map((face) => (
                <div key={face.role} className="flex flex-col gap-1 border-b border-muted/30 py-4">
                  <dt className="font-body text-step-1 text-muted">{face.role}</dt>
                  <dd dir="ltr" className="font-body text-step-2 text-parchment rtl:text-right">{face.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Games */}
        <section aria-labelledby="press-games" className={section}>
          <h2 id="press-games" className={sectionHeading}>{t("gamesHeading")}</h2>
          <ul className="flex flex-col border-t border-muted/30">
            {games.map((game) => (
              <li key={game.slug} className="border-b border-muted/30">
                <Link
                  href={`/games/${game.slug}`}
                  className={`group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:gap-8 ${focus}`}
                >
                  <span className="font-display text-step-4 font-semibold leading-display text-parchment transition-colors duration-200 ease-[var(--ease-entrance)] group-hover:text-lapis sm:w-[16rem] sm:shrink-0">
                    {game.title[locale]}
                  </span>
                  <span className="font-body text-step-2 text-muted">{game.tagline[locale]}</span>
                  <span className="font-body text-step-1 text-muted sm:ms-auto">
                    {game.status === "beta" ? tStatus("beta") : game.status === "coming-soon" ? tStatus("comingSoon") : t("released")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Usage */}
        <section aria-labelledby="press-usage" className={section}>
          <h2 id="press-usage" className={sectionHeading}>{t("usageHeading")}</h2>
          <ul className={`${proseMaxWidth} flex list-disc flex-col gap-2 ps-6 font-body text-step-2 leading-body text-muted marker:text-muted`}>
            {(t.raw("usage") as string[]).map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
