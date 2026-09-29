# Project brief — read this first

Read CLAUDE.md in this folder before doing anything. It is the
complete source of truth for this project: stack, RTL rules, design
tokens, motion spec, content model, build order, and conventions.

Also read:
- ART.md — rules for all generated artwork
- LAUNCH-CHECKLIST.md — everything still provisional
- references/NOTES.md — before using any reference screenshot

This project is Arabic-first and RTL-first. Check CLAUDE.md
section 3 before writing any layout code.

Screenshot every page in both /ar and /en before reporting work as
done. See CLAUDE.md section 9.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
