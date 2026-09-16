import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { games } from "@/lib/games";
import { getSiteUrl } from "@/lib/site";

/**
 * Only real, public pages. The styleguide is excluded (see robots.ts).
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

  const staticPages: MetadataRoute.Sitemap = (
    [
      ["/about", 0.6],
      ["/support", 0.6],
      ["/privacy", 0.3],
      ["/terms", 0.3],
    ] as const
  ).flatMap(([path, priority]) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: alternates(path),
    })),
  );

  return [...home, ...gamesIndex, ...gameDetail, ...staticPages];
}
