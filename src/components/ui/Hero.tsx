import type { ReactNode } from "react";
import { KufiTiling } from "./KufiTiling";
import { Logo } from "./Logo";

/**
 * The Home hero. Full-bleed surface; the content sits in the same 1280px
 * container and gutters as the header and every page, so the hero logo
 * lines up with the header's logo. Text at the start, the featured game
 * (`feature`, step 6 of the load sequence) at the end from lg; below lg
 * the poster drops under the CTA at a smaller size.
 *
 * `underHeader` (Home): the hero slides up under the transparent header
 * (64px bar + its 1px hairline) so the glow runs beneath it with no seam.
 * Either way the visible hero is at least one screen minus the header
 * (100dvh, not 100vh, so mobile browser bars don't crop it).
 *
 * The big logo carries id="hero-logo": SiteHeader watches it to hand
 * the logo over to the header once it scrolls out of view.
 */
export function Hero({
  wordmark,
  locale,
  headline,
  feature,
  underHeader = false,
  children,
}: {
  /** The studio name, as the logo's accessible name / English lockup text. */
  wordmark: string;
  locale: "ar" | "en";
  headline: string;
  /** The featured game (HeroFeature), beside the text from lg. */
  feature?: ReactNode;
  /** Home only: extend up under the transparent header. */
  underHeader?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      className={`hero-surface relative isolate flex w-full flex-col overflow-hidden bg-ink ${
        underHeader
          ? "-mt-[calc(4rem+1px)] min-h-[100dvh] pt-[calc(4rem+1px)]"
          : "min-h-[calc(100dvh-4rem-1px)]"
      }`}
    >
      {/* Depth: a lit pool behind where the text sits, falling off to
          darker-than-ink at the corners. Radius is tightened relative to
          the pool's offset so the hotspot reads as anchored to the content
          side, not a wash across the whole viewport; the vertical radius
          is sized to the pool's own distance from the top edge so the
          falloff keeps grading all the way there instead of plateauing
          into a flat dark band. Step 2 of the load sequence: expands
          slightly outward, then drifts ambiently — see globals.css. */}
      <div aria-hidden="true" className="hero-pool-gradient absolute inset-0" />
      {/* Step 1 of the load sequence: the tiling fades in from 0. */}
      <div className="hero-tiling-mask absolute inset-0 motion-safe:[animation:hero-fade-in_var(--duration-entrance)_var(--ease-entrance)_both]">
        <KufiTiling id="hero-kufi-tiling" />
      </div>
      {/* Edge vignette, independent of the pool. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 90% at 50% 50%, transparent 60%, rgba(3,6,16,0.45) 100%)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-1 items-center px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="flex max-w-2xl flex-col items-start gap-4 text-start lg:col-span-7">
            {/* Step 3: the logo's load moment (star streaks in, trail draws
            into the ر, letters appear -- see globals.css). Arabic: the
            primary logo. English: the symbol animates, the name fades up.
            Steps 4-5: headline, then CTA, fading up 16px. */}
            {/* The logo is the boldest element here (CLAUDE.md section 4), so
            it scales up with the screen and the headline sits a step
            below it. `height` sets the artwork's largest size; the classes
            size it per breakpoint and w-auto keeps its proportions. */}
            <div id="hero-logo">
              {locale === "ar" ? (
                <Logo
                  variant="primary"
                  height={120}
                  label={wordmark}
                  animate
                  className="text-parchment h-16 w-auto sm:h-24 lg:h-[120px]"
                />
              ) : (
                <span className="flex items-center gap-4 text-parchment">
                  <Logo
                    variant="symbol"
                    height={80}
                    animate
                    className="h-12 w-auto sm:h-16 lg:h-20"
                  />
                  <span className="font-display text-step-6 font-extrabold leading-none [font-stretch:125%] sm:text-step-7 motion-safe:[animation:hero-fade-up_var(--duration-entrance)_var(--ease-entrance)_460ms_both]">
                    {wordmark}
                  </span>
                </span>
              )}
            </div>
            <h1 className="text-balance font-display text-step-6 font-black leading-display text-parchment sm:text-step-7 motion-safe:[animation:hero-fade-up_var(--duration-entrance)_var(--ease-entrance)_460ms_both]">
              {headline}
            </h1>
            <div className="motion-safe:[animation:hero-fade-up_var(--duration-entrance)_var(--ease-entrance)_540ms_both]">
              {children}
            </div>
          </div>
          {feature && (
            <div className="w-40 sm:w-48 lg:col-span-4 lg:col-start-9 lg:w-full lg:max-w-[320px] lg:justify-self-end">
              {feature}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
