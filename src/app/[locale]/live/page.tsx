import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ExternalIcon } from "@/components/ui/LiveCards";
import { LiveHub } from "@/components/ui/LiveHub";
import { BUILT_AT, getAllLive, getChannels, toLiveCardData } from "@/lib/live";
import type { LiveKind } from "@/types/live";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Live" });
  const tBoot = await getTranslations({ locale, namespace: "Boot" });
  const title = `${t("heading")} — ${tBoot("heading")}`;

  return {
    title,
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/live`,
      languages: { ar: "/ar/live", en: "/en/live", "x-default": "/ar/live" },
    },
    openGraph: {
      title,
      description: t("intro"),
      url: `/${locale}/live`,
      type: "website",
      images: [{ url: `/og/${locale}.png`, width: 1200, height: 630, alt: title }],
    },
  };
}

// Streams & Podcasts. Same opening as /news (compact title row), then the
// LiveHub (live now / coming up / pinned filter / replays grid), then the
// studio's channels. Nothing is embedded: every link opens the platform.
export default async function LivePage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Live");
  const kindLabel = (kind: LiveKind) => t(`kinds.${kind}`);
  const items = getAllLive().map((item) => toLiveCardData(item, locale, kindLabel));
  const channels = getChannels();

  const container = "mx-auto w-full max-w-[1280px] px-6 sm:px-12 lg:px-16";
  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

  return (
    <main aria-labelledby="live-heading">
      <header className={`${container} pt-12 sm:pt-16`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
          <h1
            id="live-heading"
            className="font-display text-step-6 font-semibold leading-display text-parchment sm:text-step-7"
          >
            {t("heading")}
          </h1>
          <p className="max-w-[44ch] font-body text-step-3 leading-body text-muted md:pb-2">{t("intro")}</p>
        </div>
      </header>

      <div className={`${container} pt-8 pb-16 sm:pt-12 sm:pb-24`}>
        <LiveHub items={items} builtAt={BUILT_AT} />
      </div>

      {channels.length > 0 && (
        <section aria-labelledby="live-channels" className={`${container} pb-16 sm:pb-24`}>
          <div className="flex flex-col gap-8 border-t border-muted/40 pt-8">
            <div className="flex flex-col gap-2">
              <h2
                id="live-channels"
                className="font-display text-step-4 font-semibold leading-display text-parchment sm:text-step-5"
              >
                {t("channelsHeading")}
              </h2>
              <p className="font-body text-step-2 leading-body text-muted">{t("channelsIntro")}</p>
            </div>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {channels.map((channel) => (
                <li key={channel.platform}>
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-between gap-3 border border-muted/30 bg-ink-raised px-5 py-4 font-body text-step-2 font-medium text-parchment transition-colors duration-200 ease-[var(--ease-entrance)] hover:border-muted/70 ${focus}`}
                  >
                    {t(`platforms.${channel.platform}`)}
                    <ExternalIcon className="text-muted transition-[transform,color] duration-200 ease-[var(--ease-entrance)] group-hover:text-parchment motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
                    <span className="sr-only">{t("newTab")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
