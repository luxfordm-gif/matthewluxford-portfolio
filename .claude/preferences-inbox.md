# Preferences inbox

Written by cloud sessions, where `~/.claude` doesn't persist. The next local `wrap-up` merges these into `~/.claude/CLAUDE.md` → `## Working preferences` (deduped) and empties this file.

## Working preferences

### Design
- Design for 1920 HD as the default, but scale everything down on 13–15" laptops: a smaller rem base (~94%) in the shared layout plus section titles a step below the hero H1. The hero H1 stays as is. (Portfolio, 2026-10-16.)
- Watch for vw-dominated clamp() sizes: a rem nudge barely moves them. Retune the clamp's rem/vw split so the laptop size actually drops while the HD cap holds.
- Cards and stacks should feel alive on hover: a springy spread or lift, not just a shadow change. Spread sideways, not up, so it never collides with the heading above.
- The "AI template" tells Matthew dislikes: rows of bold sans stat tiles, black pill section chips, generic hero + four KPIs. But a serif-numeral ledger wasn't the fix for the CV either — for a redesign brief like "give it more class", show a mock and get a yes before building.
- Keep `<em>` / the italic serif out of headings and leads; emphasis lives inside body copy.

### Workflow
- Build review tooling (preference panel, variant toggles) into every prototype; it gates itself off on live so there's no removal step.
- Take snapshots at phone / small laptop / 15-inch / HD and show them before asking for sign-off. Before/after pairs for anything visual.
- One PR per working session is fine; Matthew merges himself (main is production). Confirm the merge actually landed on GitHub before treating it as done — twice in a row the merge button in the Claude app's PR view didn't reach GitHub. When he says "merge it" and it hasn't landed, ask once and merge via the API (squash, title `… (#N)` to match the repo's history).
- Matthew is often on his phone. Never hand him terminal commands to paste; make the step a one-click task (desktop "Suggested task" card) or bake it into a skill that runs on its own.
- End sessions with `wrap-up`. Learnings go to the right home (memory / rule / reference doc / project notes); open threads to one running file.

### Tooling
- Images: convert to WebP (`cwebp -q 82` where available, Pillow otherwise), lowercase-kebab filenames, delete originals.
- Skills Matthew uses on his work machine and wants on his personal one: `wrap-up` (this repo's `.claude/skills/wrap-up`), a prototype-dock / preference-panel pattern.
- The GitHub MCP tool wraps raw URLs in a PR body in escalating backticks, so image embeds in PR descriptions break; reference snapshots by repo path instead.
- From a cloud session, the egress proxy blocks the live site and `*.netlify.app`, so a deploy can't be verified by fetching it; verify locally with the built `_site/` and say the live check is Matthew's.
- The desktop link's `spawn_task` queues a card Matthew can run on his Mac in one click; use it for anything that must happen locally (installs, `~/.claude` syncs). Write the prompt self-contained — it runs on a checkout that may be behind.
