import { KufiTiling } from "./KufiTiling";

/**
 * The section 4 divider band: the same Kufic tiling as the hero, at the
 * same native 200px tile scale, unmasked and flat. A quiet seam between
 * major sections, not a hero moment — no gradient, no motion. No
 * background fill of its own either: a solid surface behind it
 * (ink-raised, previously) reads as a rule line rather than texture.
 * Left transparent, it just shows the tiling against the page's own ink.
 *
 * h-24 (96px) is short of the tile's full 200px repeat, so this is a
 * horizontal slice of the same pattern rather than one complete motif —
 * scaling the tile down to fit previously made it a row of small
 * repeating hooks, busier at the same opacity and no longer resembling
 * the hero's pattern at all. Dropping to 3% (half the hero's 6% ceiling)
 * keeps that taller, unscaled slice quiet.
 */
export function KufiDivider({ id }: { id: string }) {
  return (
    <div aria-hidden="true" className="relative h-24 w-full overflow-hidden">
      <KufiTiling id={id} opacity={0.03} />
    </div>
  );
}
