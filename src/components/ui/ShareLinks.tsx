"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useIsClient } from "@/lib/useNow";

/**
 * Share a news article: copy the link, WhatsApp, X -- and the device's own
 * share sheet where the browser offers one (most phones). Plain links and
 * the Clipboard API only: no third-party scripts or widgets load.
 *
 * The share-sheet button exists only in the browser (navigator.share), so
 * it renders after hydration (useIsClient) to keep server and client HTML
 * identical.
 */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const t = useTranslations("Share");
  const isClient = useIsClient();
  const [copied, setCopied] = useState(false);
  const canNativeShare = isClient && typeof navigator !== "undefined" && "share" in navigator;

  const chip =
    "inline-flex items-center gap-2 rounded border border-muted/40 px-4 py-2 font-body text-step-1 font-medium text-parchment transition-colors duration-200 ease-[var(--ease-entrance)] hover:border-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink";
  const text = encodeURIComponent(`${title} ${url}`);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt(t("copyFallback"), url);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="font-body text-step-1 text-muted">{t("heading")}</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copy} className={chip}>
          {copied ? t("copied") : t("copy")}
        </button>
        <a href={`https://wa.me/?text=${text}`} target="_blank" rel="noopener noreferrer" className={chip}>
          {t("whatsapp")}
          <span className="sr-only">{t("newTab")}</span>
        </a>
        <a
          href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={chip}
        >
          X
          <span className="sr-only">{t("newTab")}</span>
        </a>
        {canNativeShare && (
          <button
            type="button"
            onClick={() => navigator.share({ title, url }).catch(() => {})}
            className={chip}
          >
            {t("more")}
          </button>
        )}
      </div>
      <span aria-live="polite" className="sr-only">
        {copied ? t("copied") : ""}
      </span>
    </div>
  );
}
