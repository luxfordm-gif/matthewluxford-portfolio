# Portfolio — working notes for Claude

## Site map

- `index.html` — homepage (hero, work rail, about, testimonials, contact, footer)
- `cv.html` — full CV / résumé
- `jlr.html` — Jaguar Land Rover case study
- `lifecake.html` — Lifecake case study
- `collective.html` — The Collective case study
- `skatefarm.html` — The Skate Farm case study
- `reps.html` — Reps app side project case study

## Image pipeline

Whenever a new image is added to `assets/` (or a sub-folder), do all of this before wiring it into HTML — don't ask, just do it and include it in the same commit:

1. **Convert to WebP** with `cwebp -q 82` (installed at `/usr/local/bin/cwebp`).
2. **Rename** to descriptive, lowercase-kebab-case (e.g. `ChatGPT Image May 11.png` → `reps-thumb.webp`). Match the folder's naming convention.
3. **Write meaningful alt text** describing what's in the image, not the filename.
4. **Eager-load** (`loading="eager"`) when above the fold:
   - Anything inside the `index.html` hero section
   - Homepage work-card thumbnails
   - The hero/cover image on a case-study detail page
   Use `loading="lazy"` only for clearly below-the-fold decorative imagery.
5. **Delete the original PNG/JPG** once the WebP is committed — don't double-carry bytes.

Why: image weight was hurting case-study load times. Goal is fast pages and a clean `assets/` directory.

## Copy tone

The voice across the site is direct and conversational — read the Skate Farm and Reps pages for the canonical tone. Rules of thumb:

- Short sentences. Fragments are fine.
- `<strong>` for the punch words, `<em>` (rendered in Fraunces italic) for asides and rhetorical lifts.
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
7. `<footer class="foot">`

Each page has its own accent palette in `:root` (`--accent`, `--accent-2`). Otherwise the CSS is mostly identical between pages.

## Case-sensitive paths

Production is case-sensitive (Linux). macOS dev is case-insensitive, so a path that works locally may 404 live. Always lowercase folder + filenames in `assets/` and match the casing exactly in HTML refs. We've been bitten by this once (`assets/Reps/` vs `assets/reps/`).

## GA tracking

`gtag` fires a `case_study_view` event on any click of `a.proj[href]`. New work cards must be `<a>` tags (not `<div>`) and have a real `href` for the click to track. The `.is-soon` class adds a "Coming soon" badge but does not remove tracking — cards stay clickable.

## Deploys

Pushing to `main` deploys the live site (`matthewluxford.co.uk`). Treat `main` as production — no force pushes, no unreviewed risky changes. If `git push` rejects, `git pull --rebase origin main` first (the live host occasionally commits build artefacts).
