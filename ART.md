# Art Specification — Marsad / مرصد

Every generated asset follows this file. The point is not that any one image
is good — it's that a shelf of twelve of them reads as one studio.

Do not improvise on the style block. Vary the subject only.

---

## 1. The locked style block

Paste this verbatim into every generation. Change nothing inside it.

```
Stylised 3D game character render, high-gloss mobile game art.
Three-quarter view from a slightly low heroic angle. Smooth rounded
forms, exaggerated proportions, oversized head, strong readable
silhouette. Warm key light from upper front, cool blue rim light from
behind separating the subject from the background. Saturated colour
with warm highlights and deep blue-violet shadows. Polished matte
surfaces, soft subsurface glow on skin. Clean simple background.
Sharp focus, no motion blur, no film grain, no text, no watermark.
```

Then append the subject on its own line. Example:

```
[style block]
Subject: a lantern-keeper in heavy robes holding a brass lamp,
standing guard, determined expression.
```

Each game's `genres` field (`content/games/*.json`) is a small fixed set defined in `src/types/game.ts` — not free text. It's a reasonable input for the subject line (a `strategy` game's subject can read more tactical, an `exploration` game's more nautical or wandering), but it never touches the locked style block above.

---

## 2. Palette bridge

The art is brighter and warmer than the site. That is intended. What keeps
it from clashing is that the two share a shadow family.

- Shadows and ambient tones stay blue-violet, never neutral grey or warm brown.
  This is what lets the art sit on `--ink` without looking pasted on.
- Brass and warm gold are the metal of this world — lamps, armour trim,
  fittings. It echoes `--brass` without matching it exactly.
- Saturated accents are allowed and encouraged in the art. They are not
  allowed in the site chrome.

If a generated image has warm grey or muddy brown shadows, regenerate it.
That single property is what breaks a set apart faster than anything else.

---

## 3. Mirroring — bilingual constraint

The site renders RTL and LTR. Any layout with art on one side flips, so a
character in strong profile ends up facing off the edge of the page in one
of the two locales.

Rules:
- Characters face the camera or sit in a shallow three-quarter turn. Never
  strong profile, never a strongly directional pose.
- No text, arrows, or directional symbols inside generated art. Ever.
- Composition stays centre-weighted so it survives being mirrored.

Check every asset by flipping it horizontally. If it looks wrong flipped,
it is wrong.

---

## 4. Per-asset specs

Aspect ratios are fixed by CLAUDE.md section 5 and are not negotiable —
the layouts are already built to them.

**Game key art — 16:9**
Hero image on a game detail page. One or two characters, environment
suggested rather than detailed. Leave the inline-start third relatively
uncluttered so the title can sit there in either direction.

**Card thumbnail — 3:4 portrait**
Read at small size in a grid. Single subject, tight crop, strongest
possible silhouette. Test it at 200px wide — if you can't tell what it is,
it fails.

**Character cut-out — transparent PNG, max 1200px tall**
Generate on a flat background that contrasts with the subject, then remove
it. Never generate "on a transparent background" directly; results are
unusable. Check the edges afterwards for halo fringing, especially on hair
and fur.

**App icon — 1024×1024**
Mobile stores render this as small as 48px. One element, centred, no detail
that survives only at full size. Generate at full size and immediately view
it at 48px before accepting.

**Screenshot gallery — 16:9**
Real captures from the game once it exists. Do not generate fake gameplay.

**Open Graph — 1200×630**
Key art with safe margins; social platforms crop the edges unpredictably.

---

## 5. Workflow

1. Generate three or four variants of every asset. Never take the first.
2. Compare each new asset against the assets already accepted, not against
   the prompt. Drift happens gradually and only shows in a set.
3. Remove backgrounds as a separate pass for anything needing transparency.
4. View at final display size before accepting. Most failures are things
   that looked fine at full resolution.
5. Flip horizontally and re-check, per section 3.

Keep every accepted asset in `public/art/[game-slug]/`. Keep the exact
prompt used in a sibling `prompts.txt`, so a matching asset can be
regenerated a year from now.

---

## 6. Rejection criteria

Regenerate rather than accept if:
- Shadows are warm grey or brown instead of blue-violet
- The silhouette is unreadable at thumbnail size
- The subject is in strong profile or a strongly directional pose
- There is any text, lettering, or symbol in the image
- The render style differs noticeably from already-accepted assets
- Hands or faces are malformed, which is still the most common failure

---

## 7. Licensing

Confirm the commercial-use terms of whichever generator is used before
building a brand on its output. This is a commercial site that will link to
store listings, and app stores do ask.

The logo is never generated as a raster image. The wordmark مرصد / Marsad
is set type in Noto Kufi Arabic and Archivo, exported as SVG.
