import type { ReactNode } from "react";
import { KufiTiling } from "./KufiTiling";

export function Hero({
  wordmark,
  headline,
  children,
}: {
  wordmark: string;
  headline: string;
  children?: ReactNode;
}) {
  return (
    <section className="hero-surface relative isolate flex min-h-[70vh] w-full flex-col justify-end overflow-hidden bg-ink px-6 pb-24 pt-24 sm:px-12 sm:pb-28 lg:px-16 lg:pb-32">
      {/* Depth: a lit pool behind where the text sits, falling off to
          darker-than-ink at the corners. Radius is tightened relative to
          the pool's offset so the hotspot reads as anchored to the content
          side, not a wash across the whole viewport; the vertical radius
          is sized to the pool's own distance from the top edge so the
          falloff keeps grading all the way there instead of plateauing
          into a flat dark band. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 78% at var(--hero-pool-x) var(--hero-pool-y), #2c4a8f 0%, #16274d 26%, var(--ink) 55%, #080c1e 100%)",
        }}
      />
      <div className="hero-tiling-mask absolute inset-0">
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
      <div className="relative flex max-w-2xl flex-col items-start gap-4 text-start motion-safe:[animation:hero-reveal_0.7s_ease-out]">
        <span className="font-display text-step-2 font-black leading-display text-muted">
          {wordmark}
        </span>
        <h1 className="text-balance font-display text-step-7 font-black leading-display text-parchment sm:text-step-8">
          {headline}
        </h1>
        {children}
      </div>
    </section>
  );
}
