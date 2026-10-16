---
name: wrap-up
description: End-of-session handover. Sorts everything learned in this session into the right home (reference doc, always-follow rule or memory), updates the open-threads handover, and shows Matthew a short receipt. Use when Matthew says "wrap up", "/wrap-up", "save what we learned", "handover", "end of session", "I'm done for today", or accepts the offer to wrap up after a substantial piece of work. Prefer this over ad-hoc memory writes at the end of a session, because it checks for an existing home before adding anything and keeps memory from bloating.
---

# Wrap-up

Matthew builds across several projects with Claude. Every session should leave its learnings somewhere the next session reads, in the right home, deduped, so nothing gets re-explained and memory doesn't bloat.

## The homes

| Home | What belongs there | Path |
| --- | --- | --- |
| **Memory** | Durable, cross-project facts about *Matthew*: taste, tone, workflow habits, tooling. True next month, true in any repo. | `~/.claude/CLAUDE.md` → `## Working preferences` (loaded in every project) |
| **Always-follow rule** | Something every project must do, stated as a rule, not a preference. | `~/.claude/rules/always-follow-rules.md` (global) or `<repo>/.claude/rules/always-follow-rules.md` (this project) |
| **Reference doc** | A reusable thing with a spec and setup steps: a component, a tool, a pattern. | `~/.claude/reference/<name>.md` (global) or `<repo>/docs/<name>.md` (this project). Rules and memory *point to* reference docs; they never duplicate them. |
| **Project notes** | Conventions and decisions about *this* codebase. | `<repo>/CLAUDE.md` |
| **Open threads** | What's unfinished, waiting on Matthew, or parked. One running file, not one per session. | `~/.claude/open-threads.md` (global, grouped by project) |
| **Session log** | What this chat did. | `~/.claude/wrap-ups/<project>/<YYYY-MM-DD>-<slug>.md` |

`<project>` is the repo folder name. `<slug>` is 2–4 kebab-case words for the main thing done. Add `-2` if the file exists.

## Cloud sessions

Run `echo "$CLAUDE_CODE_REMOTE"`. If it prints `true`, `~` is a throwaway container, so every `~/.claude/...` path above becomes `<repo>/.claude/...` instead (`.claude/wrap-ups/`, `.claude/open-threads.md`, `.claude/preferences-inbox.md` in place of the global `CLAUDE.md`, `.claude/rules/`). Commit them with the session's work and say so in the receipt. The next **local** wrap-up in that repo merges them into `~/.claude` and clears the inbox.

## Steps

1. **Gather.** Re-read the conversation from the top; don't trust memory of the start. `git log --oneline` for this session's commits, `git status` for anything uncommitted. Note PR, deploy and artifact links.

2. **Sort each learning into one home.** For every thing learned, ask in order:
   - Is it a reusable thing with a spec? → reference doc (write or update it), then a one-line pointer from a rule or memory if it should be used again.
   - Must every project do it? → always-follow rule.
   - Is it about how Matthew works, in any project? → memory.
   - Is it about this codebase only? → project notes.
   - Is it unfinished? → open threads.
   - Otherwise it's just session log.

3. **Check for an existing home before adding.** Grep the target file for the topic. If a line already covers it, edit that line. If Matthew changed his mind, replace the old line. Never append a second, conflicting bullet. One bullet per item, imperative, about one line, with a short "why" when it isn't obvious.

4. **Update open threads.** Under a `## <project>` heading: add new open items as `- [ ]`, tick or delete ones this session closed, keep the ones still waiting on Matthew. Each item says what's needed and from whom.

5. **Write the session log** from this template:

   ```markdown
   # <Project> — <what got done, in a few words>
   <YYYY-MM-DD> · branch `<branch>` · PR <link or "none">

   ## Done
   - <outcome, not activity>

   ## Decided
   - <decision> — <the reason>

   ## Learned → where it went
   - <item> → memory / rule / reference doc `<path>` / project notes

   ## Open
   - [ ] <carried into open-threads.md>

   ## Files touched
   - `path` — <why>
   ```

   No secrets, tokens, client-confidential or NDA detail. In the cloud this lands in git.

6. **Local runs only: sync from the repo.** If the repo has `.claude/preferences-inbox.md`, `.claude/open-threads.md`, `.claude/rules/` or `.claude/wrap-ups/` written by a cloud session, merge them into the global homes (deduped), copy wrap-up files to `~/.claude/wrap-ups/<project>/`, then empty the inbox and open-threads files in the repo and mention they need committing.

7. **Receipt.** Three to six lines in chat, not the whole file:
   - where the session log went (full path)
   - each learning and its home, quoting new or changed lines
   - open threads still waiting on Matthew
   - in the cloud: that it's committed, and the next local wrap-up syncs it

---

### Installing on a new machine (one-off)

The skill lives in this repo, so it only loads here. To have it in every project on this computer:

```bash
mkdir -p ~/.claude/skills ~/.claude/rules ~/.claude/reference ~/.claude/wrap-ups
cp -R .claude/skills/wrap-up ~/.claude/skills/
```

Then run `wrap-up` once in this repo so the cloud-written files sync into `~/.claude`.
