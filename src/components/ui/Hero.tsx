import type { ReactNode } from "react";
import { KufiTiling } from "./KufiTiling";

export function Hero({
  headline,
  children,
}: {
  headline: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-ink px-6 py-24 text-center">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 35%, var(--ink-raised) 0%, var(--ink) 70%)",
        }}
      />
      <KufiTiling id="hero-kufi-tiling" />
      <div className="relative flex max-w-3xl flex-col items-center gap-8 opacity-100 motion-safe:[animation:hero-reveal_0.7s_ease-out]">
        <h1 className="font-display text-step-7 font-black leading-display text-parchment sm:text-step-8">
          {headline}
        </h1>
        {children}
      </div>
    </section>
  );
}
