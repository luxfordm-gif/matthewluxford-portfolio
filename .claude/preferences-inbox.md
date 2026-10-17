# Preferences inbox

Written by cloud sessions, where `~/.claude` doesn't persist. The next local `wrap-up` merges these into `~/.claude/CLAUDE.md` → `## Working preferences` (deduped) and empties this file.

## Working preferences

### Workflow
- Confirm a merge actually landed on GitHub before treating it as done — twice in a row the merge button in the Claude app's PR view didn't reach GitHub. When Matthew says "merge it" and it hasn't landed, ask once and merge via the API (squash, title `… (#N)` to match the repo's history).
- Matthew is often on his phone. Never hand him terminal commands to paste; make the step a one-click task (desktop "Suggested task" card) or bake it into a skill that runs on its own.
- He reviews on his phone first. Build and screenshot phone-size (360×640 as well as 390×844) before laptop, and script the real gesture (touch swipe, tap, idle) rather than a desktop stand-in — the tap-to-close bug and the jump-on-load only showed in a scripted touch run. Serve over localhost so the real fonts load before measuring anything: layout that depends on text width (`max-content` bars) is different under a fallback font.
- When he says a motion is still wrong after a fix, ask for a screen recording straight away — one 17-second video settled what four rounds of screenshots and five simulated runs couldn't (it showed which build he was on, and a second bug the simulation had hidden).
- When he's testing a Netlify preview on his phone, give him the deploy permalink (`https://<deploy-id>--<site>.netlify.app`, id from the Netlify comment's deploy-log link), not the shared `deploy-preview-N` URL: Chrome on Android kept serving an older build from its tab cache even after "close and reopen", and he spent two rounds reporting a bug that was already fixed.
- "Smooth" is measured, not asserted: trace frame times over a scripted scroll before and after any performance change. One "improvement" (a fixed background layer) dropped frames on the snake; the trace caught it, the raster numbers hadn't.
- When a motion feels "clumpy", change the mechanism, not the easing: on phones, drive the effect from the page's own scroll (a pinned runway, like the snake) rather than scripting the page to move while a finger is swiping. Two scrolls fighting never feels right.

### Taste
- Small UI sounds, tied one-to-one to interactions (rustle, folder, lift, lens tick/shutter) — he asks for them and notices when two things share one.
- Idle "come play with me" hints on touch (a random card wiggle, the deck nudge) — but never on the element that has its own choreography (the profile card that slides).
- A marker that reads the exact value (the month/year needle) beats an implied one; a point-in-time (a holiday) must not be drawn as a span.
- Section titles share one size (`--h2`); a small section header reads as under-designed to him.

### Tooling
- From a cloud session, the egress proxy blocks the live site and `*.netlify.app`, so a deploy can't be verified by fetching it; verify locally with the built `_site/` and say the live check is Matthew's.
- Cloud phone testing that actually resembles his phone: Playwright `devices['Pixel 7']`, the site served on localhost, Chromium launched with `args: ['--proxy-server=$HTTPS_PROXY', '--proxy-bypass-list=localhost;127.0.0.1']` (Playwright's own `proxy` option forces loopback through the proxy and the page never loads), and scrolling via CDP `Input.dispatchTouchEvent` touchStart/Move/End — `synthesizeScrollGesture` doesn't move headless Chromium at all.
- To read his screen recordings in the cloud: Playwright's bundled ffmpeg is webm-only; `pip install imageio-ffmpeg` gives a full ffmpeg, then `fps=2` frames into a contact sheet.
- Lighthouse in the cloud: the public PageSpeed API quota is shared and usually spent; run `npx lighthouse http://localhost:8080/ --chrome-flags="--headless=new --no-sandbox --proxy-server=$HTTPS_PROXY"` with `CHROME_PATH=/opt/pw-browsers/chromium-*/chrome-linux/chrome` against the built `_site/`. Ignore its compression/caching rows (Netlify handles those).
- The desktop link's `spawn_task` queues a card Matthew can run on his Mac in one click; use it for anything that must happen locally (installs, `~/.claude` syncs). Write the prompt self-contained — it runs on a checkout that may be behind. A local task that can't push to `main` opens a PR on its own branch, so expect one to review.
