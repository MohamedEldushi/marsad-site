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
const base =
  "inline-flex items-center justify-center rounded font-body text-step-2 font-medium transition-[filter,transform] duration-200 ease-[var(--ease-entrance)] hover:brightness-110 motion-safe:active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-brass text-ink",
  secondary: "bg-lapis-deep text-parchment",
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
