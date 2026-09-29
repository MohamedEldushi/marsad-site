import Image from "next/image";
import { KufiTiling } from "./KufiTiling";

/**
 * A news post's 16:9 (or wider) cover. With artwork: the image. Without:
 * a generated cover in the house style -- a lit pool plus the Kufic tiling
 * (approved for news covers, CLAUDE.md section 4), placed differently per
 * post so a grid of them doesn't look repeated, and the game's name (or
 * the post type) set large. Decorative either way: the card around it
 * carries the title as text.
 *
 * Hover (from the parent link's `group`): the cover zooms 4% inside its
 * frame, 200ms, house easing; off under reduced motion.
 */
const POOLS = [
  { x: "72%", y: "30%" },
  { x: "28%", y: "34%" },
  { x: "50%", y: "22%" },
  { x: "80%", y: "58%" },
];

function poolFor(slug: string) {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return POOLS[hash % POOLS.length];
}

export function NewsCover({
  slug,
  cover,
  label,
  idPrefix,
  sizes,
  priority = false,
  showLabel = true,
  poolTop = false,
}: {
  slug: string;
  cover?: string;
  label: string;
  /** Unique per placement: the same post can appear twice on one page. */
  idPrefix: string;
  sizes: string;
  priority?: boolean;
  /** Off when text is laid over the cover (the featured story). */
  showLabel?: boolean;
  /** Keep the glow high, away from overlaid text at the bottom. */
  poolTop?: boolean;
}) {
  const zoom =
    "transition-transform duration-200 ease-[var(--ease-entrance)] motion-safe:group-hover:scale-[1.04]";

  if (cover) {
    return (
      <Image src={cover} alt="" fill priority={priority} sizes={sizes} className={`object-cover ${zoom}`} />
    );
  }

  const pool = poolTop ? { x: "50%", y: "18%" } : poolFor(slug);
  const vars = { "--pool-x": pool.x, "--pool-y": pool.y } as React.CSSProperties;

  return (
    <div aria-hidden="true" className={`absolute inset-0 ${zoom}`} style={vars}>
      <div className="news-cover-pool absolute inset-0" />
      <div className="news-cover-mask absolute inset-0">
        <KufiTiling id={`${idPrefix}-${slug}`} />
      </div>
      {showLabel && (
        <span className="absolute inset-x-0 bottom-0 p-4 font-display text-step-4 font-semibold leading-display text-parchment/90 sm:p-6 sm:text-step-5">
          {label}
        </span>
      )}
    </div>
  );
}
