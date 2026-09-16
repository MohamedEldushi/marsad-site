/**
 * The canonical site URL, used for metadataBase, OG/Twitter tags,
 * robots.txt, and the sitemap. No domain is decided yet (CLAUDE.md
 * section 11), so this resolves automatically at each stage instead of
 * needing manual configuration:
 *
 * 1. NEXT_PUBLIC_SITE_URL — set this once a real custom domain exists.
 * 2. VERCEL_PROJECT_PRODUCTION_URL — the stable *.vercel.app production
 *    domain Vercel assigns on first deploy, before a custom domain.
 * 3. VERCEL_URL — the current deployment's own URL (previews included).
 * 4. localhost — local dev.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
