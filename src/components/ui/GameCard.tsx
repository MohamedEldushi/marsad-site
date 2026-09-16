import { getTranslations } from "next-intl/server";
import type { Game } from "@/types/game";
import { Button } from "./Button";

export async function GameCard({
  game,
  locale,
  fill = false,
}: {
  game: Game;
  locale: "ar" | "en";
  /** Fill the width of a parent grid column instead of the card's own
   * fixed intrinsic width — for a grid of cards (Home). The styleguide's
   * flex-wrap showcase leaves this off so cards keep their compact,
   * self-contained size there. */
  fill?: boolean;
}) {
  const t = await getTranslations("PrimaryAction");
  const tStatus = await getTranslations("GameStatus");

  return (
    <article className={`flex flex-col gap-4 ${fill ? "w-full" : "w-64"}`}>
      <div className="relative aspect-[3/4] w-full bg-ink-raised">
        <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-body text-step-1 text-muted">
          {game.thumbnail}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {game.status === "beta" && (
          <p className="font-body text-step-1 font-medium text-brass">
            {tStatus("beta")}
          </p>
        )}
        {game.status === "coming-soon" && (
          <p className="font-body text-step-1 text-muted">
            {tStatus("comingSoon")}
          </p>
        )}
        <h3 className="font-display text-step-4 font-semibold leading-display text-parchment">
          {game.title[locale]}
        </h3>
        <p className="font-body text-step-2 leading-body text-muted">
          {game.tagline[locale]}
        </p>
      </div>

      {game.status === "coming-soon" ? (
        <Button variant="secondary" disabled>
          {tStatus("comingSoon")}
        </Button>
      ) : game.primaryAction.type !== "none" ? (
        <Button as="a" href={game.primaryAction.url} variant="secondary">
          {t(game.primaryAction.type)}
        </Button>
      ) : null}
    </article>
  );
}
