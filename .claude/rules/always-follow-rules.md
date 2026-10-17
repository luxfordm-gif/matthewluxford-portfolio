# Always-follow rules

Rules every build gets, no matter the project. Written by `wrap-up`; merged into `~/.claude/rules/always-follow-rules.md` on Matthew's machine.

- **Every prototype or site gets the preference panel while it's being built and reviewed.** It's the draggable pill with a Layout toggle (the project's design variants) and a Viewport toggle (Mobile, Small laptop, 15-inch, HD). Spec, setup and full source: `docs/preference-panel.md` in the matthewluxford-portfolio repo (copy it to `~/.claude/reference/preference-panel.md`). It must gate itself to localhost / deploy previews / `?panel`, so going live needs no removal step; visitors never download it.
- **Check the 13" laptop size and an ultra-wide (2560), not just phone and HD.** Design at 1920 looks big at 1280×800 (use the panel's Small laptop preset), and anything full-bleed can leave a dead gap at 2560.
- **Show screenshots of the change before asking for sign-off.** Matthew reviews visually; a description isn't enough.
