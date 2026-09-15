import type { ComponentPropsWithoutRef, ElementType } from "react";

type Variant = "primary" | "secondary";

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
} & ComponentPropsWithoutRef<T>;

// Motion per CLAUDE.md section 4.5: 200ms interaction band, house easing,
// brightness lift on hover, slight scale-down on press. The transition is
// scoped to filter/transform only so the focus ring (box-shadow) never
// animates — it has to appear instantly.
//
// border-2 border-transparent is on every variant, even the unbordered
// primary, so switching variants never changes the button's box size —
// secondary's border just swaps that transparent border for a visible one.
//
// Disabled is a hard override, not a dimmed variant: ink-raised surface,
// muted text, no border, at full opacity. Brass or lapis tint on a
// disabled control reads as "still interactive but faded," which is the
// opposite of what disabled needs to communicate.
const base =
  "inline-flex items-center justify-center rounded border-2 border-transparent font-body text-step-2 font-medium transition-[filter,transform] duration-200 ease-[var(--ease-entrance)] hover:brightness-110 motion-safe:active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:border-transparent disabled:bg-ink-raised disabled:text-muted";

const variants: Record<Variant, string> = {
  primary: "bg-brass text-ink",
  secondary: "border-lapis bg-transparent text-lapis",
};

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps<T>) {
  const Component = as || "button";
  return (
    <Component
      className={`${base} ${variants[variant]} px-6 py-3 ${className}`}
      {...props}
    />
  );
}
