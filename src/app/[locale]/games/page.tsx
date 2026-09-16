import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GameCard } from "@/components/ui/GameCard";
import { games } from "@/lib/games";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "GamesIndex" });

  return {
    title: t("heading"),
    description: t("intro"),
    alternates: { canonical: `/${locale}/games` },
  };
}

// Three games, one per status (released/beta/coming-soon) — a status
// filter would just split them into three groups of one each, so it's
// left out per CLAUDE.md section 10 ("only if it earns its place").
export default async function GamesIndexPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("GamesIndex");

  // Body line length cap, section 4: 62ch Latin, 58ch Arabic.
  const proseMaxWidth = locale === "ar" ? "max-w-[58ch]" : "max-w-[62ch]";

  return (
    <main>
      <section
        aria-labelledby="games-heading"
        className="mx-auto flex max-w-[1280px] flex-col gap-12 px-6 py-16 sm:px-12 sm:py-24 lg:px-16"
      >
        <div className="flex flex-col gap-3">
          <h1
            id="games-heading"
            className="font-display text-step-7 font-semibold leading-display text-parchment"
          >
            {t("heading")}
          </h1>
          <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted`}>
            {t("intro")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}
