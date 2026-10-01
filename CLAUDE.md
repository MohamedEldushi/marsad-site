# Project: Game Studio Website

Read this file fully at the start of every session. It is the source of truth.
If a request conflicts with something here, say so before acting.

---

## 1. What this is

A marketing website for an independent game studio. It exists to:

1. Make the studio look established and credible to players and to publishers.
2. Present a growing catalogue of games, each with its own page.
3. Give players a way to reach support.

**Primary language: Arabic. Secondary: English.**
The site is designed RTL-first. LTR is the variant, not the default.

Audience: Arabic-speaking players, plus English-speaking press and publishing partners.

- Studio name (Arabic): مرصد
- Studio name (Latin): Marsad
- One-line mission (Arabic): نبني عوالم تستحق الاكتشاف
- One-line mission (English): We build worlds worth discovering

---

## 2. Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- `next-intl` for localisation and routing
- Deployed on Vercel

Rules:
- Interface strings live in `messages/ar.json` and `messages/en.json`, translated into both languages. Never hardcode user-facing text in a component.
- Game data, including localised titles, taglines, and descriptions translated into both Arabic and English, lives in `content/games/*.json`, one file per game.
- No CMS for now. No database. No auth.
- Keep dependencies minimal. Ask before adding a library.
- Markdown for news posts is rendered with `marked` (approved for the news task; zero dependencies of its own). No other markdown or front-matter library.

Routing: `/ar/...` and `/en/...`. Root `/` redirects to `/ar`. Every page emits `hreflang` for both.

---

## 3. RTL rules (non-negotiable)

This is the part most likely to go wrong. Follow it exactly.

- **Use CSS logical properties everywhere.** `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`. Never `left` / `right` / `ml-` / `mr-` for layout. In Tailwind use `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`.
- `dir` is set on `<html>` from the active locale.
- **Mirror:** arrows, chevrons, carousel controls, progress bars, breadcrumb separators, drop shadows with a horizontal offset.
- **Do not mirror:** the logo, media play buttons, clock icons, external-link icons, brand marks.
- **Numbers:** Western digits (0–9) in both languages. Dates formatted per locale via `Intl.DateTimeFormat`.
- **No uppercase styling on Arabic.** Arabic has no capitals, so `text-transform: uppercase` is meaningless there and the hierarchy must come from weight, size, and colour instead. Don't build a component whose hierarchy depends on all-caps.
- **Line height:** Arabic body text gets 1.7. Latin body text gets 1.5. Arabic display gets 1.2, Latin display 1.05.
- Arabic copy is usually shorter in characters than English. Every component must survive a 40% swing in string length without breaking.

After building anything, check it in both locales at 390px, 768px, and 1440px (the verification contract in section 9 sets the screenshot widths). Also confirm nothing overflows at 320px — no screenshot required there, just a check.

---

## 4. Design direction

**The idea:** architectural, not cute. Dark, deep, and built from geometry. Visual texture comes from Kufic-inspired angular letterforms and geometric tiling rendered as SVG, not from stock decoration. This is deliberate — it connects to the Arabic script the site is already built around, and it gives the site richness without depending on art assets.

The name means "observatory" — a structure built for watching. The logo is "Star Trail": custom lettering of مرصد in which the tail of ر is the trail of a shooting star, and a 4-point brass star leads the word right to left, in the Arabic reading direction. The artwork lives only in `src/components/ui/Logo.tsx` (variants: `primary` Arabic wordmark, `symbol` star + streak, `small` favicon mark). English contexts use the English lockup: symbol + "Marsad" in Archivo 800, expanded. Minimum sizes: primary 96px wide, symbol 24px, small mark 16px. The logo is the single boldest element on the site. Everything else stays quieter than it.

Reference synthesis:
- Information architecture follows the Supercell model (a studio holding many games).
- Restraint and spacing follow Hazelight (dark, disciplined, one accent).
- Hero depth and layering follow The Wake (full-bleed, cinematic).

**Explicitly rejected:** full-page scroll-jacking and fixed side-dot navigation; white/light-background layouts; black with a single acid-green or yellow accent; identical rounded cards with the same soft grey shadow for every piece of content.

**Hero, without waiting on art:** the hero must read as cinematic using gradient depth, the geometric tiling (see Texture below), and type alone — the key-art image slot is additive, not load-bearing. If the hero only works once real art lands, the hero is wrong.

### Colour

Nine tokens. Nothing outside this set without asking.

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0A1228` | Page base. A true blue-black, not a tinted grey. |
| `--ink-raised` | `#131E3A` | Raised surfaces, cards, nav on scroll. |
| `--lapis` | `#5A8AEB` | Interactive on `--ink`: links, focus rings, active states, any blue text (≈5.5:1 on ink). |
| `--lapis-deep` | `#2449C4` | Filled surfaces only (buttons, tags), with `--parchment` text on top (≈6:1). Never used as text on `--ink`. |
| `--brass` | `#C9953F` | The one loud accent. Rare. Primary CTA and nothing else by default — plus the logo's star (approved by the studio). |
| `--parchment` | `#EDE6D8` | Body and heading text. Never pure white. |
| `--muted` | `#8A94AE` | Secondary text, borders, disabled states. |
| `--error` | `#EA6469` | Form feedback only. Not decoration. |
| `--success` | `#46A758` | Form feedback only. Not decoration. |

Brass is the single place boldness is spent. If it appears more than twice on a screen, it has stopped working. Status labels (including beta) are explicitly exempt from this brass budget because they are small metadata, not calls to action. The logo's star is also exempt: it is part of the brand mark, not a call to action. `--error`/`--success` exist only for form validation states — never used to color a badge, label, or other UI decoration.

Browser surfaces follow the palette too (`globals.css`): `color-scheme: dark`; text selection is a `--lapis-deep` surface with `--parchment` text; the caret is `--lapis`; scrollbars are slim, a `--muted` thumb on `--ink`. Link underlines sit 4px below the text, and dates, times and durations use tabular figures.

### Type

Two display faces (one per script) and one body superfamily:

- **Display Arabic:** Noto Kufi Arabic, Bold/Black. Angular and architectural — carries the whole identity.
- **Display Latin:** Archivo, Expanded widths, 700–900.
- **Body Arabic:** IBM Plex Sans Arabic.
- **Body Latin:** IBM Plex Sans.

IBM Plex Sans and IBM Plex Sans Arabic are designed as one superfamily, so body text stays consistent across locales. Self-host the fonts, subset them, and load Arabic and Latin subsets separately.

**Weight rule:** 800–900 is reserved for the studio wordmark and the hero headline only. Section headings use 600. Nothing else goes above 600. Body text stays at 400/500.

Type scale (1.25 ratio): 0.8 / 1 / 1.25 / 1.563 / 1.953 / 2.441 / 3.052 / 3.815 rem.
Body line length capped at 70 characters (`max-width: 62ch` for Latin, `58ch` for Arabic).

Avoid: all-caps eyebrow labels above headings; accenting a single word in a headline in a different colour; monospace for small labels; `→` appended to button text.

### Texture

Kufic-inspired geometric tiling (SVG) appears in exactly five places: behind the hero, as a divider band between major sections, in one framed `KufiPanel` in the header of a text page (/about, /support — approved by the studio; static, no motion), in generated covers (`NewsCover`, only when a news post, stream, episode or game poster has no artwork — approved by the studio; static, no motion), and in the 404 page's night-sky band around the star (approved by the studio; static, masked to fade out inside the band, above the text). Max 6% opacity, one scale across the whole site. Never behind body text. Never inside a card, except a generated cover. Nowhere else without asking first.

### Layout and motion

- 12-column grid, 1280px max content width, full-bleed heroes allowed to break out.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px. Nothing off-scale.
- Radii: 0 for structural surfaces, 4px for controls. Not every element gets the same radius.
- **Motion:** one orchestrated reveal on page load, in the hero only — plus the 404 page's one star arrival (section 4.5). Everything else moves only in response to a user action, except for the hero's ambient pool drift and the scoped scroll reveals on Home, News, Streams & Podcasts and Games specified in section 4.5. Section 4.5 defines the full motion rules, including card hover behaviour; Scroll reveals are not a site-wide pattern: Home, News, Streams & Podcasts and Games only. Always respect `prefers-reduced-motion`.

---

## 4.5 Motion

The full spec behind the one-line rule above.

Two rules govern everything:

- **One orchestrated reveal on page load, hero only.** Nothing else animates on mount or on scrolling into view. The one other on-load moment is the 404 page's star (see "404" below, approved by the studio).
- **Everything else moves only in direct response to a user action** — hover, press, focus. No ambient motion outside the hero's pool drift below, no autoplay. The one scoped exception is the scroll reveal on Home, News, Streams & Podcasts and Games, below.

`prefers-reduced-motion: reduce` disables every animation and transition this section describes. The end state still renders — reduced motion removes the *motion*, not the result. Components opt in with `motion-safe` / `no-preference`, and a site-wide safety net in `globals.css` makes any remaining transition or animation (colour fades, underline growth) complete instantly under reduce.

### Easing and duration

One curve, used everywhere: `cubic-bezier(0.16, 1, 0.3, 1)`. Never linear, never a bounce/spring overshoot.

Three duration bands. Nothing outside them:

| Band | Duration | Use |
|---|---|---|
| Interaction | 200ms | Hover, press, focus-visible state changes |
| Entrance | 600ms | The hero's load-in sequence |
| Ambient | 1200ms+ | Slow background motion — the pool drift below runs far longer than this floor |

### Hero load sequence

On mount, once:

1. Tiling pattern fades in from 0 to its resting state (0ms).
2. Pool gradient expands slightly outward (80ms).
3. The logo's load moment (from 160ms), adapted from the logo's splash storyboard: the brass star streaks in from the right, the trail draws behind it into the ر, then the letters appear — three parts at 160ms, 310ms and 610ms. English: the symbol animates and "Marsad" fades up 16px. The star always travels right to left; never mirrored.
4. Headline fades up 16px (460ms).
5. CTA fades up 16px (540ms).

Each step runs at the entrance duration (600ms) with the house easing curve. This sequence is the one exception to "everything else moves on user action only" — it runs once, on load, in the hero and nowhere else.

### 404

Approved by the studio: the not-found page's signature moment is the logo's brass star arriving once on load — it drifts in from the upper right (72px, −36px, 80% scale) and settles, 600ms, house easing, 120ms delay. Physical direction on purpose: like the logo's star it always travels right to left and is never mirrored. Under reduced motion it is simply there. Nothing else on the page moves except hover/focus.

### Ambient

The hero's pool gradient drifts slowly — 20s or longer per cycle, subtle enough to be felt rather than consciously seen. No other element gets ambient motion.

### Interaction

- **Buttons:** a brightness lift on hover, a slight scale-down on press. 200ms.
- **Cards:** raise 4px and lighten the border on hover. No rotation, no shadow bloom.
- **News cards:** lighten the frame's border, zoom the cover 4% inside the frame (it never grows past the frame), and slide the "read" arrow forward in the reading direction. 200ms. No raise.
- **Tabs (news filter):** the active tab's `--lapis` underline grows in from nothing, 200ms.
- **Reading progress (news articles):** a 2px `--lapis` line along the bottom of the site header, tracking the reader's own scroll directly (no transition). Fills from the start edge.
- **Focus rings:** appear instantly. Never animated — a focus ring that fades in is briefly invisible to the person who needs it most. One style everywhere: a 2px `--lapis` ring, square (no radius beyond the element's own), offset from the element over `--ink` — 2px for controls, tabs and text links, 4px for whole-card links. Article links (`.news-body`) use the same as a 2px outline.

### Scroll reveal (Home, News, Streams & Podcasts and Games only)

The single named exception to "everything else moves on user action only." Home page sections below the hero (Games row, Studio statement) fade up 16px once, the first time each scrolls into view, at the entrance duration and house easing. The Featured game is the /games chapter (`GameChapter`), so it reveals the /games way instead (approved by the studio): the poster shutter, then the details fading up 150ms later, plus the pointer light — see Games below. Once triggered, a section never re-animates — scrolling away and back does nothing.

This is scoped to Home's own sections. It is not a general pattern to reach for on other pages without the same explicit decision. The Footer moved to the shared layout in step 4 (it now renders on every page, not just Home) and lost its scroll-reveal treatment in the move — for the same reason, it isn't a site-wide pattern without a fresh decision to make it one.

News (approved by the studio): each card in the /news grid fades up 16px the first time it scrolls into view, same duration and easing, staggered 80ms across a row. Changing a news filter re-runs the reveal for the new results — a direct response to the user's action.

Streams & Podcasts (approved by the studio): the "Coming up" cards and the replays grid reveal the same way, staggered 80ms across a row; changing the tab re-runs the reveal. The "live now" dot (on the page and in the header) never pulses — no ambient motion.

Games (approved by the studio): the page's one signature moment is the poster "shutter" — the first time a game's poster scrolls into view it opens from the centre outward, like an observatory's viewing slit, while the art inside settles from 108% to 100%. 600ms, house easing, once. The details beside it fade up 150ms later. The clip is applied to the observed wrapper's child, never the wrapper itself (a fully clipped element never counts as in view). Posters also carry a soft pointer-following light (`Spotlight`, mouse and pen only, 200ms fade) — it responds only to the user's pointer.

Game pages (approved by the studio): the key-art banner opens with the same shutter, once. It sits at the top, so in practice it plays on load — the one on-load motion on a game page. The details are inside the banner and open with it. The screenshot viewer opens and changes instantly.

---

## 5. Art assets

**`ART.md` (project root) is the source of truth for every generated asset** — style block, palette bridge, mirroring rules, per-asset specs, workflow, and rejection criteria. Read it before generating or accepting any art.

Art is AI-generated and does not exist yet. **Build every image slot as a placeholder** — a flat `--ink-raised` rectangle at the correct aspect ratio with the slot name as a label. Layout must never be shaped around a specific generated image.

Fixed aspect ratios:
- Game key art (hero): 16:9
- Game card thumbnail: 3:4 portrait
- Character cut-out: transparent PNG, variable, ≤1200px tall
- Screenshot gallery: 16:9
- Open Graph image: 1200×630

Every generated asset must be produced from the same locked art specification (camera, lighting, palette, render style, background treatment) so the set reads as one studio. The logo must be SVG, never a raster generation.

---

## 6. Content model

Every game is one JSON file in `content/games/`:

```json
{
  "slug": "game-slug",
  "status": "released | beta | coming-soon",
  "primaryAction": { "type": "store | download | play | none", "url": "" },
  "title": { "ar": "", "en": "" },
  "tagline": { "ar": "", "en": "" },
  "description": { "ar": "", "en": "" },
  "genres": ["genre-key", "genre-key"],
  "platforms": ["ios", "android", "web", "pc"],
  "releaseDate": "",
  "keyArt": "",
  "thumbnail": "",
  "screenshots": [],
  "trailerUrl": "",
  "featured": false
}
```

`primaryAction` is deliberately abstract because distribution is not yet decided. The card and detail page must render correctly for every `type` value, including `none`.

**`genres` is a closed enum, not free text.** The fixed set lives as `GENRES`/`Genre` in `src/types/game.ts`: `puzzle`, `adventure`, `strategy`, `action`, `simulation`, `narrative`, `arcade`, `roguelike`, `exploration`. Game JSON files store keys from this set, never display strings — every key needs a translation in both `messages/ar.json` and `messages/en.json` under `Genres`, and `src/types/genres.check.ts` fails the build if one is missing. Adding a genre is a two-step change: add the key to `GENRES`, then add its translation to both locale files, in that order — the build won't compile between those two steps, which is the point.

Genres are deliberately not the same list a big publisher would need (no RPG, no sports, no racing) — this is the vocabulary for an indie studio's own small catalogue, not a general-purpose taxonomy. Extend it when a real game doesn't fit, not speculatively.

**Seed content:** 3 placeholder games, one per status (`released`, `beta`, `coming-soon`), so every state gets exercised during build.

**Status display** (no badge pills anywhere):
- `released` — no label at all.
- `beta` — a small `--brass` text label.
- `coming-soon` — a `--muted` text label, and the primary action is replaced with a non-interactive "Coming soon" instead of a CTA.

### News

Every post is one folder, `content/news/<slug>/` (the folder name is the web address). `NEWS-GUIDE.md` is the step-by-step guide for adding one.

- `meta.json`: `{ "date": "YYYY-MM-DD", "type": "...", "game": "<game slug>", "cover": "/news/<slug>/<file>", "featured": true }` — `game`, `cover` and `featured` are optional.
- `ar.md` and `en.md`: a front-matter block (`title`, `summary`) between two `---` lines, then the body in markdown. Lines starting with `#` inside that block are editor notes, never shown.
- `type` is a closed set, `NEWS_TYPES` in `src/types/news.ts`: `announcement`, `devlog`, `update`, `studio`, `event`. Each needs a translation under `News.types` in both locale files. `livestream` is planned as a type for a later task; it is not accepted yet.
- Every post exists in both languages. `src/lib/news.ts` loads and validates everything at build time (both files present with a title and summary, valid type, existing game, real date, cover and inline images present under `public/news/<slug>/`, images have a description) and stops the build with a plain-language list naming each post and problem.
- Rendering: raw HTML in markdown is shown as text, never injected; body headings start at h2 (the title is the page's h1) and stop at h3; inline images render as full-width 16:9 figures; site links written as `/games/x` get the page's language prefix.
- Components: `NewsCard` (whole-card link; sizes `default`, `large` and `featured` — the cinematic story at the top of /news; 16:9 cover or a generated `NewsCover`; a filled type tag in `--lapis-deep` with parchment text, date, reading time, title, summary, a "read" arrow), `NewsCover` (the post's artwork, or a generated cover: lit pool + Kufic tiling + the game's name), `NewsFilter` (client; pinned bar of type tabs with a `--lapis` underline, a game dropdown and a live post count; editorial grid with scroll reveals; friendly empty state), `NewsBody` (article text styles, `.news-body` in `globals.css`), `ReadingProgress` (articles). Type tags are never brass.

---

## 7. Pages

- Site header on every page (`SiteHeader`, rendered in the locale layout): the logo (links home; primary logo in Arabic, English lockup in English) + Games / News / Streams & Podcasts / About / Support at the start, a language switch (same page, other locale) at the end. Active page marked with a 2px `--lapis` underline. Sticky: `--ink` at the top, `--ink-raised` + hairline once scrolled. Below lg (1024px — five links don't fit a tablet row), a menu button opens a panel (closes on navigation and Escape). Includes a skip-to-content link targeting `#main-content`. While any stream is live (by the viewer's clock), a still `--lapis` dot marks "Streams & Podcasts" in both menus.
- `/` Home — hero (unchanged), then: the featured game as a `GameChapter` (shutter reveal, pointer light, links to its page); "More worlds in progress", a row of 3:4 `GamePoster`s for the other games (generated `NewsCover` posters until art, pointer light, status line and tagline under each) with an "All games" link — the row scrolls sideways natively when it doesn't fit (always on phones; snap, page gutter kept, starts at the right in Arabic), never scroll-jacked; a slim live strip (`LiveStrip`, approved by the studio) linking to /live — "Live now" with the still dot while a stream is live, else the next upcoming stream with its countdown, hidden when there's neither (decided by the viewer's clock, like /live); latest news (3 newest posts as `NewsCard`s, only when there are any); and the studio statement as a calm typographic close (the logo's star, the heading, the paragraph set large and centred). `GamePoster` replaced the old `GameCard`, which is removed; the styleguide's card section shows `GamePoster` too.
- `/games` — full catalogue, one "chapter" per game (`GameChapter`): a large 3:4 poster (the art, or a generated `NewsCover` poster with the game's name) beside the details — status line (always present: released month/year, beta in brass, or coming soon), title (links to the game page), tagline, description, genres and platforms, the game's own action (secondary button) and a "discover the game" link. Chapters alternate sides (zig-zag); below md they stack, poster first. The whole poster links to the game page (a duplicate link, so it is tabindex -1 / aria-hidden; the title is the accessible link). Motion: the poster shutter reveal and the pointer light (section 4.5, Games).
- `/games/[slug]` — one template serving every game: a key-art banner (21:9 desktop, 16:9 tablet, 4:5 phone; the art, or a generated `NewsCover` cover until art exists) with the status, title, tagline and the game's primary action — the page's one brass button, or a disabled "Coming soon" — over a dark scrim that keeps the tiling out from behind the text; an "About the game" paragraph beside an info rail (genres, platforms, release date as label/value rows with hairlines); a trailer card that links out to YouTube in a new tab (play mark, never mirrored; no embed) only when `trailerUrl` is set; screenshots as a 16:9 gallery opening a full-screen viewer (`ScreenshotGallery`, approved by the studio as the one place a viewer is justified: the native modal `<dialog>` — focus kept inside, page inert, Escape closes, arrow keys and previous/next buttons follow the reading direction, focus returns to the thumbnail; opens instantly, no animation), or a friendly empty state; the game's news when it has any; and previous / next world links in catalogue order (no wrap-around).
- `/news` — header in the /about style (no Kufi panel), the featured story large (newest `featured` post, else the newest), then every post in a `NewsFilter` grid: 1 column under 768px, 2 at 768, 3 at 1024+
- `/news/[slug]` — type · date · game (linked), title, summary as the lead, 16:9 cover, `NewsBody`, one brass CTA to the game page when the post has a game (the page's only brass), "More news" (up to 3: same game first, then same type, then the newest others), back link. Statically generated for every post in both locales; unknown slugs are a 404. Metadata uses the summary as the description and the cover as the sharing image when there is one
- `/live` — Streams & Podcasts ("البث والبودكاست"). One JSON file per stream or episode in `content/live/` (both languages required, validated at build; `LIVE-GUIDE.md` explains every field) plus `content/live/channels.json`. Nothing is embedded: every card links out to YouTube, TikTok, Twitch or Kick in a new tab, with an external-link icon and a screen-reader note — no third-party player or tracking loads on the site. Live / upcoming / replay is decided in the browser by the viewer's clock (`src/lib/useNow.ts`, re-checked each minute; build time before hydration, so no mismatch): a "Live now" cinematic banner with the page's one brass button (only while live), "Coming up" (soonest 3, calendar tile, local time with time zone, countdown), a pinned All / Streams / Podcasts tab bar with a count, and a replays/episodes grid (episode number or "Replay" badge, duration badge, generated or real cover). Then a "Follow us" row of channel links. Components: `LiveHub` (client), `LiveNowCard`, `UpcomingCard`, `ReplayCard`, `ExternalIcon` (in `LiveCards.tsx`).
- `/about` — studio story, incl. the Arabic-first differentiator. No team section yet. Header with a `KufiPanel`, an image slot (`about/arabic-first`, 4:5) in the Arabic-first band, and an "Our games" strip of `GameTile`s.
- `/support` — a per-game routing grid of `GameTile`s (coming-soon games excluded), each a `mailto:` with the game in the subject and a report template in the body (`Support.mailSubject` / `Support.mailBody`); then a contact form + FAQ; then a See also row. The contact form (`ContactForm`, server action in `src/app/[locale]/support/actions.ts`) sends through Resend's HTTP API with plain `fetch` — no SDK dependency. Configured only by env vars (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, see `.env.example`); without them it shows an "unavailable" state pointing to the email address. Spam protection is a honeypot plus a minimum time on page — no CAPTCHA (third-party).
- `/privacy` and `/terms` — required for app store listings. Real copy will be supplied by the studio; use placeholder text until then. Both use `LegalPage` (comfortable legal reading): title, intro, "last updated", the placeholder notice (kept visible until the real text is published), and numbered sections (approved by the studio, because legal sections are referred to by number; Western digits). Contents (`LegalContents`): from lg a sticky rail beside the text with scroll-spy — the section being read gets the `--lapis` tab underline; below lg a native collapsible "Contents" list at the top. Plain anchor jumps (no smooth scroll), headings carry a scroll margin to land clear of the header. The news articles' reading-progress line runs along the header. Body at the section 4 measure caps with generous leading; a section body may hold several paragraphs separated by a blank line.
- `404` — `src/app/[locale]/not-found.tsx`, shown for unknown addresses (via the catch-all `src/app/[locale]/[...rest]/page.tsx`) and wherever a page calls `notFound()`; inside the normal layout, in the visitor's language, HTTP 404. A night-sky band (lit pool + tiling, star at its centre) above the line "يبدو أن هذا العالم لم يُكتشف بعد" / "This world hasn't been discovered yet", a short explanation, and links back: Home (the page's one brass button), Games and News. Signature moment: the star's arrival (section 4.5, 404). The star is `LogoStar`, exported from `Logo.tsx`.

Careers is out of scope for v1.

---

## 8. Quality floor

Meet these without being asked:
- Visible keyboard focus on every interactive element, using `--lapis`.
- Text contrast ≥ 4.5:1 against its background.
- Real `<button>` and `<a>` elements. Semantic landmarks.
- Images have `alt` text in the active locale, and sized to prevent layout shift.
- `prefers-reduced-motion` respected.
- Lighthouse performance ≥ 90 on mobile.

---

## 9. Tooling and verification

**Active skill:** `frontend-design` is the design authority for this project. Other design skills should stay disabled — the tokens in section 4 are the design system, and a second opinion on aesthetics causes drift.

**Browser access:** Playwright MCP is connected. The dev server runs at `http://localhost:3000`.

**Verification contract — a task is not done until this passes:**

1. Start or confirm the dev server is running.
2. Navigate to the page in the browser.
3. Screenshot it at 390px, 768px, and 1440px wide.
4. Screenshot **both** `/ar` and `/en` versions.
5. Look at the screenshots. Compare against section 4.
6. Report what you see, including anything that looks wrong.

"The code compiles" and "the page works" are different claims. Only the second one counts.

If a screenshot shows text overflowing, elements overlapping, spacing that breaks the scale, or an RTL layout that hasn't actually mirrored, fix it before reporting the task complete. Do not describe work as finished based on the diff alone.

---

## 10. Working conventions

The person running this project is not a developer. So:

- Explain what you're about to change in one or two plain sentences before doing it.
- Work on one page or one component per session.
- Commit after each completed piece, with a clear message.
- Don't refactor things that weren't asked about.
- If a decision in this file is missing or ambiguous, ask rather than guess, then update this file with the answer.

**Build order — do not skip step 2.**

1. Scaffold, fonts, tokens, i18n routing, RTL wiring
2. A style tile page at `/styleguide` showing colours, both type scales, buttons, cards, and one hero. Iterate here until approved. No other page gets built first.
3. Home
4. Games index + game detail template
5. About, Support, legal pages
6. SEO, Open Graph, sitemap
7. Deploy

---

## 11. Open decisions

**`LAUNCH-CHECKLIST.md`** (project root) is the full list of everything that must be replaced or added before this site goes public, each with the file it lives in — update it the same session a new placeholder is introduced.

None of these block the styleguide step.

- [x] Studio name and mission — resolved, see section 1. Wordmark treatment in section 4.
- [ ] Distribution model (affects `primaryAction` only)
- [ ] Domain
- [x] Support email address — placeholder for now (`support@marsad.example`, in `messages/{ar,en}.json` under `Support.email`), by explicit choice rather than blocking step 5 on it. Swap it for the real address in both locale files when one exists — it's the only place it's stored.
- [x] Whether Home carries a news/updates section — yes: "Latest news", the 3 newest posts, after the games grid. It is not scroll-revealed: section 4.5 names Home's reveal sections, and adding one is a separate decision.
- [ ] Analytics tool, and whether a consent banner is needed
- [x] Contact form — approved by the studio (replaces the earlier "mailto only, no form" rule). Email delivery via Resend; needs a verified sending domain, so it goes live with the real domain.
- [ ] Social media accounts — no real accounts yet, so there are no social links anywhere on the site. The Footer's old X/Instagram/YouTube links were removed rather than left as dead `#` links, and the "Follow us" row on /live stays hidden until `content/live/channels.json` has the studio's real addresses (it is an empty list, `[]`, until then). The sample streams and episodes in `content/live/` link to placeholder channels and are on `LAUNCH-CHECKLIST.md` to be replaced before launch. When real accounts exist: add them to `channels.json` (the row reappears on its own), and decide separately whether the Footer gets social links again (`Footer.tsx`, labels in `messages/{ar,en}.json`).
