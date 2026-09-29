import fs from "node:fs";
import path from "node:path";
import { Marked, type Tokens } from "marked";
import { games } from "@/lib/games";
import {
  NEWS_TYPES,
  type NewsCardData,
  type NewsPost,
  type NewsText,
  type NewsType,
} from "@/types/news";

/**
 * News posts, read from content/news/<slug>/ (CLAUDE.md section 6):
 *   meta.json  -- date, type, optional game / cover / featured
 *   ar.md      -- front matter (title, summary), then the body in markdown
 *   en.md      -- the same, in English
 *
 * Everything is checked when the site builds. Any problem stops the build
 * with a plain-language list naming the post and what to fix -- written
 * for whoever is adding posts, not for a developer. NEWS-GUIDE.md explains
 * each message.
 *
 * Server-only: this reads the file system. Client components get plain
 * NewsCardData objects instead (see toCardData).
 */

type Locale = "ar" | "en";
const LOCALES: Locale[] = ["ar", "en"];

const NEWS_DIR = path.join(process.cwd(), "content", "news");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const META_KEYS = ["date", "type", "game", "cover", "featured"];
const FRONT_MATTER_KEYS = ["title", "summary"];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function isRealDate(value: string) {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** A local image path must point at a file that exists under public/. */
function publicFileExists(publicPath: string) {
  return fs.existsSync(path.join(PUBLIC_DIR, ...publicPath.split("/").filter(Boolean)));
}

/**
 * Minimal front matter: a block between two "---" lines at the very top,
 * one "key: value" per line. Lines starting with # are notes and ignored.
 * Deliberately not a YAML parser -- two keys don't need a dependency.
 */
function parseFrontMatter(source: string, problem: (message: string) => void) {
  const lines = source.split("\n");
  if (lines[0]?.trim() !== "---") {
    problem('must start with a "---" line, then title and summary, then another "---" line.');
    return null;
  }
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end === -1) {
    problem('the block at the top is never closed. Add a "---" line after the summary.');
    return null;
  }

  const fields: Record<string, string> = {};
  for (const raw of lines.slice(1, end)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const colon = line.indexOf(":");
    if (colon === -1) {
      problem(`this line in the top block has no "name: value" form: "${line}".`);
      continue;
    }
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (value.length >= 2 && /^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    if (!FRONT_MATTER_KEYS.includes(key)) {
      problem(`unknown field "${key}" in the top block. Only "title" and "summary" are allowed.`);
      continue;
    }
    fields[key] = value;
  }
  if (!fields.title) problem('has no "title:" line in the top block.');
  if (!fields.summary) problem('has no "summary:" line in the top block.');

  return { fields, body: lines.slice(end + 1).join("\n") };
}

/**
 * Markdown -> HTML for one post in one language. Raw HTML in the source is
 * shown as text, never injected. Site links written as "/games/x" get the
 * page's language prefix; images become full-width 16:9 figures.
 */
function renderMarkdown(
  body: string,
  locale: Locale,
  slug: string,
  problem: (message: string) => void,
) {
  const renderImage = ({ href, title, text }: Tokens.Image) => {
    if (!text.trim()) {
      problem(`an image (${href}) has no description. Write one inside the square brackets: ![description](${href}).`);
    }
    if (href.startsWith("/")) {
      if (!href.startsWith(`/news/${slug}/`)) {
        problem(`the image "${href}" must be inside public/news/${slug}/ and start with /news/${slug}/.`);
      } else if (!publicFileExists(href)) {
        problem(`the image "${href}" was not found. Put the file in public${href}.`);
      }
    } else if (!/^https:\/\//.test(href)) {
      problem(`the image "${href}" should be a path starting with /news/${slug}/.`);
    }
    const caption = title ? `<figcaption>${escapeHtml(title)}</figcaption>` : "";
    return `<figure><img src="${escapeHtml(href)}" alt="${escapeHtml(text)}" width="1600" height="900" loading="lazy" decoding="async">${caption}</figure>`;
  };

  const marked = new Marked({
    gfm: true,
    renderer: {
      // Headings inside a post start at h2 -- the post title is the page's
      // only h1 -- and stop at h3, the two levels NewsBody styles.
      heading({ tokens, depth }) {
        const level = Math.min(Math.max(depth, 2), 3);
        return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
      },
      // An image on its own line becomes a figure, not a figure inside <p>.
      paragraph({ tokens }) {
        const meaningful = tokens.filter((token) => !(token.type === "text" && !token.raw.trim()));
        if (meaningful.length === 1 && meaningful[0].type === "image") {
          return renderImage(meaningful[0] as Tokens.Image) + "\n";
        }
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
      },
      image: renderImage,
      link({ href, title, tokens }) {
        let target = href;
        if (href.startsWith("/") && !/^\/(ar|en)(\/|$)/.test(href)) {
          target = `/${locale}${href === "/" ? "" : href}`;
        }
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
        return `<a href="${escapeHtml(target)}"${titleAttr}>${this.parser.parseInline(tokens)}</a>`;
      },
      html({ text }) {
        return escapeHtml(text);
      },
    },
  });

  return marked.parse(body, { async: false });
}

function loadPost(slug: string, problems: string[]): NewsPost | null {
  const dir = path.join(NEWS_DIR, slug);
  const where = `content/news/${slug}`;
  const problem = (file: string) => (message: string) =>
    problems.push(`${where}/${file}: ${message}`);

  if (!SLUG_PATTERN.test(slug)) {
    problems.push(
      `${where}: the folder name becomes the web address, so use only lowercase English letters, numbers and single hyphens (for example "lantern-keep-1-2").`,
    );
  }

  // meta.json
  const metaPath = path.join(dir, "meta.json");
  let meta: Record<string, unknown> = {};
  if (!fs.existsSync(metaPath)) {
    problem("meta.json")("is missing. Every post folder needs one.");
  } else {
    try {
      const parsed = JSON.parse(fs.readFileSync(metaPath, "utf8"));
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) meta = parsed;
      else problem("meta.json")("must be one { ... } block.");
    } catch {
      problem("meta.json")("is not valid JSON. Check for a missing comma, a missing quote, or a comma after the last line.");
    }
  }

  const metaProblem = problem("meta.json");
  for (const key of Object.keys(meta)) {
    if (!META_KEYS.includes(key)) {
      metaProblem(`unknown field "${key}". Allowed fields: ${META_KEYS.join(", ")}.`);
    }
  }

  const date = meta.date;
  if (typeof date !== "string" || !isRealDate(date)) {
    metaProblem(`"date" must be a real date written as YYYY-MM-DD (for example "2026-09-22"). Found: ${JSON.stringify(date)}.`);
  }

  const type = meta.type;
  if (typeof type !== "string" || !(NEWS_TYPES as readonly string[]).includes(type)) {
    metaProblem(`"type" must be one of: ${NEWS_TYPES.join(", ")}. Found: ${JSON.stringify(type)}.`);
  }

  const game = meta.game;
  if (game !== undefined && (typeof game !== "string" || !games.some((g) => g.slug === game))) {
    metaProblem(`"game" must be one of the games in content/games: ${games.map((g) => g.slug).join(", ")}. Found: ${JSON.stringify(game)}. Leave the field out if the post isn't about one game.`);
  }

  const cover = meta.cover;
  if (cover !== undefined) {
    if (typeof cover !== "string" || !cover.startsWith(`/news/${slug}/`)) {
      metaProblem(`"cover" must be a path starting with /news/${slug}/ (the file lives in public/news/${slug}/). Found: ${JSON.stringify(cover)}.`);
    } else if (!publicFileExists(cover)) {
      metaProblem(`the cover image "${cover}" was not found. Put the file in public${cover}.`);
    }
  }

  const featured = meta.featured;
  if (featured !== undefined && typeof featured !== "boolean") {
    metaProblem(`"featured" must be true or false, without quotes. Found: ${JSON.stringify(featured)}.`);
  }

  // ar.md / en.md
  const texts: Partial<Record<Locale, NewsText>> = {};
  for (const locale of LOCALES) {
    const file = `${locale}.md`;
    const filePath = path.join(dir, file);
    const fileProblem = problem(file);
    if (!fs.existsSync(filePath)) {
      fileProblem(`is missing. Every post must exist in both Arabic (ar.md) and English (en.md).`);
      continue;
    }
    const source = fs.readFileSync(filePath, "utf8").replace(/^﻿/, "").replace(/\r\n?/g, "\n");
    const parsed = parseFrontMatter(source, fileProblem);
    if (!parsed) continue;
    if (!parsed.body.trim()) fileProblem("has no text after the top block.");
    texts[locale] = {
      title: parsed.fields.title ?? "",
      summary: parsed.fields.summary ?? "",
      html: renderMarkdown(parsed.body, locale, slug, fileProblem),
    };
  }

  if (!texts.ar || !texts.en) return null;
  return {
    slug,
    date: date as string,
    type: type as NewsType,
    game: game as string | undefined,
    cover: cover as string | undefined,
    featured: featured === true,
    ar: texts.ar,
    en: texts.en,
  };
}

function loadAllNews(): NewsPost[] {
  if (!fs.existsSync(NEWS_DIR)) return [];

  const problems: string[] = [];
  const posts = fs
    .readdirSync(NEWS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => loadPost(entry.name, problems));

  if (problems.length > 0) {
    throw new Error(
      `\n\nNews: ${problems.length} problem${problems.length === 1 ? "" : "s"} to fix before the site can build (see NEWS-GUIDE.md):\n\n` +
        problems.map((line) => `  - ${line}`).join("\n") +
        "\n",
    );
  }

  return (posts as NewsPost[]).sort(
    (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
  );
}

// Cached for production builds. In development it's re-read on every call
// so a post added or edited while previewing shows up on refresh.
let cache: NewsPost[] | null = null;

/** Every post, newest first. */
export function getAllNews(): NewsPost[] {
  if (process.env.NODE_ENV !== "production") return loadAllNews();
  cache ??= loadAllNews();
  return cache;
}

export function getNewsPost(slug: string) {
  return getAllNews().find((post) => post.slug === slug);
}

/** The newest post marked featured, else the newest post. */
export function getFeaturedNews(posts = getAllNews()) {
  return posts.find((post) => post.featured) ?? posts[0];
}

/**
 * Up to `limit` other posts: same game first, then same type, then the
 * newest of the rest (so "More news" isn't empty just because nothing
 * shares a game or type yet). Newest first within each group.
 */
export function getRelatedNews(post: NewsPost, limit = 3) {
  const others = getAllNews().filter((other) => other.slug !== post.slug);
  const sameGame = post.game ? others.filter((other) => other.game === post.game) : [];
  const sameType = others.filter((other) => other.type === post.type && !sameGame.includes(other));
  const rest = others.filter((other) => !sameGame.includes(other) && !sameType.includes(other));
  return [...sameGame, ...sameType, ...rest].slice(0, limit);
}

/**
 * Arabic month names with Western digits (CLAUDE.md section 3), matching
 * the game pages. UTC so a date never shifts a day with the viewer's
 * or the build machine's time zone.
 */
export function formatNewsDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

/** ~200 words a minute, from the rendered body (tags stripped). */
export function readingMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** The post published just before and just after this one, by date. */
export function getAdjacentNews(post: NewsPost) {
  const posts = getAllNews(); // newest first
  const index = posts.findIndex((other) => other.slug === post.slug);
  return { newer: posts[index - 1], older: posts[index + 1] };
}

export function toCardData(
  post: NewsPost,
  locale: Locale,
  typeLabel: (type: NewsType) => string,
): NewsCardData {
  return {
    slug: post.slug,
    type: post.type,
    typeLabel: typeLabel(post.type),
    game: post.game,
    date: post.date,
    dateLabel: formatNewsDate(post.date, locale),
    title: post[locale].title,
    summary: post[locale].summary,
    cover: post.cover,
    readingMinutes: readingMinutes(post[locale].html),
    coverLabel: post.game
      ? (games.find((game) => game.slug === post.game)?.title[locale] ?? typeLabel(post.type))
      : typeLabel(post.type),
  };
}
