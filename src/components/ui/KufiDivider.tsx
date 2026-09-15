import { KufiTiling } from "./KufiTiling";

/**
 * The section 4 divider band: the same Kufic tiling as the hero, at the
 * same tile scale, unmasked and flat. A quiet seam between major sections,
 * not a hero moment — no gradient, no motion.
 */
export function KufiDivider({ id }: { id: string }) {
  return (
    <div aria-hidden="true" className="relative h-16 w-full overflow-hidden bg-ink-raised">
      <KufiTiling id={id} />
    </div>
  );
}
