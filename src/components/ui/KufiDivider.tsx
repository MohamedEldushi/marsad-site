import { KufiTiling } from "./KufiTiling";

/**
 * The section 4 divider band: the same Kufic tiling as the hero, unmasked
 * and flat. A quiet seam between major sections, not a hero moment — no
 * gradient, no motion. No background fill of its own either: KufiTiling
 * is already capped at the section-4 6% opacity ceiling, and a solid
 * surface behind it (ink-raised, previously) reads as a rule line rather
 * than texture. Left transparent, it just shows the tiling against the
 * page's own ink.
 *
 * The band is too short to show a full 200px tile at native size — that
 * cropped it to a sliver of bar-tops, reading as a dashed line instead of
 * geometry. Rendering the same tile at 0.24 scale makes one full motif
 * exactly 48px tall, matching the band height with no cropping.
 */
export function KufiDivider({ id }: { id: string }) {
  return (
    <div aria-hidden="true" className="relative h-12 w-full overflow-hidden">
      <KufiTiling id={id} scale={0.24} />
    </div>
  );
}
