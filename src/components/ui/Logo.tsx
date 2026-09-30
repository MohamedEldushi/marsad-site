/**
 * The Marsad logo system: "Star Trail". The ONE place its artwork lives
 * (paths exported from the final logo design, Marsad_Logo_System).
 *
 * - "primary": the Arabic wordmark مرصد. The tail of ر is the trail of a
 *   shooting star; the brass star leads the word right to left, in the
 *   Arabic reading direction.
 * - "symbol": the star and its straight, tapered streak. App icons,
 *   avatars, the English lockup. 24px and up.
 * - "small": larger star, short stub. Favicons and anything under 24px.
 *
 * Colour: letters and streak use currentColor (set with a text-* class,
 * normally text-parchment); the star is --brass (CLAUDE.md section 4:
 * approved logo exception). tone="mono" makes the star currentColor too,
 * for one-colour uses.
 *
 * Never mirrored in RTL (CLAUDE.md section 3): it's a brand mark.
 * Minimum sizes (from the logo guide): primary 96px wide, symbol 24px,
 * small mark 16px.
 *
 * animate: the hero's load moment (CLAUDE.md 4.5, step 3). The star
 * streaks in from the right, the trail draws behind it into the ر, and
 * the letters appear. Each part runs at the 600ms entrance duration with
 * the house easing. Off under reduced motion -- the logo just renders.
 */

type Variant = "primary" | "symbol" | "small";

const VIEWBOX: Record<Variant, string> = {
  primary: "24 22 226 90",
  symbol: "0 0 100 100",
  small: "0 0 100 100",
};

const ASPECT: Record<Variant, number> = {
  primary: 226 / 90,
  symbol: 1,
  small: 1,
};

export function Logo({
  variant = "primary",
  height,
  label,
  tone = "color",
  animate = false,
  className = "",
}: {
  variant?: Variant;
  /** Rendered height in px; width follows the artwork's proportions. */
  height: number;
  /** Accessible name. Omit when a visible text label sits next to it. */
  label?: string;
  tone?: "color" | "mono";
  animate?: boolean;
  className?: string;
}) {
  const star = tone === "mono" ? "currentColor" : "var(--brass)";
  const a = (part: string) => (animate ? `logo-${part}` : undefined);

  return (
    <svg
      viewBox={VIEWBOX[variant]}
      height={height}
      width={Math.round(height * ASPECT[variant])}
      fill="currentColor"
      className={`${animate ? "logo-animate " : ""}${className}`}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {variant === "primary" && (
        <>
          <g className={a("letters")}>
            {/* م */}
            <path
              fillRule="evenodd"
              d="M240 53A14 14 0 1 1 212 53A14 14 0 1 1 240 53Z M230 53A4 5.5 0 1 0 222 53A4 5.5 0 1 0 230 53Z"
            />
            {/* ص */}
            <path
              fillRule="evenodd"
              d="M112 60H146A12 12 0 0 0 146 36H132C120 36 112 44 112 52Z M122 52H146A4 4 0 0 0 146 44H134C128 44 124 47 122 52Z"
            />
            <path d="M97 60H106V40L97 47Z" />
            <path d="M114 52H62L56 60H114Z" />
            {/* د */}
            <path d="M76 60V40H64L70 32H78A8 8 0 0 1 86 40V60Z" />
          </g>
          {/* ر, whose tail is the star's trail */}
          <path
            className={a("trail")}
            d="M214 52H204C196 52 192 58 190 66C188 74 182 77 172 78.5L54 91.6L54 92.4L172 87.5C190 87.5 201 80 203 71C204.5 64 206 60 211 60H214Z"
          />
          <path className={a("star")} fill={star} d="M44 82Q45.8 90.2 54 92Q45.8 93.8 44 102Q42.2 93.8 34 92Q42.2 90.2 44 82Z" />
        </>
      )}
      {variant === "symbol" && (
        <>
          <path className={a("trail")} d="M85.5 28L29.4 62.5L25.6 55.5Z" />
          {/* Its own entrance (logo-star-in-symbol): the star slides down
              its streak, so it never leaves this small frame. */}
          <path
            className={a("star-symbol")}
            fill={star}
            d="M27.5 46Q29.84 56.66 40.5 59Q29.84 61.34 27.5 72Q25.16 61.34 14.5 59Q25.16 56.66 27.5 46Z"
          />
        </>
      )}
      {variant === "small" && (
        <>
          <path d="M84 24L43.2 57.1L36.8 46.9Z" />
          <path fill={star} d="M40 28Q46.72 45.28 64 52Q46.72 58.72 40 76Q33.28 58.72 16 52Q33.28 45.28 40 28Z" />
        </>
      )}
    </svg>
  );
}
