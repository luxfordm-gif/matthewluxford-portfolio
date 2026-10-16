# Preferences inbox

Written by cloud sessions, where `~/.claude` doesn't persist. The next local `wrap-up` merges these into `~/.claude/CLAUDE.md` → `## Working preferences` (deduped) and empties this file.

## Working preferences

### Design
- Design for 1920 HD as the default, but scale sections down on 13–15" laptops: a smaller rem base (~94%) plus section titles a step below the hero H1. The hero H1 stays as is. (Portfolio, 2026-10-16.)
- Cards and stacks should feel alive on hover: a springy spread or lift, not just a shadow change.
- Keep `<em>` / the italic serif out of headings and leads; emphasis lives inside body copy.

### Workflow
- Build review tooling (preference panel, variant toggles) into every prototype; it gates itself off on live so there's no removal step.
- Take snapshots at phone / small laptop / 15-inch / HD and show them before asking for sign-off.
- End sessions with `wrap-up`. Learnings go to the right home (memory / rule / reference doc / project notes); open threads to one running file.

### Tooling
- Images: convert to WebP (`cwebp -q 82` where available, Pillow otherwise), lowercase-kebab filenames, delete originals.
- Skills Matthew uses on his work machine and wants on his personal one: `wrap-up` (this repo's `.claude/skills/wrap-up`), a prototype-dock / preference-panel pattern.
