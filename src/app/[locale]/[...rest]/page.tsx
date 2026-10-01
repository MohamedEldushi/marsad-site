import { notFound } from "next/navigation";

// Any address under /ar or /en that matches no page lands here and shows
// the localized not-found page (./../not-found.tsx), inside the site's
// layout -- header, footer and language -- instead of Next's bare default.
export default function CatchAllPage() {
  notFound();
}
