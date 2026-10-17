# matthewluxford-portfolio — profile card, Work-life timeline, sounds, mobile pass (#76–#78)
2026-10-17 · branch `ccr-aae927a4-whkxp1` · PRs https://github.com/luxfordm-gif/matthewluxford-portfolio/pull/76 (merged `03709f9`), https://github.com/luxfordm-gif/matthewluxford-portfolio/pull/77 (merged `b6f668b`), https://github.com/luxfordm-gif/matthewluxford-portfolio/pull/78 (merged `9ee673b`)

## Done
- **Profile card + About intro.** The hero's black placeholder became a mini profile card (headshot, @matthewluxford, Connect). On scroll it travels down half a screen (holds at 42% of the viewport), straightens, lands on a centred, left-aligned About intro: handwritten "Matthew" (full name for screen readers), lead line, "right now" paragraph, "Before that". Never rotates or wiggles. Panel Layout group `About intro` flips to the first take (card beside copy).
- **"Where I've been" timeline** (`.tl`). Desktop: sideways scroller, roles stepping up a year axis, hover/focus opens a three-card fan. Phones: pins to the screen; the page scroll travels from today back to Jan 2015 with the staircase rising on a monotone cubic + ~110ms spring, transforms only; sideways swipes drive the same scroll and coast. A needle reads the month/year under it (Oct 2026 at the start, Jan 2015 at the end, both sizes); holidays draw as a dot + label, not a span; tap opens, tap again closes.
- **Sounds.** One `sfx` helper: rustle (fan), folder (deck move), lift (hero card), lens tick/shutter (snake, both directions). All synthesised; silent until the first click/key.
- **Preference panel → Sections.** Every homepage section carries `data-pref-section`; the panel lists them to switch off, drag to reorder (↑/↓ too), scroll to, reset. Saved per page; applies in the viewport preview. `docs/preference-panel.md` and its embedded source updated.
- **Mobile polish.** Profile card last in the stack, no grow, lands dead centre; deal pile no longer jumps on load (`--wfix`, measured inline + ResizeObserver); idle hero wiggle (random card, never the profile card); March 2026 ski trip row; "Off-screen" line dropped from the intro.
- **Smoothness.** Nav-underline and secret-footer scroll handlers throttled to one per frame. A fixed `::before` background layer was tried for scrolling and reverted in #78: it dropped frames on the snake (66ms max vs a steady 16.7ms).

## Decided
- Timeline on phones is scroll-driven and pinned (like the snake) — two earlier approaches (sticky axis + page-follow jumps; page glide while swiping) both fought the phone's own scrolling and felt clumpy.
- Needle sits at 70% across; the journey is defined in years (today → first axis year) and the track's padding is computed so both ends land exactly, rather than letting `scrollWidth` decide.
- Each interaction gets its own sound; the deck's folder sound on the hero cards was "too repetitive" and became `lift`.
- Holidays render as a moment (dot + label); a span implied the ski trip ran to October.
- The hello signature reads "Matthew" (Matt was tried and reverted).

## Learned → where it went
- Phone-first review, scripted real gestures (touch swipe/tap/idle) → memory (`.claude/preferences-inbox.md`, Workflow)
- Smoothness is measured with a frame-time trace before/after → memory (Workflow) + project notes (`CLAUDE.md` → Scroll smoothness)
- "Clumpy" = wrong mechanism; drive from the page's scroll, never script the page under a finger → memory (Workflow)
- Taste: one sound per interaction; idle hints but not on choreographed elements; exact-value markers; point-in-time ≠ span; section titles share `--h2` → memory (Taste)
- Sound helper, four sounds, one-to-one → project notes (`CLAUDE.md` → Homepage sounds)
- `background-attachment:fixed` is the known-good background → project notes (Scroll smoothness)
- Sections toggle + About intro group → project notes (Preference panel) and `docs/preference-panel.md`

## Open
- [ ] carried into `.claude/open-threads.md` — holiday photos/dates; work fan images; About intro pick; title alternatives; sounds and feel constants untuned on a real phone; plus the older 13" check, serif pick, CV direction

## Files touched
- `src/index.njk` — hero profile card + slide, `.hello`, `.tl` timeline (desktop + pinned phone), needle, life rows, `sfx`, wiggle, section tags, scroll throttles
- `src/assets/pref-panel.js` — Sections popover (toggle, drag/keyboard reorder, reset, per-page save)
- `src/_includes/partials/pref-panel.njk` — `About intro` layout group
- `src/assets/hello/`, `src/assets/timeline/` — card/avatar crops of the headshot; 320×240 fan thumbs
- `docs/preference-panel.md` — Sections spec + source
- `CLAUDE.md` — site map, panel groups, Homepage sounds, Scroll smoothness
- `.claude/open-threads.md`, `.claude/preferences-inbox.md`, this file — wrap-up
