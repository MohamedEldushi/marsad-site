# Art prompts — first set (key art + thumbnail, all three seed games)

Ready to paste as-is. The style block is reproduced verbatim from `ART.md`
section 1 in every prompt — don't edit it. Only the `Subject:` line changes.

Each block below also states the aspect ratio in plain language and as the
common tool flags, since `ART.md`'s aspect ratios aren't negotiable
(CLAUDE.md section 5 — the layouts are already built to them):
- Key art: **16:9** (`--ar 16:9`)
- Thumbnail: **3:4** portrait (`--ar 3:4`)

---

## Order to generate in

1. **Lantern Keep — key art**
2. **Lantern Keep — thumbnail**
3. **Salt & Signal — key art**
4. **Salt & Signal — thumbnail**
5. **Echo Atlas — key art**
6. **Echo Atlas — thumbnail**

Why this order: Lantern Keep is the featured game and the first thing a
visitor sees on Home, so its key art is the one that ends up setting the
bar the rest of the set gets checked against (`ART.md` section 5, step 2:
"compare each new asset against the assets already accepted, not against
the prompt"). Within each game, generate key art before its thumbnail —
they're meant to be the same character, and it's easier to keep the
thumbnail consistent with a key art that's already been accepted than the
other way round.

## After every single image, before moving to the next prompt

Run this whole checklist each time — not just at the end:

1. **Generate 3–4 variants. Don't take the first result.**
2. **Shadows and ambient tones are blue-violet** — never neutral grey,
   never warm brown. This is the single fastest thing to break the set
   apart (`ART.md` section 2).
3. **Brass/warm-gold metal is present** on the object called out in the
   subject line (lantern, signal-finder, atlas fittings) — it's what ties
   the art palette back to `--brass` without matching it exactly.
4. **Not a strong profile, not a strongly directional pose.** Camera-facing
   or a shallow three-quarter turn only.
5. **No text, lettering, arrows, or symbols anywhere in the image.**
6. **Flip the image horizontally and look again.** If anything reads wrong
   mirrored, reject it — the site shows this art in both an RTL and an LTR
   layout.
7. **Hands and faces aren't malformed** — still the most common failure.
8. **Thumbnail only:** shrink it to ~200px wide and check you can still
   tell what it is. If not, it fails, full stop.
9. Once one image from a game (key art or thumbnail) is accepted, **every
   later image compares against it, not against the prompt text** — so if
   Lantern Keep's key art comes out a little warmer or a little more
   saturated than expected, match that in the thumbnail rather than
   re-matching the prompt.
10. Save the accepted file to `public/art/[game-slug]/key-art.png` or
    `.../thumbnail.png` (matching the `keyArt`/`thumbnail` paths already in
    each game's `content/games/*.json`), and paste the exact prompt you
    used into a sibling `public/art/[game-slug]/prompts.txt` — so the same
    asset can be regenerated a year from now (`ART.md` section 5).

If anything needs a transparent background later (character cut-outs),
that's a separate pass per `ART.md` section 4 — never generate "on a
transparent background" directly.

---

## 1. Lantern Keep — key art (16:9)

```
Stylised 3D game character render, high-gloss mobile game art.
Three-quarter view from a slightly low heroic angle. Smooth rounded
forms, exaggerated proportions, oversized head, strong readable
silhouette. Warm key light from upper front, cool blue rim light from
behind separating the subject from the background. Saturated colour
with warm highlights and deep blue-violet shadows. Polished matte
surfaces, soft subsurface glow on skin. Clean simple background.
Sharp focus, no motion blur, no film grain, no text, no watermark.
Subject: a lone lantern-keeper in heavy layered robes and worn leather
armour, holding aloft a tall brass lantern staff that casts warm
light, standing on the rampart of a besieged stone tower. Suggested
silhouettes of shadow-creatures climbing the tower's edge in the
middle distance below, kept soft and indistinct rather than detailed.
Determined, watchful expression. Subject centred in the frame with
open, uncluttered space along both the left and right thirds, so a
title can sit on either side depending on layout.
```

Aspect ratio: 16:9 widescreen (`--ar 16:9`).

---

## 2. Lantern Keep — thumbnail (3:4)

```
Stylised 3D game character render, high-gloss mobile game art.
Three-quarter view from a slightly low heroic angle. Smooth rounded
forms, exaggerated proportions, oversized head, strong readable
silhouette. Warm key light from upper front, cool blue rim light from
behind separating the subject from the background. Saturated colour
with warm highlights and deep blue-violet shadows. Polished matte
surfaces, soft subsurface glow on skin. Clean simple background.
Sharp focus, no motion blur, no film grain, no text, no watermark.
Subject: a lone lantern-keeper in heavy layered robes and worn leather
armour, gripping a tall brass lantern staff close to the body,
three-quarter turn toward camera, determined expression. Tight crop
from mid-thigh up, strongest possible readable silhouette against a
clean simple background, no environment detail.
```

Aspect ratio: 3:4 portrait (`--ar 3:4`).

---

## 3. Salt & Signal — key art (16:9)

```
Stylised 3D game character render, high-gloss mobile game art.
Three-quarter view from a slightly low heroic angle. Smooth rounded
forms, exaggerated proportions, oversized head, strong readable
silhouette. Warm key light from upper front, cool blue rim light from
behind separating the subject from the background. Saturated colour
with warm highlights and deep blue-violet shadows. Polished matte
surfaces, soft subsurface glow on skin. Clean simple background.
Sharp focus, no motion blur, no film grain, no text, no watermark.
Subject: a wind-worn sailor in a heavy oilskin coat, standing at the
bow of a small wooden boat, holding up a glowing brass signal-finder
that casts a faint directional beam out toward an empty horizon. Open
sea suggested below and around, kept soft and indistinct rather than
detailed. Alert, searching expression, hair and coat caught by the
wind. Subject centred in the frame with open, uncluttered space along
both the left and right thirds, so a title can sit on either side
depending on layout.
```

Aspect ratio: 16:9 widescreen (`--ar 16:9`).

---

## 4. Salt & Signal — thumbnail (3:4)

```
Stylised 3D game character render, high-gloss mobile game art.
Three-quarter view from a slightly low heroic angle. Smooth rounded
forms, exaggerated proportions, oversized head, strong readable
silhouette. Warm key light from upper front, cool blue rim light from
behind separating the subject from the background. Saturated colour
with warm highlights and deep blue-violet shadows. Polished matte
surfaces, soft subsurface glow on skin. Clean simple background.
Sharp focus, no motion blur, no film grain, no text, no watermark.
Subject: a wind-worn sailor in a heavy oilskin coat, gripping a
glowing brass signal-finder close to the chest, three-quarter turn
toward camera, alert searching expression, hair and coat caught by
the wind. Tight crop from mid-thigh up, strongest possible readable
silhouette against a clean simple background, no environment detail.
```

Aspect ratio: 3:4 portrait (`--ar 3:4`).

---

## 5. Echo Atlas — key art (16:9)

```
Stylised 3D game character render, high-gloss mobile game art.
Three-quarter view from a slightly low heroic angle. Smooth rounded
forms, exaggerated proportions, oversized head, strong readable
silhouette. Warm key light from upper front, cool blue rim light from
behind separating the subject from the background. Saturated colour
with warm highlights and deep blue-violet shadows. Polished matte
surfaces, soft subsurface glow on skin. Clean simple background.
Sharp focus, no motion blur, no film grain, no text, no watermark.
Subject: a travelling cartographer in a long layered coat with map
cases slung across the back, holding open a large atlas bound in
brass fittings and clasps, its inked map lines glowing and visibly
shifting and redrawing themselves. Suggested fragments of a changing
landscape emerging faintly from the atlas's pages, kept soft and
indistinct rather than detailed. Curious, wondering expression.
Subject centred in the frame with open, uncluttered space along both
the left and right thirds, so a title can sit on either side
depending on layout.
```

Aspect ratio: 16:9 widescreen (`--ar 16:9`).

---

## 6. Echo Atlas — thumbnail (3:4)

```
Stylised 3D game character render, high-gloss mobile game art.
Three-quarter view from a slightly low heroic angle. Smooth rounded
forms, exaggerated proportions, oversized head, strong readable
silhouette. Warm key light from upper front, cool blue rim light from
behind separating the subject from the background. Saturated colour
with warm highlights and deep blue-violet shadows. Polished matte
surfaces, soft subsurface glow on skin. Clean simple background.
Sharp focus, no motion blur, no film grain, no text, no watermark.
Subject: a travelling cartographer in a long layered coat, holding a
glowing atlas bound in brass fittings close to the chest, its inked
map lines visibly shifting on the open page, three-quarter turn
toward camera, curious wondering expression. Tight crop from
mid-thigh up, strongest possible readable silhouette against a clean
simple background, no environment detail.
```

Aspect ratio: 3:4 portrait (`--ar 3:4`).

---

## Before you start generating at all

`ART.md` section 7: confirm the commercial-use terms of whichever generator
you use before building a brand on its output — this is a commercial site
that will link to store listings, and app stores do ask.
