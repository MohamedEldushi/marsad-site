# Launch checklist

Everything below is either a placeholder standing in for something real, or
something genuinely not built yet. None of it is broken — every item renders
a deliberate, working state (a "coming soon" label, a "not yet published"
date, a plain flat rectangle) rather than an error. But none of it is real
either, and the site should not go public with any of these still in place.

**Keep this file current.** Whenever a new placeholder gets introduced —
a new game with fake copy, a new page with a TBD value, a new image slot —
add a row for it here the same session it's added, not later.

---

## Must replace before launch

| What | Lives in | Currently | Replace with |
|---|---|---|---|
| Game catalogue | `content/games/lantern-keep.json`, `content/games/salt-and-signal.json`, `content/games/echo-atlas.json` | Three invented example games — each one's own `description` field literally says "A placeholder ... game" (or "لعبة نائمة" in Arabic), and CLAUDE.md section 6 calls them "3 placeholder games" outright. They exist to exercise all three status states (`released`/`beta`/`coming-soon`) during development. | The studio's real games, one JSON file per game per the schema in CLAUDE.md section 6. If any of these three happen to become real games, at minimum drop the word "placeholder" from their `description` text. |
| Game key art (16:9) | `content/games/*.json` → `keyArt` field; rendered by `src/app/[locale]/page.tsx` (Home's featured section) and `src/app/[locale]/games/[slug]/page.tsx` | A flat `--ink-raised` rectangle labelled with the slot name (e.g. "lantern-keep/key-art") | A real 16:9 image per ART.md, saved to `public/art/[game-slug]/key-art.*` — the placeholder `<div>` in both files above also needs swapping for a real `<Image>` once art exists |
| Game card thumbnail (3:4) | `content/games/*.json` → `thumbnail` field; rendered by `src/components/ui/GameCard.tsx` | Same flat placeholder treatment | A real 3:4 image per ART.md, saved to `public/art/[game-slug]/thumbnail.*`, with `GameCard.tsx` updated to render it |
| Screenshot gallery | `content/games/*.json` → `screenshots` field (empty `[]` for all three games); rendered by `src/app/[locale]/games/[slug]/page.tsx` | Empty array — the page shows a deliberate "Screenshots are coming soon" line, not a broken gallery | Real captures once each game exists, per ART.md section 4 ("do not generate fake gameplay") |
| Store / download links | `content/games/lantern-keep.json` and `content/games/salt-and-signal.json` → `primaryAction.url` (both `"#"`); rendered wherever `primaryAction` renders (`GameCard.tsx`, Home's featured section, the game detail page) | `"#"` — a placeholder that goes nowhere | The real store/download URL once the distribution model is decided (CLAUDE.md section 11) — this also determines what `echo-atlas.json`'s `primaryAction` becomes once it leaves "coming soon" |
| Support email | `messages/en.json` and `messages/ar.json` → `Support.email` | `support@marsad.example` — the `.example` domain is IANA-reserved specifically so it can never resolve to a real inbox | The studio's real support address, in both files (it's the same Latin string in each, not translated) |
| Privacy Policy copy | `messages/en.json` and `messages/ar.json` → `Privacy.sections[].body` (9 sections) | Every section's `body` is the same placeholder sentence, explicitly marked as such | Real policy text, section by section — the heading structure is meant to stay, so this is editing each `body` value directly, not rebuilding the page |
| Terms of Service copy | `messages/en.json` and `messages/ar.json` → `Terms.sections[].body` (10 sections) | Same treatment as Privacy | Real terms text, same section-by-section edit |
| Privacy/Terms "last updated" date | `messages/en.json` and `messages/ar.json` → `Legal.lastUpdatedValue` | `"Not yet published"` / `"لم يُنشر بعد"` | The real publish date, once the real copy above replaces the placeholder text |
| Privacy/Terms placeholder notice | `messages/en.json` and `messages/ar.json` → `Legal.noticeBody`; rendered as a bordered callout on both `/privacy` and `/terms` | A visible notice stating the page is a placeholder | Delete the notice (and the callout box rendering it, in `src/app/[locale]/privacy/page.tsx` and `src/app/[locale]/terms/page.tsx`) once real copy is in place |
| Social accounts | `src/components/ui/Footer.tsx` (links removed entirely); labels were in `messages/en.json` / `messages/ar.json` → `Footer.social.*` (also removed) | No links at all — removed rather than left as dead `href="#"` anchors, since no real accounts exist | Real X/Instagram/YouTube (or whichever platforms the studio actually uses) URLs, added back into `Footer.tsx` with their labels restored to both message files |
| Domain | `src/lib/site.ts` documents the fallback chain; the actual value is set via the `NEXT_PUBLIC_SITE_URL` environment variable in the Vercel project settings, not in code | Unset — falls back to the `*.vercel.app` address Vercel assigned on deploy | A real custom domain, set as `NEXT_PUBLIC_SITE_URL` in Vercel once purchased and pointed at the project. Nothing else needs to change — metadata, the sitemap, and `robots.txt` all read from this one value automatically |

---

## Must add before launch (not currently placeholder — not built at all)

| What | Notes |
|---|---|
| Analytics tool, and whether a consent banner is needed | Open decision, CLAUDE.md section 11. No analytics code exists yet either way. |

---

## Open decisions, not launch-blocking

Tracked in CLAUDE.md section 11 but don't have a fake/placeholder stand-in
today, so there's nothing to "replace" — just a decision to make whenever:

- Whether Home carries a news/updates section.

---

## Explicitly *not* placeholders — don't "fix" these

- **Favicon / wordmark** (`src/app/icon.svg`, `src/app/favicon.ico`) — real, finished, vector, per CLAUDE.md section 5.
- **Open Graph images** (`public/og/ar.png`, `public/og/en.png`) — real branded cards using the actual wordmark and mission line, not placeholder art. Worth regenerating with real key art once it exists, but nothing is broken today.
- **Home, About, and Support page copy** — genuine written copy, not placeholder text. (The Support FAQ's "the App Store, Google Play, or similar" phrasing is deliberately generic because the distribution model isn't decided yet — see the store links row above — not because it's a placeholder itself.)
