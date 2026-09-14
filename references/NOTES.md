# References

Read this before looking at any image in this folder.

**These are structural references, not targets.** Do not reproduce them.
The design direction is defined in `CLAUDE.md` section 4, and that file wins
every time it conflicts with something visible in a screenshot.

Never reuse any asset visible in these images. The character art, logos, and
photography belong to those studios. You are looking at composition, spacing,
and hierarchy only.

---

## Supercell (`supercell-*.png`)

A studio site built to hold many games, which is the same problem we have.

**Take:** the information architecture. How the nav is organised, how the games
grid works, how news cards sit below the fold, how each section gets a single
clear job and one call to action.

**Ignore:** the entire visual treatment. White background, bright colour, and
centre-aligned everything only survives because of expensive 3D character
renders bleeding past the layout edges. We don't have those. Reproducing this
look without that art gives large empty rectangles.

Also ignore the all-caps headings. They don't translate to Arabic.

---

## The Wake (`thewake-*.png`)

**Take:** hero depth. Full-bleed background, content floating over layered
texture, type sitting confidently in the middle of the frame. Also the roadmap
section — a genuine horizontal sequence, which is one of the few places
numbered or dated markers are actually justified.

**Ignore:** the fixed diamond dot navigation running down the side, and the
full-page scroll snapping. Both are accessibility problems and the side rail
has to move to the opposite edge in RTL, which makes it fragile. We are not
building either.

Also ignore the light grey sections. Our base is dark throughout.

---

## Hazelight (`hazelight-*.png`)

The closest to our intended feel.

**Take:** restraint. Dark base, one accent used sparingly, wide margins,
generous vertical rhythm, and type doing the work instead of decoration. The
footer is the best single example — clear column grouping, quiet labels, nothing
extra. The game detail layout (art on one side, title, tags, short paragraph,
one button) is close to the template we want for `/games/[slug]`.

**Ignore:** the black-and-acid-yellow palette specifically. That exact
combination is everywhere right now. Our palette is in `CLAUDE.md`.

---

## How to use these

When building a section, say which reference informed which decision, and which
parts of it you deliberately didn't carry over. If a screenshot is pulling a
choice away from the tokens in `CLAUDE.md`, the tokens win — flag it rather than
splitting the difference.
