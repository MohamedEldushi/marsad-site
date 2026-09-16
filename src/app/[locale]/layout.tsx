import type { Metadata } from "next";
import {
  Archivo,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
  Noto_Kufi_Arabic,
} from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/ui/Footer";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";
import "../globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "variable",
});

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-noto-kufi-arabic",
  subsets: ["arabic"],
  weight: ["600", "900"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t("title");
  const description = t("description");
  const ogLocale = locale === "ar" ? "ar_AR" : "en_US";
  const otherOgLocale = locale === "ar" ? "en_US" : "ar_AR";
  // Static per-locale OG cards (public/og/{locale}.png), rendered once
  // with a real browser rather than generated per-request: next/og's
  // Satori renderer can't shape Arabic text for either Noto Kufi Arabic
  // or IBM Plex Sans Arabic (both hit "lookupType ... not yet supported"
  // GSUB errors at build time), while a real browser handles it correctly.
  const ogImage = {
    url: `/og/${locale}.png`,
    width: 1200,
    height: 630,
    alt: title,
  };

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
        "x-default": "/ar",
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: title,
      type: "website",
      locale: ogLocale,
      alternateLocale: [otherOgLocale],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${archivo.variable} ${notoKufiArabic.variable} ${ibmPlexSans.variable} ${ibmPlexSansArabic.variable} h-full`}
    >
      <body className="min-h-full font-body antialiased">
        <NextIntlClientProvider>
          {children}
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
