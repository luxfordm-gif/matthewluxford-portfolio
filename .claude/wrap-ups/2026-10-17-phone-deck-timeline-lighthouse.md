# matthewluxford-portfolio — phone deck, Lighthouse fixes, phone timeline rebuilt
2026-10-17 (session ran 13–17 Oct) · branch `ccr-582ff934-v1ltkz` · PRs #69, #70, #87, #88, #89 (all merged)

## Done
- Work deck on phones: front card `min(74vw,330px)` with one card tucked behind each side, no arrows; the deck loops endlessly on every screen (cards leave/arrive from the right side, multi-card jumps riffle). #69
- Lighthouse pass on the homepage: deck/case-study heroes and the rest of the homepage JPGs to WebP (+800px `-sm` for phones via `srcset`), the parked work rail's 1.5 MB video no longer downloads (no `autoplay`/`poster` in markup; JS starts it only when the rail is shown), five a11y fixes. Mobile page weight 3.4 MB → 0.8 MB, LCP 8.0s → 5.2s, accessibility 91 → 100. #70
- About intro on phones: wider gutters (`--pad`+1rem) and 96px above the lead. #87
- "Where I've been" on phones, final form: full-screen pin; the role the needle is in sits in the top slot; hand-over where the newer role starts (≤40px ramp + spring); holidays never take the top; rows only ever climb; Beyond the screen is pulled up into the empty room under Ten London (`--tl-overlap`); nav stays hidden while the timeline holds the screen. #89
- Timeline on live site confirmed by Matthew on his phone ("Better.").

## Decided
- Wider deck card + tidier fan over a slimmer card — the fan behind made it look wide, not the card.
- Timeline staircase keys off bar **starts**, not ends — `min-width:max-content` makes a bar's right edge its label width.
- The end-of-journey gap is closed by pulling the next section up, not by moving Ten London down — rows must only ever climb.
- Full-screen pin, not a windowed one — the holidays take rows while sitting off-screen, so a four-row window showed two roles (#87/#88's window was reverted in #89).
- `noindex,nofollow` left in place — Matthew's call, not a Lighthouse fix.

## Learned → where it went
- Phone timeline mechanics, the `max-content` trap, don't-window-the-pin, deck/hello phone sizes, Pillow for WebP → project notes `CLAUDE.md`
- Ask for a screen recording as soon as a motion report contradicts the simulation; give deploy permalinks not `deploy-preview-N`; serve localhost so real fonts load before measuring → `.claude/preferences-inbox.md` (Workflow)
- Cloud phone-test recipe (Pixel 7 profile, Chromium proxy args, CDP touch events), reading MP4 recordings (imageio-ffmpeg), local Lighthouse → `.claude/preferences-inbox.md` (Tooling)
- Nothing new for always-follow rules or reference docs.

## Open
- [ ] **Matthew:** remove `noindex,nofollow` when the site should be findable.
- [ ] **Matthew:** mobile first paint — self-host/swap fonts? shorten the intro screen?
- [ ] Feel constants (RATIO, spring, needle at 70%, ramp ≤40px): leave unless asked; he's happy as of #89.

## Files touched
- `src/index.njk` — deck loop + phone sizing; image srcsets; a11y (fan unhidden, contrast token `--muted-strong`, button names, deck bars); hello phone gutters; whole phone-timeline block (CSS + JS) rewritten across #87–#89; nav `tlHoldsScreen`
- `src/jlr.njk`, `src/lifecake.njk`, `src/skatefarm.njk`, `src/collective.njk` — hero images to WebP
- `src/assets/**` — JPGs replaced by WebP (+`-sm` variants), originals deleted
- `CLAUDE.md`, `.claude/preferences-inbox.md`, `.claude/open-threads.md` — this wrap-up
