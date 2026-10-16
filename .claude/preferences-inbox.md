# Preferences inbox

Written by cloud sessions, where `~/.claude` doesn't persist. The next local `wrap-up` merges these into `~/.claude/CLAUDE.md` → `## Working preferences` (deduped) and empties this file.

## Working preferences

### Workflow
- Confirm a merge actually landed on GitHub before treating it as done — twice in a row the merge button in the Claude app's PR view didn't reach GitHub. When Matthew says "merge it" and it hasn't landed, ask once and merge via the API (squash, title `… (#N)` to match the repo's history).
- Matthew is often on his phone. Never hand him terminal commands to paste; make the step a one-click task (desktop "Suggested task" card) or bake it into a skill that runs on its own.

### Tooling
- From a cloud session, the egress proxy blocks the live site and `*.netlify.app`, so a deploy can't be verified by fetching it; verify locally with the built `_site/` and say the live check is Matthew's.
- The desktop link's `spawn_task` queues a card Matthew can run on his Mac in one click; use it for anything that must happen locally (installs, `~/.claude` syncs). Write the prompt self-contained — it runs on a checkout that may be behind. A local task that can't push to `main` opens a PR on its own branch, so expect one to review.
