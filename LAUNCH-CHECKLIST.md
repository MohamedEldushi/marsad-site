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
| Sample news posts | `content/news/welcome-to-marsad/`, `content/news/lantern-keep-devlog-light/`, `content/news/salt-and-signal-beta-update/` (each file starts with a "SAMPLE POST" note line) | Three placeholder posts in both languages. The two game posts describe features of invented seed games (Lantern Keep, Salt & Signal), so none of it is true | Real posts written by the studio (see `NEWS-GUIDE.md`), and delete every sample folder. If no real posts exist yet at launch, delete the samples anyway: /news then shows a "no news yet" message and Home hides its news section |
| Game key art (16:9) | `content/games/*.json` → `keyArt` field; rendered by `src/app/[locale]/page.tsx` (Home's featured section) and `src/app/[locale]/games/[slug]/page.tsx` | A flat `--ink-raised` rectangle labelled with the slot name (e.g. "lantern-keep/key-art") | A real 16:9 image per ART.md, saved to `public/art/[game-slug]/key-art.*` — the placeholder `<div>` in both files above also needs swapping for a real `<Image>` once art exists |
| Game posters / thumbnails (3:4) | `content/games/*.json` → `thumbnail` field; every page (Home, /games, /about, /support, the styleguide) shows a generated poster instead (`GameChapter.tsx`, `GamePoster.tsx`, via `NewsCover`) | Generated Kufic posters with the game's name | A real 3:4 image per ART.md, saved to `public/art/[game-slug]/thumbnail.*`; pass it as `cover` to `NewsCover` in `GameChapter.tsx` and `GamePoster.tsx` |
| About artwork (4:5) | `src/app/[locale]/about/page.tsx`, the Arabic-first band | A flat `--ink` rectangle labelled "about/arabic-first" | A real 4:5 image per ART.md, saved to `public/art/about/arabic-first.*`, with the placeholder `<div>` swapped for a real `<Image>` (keep the `aria-label` text as its alt) |
| Logo readability check | `src/components/ui/Logo.tsx` | Final "Star Trail" artwork, not yet tested with readers | Show the primary logo, unexplained, to several Arabic readers and ask what it says. Everyone should read مرصد without hesitating; if not, refine the lettering in Logo.tsx (the only place the artwork lives) and regenerate the icons and sharing images |
| Streams & podcasts content | `content/live/*.json` | Seven sample streams and episodes (some mention the invented games), all linking to placeholder channels | Delete the samples and add real streams and episodes (see LIVE-GUIDE.md) |
| Channel links | `content/live/channels.json` | An empty list (`[]`), so the "Follow us" row on /live is hidden | The studio's real channel addresses, one entry per platform (see LIVE-GUIDE.md); the row appears as soon as the file has entries |
| Contact form delivery | Vercel → Settings → Environment Variables (names in `.env.example`); code in `src/app/[locale]/support/actions.ts` | Not configured, so the form shows "not available right now" and points to the email address | A Resend account with the real domain verified; then set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (the real support inbox) and `CONTACT_FROM_EMAIL` (e.g. `Marsad <noreply@real-domain>`) in Vercel, redeploy, and send a test message in both languages |
| Privacy policy: contact form | `messages/{ar,en}.json` → `Privacy.sections` | The placeholder policy doesn't mention the form | Real policy text covering what the form collects (name, email, message), why, that it's delivered via Resend, and how long messages are kept |
| Screenshot gallery | `content/games/*.json` → `screenshots` field (empty `[]` for all three games); rendered by `src/app/[locale]/games/[slug]/page.tsx` | Empty array — the page shows a deliberate "Screenshots are coming soon" line, not a broken gallery | Real captures once each game exists, per ART.md section 4 ("do not generate fake gameplay") |
| Store / download links | `content/games/lantern-keep.json` and `content/games/salt-and-signal.json` → `primaryAction.url` (both `"#"`); rendered wherever `primaryAction` renders (`GameChapter.tsx` — on /games and Home's featured game — and the game detail page) | `"#"` — a placeholder that goes nowhere | The real store/download URL once the distribution model is decided (CLAUDE.md section 11) — this also determines what `echo-atlas.json`'s `primaryAction` becomes once it leaves "coming soon" |
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
