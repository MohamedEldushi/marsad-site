import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The styleguide is a design reference, not public content.
        disallow: ["/ar/styleguide", "/en/styleguide"],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
