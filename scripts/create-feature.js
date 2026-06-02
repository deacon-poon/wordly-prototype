#!/usr/bin/env node
/**
 * create-feature — scaffold a new in-app prototype feature.
 * Usage: npm run create-feature <name> [github-owner]
 *        npm run create-feature attend-flow justincepelak
 *
 * Copies src/features/_template → src/features/<name>, fills in id/title/owner,
 * and regenerates the feature registry so it appears in the sidebar at /lab/<name>.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const name = process.argv[2];
const owner = process.argv[3] || "";

if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error("Usage: npm run create-feature <name> [github-owner]");
  console.error("  <name> must be kebab-case, e.g. attend-flow");
  process.exit(1);
}

const templateDir = path.join(__dirname, "../src/features/_template");
const targetDir = path.join(__dirname, "../src/features", name);

if (fs.existsSync(targetDir)) {
  console.error(`src/features/${name} already exists`);
  process.exit(1);
}

const title = name
  .split("-")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(" ");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      const content = fs
        .readFileSync(s, "utf8")
        .split("__ID__").join(name)
        .split("__TITLE__").join(title)
        .split("__OWNER__").join(owner);
      fs.writeFileSync(d, content);
    }
  }
}

copyDir(templateDir, targetDir);

// Don't ship the template's README into the new feature.
const copiedReadme = path.join(targetDir, "README.md");
if (fs.existsSync(copiedReadme)) fs.rmSync(copiedReadme);

try {
  execSync(`node ${JSON.stringify(path.join(__dirname, "generate-feature-registry.js"))}`, {
    stdio: "inherit",
  });
} catch {
  console.warn("! Could not auto-generate the registry; run `npm run generate:features`.");
}

console.log(`\n✓ Created src/features/${name}`);
console.log(`  Route:  /lab/${name}`);
console.log(`  Edit:   src/features/${name}/index.tsx`);
console.log(`  Nav:    set group / label / icon in src/features/${name}/feature.config.ts`);
console.log(`  Run:    npm run dev  →  http://localhost:3000/lab/${name}\n`);
