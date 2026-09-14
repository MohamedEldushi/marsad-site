import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("Boot");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display font-black leading-display text-step-8 text-parchment">
        {t("heading")}
      </h1>
      <p className="max-w-md font-body leading-body text-step-3 text-muted">
        {t("tagline")}
      </p>
    </main>
  );
}
