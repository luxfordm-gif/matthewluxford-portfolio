# matthewluxford-portfolio — Reps rebuilt around reels, Contact nav with phone menu, What I do
2026-10-18 · branch `ccr-36b9171c-p1b0p0` · PR https://github.com/luxfordm-gif/matthewluxford-portfolio/pull/92

## Done
- Reps case study reworked after kester.work/work/streaks: copy roughly halved; a session reel (a Pixel playing a 38s walkthrough, then six screens), a progress reel (eight screens), a merch reel and a reel of four getrepsapp.app shots; the coach-login outlook; one "Next project". #92
- Every app screen and the clip come from Matthew's Pixel screenshots and screen recording, cropped with Pillow/ffmpeg; the phone frame is a Pixel 10 Pro XL in CSS after an iPhone frame cropped the bottom of every screen.
- The dark stat card, the pill-and-arrow build loop and the boxed outcome numbers replaced with `ruled` rows (facts, numbered steps, big figures) after Matthew called them "AI generated layouts".
- Nav on every page: "Contact" is the primary button (to the footer's details), CV in the links, and a burger menu on phones where the links used to vanish.
- Homepage "What I do, specifically." section: five numbered ruled rows with tags, after princepal.in; no HTML/CSS row because he designs and ships with AI.
- Shipped: PR #92 merged to main at Matthew's "Ship it".

## Decided
- Reels over static galleries, captions per slide, rules between slides — the Kester structure, in the site's own type.
- Pixel frame, not iPhone — his screenshots are 20:9 and an iPhone's 19.5:9 screen lost the tab bars.
- Type between hairlines instead of cards/pills/glass — the look he reads as AI-made; recorded in CLAUDE.md "Layout tells to avoid".
- Profile screen left out — it shows his email.
- No mocked backend for screenshots — the app needs Supabase, which the cloud can't reach; he sent real captures instead.
- "Contact", not "Get in touch" or "Contact me" (his pick, loosely).

## Learned → where it went
- AI-looking layout tells, reference sites, Pixel framing, nav CTA → memory (`.claude/preferences-inbox.md`, Taste) and project notes (`CLAUDE.md`)
- Ask for real captures, keep personal details out → memory (Workflow) + always-follow rule (`.claude/rules/always-follow-rules.md`)
- Cloud network limits, read-only public clones, VP9 for video tests, Pixel crop numbers, ffmpeg walkthrough recipe → memory (Tooling)
- Reel / ruled shortcodes, phone-frame ratios, nav-menu shared block, "What I do" section → project notes (`CLAUDE.md`)

## Open
- [ ] carried into `.claude/open-threads.md` — retake site shots locally, confirm the clip plays on his phone, heading and button wording, What I do order and copy, other case studies' cards, unused Reps gallery files

## Files touched
- `src/reps.njk` — rewritten: short copy, four reels, ruled rows, coach login, no `prev`
- `.eleventy.js` — `reel`, `reel_phone`, `reel_video`, `reel_card`, `ruled`, `ruled_row` shortcodes
- `src/_includes/layouts/case.njk` — reel, phone-frame, ruled and nav-menu styles; drag scroll and play-on-view JS; lone Next block spacing
- `src/_includes/partials/nav.njk` — Contact button, CV link, burger and phone menu
- `src/index.njk` — nav-menu shared block, `.skills` section, hash-based active underline
- `src/assets/reps/` — `screen-*.webp` (13), `merch-*.webp` (7), `site-*.webp` (4), `reps-walkthrough.mp4` + poster
- `CLAUDE.md` — reels, crop recipes, layout tells, nav, What I do
- `.claude/preferences-inbox.md`, `.claude/rules/always-follow-rules.md`, `.claude/open-threads.md` — this wrap-up
