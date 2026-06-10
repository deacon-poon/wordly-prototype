#!/usr/bin/env node
/**
 * validate-features.js — enforce that every prototype is built in React.
 *
 * Each feature module's entry (`src/features/<id>/index.tsx`) MUST be a React
 * component: the catch-all route (`/lab/[feature]`) imports its default export
 * and renders it. A raw HTML document pasted into index.tsx has no export and
 * won't compile — it breaks the build (and deploy) for everyone. This script
 * catches that before it can land.
 *
 * Runs in two modes:
 *   node scripts/validate-features.js          → build/CI gate (exit 1 on error)
 *   node scripts/validate-features.js --hook    → Claude Code PostToolUse hook
 *                                                 (exit 2 so feedback reaches the agent)
 *
 * Hard errors (block):
 *   - file begins with <!DOCTYPE …> or <html …>  → raw HTML, not React
 *   - no default export                          → route can't render it
 * Warning (nudge, non-blocking):
 *   - missing "use client" directive             → contract expects it
 */
const fs = require("fs");
const path = require("path");

const HOOK_MODE = process.argv.includes("--hook");
const FEATURES_DIR = path.join(__dirname, "..", "src", "features");
const ENTRY_NAMES = ["index.tsx", "index.ts", "index.jsx", "index.js"];

const errors = [];
const warnings = [];

function featureEntry(dir) {
  for (const name of ENTRY_NAMES) {
    const p = path.join(dir, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

if (fs.existsSync(FEATURES_DIR)) {
  for (const id of fs.readdirSync(FEATURES_DIR)) {
    if (id.startsWith("_") || id.startsWith(".")) continue; // skip _template etc.
    const dir = path.join(FEATURES_DIR, id);
    if (!fs.statSync(dir).isDirectory()) continue;

    const entry = featureEntry(dir);
    const rel = entry
      ? path.relative(path.join(__dirname, ".."), entry)
      : `src/features/${id}/index.tsx`;

    if (!entry) {
      errors.push(`${rel} — feature has no index.tsx entry component.`);
      continue;
    }

    const raw = fs.readFileSync(entry, "utf8");
    const head = raw.replace(/^﻿/, "").trimStart().toLowerCase();

    if (head.startsWith("<!doctype") || head.startsWith("<html")) {
      errors.push(
        `${rel} — looks like a raw HTML document, not a React component.`
      );
      continue; // the HTML check subsumes the rest
    }

    const hasDefaultExport =
      /export\s+default\b/.test(raw) || /export\s*\{[^}]*\bdefault\b/.test(raw);
    if (!hasDefaultExport) {
      errors.push(
        `${rel} — no default export. The route renders the file's default export, so it must \`export default\` a React component.`
      );
    }

    if (!/^\s*["']use client["']/m.test(raw)) {
      warnings.push(
        `${rel} — missing the "use client" directive (the feature contract expects it at the top).`
      );
    }
  }
}

for (const w of warnings) console.warn(`  ⚠️  ${w}`);

if (errors.length === 0) {
  if (!HOOK_MODE) console.log("✓ feature modules are valid React components");
  process.exit(0);
}

const lines = [
  "",
  "✖ Feature module check failed — prototypes must be built in React:",
  ...errors.map((e) => `   • ${e}`),
  "",
  '  A feature\'s index.tsx must be a React module: `"use client"` at the top',
  "  and `export default function ...` returning JSX.",
  "",
  '  Have an HTML sketch? Ask Claude: "convert my HTML prototype to React"',
  "  (or keep a throwaway HTML prototype in apps/* instead of src/features/).",
  "",
];
console.error(lines.join("\n"));

// PostToolUse: exit 2 surfaces stderr back to the agent as actionable feedback.
process.exit(HOOK_MODE ? 2 : 1);
