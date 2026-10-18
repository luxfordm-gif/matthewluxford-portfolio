# matthewluxford-portfolio — Palette tokenised, dark theme, morphing toggle, Reps trims
2026-10-18 (afternoon) · branch `ccr-36b9171c-p1b0p0` · PRs #93 https://github.com/luxfordm-gif/matthewluxford-portfolio/pull/93 · #94 · #95 · #96 · #97 https://github.com/luxfordm-gif/matthewluxford-portfolio/pull/97

## Done
- Palette defined once in `layouts/base.njk` with the dark set beside it; the three per-page copies removed and the hardcoded chrome (nav glass, dot grids, hero glow, phone menu, timeline bars, CV fade, four ink/white pairs) moved to tokens. `scripts/check-tokens.js` fails the build on drift, in `npm run check` and CI. #97
- Dark theme on the homepage, case studies and CV; `work-with-me` opts out. Set before paint from the saved choice or the system; the theme-color meta follows. #97
- Theme toggle: one SVG that morphs sun → half moon → moon (masked bite + folding rays), ringed in the desktop and CV navs, a "Dark theme / Light theme" row in the phone menu. #97
- Phone menu links down to 1.3rem/500. #97
- Reps: beta-form site shot removed, "See it here" link, 10 beta testers in So far, reels pre-load their slides on reveal (the body weight screen looked blank on 4G), feature bullets and the duplicate "I built it." heading gone, phone reels smaller with more air. #94 #95 #96
- "What I do": branding row removed; he doesn't do logos or identity. #93
- All merged to main on his "Merge" / "Ship it".

## Decided
- Tokens before the theme — he asked why the palette wasn't tokenised from day one; answered straight (declared per page, chrome hardcoded, no rule or check) and made it a rule.
- Object colours stay fixed in both themes (hero cards, deck cards, black case card, phone frames, secret footer), marked `/* fixed */` for the check.
- The toggle leaves the phone bar (too busy) and lives in the menu as a labelled row.
- Reels pre-load on reveal rather than lazy per slide: a sideways scroller's lazy images only start on the swipe that reveals them.

## Learned → where it went
- Tokenise the palette once with a check; say so when a foundation is skipped → always-follow rule + memory (Workflow)
- No branding in skills or positioning; quiet phone menus; dark theme + morphing toggle expected → memory (Taste)
- His phone review loop: small asks, one PR each, "Merge" → memory (Workflow)
- Token names, dark values, `/* fixed */`, `noTheme`, theme-icon partial, nav-menu shared block in three files → project notes `CLAUDE.md`

## Open
- [ ] carried into `.claude/open-threads.md` — dark check on the deck/testimonials/footer, the morph mid-frame live, work-with-me's palette, plus the morning's items (site shots with real fonts, clip autoplay, heading wording, What I do order/copy, other case studies' cards, unused Reps files)

## Files touched
- `src/_includes/layouts/base.njk` — palette + dark tokens, pre-paint theme script
- `scripts/check-tokens.js`, `package.json`, `.github/workflows/check-shared-css.yml` — palette drift check
- `src/_includes/partials/nav.njk`, `nav-cv.njk`, `theme-icon.njk` — toggle markup, morphing icon, JS
- `src/index.njk`, `src/_includes/layouts/case.njk`, `src/cv.njk` — tokens in place of literals; shared nav-menu block (toggle + quieter menu); `work-with-me.njk` opts out
- `src/reps.njk`, `src/assets/reps/` — trims, link, beta figure, `site-beta.webp` deleted
- `CLAUDE.md`, `.claude/rules/always-follow-rules.md`, `.claude/preferences-inbox.md`, `.claude/open-threads.md` — notes
