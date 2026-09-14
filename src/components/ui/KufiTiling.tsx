/**
 * The one texture device allowed by CLAUDE.md section 4: an angular,
 * Kufic-inspired step pattern. Only ever used at 6% opacity, behind the
 * hero or as a section-divider band — never behind body text or in a card.
 */
export function KufiTiling({ id }: { id: string }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full text-parchment opacity-[0.06]"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={id} width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M0 30 H15 V15 H30 V0 M30 60 V45 H45 V30 H60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
