"use client";

import { useState } from "react";

/** Copies `value` to the clipboard and confirms for 2.4s. Press kit use. */
export function CopyButton({
  value,
  label,
  copiedLabel,
  className = "",
}: {
  value: string;
  label: string;
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2400);
        } catch {
          /* Clipboard blocked: the text is on screen to select by hand. */
        }
      }}
      className={`rounded border border-muted/40 px-3 py-2 font-body text-step-1 font-medium text-parchment transition-colors duration-200 ease-[var(--ease-entrance)] hover:border-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${className}`}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
