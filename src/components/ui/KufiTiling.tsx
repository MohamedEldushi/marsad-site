/**
 * The one texture device allowed by CLAUDE.md section 4: an angular,
 * Kufic-inspired geometric tile. Behind the hero, or as a section-divider
 * band — never behind body text or in a card. Always the same 200-unit
 * tile at native scale, so every use reads as the same pattern family;
 * only opacity varies by context (6% ceiling for the hero, lower where a
 * taller/wider area of it would otherwise read as too present).
 *
 * Built from filled right-angle bars of unequal thickness with interlocking
 * negative space of unequal width, the way square Kufic letterforms are
 * constructed — not a uniform-stroke Greek meander.
 */
export function KufiTiling({
  id,
  className = "",
  opacity = 0.06,
}: {
  id: string;
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full text-parchment ${className}`}
      style={{ opacity }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={id} width="200" height="200" patternUnits="userSpaceOnUse">
          <g fill="currentColor">
            <rect x="22" y="22" width="54" height="146" />
            <rect x="22" y="22" width="108" height="15" />
            <rect x="115" y="22" width="24" height="70" />
            <rect x="70" y="158" width="110" height="13" />
            <rect x="158" y="92" width="38" height="79" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
