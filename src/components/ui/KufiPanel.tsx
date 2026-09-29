import { KufiTiling } from "./KufiTiling";

/**
 * The framed Kufic panel used in text-page headers (/about, /support).
 * Purely decorative: a static lit pool with the site's one tiling pattern
 * masked over it, inside a hairline frame. Square corners -- it's a
 * structural surface. Never put text inside it (section 4: the tiling is
 * never behind body text).
 */
export function KufiPanel({ id, className = "" }: { id: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative isolate overflow-hidden border border-muted/30 ${className}`}
    >
      <div className="panel-pool absolute inset-0" />
      <div className="panel-tiling-mask absolute inset-0">
        <KufiTiling id={id} />
      </div>
    </div>
  );
}
