# Adding streams and podcast episodes

Everything on the **Streams & Podcasts** page (`/live`) comes from small
files in `content/live/`. One file = one stream or one podcast episode.
You never have to move anything by hand: the page works out by itself
what is **coming up**, what is **live now**, and what is a **replay**,
using each visitor's own clock.

Nothing is embedded on the site. Every card links out to YouTube,
TikTok, Twitch or Kick in a new tab.

## Add a stream or an episode

1. Open `content/live/` and copy an existing file, e.g.
   `podcast-episode-3.json` or `studio-tour-stream.json`.
2. Rename the copy. Use lowercase letters, numbers and hyphens only:
   `dev-stream-5.json`, `podcast-episode-4.json`.
3. Change the fields (explained below). Keep the punctuation exactly as
   it is: quotes, commas, braces.
4. Preview locally (`npm run dev`, then open http://localhost:3000/ar/live).
5. Commit and push. The live site updates when Vercel rebuilds.

## The fields

| Field | Required | What to put |
|---|---|---|
| `kind` | yes | `"stream"` or `"podcast"` |
| `start` | yes | Date **and time with a time zone**, e.g. `"2026-10-15T20:00:00+03:00"` (8pm Riyadh time). For podcasts, when the episode is published. |
| `end` | streams only | When the stream ends, same format. Needed so the site knows when "live now" stops. |
| `duration` | no | Length in minutes, e.g. `95`. Shown on replays and episodes as 1:35:00. |
| `episode` | podcasts only | The episode number, e.g. `4`. |
| `game` | no | A game's slug from `content/games`, if it's about one (e.g. `"lantern-keep"`). Its name appears on the cover. |
| `cover` | no | An image in `public/`, e.g. `"/live/dev-stream-5/cover.jpg"`. Without one, the site makes a Marsad-style cover automatically. |
| `links` | yes | Where to watch. The **first** link is the main one. |
| `ar`, `en` | yes | A `title` and a one-sentence `summary` in **both** languages. |

### Links

```json
"links": [
  { "platform": "youtube", "url": "https://www.youtube.com/watch?v=..." },
  { "platform": "tiktok", "url": "https://www.tiktok.com/@..." }
]
```

Platforms: `youtube`, `tiktok`, `twitch`, `kick`. Addresses must start
with `https://`.

**Tip for scheduled streams:** on YouTube, schedule the stream first,
then use that video's link. Visitors who click "coming up" land on the
YouTube page where they can press "Notify me". The same link becomes the
replay after the stream ends.

## Complete example (stream)

```json
{
  "kind": "stream",
  "start": "2026-10-16T20:00:00+03:00",
  "end": "2026-10-16T22:00:00+03:00",
  "game": "lantern-keep",
  "links": [
    { "platform": "youtube", "url": "https://www.youtube.com/watch?v=abc123" },
    { "platform": "twitch", "url": "https://www.twitch.tv/marsad" }
  ],
  "ar": {
    "title": "بث التطوير: نبني الطابق الأخير في حارس الفانوس",
    "summary": "نعمل مباشرة على آخر طوابق البرج، ونجيب على أسئلتكم أثناء البناء."
  },
  "en": {
    "title": "Dev stream: building Lantern Keep's final floor",
    "summary": "We work live on the tower's last floor and answer your questions as we build."
  }
}
```

After the stream, add `"duration": 118` (its real length in minutes) so
the replay shows it.

## Complete example (podcast episode)

```json
{
  "kind": "podcast",
  "start": "2026-10-08T18:00:00+03:00",
  "episode": 4,
  "duration": 50,
  "links": [
    { "platform": "youtube", "url": "https://www.youtube.com/watch?v=def456" },
    { "platform": "tiktok", "url": "https://www.tiktok.com/@marsad/video/123" }
  ],
  "ar": { "title": "عنوان الحلقة", "summary": "جملة واحدة عن موضوع الحلقة." },
  "en": { "title": "Episode title", "summary": "One sentence about the episode." }
}
```

## Your channels

The "Follow us" row reads `content/live/channels.json`: one entry per
platform, in the order shown. Remove a platform you don't use.

## If the build fails

The site checks every file when it builds and lists each problem in plain
language, naming the file. The usual ones:

- **"start" must be a date and time with a time zone**: include the time
  and the offset, like `2026-10-15T20:00:00+03:00`.
- **streams need an "end" time**: add `end` after `start`.
- **links[0].url must be a full https:// address**: copy the whole link
  from the browser's address bar.
- **needs "en" with both a "title" and a "summary"**: every item exists in
  both languages.
- **isn't valid JSON**: usually a missing comma between fields, or a
  missing quote. Compare with an example above.
