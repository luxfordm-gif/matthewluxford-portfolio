# matthewluxford-portfolio — preference panel, laptop type scale, deck hover
2026-10-16 · branch `claude/responsive-breakpoints-panel-xt49vs` · PR: see branch

## Done
- Draggable, closable preference panel (`src/assets/pref-panel.js`) with Layout and Viewport toggles. Loads on localhost / Netlify previews / `?panel` only; never on live for visitors.
- Viewport presets: Mobile 390×844, Small laptop 1280×800, 15-inch 1440×900, HD 1920×1080. Same-origin iframe, scaled to fit, keeps scroll position.
- Layout group on the homepage: Accent serif (EB Garamond trial vs Fraunces).
- Laptop type scale: rem base 93.75% between 761 and 1599px; section titles on their own `--h2` a step below the hero `--h1` (pinned in px). At 1280: hero 72px unchanged, sections 72 → 53px, body 16.8 → 15.75px. HD and phone unchanged.
- Deck fits a 13" screen: height capped at 55vh, card width follows.
- Deck hover: fan spreads sideways (~1.5×, 1.85× for the card you point at), front card lifts; springy ease; hover-capable desktops only.
- `docs/preference-panel.md`: spec, setup for any project, config reference, embedded source, nine snapshots.
- `wrap-up` skill at `.claude/skills/wrap-up/SKILL.md`, modelled on Matthew's work-machine version (homes: memory / rule / reference doc / project notes / open threads / session log).

## Decided
- Scale laptops with a rem nudge rather than retuning every clamp() — one rule, everything follows, and the H1 is pinned in px so it's immune.
- Panel renders in a shadow root — the site's CSS can't touch it and it can't touch the site, so it drops into any project.
- Viewport preview is a real iframe, not a CSS zoom — media queries fire for real.
- Hover spread is mostly horizontal with damped rotation — a vertical spread pushed the back cards into the section title.
- Cloud sessions write wrap-up files into the repo's `.claude/`, since the container's `~` is thrown away.

## Learned → where it went
- Panel on every prototype, gated off on live → rule `.claude/rules/always-follow-rules.md`; spec → reference doc `docs/preference-panel.md`
- Check 13" laptop, show screenshots first → rule
- Laptop scaling approach, lively hover, WebP habits → memory (`.claude/preferences-inbox.md`)
- Panel gate/config location, laptop rem rule, `prefSerif` flag → project notes `CLAUDE.md`

## Open
- [ ] carried into `.claude/open-threads.md`

## Files touched
- `src/assets/pref-panel.js` — the panel
- `src/_includes/partials/pref-panel.njk` — gate + per-project config; included from `layouts/base.njk`
- `src/index.njk` — `--h1`/`--h2` split, laptop rem nudge, deck height cap, hover spread, `prefSerif` front matter + serif CSS hook
- `docs/preference-panel.md`, `docs/preference-panel/*.webp` — reusable doc + snaps
- `.claude/skills/wrap-up/SKILL.md`, `.claude/rules/`, `.claude/preferences-inbox.md`, `.claude/open-threads.md` — the wrap-up system
- `CLAUDE.md` — project notes
