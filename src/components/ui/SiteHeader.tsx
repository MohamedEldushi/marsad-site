"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { liveStatus, useNow } from "@/lib/useNow";

/**
 * Site-wide header. Structure after the Supercell studio nav (wordmark +
 * a few primary links at the start, utilities at the end), in our system:
 *
 * - Start: the wordmark (links home), then Games / News / About / Support.
 * - End: the language switch -- same page, other locale.
 * - Active page: a 2px --lapis underline (lapis = active states, section
 *   4). No brass here; brass stays for primary CTAs.
 * - Hover: a --lapis underline grows in under a nav link (scale-x,
 *   200ms), the same motion as the news tabs. The active page keeps its
 *   full underline.
 * - Language: a two-part toggle "ع | EN". The current language is marked
 *   (--parchment, --lapis underline); the other is a link to the same
 *   page in that language, with lang/hreflang and an aria-label.
 * - Sticky. Plain --ink at the top of the page; --ink-raised with a
 *   hairline once scrolled (the "nav on scroll" use in the colour table).
 *   The colour change responds to the user's scroll, 200ms, house easing.
 * - Home only (approved by the studio): transparent with no line over the
 *   hero, so the hero's glow runs underneath. The small logo hides while
 *   the hero's big logo (#hero-logo) is on screen; once it scrolls out of
 *   view (IntersectionObserver, not a scroll listener) the header turns
 *   --ink-raised with its hairline and the small logo fades in, 200ms.
 *   Hidden only visually: the home link keeps its label and tab stop, and
 *   shows itself when it has keyboard focus.
 * - Below lg (1024px; five links no longer fit a tablet row): a menu
 *   button opens a full-screen panel with the same links. The icon morphs
 *   into an X (200ms); the links fade up 16px one after another (600ms,
 *   80ms stagger). Reduced motion: none of it. Focus is trapped in the
 *   panel (with the close button), the page behind is inert, and it
 *   closes on navigation and on Escape (focus returns to the button).
 *
 * Every direction is logical (start/end), so RTL mirrors automatically.
 * The wordmark itself is never mirrored -- it's text, not an icon.
 */
const LINKS = [
  { href: "/games", key: "games" },
  { href: "/news", key: "news" },
  { href: "/live", key: "live" },
  { href: "/about", key: "about" },
  { href: "/support", key: "support" },
] as const;

export function SiteHeader({
  streamWindows = [],
  builtAt,
}: {
  /** Every stream's start/end, so the header can mark "live now". */
  streamWindows?: { start: string; end: string }[];
  builtAt: number;
}) {
  const t = useTranslations("Nav");
  // A still --lapis dot beside "Streams & Podcasts" while any stream is
  // live, on every page. Not pulsing: no ambient motion (CLAUDE.md 4.5).
  const now = useNow(builtAt);
  const isLiveNow = streamWindows.some((w) => liveStatus({ kind: "stream", ...w }, now) === "live");
  const liveMarker = (
    <>
      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-lapis" />
      <span className="sr-only">{`(${t("liveNow")})`}</span>
    </>
  );
  const tBoot = useTranslations("Boot");
  const locale = useLocale();
  const pathname = usePathname();

  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  // Home: is the hero's big logo on screen? Starts true so the server
  // render of Home matches the top of the page (transparent, no logo).
  const [heroLogoVisible, setHeroLogoVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
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

  // Home: watch the hero logo. It counts as gone once it has slipped
  // under the 64px header bar, hence the negative top margin.
  useEffect(() => {
    if (!isHome) return;
    const el = document.getElementById("hero-logo");
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setHeroLogoVisible(entry.isIntersecting), {
      rootMargin: "-64px 0px 0px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isHome]);

  // Open menu: focus the first link, keep Tab inside the panel and its
  // close button, make the page behind inert and still, close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const button = menuButtonRef.current;
    const panel = panelRef.current;
    const main = document.getElementById("main-content");
    const behind = [main, main?.nextElementSibling].filter((el): el is HTMLElement => el instanceof HTMLElement);
    behind.forEach((el) => (el.inert = true));
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const focusables = () => [
      ...(button ? [button] : []),
      ...Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button") ?? []),
    ];
    focusables()[1]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        button?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey
        ? index <= 0
          ? items.length - 1
          : index - 1
        : index === -1 || index === items.length - 1
          ? 0
          : index + 1;
      event.preventDefault();
      items[next].focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      behind.forEach((el) => (el.inert = false));
      root.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

  // Home: over the hero until its logo leaves. Elsewhere: by scroll.
  const overHero = isHome && heroLogoVisible && !menuOpen;
  const raised = menuOpen || (isHome ? !heroLogoVisible : scrolled);

  // "ع | EN": the current language marked, the other a link to this page
  // in that language. Glyphs are aria-hidden; the full name is spoken.
  const languageToggle = (size: "bar" | "panel") => {
    const part = size === "bar" ? "px-1 py-1 text-step-1" : "px-2 py-2 text-step-3";
    return (
      <div role="group" aria-label={t("language")} className="flex items-center gap-2 font-body font-medium">
        {(["ar", "en"] as const).map((code, index) => {
          const glyph = code === "ar" ? t("langAr") : t("langEn");
          const name = code === "ar" ? t("versionAr") : t("versionEn");
          // Both scripts sit side by side here, so each glyph is pinned to
          // its own body face rather than the page's (globals.css).
          const face = code === "ar" ? "font-body-ar" : "font-body-en";
          return (
            <span key={code} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-muted/60">
                  |
                </span>
              )}
              {code === locale ? (
                <span aria-current="true" className={`border-b-2 border-lapis text-parchment ${face} ${part}`}>
                  <span aria-hidden="true" lang={code}>
                    {glyph}
                  </span>
                  <span className="sr-only" lang={code}>
                    {name}
                  </span>
                </span>
              ) : (
                <Link
                  href={pathname}
                  locale={code}
                  lang={code}
                  hrefLang={code}
                  aria-label={name}
                  onClick={() => setMenuOpen(false)}
                  className={`border-b-2 border-transparent text-muted transition-colors duration-200 ease-[var(--ease-entrance)] hover:text-parchment ${face} ${part} ${focusRing}`}
                >
                  {glyph}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  // Menu icon: three bars that morph into an X (200ms). Symmetric in both
  // directions, so never mirrored.
  const bar = "origin-center transition-[translate,rotate,opacity] duration-200 ease-[var(--ease-entrance)] [transform-box:fill-box]";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-200 ease-[var(--ease-entrance)] ${
        raised ? "border-muted/20 bg-ink-raised" : overHero ? "border-transparent bg-transparent" : "border-transparent bg-ink"
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
          {/* Arabic: the primary logo (40px tall = 100px wide, above the
              96px minimum). English: the English lockup, symbol + "Marsad".
              The link's aria-label names it, so the logo is decorative. */}
          <Link
            href="/"
            aria-label={t("homeLabel")}
            className={`flex items-center gap-3 text-parchment transition-opacity duration-200 ease-[var(--ease-entrance)] ${
              overHero ? "pointer-events-none opacity-0 focus-visible:opacity-100" : "opacity-100"
            } ${focusRing}`}
          >
            {locale === "ar" ? (
              <Logo variant="primary" height={40} />
            ) : (
              <>
                <Logo variant="symbol" height={28} />
                <span className="font-display text-step-3 font-extrabold leading-none [font-stretch:125%]">
                  {tBoot("heading")}
                </span>
              </>
            )}
          </Link>

          <nav aria-label={t("label")} className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {LINKS.map(({ href, key }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex h-16 items-center whitespace-nowrap font-body text-step-2 font-medium transition-colors duration-200 ease-[var(--ease-entrance)] ${
                        active ? "text-parchment" : "text-muted hover:text-parchment"
                      } ${focusRing}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {t(key)}
                        {key === "live" && isLiveNow && liveMarker}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 bottom-0 h-0.5 bg-lapis transition-transform duration-200 ease-[var(--ease-entrance)] ${
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">{languageToggle("bar")}</div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
            onClick={() => setMenuOpen((open) => !open)}
            className={`flex h-10 w-10 items-center justify-center rounded text-parchment lg:hidden ${focusRing}`}
          >
            {/* Symmetric icon: identical in both directions, so no mirroring. */}
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="6" width="16" height="2" className={`${bar} ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
              <rect x="4" y="11" width="16" height="2" className={`${bar} ${menuOpen ? "opacity-0" : ""}`} />
              <rect x="4" y="16" width="16" height="2" className={`${bar} ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          ref={panelRef}
          id="mobile-menu"
          aria-label={t("label")}
          className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-muted/20 bg-ink-raised lg:hidden"
        >
          <ul className="mx-auto flex max-w-[1280px] flex-col px-6 py-8 sm:px-12">
            {LINKS.map(({ href, key }, index) => {
              const active = isActive(href);
              return (
                <li
                  key={href}
                  className="border-b border-muted/20 motion-safe:[animation:reveal-fade-up_var(--duration-entrance)_var(--ease-entrance)_both]"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 py-5 font-display text-step-5 font-semibold leading-display ${
                      active ? "text-parchment" : "text-muted"
                    } ${focusRing}`}
                  >
                    {active && <span aria-hidden="true" className="h-8 w-0.5 bg-lapis" />}
                    {t(key)}
                    {key === "live" && isLiveNow && liveMarker}
                  </Link>
                </li>
              );
            })}
            <li
              className="pt-8 motion-safe:[animation:reveal-fade-up_var(--duration-entrance)_var(--ease-entrance)_both]"
              style={{ animationDelay: `${LINKS.length * 80}ms` }}
            >
              {languageToggle("panel")}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
