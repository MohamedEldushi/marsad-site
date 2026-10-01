import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/ui/LegalPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });

  return {
    title: t("title"),
    description: t("intro"),
    alternates: { canonical: `/${locale}/terms` },
  };
}

// Shared layout for the legal pages: numbered sections, contents with
// scroll-spy, reading progress, the placeholder notice (LegalPage).
export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  return <LegalPage namespace="Terms" locale={locale} />;
}
