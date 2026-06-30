#!/usr/bin/env node
/*
 * Attendee Engagement — WCAG 2.1 AA accessibility gate.
 *
 * A zero-dependency audit that runs in plain Node (no test runner, no browser).
 * It is deliberately SEPARATE from the UI: the prototype's interactive sizing and
 * colour usages are declared once, here, and checked against WCAG thresholds so a
 * regression fails loudly (non-zero exit) before it ships.
 *
 *   node src/features/attendee-engagement/a11y/gate.mjs
 *   node src/features/attendee-engagement/a11y/gate.mjs --json
 *
 * Three categories:
 *   contrast    1.4.3 (text 4.5:1, large text 3:1) + 1.4.11 (UI/icon 3:1)
 *   target      2.5.5 touch target ≥ 44×44  (2.5.8 hard floor is 24; we hold 44)
 *   legibility  project rule layered on WCAG — body text ≥ 15px, secondary ≥ 13px
 *
 * COLOURS are resolved live from engagement.module.css, so the gate always measures
 * the real tokens. SIZES are declared in the SPEC below — when you resize a control
 * or add an interactive element, update its entry here (cite the component:line) and
 * the gate keeps protecting it. Run it after any change to the feature's UI.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const FEATURE = join(HERE, "..");

// ── WCAG colour maths ────────────────────────────────────────────────────────
const srgbToLin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const relLuminance = (hex) => {
  const h = hex.replace("#", "");
  const n =
    h.length === 3
      ? h
          .split("")
          .map((x) => x + x)
          .join("")
      : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
};
const contrast = (a, b) => {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};

// ── Resolve design tokens from the feature's own stylesheet ───────────────────
const css = readFileSync(join(FEATURE, "engagement.module.css"), "utf8");
const TOKENS = {};
for (const m of css.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
  TOKENS[m[1]] = m[2];
}
/** Accepts "#hex", "var(--token)", or "--token" → resolved hex. */
const hex = (c) => {
  if (c.startsWith("#")) return c;
  const name = c.startsWith("var(") ? c.slice(4, -1).trim() : c;
  const v = TOKENS[name];
  if (!v) throw new Error(`Unknown colour token: ${c}`);
  return v;
};

// WCAG 1.4.3: large text = ≥ 24px, or ≥ 18.66px (14pt) bold.
const isLargeText = (px, bold) => px >= 24 || (bold && px >= 18.66);

// ── THE SPEC ─────────────────────────────────────────────────────────────────
// Every contrast-bearing pair and every interactive control in the feature.
// `kind: "ui"` → non-text (icon / graphic) at the 3:1 bar; otherwise text.

const CONTRAST = [
  // — text —
  { label: "transcript body on white", fg: "--fg-1", bg: "#ffffff", px: 14.5 },
  { label: "transcript body on saved tint", fg: "--fg-1", bg: "--primary-blue-25", px: 14.5 },
  { label: "speaker name", fg: "--fg-1", bg: "#ffffff", px: 13 },
  { label: 'caret ">>" on app bg', fg: "--fg-3", bg: "--primary-blue-25", px: 14, bold: true },
  { label: '"My Highlights" title', fg: "--fg-1", bg: "#ffffff", px: 13, bold: true },
  { label: "count badge text", fg: "#ffffff", bg: "--primary-blue-400", px: 10.5, bold: true },
  { label: "highlight card text", fg: "--fg-1", bg: "#ffffff", px: 12.5 },
  { label: "empty-state hint", fg: "--fg-4", bg: "#ffffff", px: 12 },
  { label: "coach card subtext", fg: "--fg-3", bg: "--primary-blue-25", px: 11.5 },
  { label: "coach B2 pill text", fg: "#ffffff", bg: "--primary-blue-500", px: 12.5, bold: true },
  { label: "coach B4 banner text", fg: "--fg-2", bg: "#ffffff", px: 12, bold: true },
  // — non-text / icons (1.4.11, 3:1) —
  { label: "reaction 👍 icon", fg: "--accent-green-700", bg: "#ffffff", kind: "ui" },
  { label: "reaction 👎 icon", fg: "--rare-orange-600", bg: "#ffffff", kind: "ui" },
  { label: "reaction 💡 icon", fg: "--primary-blue-500", bg: "#ffffff", kind: "ui" },
  { label: "reaction ❓ icon", fg: "--primary-blue-700", bg: "#ffffff", kind: "ui" },
  { label: "reaction 📌 icon", fg: "--primary-blue-600", bg: "#ffffff", kind: "ui" },
  { label: "bookmark header icon", fg: "--primary-blue-400", bg: "#ffffff", kind: "ui" },
  { label: "remove (✕) icon", fg: "--fg-4", bg: "#ffffff", kind: "ui" },
];

const TARGET_MIN = 44;
const TARGETS = [
  { label: "reaction rail button", px: 30, ref: "TranscriptBubble.tsx rail" },
  { label: "highlights reaction button", px: 32, ref: "HighlightsList.tsx" },
  { label: "corner reaction chip", px: 24, ref: "TranscriptBubble.tsx chip hit-area" },
  { label: "highlight remove button", px: 22, ref: "HighlightsList.tsx remove hit-area" },
  { label: "coach B2 dismiss", px: 22, ref: "Coach.tsx dismiss hit-area" },
];

const BODY_MIN = 15;
const SECONDARY_MIN = 13;
const LEGIBILITY = [
  { label: "transcript body (desktop)", px: 14.5, min: BODY_MIN },
  { label: "transcript body (phone)", px: 13.5, min: BODY_MIN },
  { label: "highlight card text", px: 12.5, min: SECONDARY_MIN },
  { label: "speaker name", px: 13, min: SECONDARY_MIN },
  { label: "empty-state hint", px: 12, min: SECONDARY_MIN },
  { label: "coach card subtext", px: 11.5, min: SECONDARY_MIN },
];

// ── Run ──────────────────────────────────────────────────────────────────────
const rows = [];
const fail = (cat, label, got, need, detail) =>
  rows.push({ cat, ok: false, label, got, need, detail });
const pass = (cat, label, got, need, detail) =>
  rows.push({ cat, ok: true, label, got, need, detail });

for (const c of CONTRAST) {
  const ratio = contrast(hex(c.fg), hex(c.bg));
  const need = c.kind === "ui" ? 3.0 : isLargeText(c.px, c.bold) ? 3.0 : 4.5;
  const got = `${ratio.toFixed(2)}:1`;
  const detail = `${c.fg} on ${c.bg}`;
  (ratio >= need ? pass : fail)("contrast", c.label, got, `${need}:1`, detail);
}
for (const t of TARGETS) {
  (t.px >= TARGET_MIN ? pass : fail)(
    "target",
    t.label,
    `${t.px}px`,
    `${TARGET_MIN}px`,
    t.ref
  );
}
for (const l of LEGIBILITY) {
  (l.px >= l.min ? pass : fail)(
    "legibility",
    l.label,
    `${l.px}px`,
    `${l.min}px`,
    ""
  );
}

const failures = rows.filter((r) => !r.ok);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ pass: failures.length === 0, rows }, null, 2));
  process.exit(failures.length ? 1 : 0);
}

const C = { red: "\x1b[31m", green: "\x1b[32m", dim: "\x1b[2m", reset: "\x1b[0m", bold: "\x1b[1m" };
const pad = (s, n) => String(s).padEnd(n);
console.log(`\n${C.bold}Attendee Engagement · WCAG 2.1 AA gate${C.reset}\n`);
for (const r of rows) {
  const mark = r.ok ? `${C.green}✓${C.reset}` : `${C.red}✗${C.reset}`;
  const got = r.ok ? `${C.dim}${r.got}${C.reset}` : `${C.red}${r.got}${C.reset}`;
  const need = r.ok ? "" : `${C.dim}(need ${r.need})${C.reset}`;
  console.log(
    `  ${mark} ${pad(r.cat, 11)} ${pad(r.label, 30)} ${pad(got, 22)} ${need}`
  );
}
const n = failures.length;
console.log(
  `\n${n ? C.red + C.bold : C.green + C.bold}${n ? `FAIL — ${n} violation${n > 1 ? "s" : ""}` : "PASS"}${C.reset}\n`
);
process.exit(n ? 1 : 0);
