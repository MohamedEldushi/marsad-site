"use client";

import { useActionState, useEffect, useRef } from "react";
import type { ContactField, ContactState } from "@/app/[locale]/support/actions";
import { Button } from "./Button";

type Labels = {
  name: string;
  email: string;
  game: string;
  gameChoose: string;
  gameOther: string;
  message: string;
  submit: string;
  sending: string;
  sent: string;
  error: string;
  unavailable: string;
  honeypot: string;
};

/**
 * The /support contact form. Labels come in as props from the server page
 * (all copy lives in messages/*.json). Validation is done on the server,
 * so error text is always in the page's language rather than the
 * browser's. Feedback colours are --error / --success, the only place
 * those tokens are allowed.
 *
 * The submit button is the page's single brass element.
 *
 * States (all in response to the player's own submit, CLAUDE.md 4.5):
 * - focus: the --lapis ring and a --lapis border, both instant;
 * - sending: the fields dim and go read-only, the button says so;
 * - sent: a quiet --success panel whose check mark draws itself once
 *   (600ms, house easing; simply drawn under reduced motion). Status
 *   messages unmount while sending, so the moment replays per send.
 */
export function ContactForm({
  action,
  labels,
  gameOptions,
  email,
}: {
  action: (state: ContactState, formData: FormData) => Promise<ContactState>;
  labels: Labels;
  gameOptions: { value: string; label: string }[];
  email: string;
}) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" });
  // Set in the browser, not at build time: the page is static, so a
  // server-rendered timestamp would be the build's, not the visitor's.
  const startedAtRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  const control =
    "w-full rounded border border-muted/40 bg-ink-raised px-4 py-3 font-body text-step-2 leading-body text-parchment [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:border-lapis aria-[invalid=true]:border-error read-only:cursor-wait";

  const field = (id: ContactField, label: string, input: React.ReactNode) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={`contact-${id}`} className="font-body text-step-2 font-medium text-parchment">
        {label}
      </label>
      {input}
      {errors[id] && (
        <p id={`contact-${id}-error`} className="font-body text-step-1 text-error">
          {errors[id]}
        </p>
      )}
    </div>
  );

  const a11y = (id: ContactField) => ({
    id: `contact-${id}`,
    name: id,
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `contact-${id}-error` : undefined,
  });

  return (
    <form action={formAction} noValidate aria-busy={pending} className="flex flex-col gap-6">
      {/* Dimmed and locked while sending; the values are already sent. */}
      <div
        className={`flex flex-col gap-6 transition-opacity duration-200 ease-[var(--ease-entrance)] ${
          pending ? "pointer-events-none opacity-60" : ""
        }`}
      >
      {field(
        "name",
        labels.name,
        <input {...a11y("name")} readOnly={pending} type="text" dir="auto" autoComplete="name" defaultValue={values.name} className={control} />,
      )}
      {field(
        "email",
        labels.email,
        // Addresses are Latin, so LTR even on the Arabic page -- but kept
        // flush with the column edge there (rtl:text-right is deliberate:
        // the element's own dir is ltr, so a logical "end" would flip).
        <input {...a11y("email")} readOnly={pending} type="email" dir="ltr" autoComplete="email" defaultValue={values.email} className={`${control} rtl:text-right`} />,
      )}
      {field(
        "game",
        labels.game,
        // Keyed on the returned value: React 19 resets the form after each
        // submit, and a remount is what makes a <select> restore it. `key`
        // must come before the spread: after it, React warns about keys.
        <select key={values.game ?? ""} {...a11y("game")} defaultValue={values.game ?? ""} className={control}>
          <option value="" disabled>
            {labels.gameChoose}
          </option>
          {gameOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          <option value="other">{labels.gameOther}</option>
        </select>,
      )}
      {field(
        "message",
        labels.message,
        // dir="auto": each player's text lays out in its own direction.
        <textarea {...a11y("message")} readOnly={pending} dir="auto" rows={6} defaultValue={values.message} className={`${control} resize-y`} />,
      )}

      </div>

      {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label>
          {labels.honeypot}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />

      <div className="flex flex-col items-start gap-4">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? labels.sending : labels.submit}
        </Button>
        <div aria-live="polite" className="font-body text-step-2 leading-body">
          {!pending && state.status === "sent" && (
            <div className="contact-sent flex items-start gap-3 rounded border border-success/50 px-4 py-3">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 size-6 shrink-0 text-success" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle className="contact-sent-ring" cx="12" cy="12" r="10" pathLength="1" />
                <path className="contact-sent-check" d="M7.5 12.5l3 3 6-6.5" pathLength="1" />
              </svg>
              <p className="text-success">{labels.sent}</p>
            </div>
          )}
          {!pending && state.status === "error" && (
            <p className="text-error">
              {labels.error}{" "}
              <a href={`mailto:${email}`} dir="ltr" className="text-lapis underline">
                {email}
              </a>
            </p>
          )}
          {!pending && state.status === "unavailable" && (
            <p className="text-error">
              {labels.unavailable}{" "}
              <a href={`mailto:${email}`} dir="ltr" className="text-lapis underline">
                {email}
              </a>
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
