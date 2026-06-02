#!/usr/bin/env node
/**
 * create-app — scaffold a new Wordly Lab prototype
 * Usage: npm run create-app <name>
 *        node scripts/create-app.js attend
 */

const fs = require("fs");
const path = require("path");

const name = process.argv[2];
if (!name) {
  console.error("Usage: npm run create-app <prototype-name>");
  console.error("Example: npm run create-app attend");
  process.exit(1);
}

const templateDir = path.join(__dirname, "../apps/_template");
const targetDir = path.join(__dirname, "../apps", name);

if (fs.existsSync(targetDir)) {
  console.error(`apps/${name} already exists`);
  process.exit(1);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      let content = fs.readFileSync(srcPath, "utf8");
      // Rename the package
      content = content.replace(
        "@wordly/prototype-template",
        `@wordly/${name}`
      );
      content = content.replace(
        "Wordly Lab Prototype",
        `Wordly Lab — ${name.charAt(0).toUpperCase() + name.slice(1)}`
      );
      fs.writeFileSync(destPath, content);
    }
  }
}

copyDir(templateDir, targetDir);

// Update package.json port to avoid conflicts
const pkgPath = path.join(targetDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const portOffset = fs.readdirSync(path.join(__dirname, "../apps")).length;
pkg.scripts.dev = `next dev --port ${3000 + portOffset}`;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log(`\n✓ Created apps/${name}`);
console.log(`\n  cd apps/${name}`);
console.log(`  npm install`);
console.log(`  npm run dev\n`);
