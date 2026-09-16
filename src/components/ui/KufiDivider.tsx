import { KufiTiling } from "./KufiTiling";

/**
 * The section 4 divider band: the same Kufic tiling as the hero, at the
 * same tile scale, unmasked and flat. A quiet seam between major sections,
 * not a hero moment — no gradient, no motion. No background fill of its
 * own either: KufiTiling is already capped at the section-4 6% opacity
 * ceiling, and a solid surface behind it (ink-raised, previously) reads
 * as a rule line rather than texture. Left transparent, it just shows
 * the tiling against the page's own ink.
 */
export function KufiDivider({ id }: { id: string }) {
  return (
    <div aria-hidden="true" className="relative h-8 w-full overflow-hidden">
      <KufiTiling id={id} />
    </div>
  );
}
