"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * Site-wide header. Structure after the Supercell studio nav (wordmark +
 * a few primary links at the start, utilities at the end), in our system:
 *
 * - Start: the wordmark (links home), then Games / News / About / Support.
 * - End: the language switch -- same page, other locale.
 * - Active page: a 2px --lapis underline (lapis = active states, section
 *   4). No brass here; brass stays for primary CTAs.
 * - Sticky. Plain --ink at the top of the page; --ink-raised with a
 *   hairline once scrolled (the "nav on scroll" use in the colour table).
 *   The colour change responds to the user's scroll, 200ms, house easing.
 * - Below md: a menu button opens a panel with the same links. Closes on
 *   navigation and on Escape. No open/close animation.
 *
 * Every direction is logical (start/end), so RTL mirrors automatically.
 * The wordmark itself is never mirrored -- it's text, not an icon.
 */
const LINKS = [
  { href: "/games", key: "games" },
  { href: "/news", key: "news" },
  { href: "/about", key: "about" },
  { href: "/support", key: "support" },
] as const;

export function SiteHeader() {
  const t = useTranslations("Nav");
  const tBoot = useTranslations("Boot");
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === "ar" ? "en" : "ar";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Close the mobile menu whenever the page changes. Tracked with the
  // "previous value" pattern rather than an effect.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

  const raised = scrolled || menuOpen;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-200 ease-[var(--ease-entrance)] ${
        raised ? "border-muted/20 bg-ink-raised" : "border-transparent bg-ink"
      }`}
    >
      <a
        href="#main-content"
        className={`absolute start-4 top-2 -translate-y-24 rounded bg-parchment px-4 py-2 font-body text-step-2 font-medium text-ink focus:translate-y-0 ${focusRing}`}
      >
        {t("skip")}
      </a>

      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-8 px-6 sm:px-12 lg:px-16">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            aria-label={t("homeLabel")}
            className={`font-display text-step-4 font-black leading-none text-parchment ${focusRing}`}
          >
            {tBoot("heading")}
          </Link>

          <nav aria-label={t("label")} className="hidden md:block">
            <ul className="flex items-center gap-8">
              {LINKS.map(({ href, key }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex h-16 items-center font-body text-step-2 font-medium transition-colors duration-200 ease-[var(--ease-entrance)] ${
                        active ? "text-parchment" : "text-muted hover:text-parchment"
                      } ${focusRing}`}
                    >
                      {t(key)}
                      {active && (
                        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-lapis" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={pathname}
            locale={otherLocale}
            lang={otherLocale}
            hrefLang={otherLocale}
            className={`hidden rounded border border-muted/40 px-3 py-1 font-body text-step-1 font-medium text-parchment transition-colors duration-200 ease-[var(--ease-entrance)] hover:border-muted md:inline-block ${focusRing}`}
          >
            {t("switchTo")}
          </Link>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
            onClick={() => setMenuOpen((open) => !open)}
            className={`flex h-10 w-10 items-center justify-center rounded text-parchment md:hidden ${focusRing}`}
          >
            {/* Symmetric icon: identical in both directions, so no mirroring. */}
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label={t("label")}
          className="border-t border-muted/20 bg-ink-raised md:hidden"
        >
          <ul className="mx-auto flex max-w-[1280px] flex-col px-6 py-4 sm:px-12">
            {LINKS.map(({ href, key }) => {
              const active = isActive(href);
              return (
                <li key={href} className="border-b border-muted/20">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 py-4 font-display text-step-4 font-semibold leading-display ${
                      active ? "text-parchment" : "text-muted"
                    } ${focusRing}`}
                  >
                    {active && <span aria-hidden="true" className="h-6 w-0.5 bg-lapis" />}
                    {t(key)}
                  </Link>
                </li>
              );
            })}
            <li className="pt-6 pb-2">
              <Link
                href={pathname}
                locale={otherLocale}
                lang={otherLocale}
                hrefLang={otherLocale}
                className={`inline-block rounded border border-muted/40 px-4 py-2 font-body text-step-2 font-medium text-parchment ${focusRing}`}
              >
                {t("switchTo")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
