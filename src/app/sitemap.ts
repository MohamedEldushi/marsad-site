import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { games } from "@/lib/games";
import { getSiteUrl } from "@/lib/site";

/**
 * Only real, public pages. The styleguide is excluded (see robots.ts).
 * Add each page here as it's built (about, support, legal) rather than
 * pre-listing routes that don't exist yet.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const alternates = (path: string) => ({
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`]),
    ),
  });

  const home: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: alternates(""),
  }));

  const gamesIndex: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}/games`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
    alternates: alternates("/games"),
  }));

  const gameDetail: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    games.map((game) => ({
      url: `${siteUrl}/${locale}/games/${game.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: alternates(`/games/${game.slug}`),
    })),
  );

  return [...home, ...gamesIndex, ...gameDetail];
}
