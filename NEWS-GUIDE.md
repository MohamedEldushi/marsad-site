# How to add a news post

This guide is for anyone adding news to the Marsad site. You don't need to
be a developer. A post is just a folder with three text files in it.

---

## What a post is

Every post lives in its own folder inside `content/news/`:

```
content/news/
  lantern-keep-1-2-is-out/     <- one folder = one post
    meta.json                  <- date, type, which game
    ar.md                      <- the Arabic text
    en.md                      <- the English text
```

Every post must exist in **both** Arabic and English. The site won't build
if one of the two files is missing.

---

## Step 1: Make the folder

1. Open `content/news/`.
2. Copy an existing post folder and paste it next to the others.
3. Rename the copy. **The folder name becomes the web address:**
   `lantern-keep-1-2-is-out` becomes `/ar/news/lantern-keep-1-2-is-out`.

Folder name rules:
- lowercase English letters (a–z), numbers (0–9), and hyphens (-) only
- no spaces, no Arabic letters, no capitals
- no hyphen at the start or end, and never two hyphens in a row

Good: `salt-and-signal-beta-2`. Not allowed: `Salt & Signal Beta`,
`beta--2`, `تحديث`.

Once a post is public, don't rename its folder: the old web address would
stop working.

---

## Step 2: Fill in `meta.json`

```json
{
  "date": "2026-10-05",
  "type": "update",
  "game": "salt-and-signal",
  "cover": "/news/salt-and-signal-beta-2/cover.jpg",
  "featured": true
}
```

| Field | Required? | What it means |
|---|---|---|
| `date` | Yes | The publish date, written `YYYY-MM-DD` (year-month-day). Posts are listed newest first. |
| `type` | Yes | One of: `announcement`, `devlog`, `update`, `studio`, `event`. It's shown on the card ("Update", "تحديث", ...) and used by the filter on the news page. |
| `game` | No | The game the post is about. Use the game's file name from `content/games/` without `.json`: `lantern-keep`, `salt-and-signal` or `echo-atlas`. The post then shows up on that game's page, links to it, and ends with a button to the game. Leave the whole line out for studio news. |
| `cover` | No | The cover image (see Step 4). Leave the line out and the site shows a plain placeholder. |
| `featured` | No | `true` to show this post large at the top of the news page. If several posts are featured, the newest one wins. Leave it out otherwise. No quotes around `true`. |

JSON is strict about punctuation:
- every text value goes in straight double quotes: `"update"`
- a comma after every line **except the last one**
- keep the `{` and `}` at the start and end

---

## Step 3: Write `ar.md` and `en.md`

Each file starts with a small block between two `---` lines, then the
article itself:

```markdown
---
title: The headline of the post
summary: One sentence that says what the post is about.
---

The article starts here.
```

- **title**: the headline, shown on cards and at the top of the article.
- **summary**: one sentence. It appears on cards, under the headline, and
  as the text search engines and social media show.
- A line starting with `#` inside the top block is a private note. It's
  never shown on the site.

### Writing the article

The article is written in **Markdown**, which uses a few simple marks:

| You type | You get |
|---|---|
| A blank line between paragraphs | A new paragraph |
| `## A heading` | A section heading |
| `### A smaller heading` | A smaller heading inside a section |
| `- an item` (one per line) | A bulleted list |
| `1. first step` (one per line) | A numbered list |
| `> a quote` | A quote, set apart from the text |
| `**important**` | Stronger text |
| `[the link text](/games/lantern-keep)` | A link to a page on this site |
| `[the link text](https://example.com)` | A link to another website |
| `![what the picture shows](/news/my-post/photo.jpg)` | A picture (see Step 4) |

Notes:
- Don't use a single `#` heading in the article: the title already is the
  main heading. (If you do, it's shown as a `##` heading.)
- Links to pages on this site can leave out the language. `/games` goes to
  `/ar/games` in the Arabic post and `/en/games` in the English one.
- Web code (HTML) typed into a post is shown as plain text, not run.

---

## Step 4: Add pictures (optional)

1. Make a folder with the **same name as your post** inside `public/news/`:
   `public/news/salt-and-signal-beta-2/`
2. Put the image files there, e.g. `cover.jpg`, `harbour.jpg`.
3. Refer to them starting from `/news/`, without `public`:
   - cover, in `meta.json`: `"cover": "/news/salt-and-signal-beta-2/cover.jpg"`
   - inside the article: `![The harbour at dawn](/news/salt-and-signal-beta-2/harbour.jpg)`

Pictures are always shown **wide, in 16:9** (like a TV screen), so crop
them that way. 1600 × 900 pixels is a good size. Anything else gets
trimmed at the edges to fit.

Every picture in the article needs a short description inside the square
brackets. People using screen readers hear it, and the build stops if
it's empty. Write it in the language of the file.

Artwork must follow `ART.md`.

---

## Step 5: Preview it on your computer

1. Open a terminal in the project folder.
2. Run `npm run dev` and wait until it says it's ready.
3. Open http://localhost:3000/ar/news and http://localhost:3000/en/news.
   Your post should be there. Click it and read it in both languages.
4. Saved a change? Refresh the page to see it.
5. Before publishing, run `npm run build`. If it finishes without errors,
   the post is ready. If it stops, see "When the build stops" below.

## Step 6: Publish

Commit the new folder (and any images in `public/news/`) and push to
GitHub. Vercel rebuilds the site and the post goes live a few minutes
later.

To remove a post, delete its folder in `content/news/` (and its images
folder in `public/news/`), then commit and push.

---

## When the build stops

If something is wrong, the build stops and prints a list like this:

```
News: 2 problems to fix before the site can build (see NEWS-GUIDE.md):

  - content/news/beta-2/en.md: is missing. Every post must exist in both Arabic (ar.md) and English (en.md).
  - content/news/beta-2/meta.json: "date" must be a real date written as YYYY-MM-DD ...
```

Each line names the post folder, the file, and what to fix. The common ones:

| The message says | What to do |
|---|---|
| `ar.md` / `en.md` **is missing** | Add the missing language file. Both are always required. |
| **has no "title:" line** / **has no "summary:" line** | Add that line to the top block, between the two `---` lines. |
| **must start with a "---" line** / **the block at the top is never closed** | The file must begin with `---`, then title and summary, then another `---`. |
| **unknown field** | A misspelled field name, e.g. `titel:` or `"gmae"`. Fix the spelling. |
| **is not valid JSON** | A punctuation slip in `meta.json`: a missing comma, a missing quote, or a comma after the last line. |
| **"date" must be a real date** | Write it as `2026-10-05`. Dates that don't exist (like `2026-02-30`) are refused too. |
| **"type" must be one of ...** | Use one of the five types exactly as written, in lowercase. |
| **"game" must be one of the games** | Use a game's file name from `content/games/` (without `.json`), or remove the line. |
| **"featured" must be true or false** | Write `true` without quotes, or remove the line. |
| **the cover image / the image ... was not found** | The file isn't where the path says. Check the folder name and the file name, including `.jpg` vs `.png`. |
| **must be inside public/news/<post>/** | Images for a post go in the folder with the same name as the post. |
| **an image has no description** | Write a description inside the `[ ]` of `![ ](...)`. |
| **the folder name becomes the web address** | Rename the folder using only a–z, 0–9 and single hyphens. |

---

## A complete example

Folder: `content/news/lantern-keep-winter-update/`

`meta.json`
```json
{
  "date": "2026-12-01",
  "type": "update",
  "game": "lantern-keep"
}
```

`en.md`
```markdown
---
title: Lantern Keep winter update
summary: Snow reaches the tower, the nights get longer, and the lantern learns a new trick.
---

Winter has come to Lantern Keep. This update changes how the nights play out, and gives you one new way to hold back the dark.

## What's new

- Snow slows the dark down, but it also dims the light at the edges.
- Nights are longer, so plan your oil more carefully.
- The lantern can now be narrowed into a beam that reaches further.

## Fixed

1. The tower no longer shakes after a wave has ended.
2. The pause menu now opens during the last wave too.

> Hold the light. Spring is coming.

Tell us how it plays on the [support page](/support).
```

`ar.md`
```markdown
---
title: تحديث الشتاء في حارس الفانوس
summary: يصل الثلج إلى البرج، وتطول الليالي، ويتعلّم الفانوس حيلة جديدة.
---

حلّ الشتاء على حارس الفانوس. يغيّر هذا التحديث طريقة سير الليالي، ويمنحك وسيلة جديدة لصدّ الظلام.

## الجديد

- يُبطئ الثلج الظلام، لكنه يُخفت النور عند الأطراف أيضًا.
- أصبحت الليالي أطول، فخطّط لاستهلاك الزيت بعناية أكبر.
- صار بإمكانك تضييق نور الفانوس إلى شعاع يصل أبعد.

## ما أصلحناه

1. لم يعد البرج يهتز بعد انتهاء الموجة.
2. صارت قائمة الإيقاف المؤقت تُفتح في الموجة الأخيرة أيضًا.

> احمِ النور. الربيع قادم.

أخبرنا برأيك في [صفحة الدعم](/support).
```
