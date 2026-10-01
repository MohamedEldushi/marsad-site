import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GameChapter } from "@/components/ui/GameChapter";
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

// Each game is its own chapter (GameChapter): a large poster beside the
// details, alternating sides down the page. With a handful of games, a
// status filter would split them into groups of one, so it's left out per
// CLAUDE.md section 10 ("only if it earns its place").
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
    <main aria-labelledby="games-heading">
      <header className="mx-auto w-full max-w-[1280px] px-6 pt-12 sm:px-12 sm:pt-16 lg:px-16">
        <div className="flex flex-col gap-3 border-b border-muted/30 pb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h1
            id="games-heading"
            className="font-display text-step-6 font-semibold leading-display text-parchment sm:text-step-7"
          >
            {t("heading")}
          </h1>
          <p className={`${proseMaxWidth} font-body text-step-3 leading-body text-muted lg:max-w-[44ch] lg:pb-2`}>
            {t("intro")}
          </p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-24 px-6 pt-16 pb-24 sm:gap-32 sm:px-12 sm:pt-24 sm:pb-32 lg:px-16">
        {games.map((game, index) => (
          <GameChapter key={game.slug} game={game} locale={locale} index={index} />
        ))}
      </div>
    </main>
  );
}
