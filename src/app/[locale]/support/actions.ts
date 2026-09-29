"use server";

import { getTranslations } from "next-intl/server";
import { games } from "@/lib/games";

/**
 * Contact form handler. Sends the message to the studio's inbox through
 * Resend's HTTP API with a plain fetch -- no SDK, no new dependency.
 *
 * Configuration lives in environment variables (Vercel -> Settings ->
 * Environment Variables), never in the repo:
 *   RESEND_API_KEY      Resend API key
 *   CONTACT_TO_EMAIL    where messages are delivered (the studio inbox)
 *   CONTACT_FROM_EMAIL  sender, on a domain verified in Resend,
 *                       e.g. "Marsad <noreply@your-domain>"
 * If any is missing the form reports itself unavailable and points the
 * player to the email address instead of pretending it sent.
 *
 * Replies: reply_to is set to the player's address, so answering the
 * email in your inbox replies to the player directly.
 */

export type ContactField = "name" | "email" | "game" | "message";

export type ContactState = {
  status: "idle" | "invalid" | "sent" | "error" | "unavailable";
  fieldErrors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<ContactField, string>>;
};

const LIMITS = { name: 100, email: 200, message: 5000, messageMin: 10 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTHER = "other";

export async function sendContactMessage(
  locale: "ar" | "en",
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const t = await getTranslations({ locale, namespace: "Support.form" });

  const read = (key: string) => String(formData.get(key) ?? "").trim();
  const values = {
    name: read("name"),
    email: read("email"),
    game: read("game"),
    message: read("message"),
  };

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!values.name) fieldErrors.name = t("errors.nameRequired");
  else if (values.name.length > LIMITS.name) fieldErrors.name = t("errors.tooLong");

  if (!values.email) fieldErrors.email = t("errors.emailRequired");
  else if (values.email.length > LIMITS.email || !EMAIL_PATTERN.test(values.email))
    fieldErrors.email = t("errors.emailInvalid");

  const allowedGames = games.filter((g) => g.status !== "coming-soon").map((g) => g.slug);
  if (values.game !== OTHER && !allowedGames.includes(values.game))
    fieldErrors.game = t("errors.gameRequired");

  if (values.message.length < LIMITS.messageMin) fieldErrors.message = t("errors.messageShort");
  else if (values.message.length > LIMITS.message) fieldErrors.message = t("errors.tooLong");

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "invalid", fieldErrors, values };
  }

  // Spam checks run after validation, so a person who submits too fast
  // or empty still sees real field errors. A honeypot field real people
  // never see, plus a minimum time on the page (set by the browser on
  // load). A bot that trips either gets the normal "sent" state so it
  // learns nothing.
  if (read("website") !== "") return { status: "sent" };
  const startedAt = Number(read("startedAt"));
  if (startedAt && Date.now() - startedAt < 3000) return { status: "sent" };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.warn("[contact] Not configured: set RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.");
    return { status: "unavailable", values };
  }

  const game = games.find((g) => g.slug === values.game);
  const gameLabel = game ? game.title[locale] : t("gameOther");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject: `[${gameLabel}] ${values.name}`,
        text: [
          `Name: ${values.name}`,
          `Email: ${values.email}`,
          `Game: ${gameLabel}`,
          `Site language: ${locale}`,
          "",
          values.message,
        ].join("\n"),
      }),
    });
    if (!response.ok) {
      console.error("[contact] Resend error", response.status, await response.text());
      return { status: "error", values };
    }
  } catch (error) {
    console.error("[contact] Network error", error);
    return { status: "error", values };
  }

  return { status: "sent" };
}
