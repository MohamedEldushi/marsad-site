import type { ComponentPropsWithoutRef, ElementType } from "react";

type Variant = "primary" | "secondary";

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
} & ComponentPropsWithoutRef<T>;

const base =
  "inline-flex items-center justify-center rounded font-body text-step-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lapis focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-brass text-ink hover:bg-[#dba84a]",
  secondary: "bg-lapis-deep text-parchment hover:bg-[#2d57dc]",
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
