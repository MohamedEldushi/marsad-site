/**
 * The one texture device allowed by CLAUDE.md section 4: an angular,
 * Kufic-inspired geometric tile. Only ever used at 6% opacity, behind the
 * hero or as a section-divider band — never behind body text or in a card.
 *
 * Built from filled right-angle bars of unequal thickness with interlocking
 * negative space of unequal width, the way square Kufic letterforms are
 * constructed — not a uniform-stroke Greek meander.
 *
 * The tile is defined once at 200 units — that's "one scale across the
 * whole site" in the sense that matters: one design, one set of
 * proportions. `scale` renders that same design uniformly smaller where
 * the container is too short to show a full 200px tile (the divider
 * band), the way a photo gets resized, not redrawn.
 */
export function KufiTiling({
  id,
  className = "",
  scale = 1,
}: {
  id: string;
  className?: string;
  scale?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full text-parchment opacity-[0.06] ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id={id}
          width="200"
          height="200"
          patternUnits="userSpaceOnUse"
          patternTransform={scale !== 1 ? `scale(${scale})` : undefined}
        >
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
