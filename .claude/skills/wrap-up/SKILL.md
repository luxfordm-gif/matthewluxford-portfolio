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

0. **Local runs only: install yourself, then sync.** If `$CLAUDE_CODE_REMOTE` is not `true`:
   - If `~/.claude/skills/wrap-up/SKILL.md` is missing or older than this file, `mkdir -p ~/.claude/skills && cp -R <repo>/.claude/skills/wrap-up ~/.claude/skills/`. That's what makes "wrap up" work in every other project; no terminal step needed from Matthew.
   - Then do step 6 (sync the repo's cloud-written files into `~/.claude`) **before** anything else, so this session's learnings land on top of the merged ones.
   - If this is a fresh session with no work to log (Matthew just opened the repo to do the sync), steps 1–5 are a no-op: skip the session log, say so in the receipt.

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

6. **Local runs only: sync from the repo.** `mkdir -p ~/.claude/rules ~/.claude/reference ~/.claude/wrap-ups/<project>` first, then:
   - `.claude/preferences-inbox.md` → merge its bullets into `~/.claude/CLAUDE.md` under `## Working preferences` (create the file and section if missing; keep the sub-heads). Dedupe against existing lines. Then reduce the inbox to its header paragraph only.
   - `.claude/rules/always-follow-rules.md` → merge into `~/.claude/rules/always-follow-rules.md`, deduped. Leave the repo copy in place (the project still wants it).
   - `.claude/open-threads.md` → merge its `## <project>` section into `~/.claude/open-threads.md`. Then reduce the repo copy to its header paragraph plus an empty `## <project>` heading.
   - `.claude/wrap-ups/*.md` → copy to `~/.claude/wrap-ups/<project>/` if not already there. Leave the repo copies.
   - `docs/preference-panel.md` (or any doc a rule points at as a reference) → copy to `~/.claude/reference/<name>.md` if missing or older.
   Commit the emptied inbox and open-threads files with a message like `Wrap-up: synced cloud notes into ~/.claude` and push; say so in the receipt.

7. **Receipt.** Three to six lines in chat, not the whole file:
   - where the session log went (full path)
   - each learning and its home, quoting new or changed lines
   - open threads still waiting on Matthew
   - in the cloud: that it's committed, and the next local wrap-up syncs it

---

### First run on a new machine

Nothing to install by hand. Open Claude Code in this repo's folder (Claude Desktop → Code, or `claude` in Terminal) and say **wrap up**. Project skills in `.claude/skills/` load automatically for this repo, so step 0 runs: the skill copies itself to `~/.claude/skills/` for every other project, and syncs the cloud-written files into `~/.claude`.
