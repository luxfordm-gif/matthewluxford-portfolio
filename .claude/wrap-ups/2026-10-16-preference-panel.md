# matthewluxford-portfolio — preference panel, laptop type scale, deck hover, wrap-up skill
2026-10-16 · branch `claude/responsive-breakpoints-panel-xt49vs` · PR https://github.com/luxfordm-gif/matthewluxford-portfolio/pull/71 (open at wrap-up time; CI green on `2099caf`)

## Done
- Draggable, closable preference panel (`src/assets/pref-panel.js`) with Layout and Viewport toggles. Loads on localhost / LAN / Netlify previews / `?panel` only; never for visitors.
- Viewport presets: Mobile 390×844, Small laptop 1280×800, 15-inch 1440×900, HD 1920×1080. Same-origin iframe, scaled to fit, keeps scroll position.
- Layout group on the homepage: Accent serif (EB Garamond trial vs Fraunces).
- Laptop type scale on every page: rem base 93.75% between 761 and 1599px in `layouts/base.njk`. Homepage section titles on their own `--h2` a step below the hero `--h1` (pinned in px). Case-study title token `--fs-h1` retuned so it actually drops (122 → 101px at 1280; 144px at 1920 unchanged). Body 16.8 → 15.75px.
- Deck fits a 13" screen: height capped at 55vh.
- Deck hover: fan spreads sideways (~1.5×, 1.85× for the card you point at), front card lifts, springy ease; hover-capable desktops only.
- `docs/preference-panel.md`: spec, setup for any project, config reference, embedded source, nine snapshots.
- `wrap-up` skill at `.claude/skills/wrap-up/SKILL.md`, modelled on Matthew's work-machine version. `.claude/` now tracked (bar `settings.local.json`).
- CV hero rework (serif ledger + running heads) built, shown, **reverted** at Matthew's call. CV is byte-identical to `main`.

## Decided
- Scale laptops with a rem nudge in the shared layout rather than retuning every clamp() — one rule, every page follows; the H1 is pinned in px so it's immune.
- Panel renders in a shadow root, so it drops into any project without CSS fights.
- Viewport preview is a real iframe, not a CSS zoom — media queries fire for real.
- Hover spread is mostly horizontal with damped rotation — a vertical spread pushed back cards into the section title.
- CV stays as the four-up proof strip and pill headers. Matthew wants more class but not that direction; next attempt is mock-first.
- Cloud sessions write wrap-up files into the repo's `.claude/`, since the container's `~` is thrown away.

## Learned → where it went
- Panel on every prototype, gated off on live → rule `.claude/rules/always-follow-rules.md`; spec → reference doc `docs/preference-panel.md`
- Check 13" laptops, show screenshots first → rule
- Laptop scaling approach, vw-dominated clamp gotcha, lively hover, CV redesign taste, merge-confirmation habit, PR-body URL gotcha → memory (`.claude/preferences-inbox.md`)
- Panel gate/config location, laptop rem rule, `prefSerif` flag, CV left alone → project notes `CLAUDE.md`

## Open
- [ ] carried into `.claude/open-threads.md` — merge #71, install the skill on the Mac, check 13" on all page types, pick the serif, CV direction

## Files touched
- `src/assets/pref-panel.js` — the panel
- `src/_includes/partials/pref-panel.njk` — gate + per-project config; included from `layouts/base.njk`
- `src/_includes/layouts/base.njk` — laptop rem nudge, `--fs-h1` retune, panel include
- `src/index.njk` — `--h1`/`--h2` split, deck height cap, hover spread, `prefSerif` front matter + serif CSS hook
- `docs/preference-panel.md`, `docs/preference-panel/*.webp` — reusable doc + snaps
- `.claude/skills/wrap-up/SKILL.md`, `.claude/rules/`, `.claude/preferences-inbox.md`, `.claude/open-threads.md` — the wrap-up system
- `.gitignore` — `.claude/` tracked bar local settings
- `CLAUDE.md` — project notes
