#!/usr/bin/env node
// Checks that every CSS block wrapped in `/* @shared: NAME */ ... /* @end-shared */`
// is byte-identical across every page that declares it.
//
// Usage:
//   node scripts/check-shared-css.js          // verify; exit 1 if drift
//   node scripts/check-shared-css.js --fix    // adopt the FIRST occurrence as
//                                                canonical and rewrite the others

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const FIX = process.argv.includes("--fix");

const OPEN = /\/\*\s*@shared:\s*([\w-]+)\s*\*\//g;
const CLOSE = "/* @end-shared */";

function listHtmlFiles() {
  return fs
    .readdirSync(SRC)
    .filter((f) => f.endsWith(".html") || f.endsWith(".njk"))
    .map((f) => path.join(SRC, f));
}

function extractBlocks(file) {
  const text = fs.readFileSync(file, "utf8");
  const blocks = [];
  let m;
  OPEN.lastIndex = 0;
  while ((m = OPEN.exec(text)) !== null) {
    const name = m[1];
    const openIdx = m.index;
    const innerStart = OPEN.lastIndex;
    const closeIdx = text.indexOf(CLOSE, innerStart);
    if (closeIdx === -1) {
      throw new Error(`${file}: @shared: ${name} has no matching @end-shared`);
    }
    const inner = text.slice(innerStart, closeIdx);
    blocks.push({
      name,
      file,
      inner,
      openStart: openIdx,
      openEnd: innerStart,
      closeStart: closeIdx,
      closeEnd: closeIdx + CLOSE.length,
    });
  }
  return blocks;
}

function diffLines(a, b) {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const max = Math.max(aLines.length, bLines.length);
  const out = [];
  for (let i = 0; i < max; i++) {
    if (aLines[i] !== bLines[i]) {
      if (aLines[i] !== undefined) out.push(`- ${aLines[i]}`);
      if (bLines[i] !== undefined) out.push(`+ ${bLines[i]}`);
    }
  }
  return out.slice(0, 40).join("\n");
}

function fix(blocks) {
  // group by name; for each group, copy the first block's inner content into all others
  const groups = new Map();
  for (const b of blocks) {
    if (!groups.has(b.name)) groups.set(b.name, []);
    groups.get(b.name).push(b);
  }
  const fileEdits = new Map(); // file -> array of {start, end, text}
  for (const [name, group] of groups) {
    if (group.length < 2) continue;
    const canonical = group[0].inner;
    for (let i = 1; i < group.length; i++) {
      const b = group[i];
      if (b.inner === canonical) continue;
      if (!fileEdits.has(b.file)) fileEdits.set(b.file, []);
      fileEdits.get(b.file).push({
        start: b.openEnd,
        end: b.closeStart,
        text: canonical,
      });
    }
  }
  for (const [file, edits] of fileEdits) {
    edits.sort((a, b) => b.start - a.start); // apply back-to-front
    let text = fs.readFileSync(file, "utf8");
    for (const e of edits) text = text.slice(0, e.start) + e.text + text.slice(e.end);
    fs.writeFileSync(file, text);
    console.log(`fixed: ${path.relative(ROOT, file)}`);
  }
}

function main() {
  const files = listHtmlFiles();
  if (!files.length) {
    console.log("No .html files found in repo root.");
    process.exit(0);
  }
  const blocks = files.flatMap((f) => extractBlocks(f));
  if (!blocks.length) {
    console.log("No @shared blocks found — nothing to check.");
    process.exit(0);
  }

  if (FIX) {
    fix(blocks);
    return;
  }

  // group by name; report any drift
  const groups = new Map();
  for (const b of blocks) {
    if (!groups.has(b.name)) groups.set(b.name, []);
    groups.get(b.name).push(b);
  }

  let drifted = false;
  for (const [name, group] of groups) {
    if (group.length < 2) {
      console.log(`@shared: ${name} — single declaration in ${path.relative(ROOT, group[0].file)} (nothing to compare)`);
      continue;
    }
    const canonical = group[0];
    const others = group.slice(1).filter((b) => b.inner !== canonical.inner);
    if (others.length === 0) {
      console.log(`@shared: ${name} — OK across ${group.length} files`);
      continue;
    }
    drifted = true;
    console.error(`\n@shared: ${name} — DRIFT detected`);
    console.error(`  canonical: ${path.relative(ROOT, canonical.file)}`);
    for (const other of others) {
      console.error(`  differs:   ${path.relative(ROOT, other.file)}`);
      console.error(diffLines(canonical.inner, other.inner));
    }
  }

  if (drifted) {
    console.error("\nRun `node scripts/check-shared-css.js --fix` to copy the canonical version everywhere.");
    process.exit(1);
  }
  console.log("\nAll @shared blocks in sync.");
}

main();
