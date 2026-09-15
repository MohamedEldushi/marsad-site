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
- All user-facing copy lives in `messages/ar.json` and `messages/en.json`. Never hardcode text in a component.
- Game data lives in `content/games/*.json`, one file per game.
- No CMS for now. No database. No auth.
- Keep dependencies minimal. Ask before adding a library.

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

The name means "observatory" — a structure built for watching. The wordmark is the four Arabic letters م ر ص د set in Noto Kufi Arabic at weight 900, and it is the single boldest element on the site. Everything else stays quieter than it.

Reference synthesis:
- Information architecture follows the Supercell model (a studio holding many games).
- Restraint and spacing follow Hazelight (dark, disciplined, one accent).
- Hero depth and layering follow The Wake (full-bleed, cinematic).

**Explicitly rejected:** full-page scroll-jacking and fixed side-dot navigation; white/light-background layouts; black with a single acid-green or yellow accent; identical rounded cards with the same soft grey shadow for every piece of content.

**Hero, without waiting on art:** the hero must read as cinematic using gradient depth, the geometric tiling (see Texture below), and type alone — the key-art image slot is additive, not load-bearing. If the hero only works once real art lands, the hero is wrong.

### Colour

Eight tokens. Nothing outside this set without asking.

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0A1228` | Page base. A true blue-black, not a tinted grey. |
| `--ink-raised` | `#131E3A` | Raised surfaces, cards, nav on scroll. |
| `--lapis` | `#4A7BE8` | Interactive on `--ink`: links, focus rings, active states, any blue text (≈4.7:1 on ink). |
| `--lapis-deep` | `#2449C4` | Filled surfaces only (buttons, tags), with `--parchment` text on top (≈6:1). Never used as text on `--ink`. |
| `--brass` | `#C9953F` | The one loud accent. Rare. Primary CTA and nothing else by default. |
| `--parchment` | `#EDE6D8` | Body and heading text. Never pure white. |
| `--muted` | `#8A94AE` | Secondary text, borders, disabled states. |
| `--error` | `#EA6469` | Form feedback only. Not decoration. |
| `--success` | `#46A758` | Form feedback only. Not decoration. |

Brass is the single place boldness is spent. If it appears more than twice on a screen, it has stopped working. `--error`/`--success` exist only for form validation states — never used to color a badge, label, or other UI decoration.

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

Kufic-inspired geometric tiling (SVG) appears in exactly two places: behind the hero, and as a divider band between major sections. Max 6% opacity, one scale across the whole site. Never behind body text. Never inside a card. Nowhere else without asking first.

### Layout and motion

- 12-column grid, 1280px max content width, full-bleed heroes allowed to break out.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px. Nothing off-scale.
- Radii: 0 for structural surfaces, 4px for controls. Not every element gets the same radius.
- **Motion:** one orchestrated reveal on page load, in the hero only. Everything else moves only in response to a user action. No fade-and-slide-up on every section. No hover transform on every card. Always respect `prefers-reduced-motion`.

---

## 4.5 Motion

The full spec behind the one-line rule above.

Two rules govern everything:

- **One orchestrated reveal on page load, hero only.** Nothing else animates on mount or on scrolling into view.
- **Everything else moves only in direct response to a user action** — hover, press, focus. No ambient motion outside the hero's pool drift below, no scroll-triggered reveals, no autoplay.

`prefers-reduced-motion: reduce` disables every animation and transition this section describes. The end state still renders — reduced motion removes the *motion*, not the result.

### Easing and duration

One curve, used everywhere: `cubic-bezier(0.16, 1, 0.3, 1)`. Never linear, never a bounce/spring overshoot.

Three duration bands. Nothing outside them:

| Band | Duration | Use |
|---|---|---|
| Interaction | 200ms | Hover, press, focus-visible state changes |
| Entrance | 600ms | The hero's load-in sequence |
| Ambient | 1200ms+ | Slow background motion — the pool drift below runs far longer than this floor |

### Hero load sequence

On mount, once, staggered 80ms apart:

1. Tiling pattern fades in from 0 to its resting state.
2. Pool gradient expands slightly outward.
3. Wordmark fades up 16px.
4. Headline fades up 16px.
5. CTA fades up 16px.

Each step runs at the entrance duration (600ms) with the house easing curve. This sequence is the one exception to "everything else moves on user action only" — it runs once, on load, in the hero and nowhere else.

### Ambient

The hero's pool gradient drifts slowly — 20s or longer per cycle, subtle enough to be felt rather than consciously seen. No other element gets ambient motion.

### Interaction

- **Buttons:** a brightness lift on hover, a slight scale-down on press. 200ms.
- **Cards:** raise 4px and lighten the border on hover. No rotation, no shadow bloom.
- **Focus rings:** appear instantly. Never animated — a focus ring that fades in is briefly invisible to the person who needs it most.

---

## 5. Art assets

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
  "genres": ["", ""],
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

**Seed content:** 3 placeholder games, one per status (`released`, `beta`, `coming-soon`), so every state gets exercised during build.

**Status display** (no badge pills anywhere):
- `released` — no label at all.
- `beta` — a small `--brass` text label.
- `coming-soon` — a `--muted` text label, and the primary action is replaced with a non-interactive "Coming soon" instead of a CTA.

---

## 7. Pages

- `/` Home — hero, featured game, games grid, studio statement
- `/games` — full catalogue
- `/games/[slug]` — one template serving every game
- `/about` — studio story, team
- `/support` — `mailto:` link only (no form, no third-party service, no backend — revisit if volume justifies it), FAQ
- `/privacy` and `/terms` — required for app store listings. Real copy will be supplied by the studio; use placeholder text until then.
- `404`

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

None of these block the styleguide step.

- [x] Studio name and mission — resolved, see section 1. Wordmark treatment in section 4.
- [ ] Distribution model (affects `primaryAction` only)
- [ ] Domain and support email address
- [ ] Whether Home carries a news/updates section
- [ ] Analytics tool, and whether a consent banner is needed
