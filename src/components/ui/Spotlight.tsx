"use client";

import { useRef, type ReactNode } from "react";

/**
 * Tracks the pointer over its child and exposes the position as
 * --spot-x / --spot-y, for the .spotlight-glow layer (globals.css).
 * Writes straight to the element's style: no React state, no re-render
 * per mouse move.
 */
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el || event.pointerType === "touch") return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      }}
    >
      {children}
    </div>
  );
}
