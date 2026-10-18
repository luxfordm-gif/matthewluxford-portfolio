#!/usr/bin/env node
// Palette drift check. The palette lives once in layouts/base.njk; page CSS
// must read tokens, never repeat the values. Anything listed here appearing
// outside base.njk fails the build with file:line. Object colours (a black
// card, a white badge on a dark card) are allowed: mark the line /* fixed */.
//
//   node scripts/check-tokens.js
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const BASE = path.join(SRC, "_includes", "layouts", "base.njk");

// palette literals that have a token
const LITERALS = [
  /#fafaf7/i, /#eae6dd/i, /#9a958d/i, /#736e66/i, /#27272a/i, /#c9c4b9/i,
  /rgba\(\s*250\s*,\s*250\s*,\s*247/i, /rgba\(\s*201\s*,\s*196\s*,\s*185/i,
  /rgba\(\s*241\s*,\s*239\s*,\s*234/i, /rgba\(\s*233\s*,\s*230\s*,\s*223/i, /#f6f4ef/i, /#eeebe4/i,
  // and the dark set
  /#0f0f0e/i, /#171716/i, /#f3f1ec/i, /#d6d3cc/i, /#8d887f/i, /#a9a49a/i, /#2a2927/i,
];
// pairings that break when --ink flips: a token background with a literal text colour
const PAIRS = [/background:\s*var\(--ink\)\s*;\s*color:\s*#fff\b/i, /background:\s*var\(--paper\)\s*;\s*color:\s*#000\b/i];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.(njk|html|css)$/.test(e.name)) out.push(full);
  }
  return out;
}

const problems = [];
for (const file of walk(SRC)) {
  if (file === BASE) continue;
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/@media print/.test(line)) return; // print styles are deliberately black on white
    if (/<meta /.test(line)) return;          // theme-color is set by the head script
    if (/\/\*\s*fixed\s*\*\//.test(line)) return; // an object colour, kept in both themes on purpose
    for (const re of [...LITERALS, ...PAIRS]) {
      if (re.test(line)) { problems.push(`${path.relative(ROOT, file)}:${i + 1}  ${line.trim().slice(0, 110)}`); break; }
    }
  });
}

if (problems.length) {
  console.error("Palette values hardcoded outside layouts/base.njk — use the tokens:\n");
  for (const p of problems) console.error("  " + p);
  console.error(`\n${problems.length} problem(s).`);
  process.exit(1);
}
console.log("Palette tokens — no hardcoded values outside base.njk.");
