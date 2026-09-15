/**
 * The one texture device allowed by CLAUDE.md section 4: an angular,
 * Kufic-inspired geometric tile. Only ever used at 6% opacity, behind the
 * hero or as a section-divider band — never behind body text or in a card.
 *
 * Built from filled right-angle bars of unequal thickness with interlocking
 * negative space of unequal width, the way square Kufic letterforms are
 * constructed — not a uniform-stroke Greek meander.
 */
export function KufiTiling({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full text-parchment opacity-[0.06] ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={id} width="200" height="200" patternUnits="userSpaceOnUse">
          <g fill="currentColor">
            <rect x="26" y="26" width="42" height="132" />
            <rect x="26" y="26" width="116" height="34" />
            <rect x="108" y="26" width="34" height="96" />
            <rect x="70" y="122" width="98" height="28" />
            <rect x="146" y="122" width="26" height="56" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
