# Portfolio — working notes for Claude

## Stack & dev workflow

The site is built with [Eleventy (11ty)](https://www.11ty.dev/) — a static-site generator. Source lives in `src/`, build output in `_site/` (gitignored), and Netlify runs `npm run build` on every deploy.

```bash
npm install         # one-time setup
npm run dev         # local dev server with hot reload (eleventy --serve)
npm run build       # build to _site/
npm run check       # run the shared-CSS drift check (also runs in CI)
```

## Site map (source files)

- `src/index.njk` — homepage (hero, FYI note, photo-card intro `.hello` — the nav's About lands here, work deck, "Where I've been" timeline `.tl`, beyond, testimonials, lux-large-footer). The old About list (accordion job rows) was removed in #80: the timeline carries that now.
  - "Where I've been" `.tl`: a sideways scroller on desktop; on phones (≤760px) it pins to the screen (`.tl.is-pinned`, a tall runway with a sticky `.tl__pin`) and the page scroll travels back through the years, with the staircase rising on a smooth curve and a spring. Sideways swipes drive the same page scroll and coast on release.
- `src/cv.njk` — full CV / résumé (nav-cv variant, secret-footer)
- `src/jlr.html` — Jaguar Land Rover case study
- `src/lifecake.html` — Lifecake case study
- `src/collective.html` — The Collective case study
- `src/skatefarm.html` — The Skate Farm case study
- `src/reps.html` — Reps app side project case study

Case studies are still raw HTML — they get migrated to use layouts/partials in a follow-up PR.

## Shared partials & layout

- `src/_includes/layouts/base.njk` — doctype, `<head>`, `<body id="top">`, content slot. Used by index.njk and cv.njk.
- `src/_includes/partials/head-meta.njk` — meta tags, GA, fonts. Reads `title`, `description`, `canonical`, `ogImage`, etc. from page front-matter.
- `src/_includes/partials/nav.njk` — main nav (Resume CTA). Takes `navBrandHref` and `navLinkBase` for homepage's same-page anchors vs case studies' cross-page links.
- `src/_includes/partials/nav-cv.njk` — CV variant (close button).
- `src/_includes/partials/lux-large-footer.njk` — homepage big footer.
- `src/_includes/partials/secret-footer.njk` — the magic reveal footer (used on index + cv).
- `src/_includes/partials/terms-footer.njk` — small © + back-to-top row (used by case studies once migrated).

Pages set per-page CSS via `{% block pageStyles %}<style>...</style>{% endblock %}`. Page body lives in `{% block content %}...{% endblock %}`.

## Preference panel (review tool)

A draggable pill with Layout and Viewport toggles for reviewing pages at Mobile / Small laptop / 15-inch / HD and flicking between design variants. Full spec, setup and source: `docs/preference-panel.md`.

- Script: `src/assets/pref-panel.js`. Gate + config: `src/_includes/partials/pref-panel.njk`, included from `layouts/base.njk` so every page has it.
- Loads only on localhost / LAN / `*.netlify.app`, or on the live site after visiting with `?panel` (`?panel=off` forgets). Visitors never download it, so there's nothing to strip before going live.
- Layout groups write `data-pref-<group>` on `<html>`; add CSS against that. The homepage opts into the **Accent serif** group with `prefSerif: true` in its front matter (`html[data-pref-serif="fraunces"]` hook in `src/index.njk`). Delete the group once the serif is chosen.
- **About intro** group (`prefIntro: true`): "Card slides from hero" (default — the hero's centre profile card travels down half a screen on scroll and lands on the centred `.hello` copy) vs "Card beside copy" (the first take). Delete the group once one is picked.
- **Sections** button: every homepage section carries `data-pref-section="Label"`, so it can be switched off or dragged into a new order from the panel (saved per page, review-only). Don't delete or hide sections in the HTML to try a layout; use the panel. Tag new top-level sections the same way.
- Close with × or ⌥⇧P; same shortcut brings it back.

## Homepage sounds

All synthesised in one `sfx` helper in `src/index.njk` (Web Audio, filtered noise bursts; no files). Browsers only allow sound after a click or key press, so every call is silent until then. Four sounds, each tied to one thing — don't reuse one across sections, Matthew found that repetitive:

- `pop` — timeline fan opening (a soft, short paper puff; a longer rustle got repetitive hovering down the rows and a tonal bubble pop was "too much pop")
- `folder` — a case-study deck move (card-stock slide + tap)
- `lift` — a hero card lifting on hover / tap-to-pop (lighter, no tap)
- `pluck` / `thud` — a polaroid in the snake picked up / bumping the stage edge after a throw
- `detent` — the timeline needle: a notch per month as it passes (lower and woodier than the lens tick, throttled), a firmer double notch on a new year; silent on load/resize
- `tick` / `shutter` — the snake: a tick per word (throttled, both scroll directions), a shutter once per key phrase; silent on load/resize paints

## Scroll smoothness

Measure before and after any change meant to help it: an rAF frame-time trace over a scripted scroll (see the snake check in the wrap-up logs). `background-attachment:fixed` on `.page` is the known-good background; a fixed `::before` layer under a `clip-path` looked cheaper on a raster trace but dropped frames on the snake. The hero cards, deck, snake, profile-card slide and timeline all animate transforms only; keep it that way.

## Type scale on laptops

The site is designed at 1920. Between 761px and 1599px wide every page drops the rem base to 93.75% (`html{font-size}` in `layouts/base.njk`) so copy, gaps and paddings come in ~6% together. On the homepage section titles use `--h2`, a step below the hero's `--h1`; `--h1` is in px so the rem nudge can't touch it. The case-study title token `--fs-h1` (also in `base.njk`) has a lighter rem share so it actually comes down on laptops (~101px at 1280, 144px at 1920). Check changes at 1280×800 with the panel's Small laptop preset.

## CV layout

Leave the CV's hero (four-up proof strip) and pill section headers as they are. A serif-ledger rework was tried and reverted in PR #71 — Matthew wants it classier but not that way. Any new direction gets mocked and approved before it's built.

## Wrap-up

Say "wrap up" at the end of a session. The skill in `.claude/skills/wrap-up/` sorts learnings into memory / rules / reference docs / project notes, updates `.claude/open-threads.md` and writes a dated log to `.claude/wrap-ups/`. In the cloud those land in the repo; a local run syncs them into `~/.claude`.

**First time on a new machine, or if Matthew says "do the wrap-up sync" / "search the repo for wrap-up":** just run the `wrap-up` skill. It installs itself to `~/.claude/skills/` and pulls `.claude/preferences-inbox.md`, `.claude/rules/`, `.claude/open-threads.md`, `.claude/wrap-ups/` and `docs/preference-panel.md` into `~/.claude/`. No terminal steps, no pasting. What's been done so far is in `.claude/wrap-ups/` (one dated file per session) and what's still open is in `.claude/open-threads.md`.

## Image pipeline

Whenever a new image is added to `src/assets/` (or a sub-folder), do all of this before wiring it into HTML — don't ask, just do it and include it in the same commit:

1. **Convert to WebP** with `cwebp -q 82` (installed at `/usr/local/bin/cwebp`).
2. **Rename** to descriptive, lowercase-kebab-case (e.g. `ChatGPT Image May 11.png` → `reps-thumb.webp`). Match the folder's naming convention.
3. **Write meaningful alt text** describing what's in the image, not the filename.
4. **Eager-load** (`loading="eager"`) when above the fold:
   - Anything inside the `src/index.njk` hero section
   - Homepage work-card thumbnails
   - The hero/cover image on a case-study detail page
   Use `loading="lazy"` only for clearly below-the-fold decorative imagery.
5. **Delete the original PNG/JPG** once the WebP is committed — don't double-carry bytes.

Why: image weight was hurting case-study load times. Goal is fast pages and a clean `src/assets/` directory.

## Copy tone

The voice across the site is direct and conversational — read the Skate Farm and Reps pages for the canonical tone. Rules of thumb:

- Short sentences. Fragments are fine.
- `<strong>` for the punch words, `<em>` (rendered in Fraunces italic) for asides and rhetorical lifts.
- **Keep `<em>` out of headings, titles and leads.** Section `h2`s, the `caseTitle` and the `caseLead` stay plain Inter — no Fraunces italic. `<em>` is for emphasis *inside body copy* and the coloured hero-card title (`case_hero`) only. (All existing case studies follow this; riverfox briefly didn't.)
- Anti-corporate: no "stakeholder alignment", "leveraging synergies", or strategy-deck phrasing.
- First person, honest, slightly self-deprecating where it fits.
- Lead with the thing, not the framing. ("A PDF lands in my inbox. Then the dance begins.")

## Case-study template

All case-study pages follow the same shape — copy `skatefarm.html` or `reps.html` as the starting point. Sections, in order:

1. `<header class="case__head">` — title + lead + meta (Role / Timeline / Scope)
2. `<section class="case__hero">` — coloured/black card with a 2-up grid (headline + stats)
3. Repeated `<section class="case__body">` — `1fr 2fr` grid, h2 on the left, copy on the right
4. Optional `<section class="case__numbers">` for data-heavy pages (see Skate Farm)
5. `<section class="outcomes">` — three big numbers
6. `<section class="next">` — "Next project" CTA
7. `<footer class="terms-footer">` — small © + back-to-top row

Each page has its own accent palette in `:root` (`--accent`, `--accent-2`). Otherwise the CSS is mostly identical between pages.

## Case-sensitive paths

Production is case-sensitive (Linux). macOS dev is case-insensitive, so a path that works locally may 404 live. Always lowercase folder + filenames in `src/assets/` and match the casing exactly in HTML refs. We've been bitten by this once (`assets/Reps/` vs `assets/reps/`).

## GA tracking

`gtag` fires a `case_study_view` event on any click of `a.proj[href]`. New work cards must be `<a>` tags (not `<div>`) and have a real `href` for the click to track. The `.is-soon` class adds a "Coming soon" badge but does not remove tracking — cards stay clickable.

## Shared CSS blocks (drift guardrail)

Some CSS blocks are still duplicated across pages (e.g. `.secret-footer` lives in both `src/index.njk` and `src/cv.njk` — the partial only covers HTML markup, not the styles). To keep them in sync, wrap each shared block with sentinel comments:

```css
/* @shared: <name> */
.thing { ... }
/* @end-shared */
```

A CI check (`.github/workflows/check-shared-css.yml`) runs `node scripts/check-shared-css.js` on every PR. If any two `@shared: <name>` blocks differ — even by one byte — the check fails with a diff and blocks merge.

To resync after deliberately changing one copy:

```bash
npm run check                              # report drift
node scripts/check-shared-css.js --fix     # copy the first (alphabetical) file's version everywhere
```

Currently wrapped:
- `secret-footer` — in `src/index.njk`, `src/cv.njk`, `src/_includes/layouts/case.njk` (the case-study layout)
- `terms-footer` — in `src/_includes/layouts/case.njk` (single copy now the case studies share one layout)

The check walks `src/` recursively, so blocks inside `_includes/` (layouts, partials) are covered too — not just the page files in `src/` root. Extend by wrapping more blocks the same way; the script auto-picks them up.

## Deploys

Pushing to `main` deploys the live site (`matthewluxford.co.uk`). Treat `main` as production — no force pushes, no unreviewed risky changes. Netlify runs `npm run build` on every push and publishes `_site/`. If `git push` rejects, `git pull --rebase origin main` first.
