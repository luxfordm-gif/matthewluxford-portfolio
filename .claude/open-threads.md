# Open threads

One running list across projects. `wrap-up` updates it; local runs merge it into `~/.claude/open-threads.md`.

## matthewluxford-portfolio

- [x] First local wrap-up sync ran on the Mac (PR #73 carried the emptied files; superseded by #74). `~/.claude` now holds the skill, preferences, rules, open threads and session logs.
- [ ] **Matthew:** check the laptop type scale on the real 13" — homepage (hero H1 unchanged, section titles ~53px at 1280), the CV and a case study (title 122 → ~101px). Say if it needs another notch.
- [ ] **Matthew:** pick a serif — EB Garamond trial vs Fraunces — using the panel's Layout toggle on the homepage. Then delete the losing one and the `prefSerif` group.
- [ ] CV: Matthew wants it given "more class" but not the serif-ledger hero (tried and reverted in #71). Needs a different direction before anyone touches it again — ask first, mock before building.
- [ ] **Matthew:** holidays for the timeline — real dates/places and three photos each for Summer 2019, Summer 2024 and the March 2026 ski trip (all placeholder rows/cards now). Drop them in `src/assets/timeline/` at 320×240 WebP.
- [ ] **Matthew:** work images for the Kraken, Yoppie, The Collective and agency-years fans (text cards for now). Anything he's allowed to show.
- [ ] **Matthew:** pick the About intro layout — "Card slides from hero" (current default) vs "Card beside copy" — via the panel's Layout toggle, then delete the losing CSS and the `prefIntro` group.
- [ ] **Matthew:** timeline title — "Where I've been" shipped; alternatives floated: "The story so far", "Track record", "18 years, give or take". Say if he wants one of those.
- [ ] Sounds are tuned blind (the cloud can't play audio) — Matthew's ear is the test. He liked rustle/folder/lens as of #78; the hero `lift` is new and untested by him.
- [ ] Hero wiggle and timeline spring/ratio (`RATIO` 1.15, ~110ms spring, needle at 70%, hand-over ramp ≤40px) are feel constants; Matthew scrolled the #89 timeline on his phone and said "better", so leave them unless he asks.
- [ ] **Matthew:** `noindex,nofollow` is still on every page (`head-meta.njk`, added deliberately in 41d34cc). Google can't index the site until it comes out. Say when the site should be findable and it's a one-line removal.
- [ ] Mobile first paint is ~4.6s on Lighthouse's slow 4G: the Google Fonts stylesheet blocks render (~2.5s) and the "matthew." intro screen delays the first hero card. Both are design calls — **Matthew** to say whether to self-host/swap the fonts and shorten or skip the intro. Images, the parked video and a11y were fixed in #70 (mobile perf 60→68, a11y 91→100).
