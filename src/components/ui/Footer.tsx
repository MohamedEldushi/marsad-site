import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { games } from "@/lib/games";

export async function Footer({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations("Footer");
  const tBoot = await getTranslations("Boot");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-muted/20 bg-ink">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-6 py-16 sm:px-12 sm:py-20 lg:px-16">
        {/*
          Three siblings under one justify-between row, not wordmark vs. a
          single bundled nav block — Hazelight's footer spreads its logo,
          two nav columns, and a merch link across the full row this way.
          Nesting the two nav columns together previously made them act as
          one flex item, so justify-between only ever split the row in two:
          wordmark at one edge, both columns bunched at the other with a
          huge gap between.
        */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-display text-step-5 font-black leading-display text-parchment">
              {tBoot("heading")}
            </span>
            <p className="max-w-[32ch] font-body text-step-2 leading-body text-muted">
              {tBoot("tagline")}
            </p>
          </div>

          <nav aria-label={t("gamesHeading")} className="flex flex-col gap-4">
            <p className="font-body text-step-1 font-medium text-muted">
              {t("gamesHeading")}
            </p>
            <ul className="flex flex-col gap-3">
              {games.map((game) => (
                <li key={game.slug}>
                  <Link
                    href={`/games/${game.slug}`}
                    className="font-body text-step-2 text-parchment underline-offset-4 hover:text-lapis hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
                  >
                    {game.title[locale]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/games"
                  className="font-body text-step-2 text-lapis underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
                >
                  {t("gamesAll")}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label={t("studioHeading")} className="flex flex-col gap-4">
            <p className="font-body text-step-1 font-medium text-muted">
              {t("studioHeading")}
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/"
                  className="font-body text-step-2 text-parchment underline-offset-4 hover:text-lapis hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="font-body text-step-2 text-parchment underline-offset-4 hover:text-lapis hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="font-body text-step-2 text-parchment underline-offset-4 hover:text-lapis hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
                >
                  {t("support")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-muted/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-step-1 text-muted">
            {t("copyright", { year })}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="font-body text-step-1 text-muted underline-offset-4 hover:text-lapis hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
            >
              {t("legal.privacy")}
            </Link>
            <Link
              href="/terms"
              className="font-body text-step-1 text-muted underline-offset-4 hover:text-lapis hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
            >
              {t("legal.terms")}
            </Link>
            <a
              href="#"
              className="font-body text-step-1 text-muted underline-offset-4 hover:text-lapis hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
            >
              {t("social.x")}
            </a>
            <a
              href="#"
              className="font-body text-step-1 text-muted underline-offset-4 hover:text-lapis hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
            >
              {t("social.instagram")}
            </a>
            <a
              href="#"
              className="font-body text-step-1 text-muted underline-offset-4 hover:text-lapis hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis"
            >
              {t("social.youtube")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
