# Always-follow rules

Rules every build gets, no matter the project. Written by `wrap-up`; merged into `~/.claude/rules/always-follow-rules.md` on Matthew's machine.

- **Every prototype or site gets the preference panel while it's being built and reviewed.** It's the draggable pill with a Layout toggle (the project's design variants) and a Viewport toggle (Mobile, Small laptop, 15-inch, HD). Spec, setup and full source: `docs/preference-panel.md` in the matthewluxford-portfolio repo (copy it to `~/.claude/reference/preference-panel.md`). It must gate itself to localhost / deploy previews / `?panel`, so going live needs no removal step; visitors never download it.
- **Check the 13" laptop size and an ultra-wide (2560), not just phone and HD.** Design at 1920 looks big at 1280×800 (use the panel's Small laptop preset), and anything full-bleed can leave a dead gap at 2560.
- **Show screenshots of the change before asking for sign-off.** Matthew reviews visually; a description isn't enough.
- **Keep personal details out of screenshots and frames.** Check every capture for his email, phone, account names or other people's data before it goes on a page; leave that screen out rather than blur it.
- **Tokenise the palette once, in the base layout, on day one, with a drift check.** Colours (bg, paper, ink, muted, line, dots, glow) live in one `:root` block with a `[data-theme="dark"]` set beside it; page CSS only reads tokens; a script fails the build on any palette literal outside that block (`scripts/check-tokens.js` in matthewluxford-portfolio is the model). Same for spacing and type scale. A themeable site is cheap when this exists and a tokenising pass when it doesn't. When a foundation like this is skipped, say so at the time, not when it bites.
