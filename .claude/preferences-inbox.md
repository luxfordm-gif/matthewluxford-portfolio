# Preferences inbox

Written by cloud sessions, where `~/.claude` doesn't persist. The next local `wrap-up` merges these into `~/.claude/CLAUDE.md` → `## Working preferences` (deduped) and empties this file.

## Taste
- Reads glassy bordered stat cards, pill-and-arrow flow strips and boxed big-number cards as "AI generated layouts". Prefer plain type between hairlines (numbered rows, ruled facts, big figures on rules). Boxes, pills and glass only when they earn it.
- Case-study references he rates: kester.work/work/streaks (short copy, phone reels with a caption per screen and rules between slides, one plain "Next project" at the end) and princepal.in (numbered "What I do, specifically." rows, typography, warm colour). Use them as the bar for editorial pages.
- Frames phones as a Google Pixel (he's a Pixel user), not an iPhone, and wants every screen shown in full: tab bars, Save buttons and the bottom rows must not be cropped.
- Nav: the primary button is "Contact" and jumps to the footer's contact details; the CV lives in the links or the phone menu, never as the main button.
- He doesn't do branding: no logos, identity or brand-book rows in any skills list or positioning copy.
- Phone menus: quiet type (1.3rem, medium), not display-size links. Dark theme is expected on a site, with a sun/moon toggle that morphs rather than swaps, ringed on desktop and a labelled row in the phone menu.

## Workflow
- Ask for real material rather than mocking it: when a site or app is unreachable from the cloud, he sends Pixel screenshots and a screen recording within minutes. Never stand in with mocked backend data on a case study.
- Keep his email and other personal details out of screenshots and frames (the Reps Profile screen showed his address, so it was left out).
- Wants foundations (tokens, shared components, checks) laid before features, and to be told at the time if one is being skipped. When he finds one missing he asks why; answer straight (#97: the palette was declared per page and some chrome hardcoded until the dark theme needed it).
- Review loop on his phone: he screenshots the live preview and sends two or three small asks at a time; each gets its own small PR, he says "Merge" and it ships. Keep PRs that granular.

## Tooling
- Cloud network only reaches GitHub and the package registries: Supabase, Fontshare, html2png.dev and his live sites are all denied. Public repos clone read-only through the proxy (`GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1`). A landing page can be served locally and shot with Playwright, with Google Fonts or system Inter standing in for Fontshare type (retake locally for the real fonts).
- Headless Chromium in the cloud has no H.264: verify `<video>` behaviour with a short VP9 file, then ship the mp4.
- Pixel screenshots are 1080×2404: crop y 162–2284 to drop Android's status and nav bars. Pillow for crops and WebP, ffmpeg for frames (`-ss <t> -frames:v 1`) and for cutting a walkthrough (`select=between(t,a,b)+…,setpts=N/30/TB`, crop, scale 540 wide, libx264 crf 27 → ~0.7 MB for 38s).
