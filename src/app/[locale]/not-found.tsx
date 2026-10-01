import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { KufiTiling } from "@/components/ui/KufiTiling";
import { LogoStar } from "@/components/ui/Logo";
import { Link } from "@/i18n/navigation";

/**
 * The 404 page: a patch of night sky (approved by the studio). The site's
 * tiling sits behind a lit pool, and the logo's brass star -- the one that
 * leads the wordmark -- arrives and settles once: the page's signature
 * moment (globals.css, .sky-star; 600ms, house easing, off under reduced
 * motion). It travels right to left in both languages, like the logo's
 * star, and is never mirrored.
 *
 * Brass on this screen: the star (logo, exempt) and the one primary button.
 * Shown for unknown addresses ([...rest]) and wherever a page calls
 * notFound() (an unknown game or news post).
 */
export default function NotFound() {
  const t = useTranslations("NotFound");
  const tNav = useTranslations("Nav");
  const tBoot = useTranslations("Boot");

  const quietLink =
    "group inline-flex items-center gap-2 font-body text-step-2 font-medium text-lapis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-4 focus-visible:ring-offset-ink";
  const arrow = (
    // Directional: mirrors in RTL (CLAUDE.md section 3).
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="transition-transform duration-200 ease-[var(--ease-entrance)] rtl:-scale-x-100 motion-safe:group-hover:translate-x-1 motion-safe:rtl:group-hover:-translate-x-1"
    >
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
    </svg>
  );

  return (
    <main
      aria-labelledby="not-found-heading"
      className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center sm:px-12"
    >
      {/* React hoists this into <head>, so the tab says what happened. */}
      <title>{`${t("title")} — ${tBoot("heading")}`}</title>

      {/* Night sky: its own band, with the star at its centre. The lit pool
          spreads wider (clipped by <main>), but the tiling is masked to
          fade out completely inside the band, so it never sits behind the
          heading or the text below (CLAUDE.md section 4). */}
      <div className="relative flex h-56 w-full max-w-3xl items-center justify-center sm:h-72">
        <div
          aria-hidden="true"
          className="sky-pool absolute top-1/2 left-1/2 -z-10 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
        />
        <div className="sky-tiling-mask absolute inset-0 -z-10">
          <KufiTiling id="not-found-tiling" />
        </div>
        <LogoStar size={56} className="sky-star" />
      </div>

      <h1
        id="not-found-heading"
        className="mt-8 max-w-[18ch] font-display text-step-6 font-semibold leading-display text-parchment [text-wrap:balance] sm:text-step-7"
      >
        {t("heading")}
      </h1>
      <p className="mt-6 max-w-[46ch] font-body text-step-3 leading-body text-muted [text-wrap:pretty]">
        {t("body")}
      </p>

      <nav aria-label={t("linksLabel")} className="mt-12">
        <ul className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <li>
            <Button as={Link} href="/" variant="primary">
              {t("home")}
            </Button>
          </li>
          <li>
            <Link href="/games" className={quietLink}>
              {tNav("games")}
              {arrow}
            </Link>
          </li>
          <li>
            <Link href="/news" className={quietLink}>
              {tNav("news")}
              {arrow}
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
