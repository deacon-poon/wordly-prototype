#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

// Colors for terminal output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

// Common module patterns to search for
const importPatterns = [
  /from\s+['"]([^./][^'"]*)['"]/, // ES6 imports: from 'module'
  /import\s+['"]([^./][^'"]*)['"]/, // ES6 side-effect imports: import 'module'
  /require\s*\(\s*['"]([^./][^'"]*)['"]/, // CommonJS: require('module')
  /@import\s+['"]([^./][^'"]*)['"]/, // CSS imports: @import 'module'
];

// Required Next.js CSS dependencies
const requiredCssPackages = ["autoprefixer", "tailwindcss", "postcss"];

// Known packages that might be imported from parent packages
const submodulePackages = {
  "react-dom": ["react"],
  "@radix-ui/react-alert-dialog": ["@radix-ui/react-dialog"],
  "@radix-ui/react-context-menu": ["@radix-ui/react-dropdown-menu"],
  // Add more submodule relationships as needed
};

// Get package.json data
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

// Track issues
const issues = [];
const warnings = [];
const missingPackages = new Set();

// Function to recursively search for source files
function findSourceFiles(
  dir,
  fileTypes = [".js", ".jsx", ".ts", ".tsx", ".css"]
) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !filePath.includes("node_modules") &&
      !filePath.includes(".git")
    ) {
      results = results.concat(findSourceFiles(filePath, fileTypes));
    } else {
      const ext = path.extname(file);
      if (fileTypes.includes(ext)) {
        results.push(filePath);
      }
    }
  });

  return results;
}

console.log(`${colors.bold}Checking for dependency issues...${colors.reset}`);

// 1. Find source files
console.log(`${colors.blue}Scanning source files...${colors.reset}`);
const sourceFiles = findSourceFiles("./src");
console.log(`Found ${sourceFiles.length} files to scan.`);

// 2. Scan each file for imports
sourceFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf8");

  importPatterns.forEach((pattern) => {
    const matches = content.match(new RegExp(pattern, "g"));
    if (!matches) return;

    matches.forEach((match) => {
      const moduleMatch = match.match(pattern);
      if (!moduleMatch || !moduleMatch[1]) return;

      let moduleName = moduleMatch[1];

      // Extract package name from scoped imports (e.g., @radix-ui/react-dropdown-menu -> @radix-ui/react-dropdown-menu)
      // or from deep imports (e.g., lodash/merge -> lodash)
      const packageName = moduleName.startsWith("@")
        ? moduleName.split("/").slice(0, 2).join("/")
        : moduleName.split("/")[0];

      if (
        !dependencies[packageName] &&
        !packageName.startsWith("@/") &&
        !packageName.startsWith("./") &&
        !packageName.startsWith("../") &&
        packageName !== "react" && // React is a peer dependency of Next.js
        packageName !== "next" // Next.js is always available
      ) {
        let isSubmodule = false;

        // Check if it's a submodule of an installed package
        for (const [parent, children] of Object.entries(submodulePackages)) {
          if (dependencies[parent] && children.includes(packageName)) {
            isSubmodule = true;
            break;
          }
        }

        if (!isSubmodule) {
          missingPackages.add(packageName);
          issues.push({
            file: path.relative(process.cwd(), filePath),
            package: packageName,
            importStatement: match.trim(),
          });
        }
      }
    });
  });
});

// 3. Check for CSS processing dependencies (Next.js specific)
const cssFiles = sourceFiles.filter((file) => file.endsWith(".css"));
if (cssFiles.length > 0) {
  requiredCssPackages.forEach((pkg) => {
    if (!dependencies[pkg]) {
      missingPackages.add(pkg);
      warnings.push(
        `CSS files detected but ${pkg} is not installed. This is required for NextJS.`
      );
    }
  });
}

// 4. Verify package.json consistency
// Check for packages with mixed version specifiers (^ vs exact vs ~)
const versionPatterns = {
  caret: { pattern: /^\^/, count: 0 },
  tilde: { pattern: /^~/, count: 0 },
  exact: { pattern: /^[0-9]/, count: 0 },
};

for (const [pkg, version] of Object.entries(dependencies)) {
  if (versionPatterns.caret.pattern.test(version))
    versionPatterns.caret.count++;
  else if (versionPatterns.tilde.pattern.test(version))
    versionPatterns.tilde.count++;
  else if (versionPatterns.exact.pattern.test(version))
    versionPatterns.exact.count++;
}

const dominantPattern = Object.entries(versionPatterns).sort(
  (a, b) => b[1].count - a[1].count
)[0][0];

// Look for inconsistent version patterns
for (const [pkg, version] of Object.entries(dependencies)) {
  if (
    (dominantPattern === "caret" &&
      !versionPatterns.caret.pattern.test(version)) ||
    (dominantPattern === "tilde" &&
      !versionPatterns.tilde.pattern.test(version)) ||
    (dominantPattern === "exact" &&
      !versionPatterns.exact.pattern.test(version))
  ) {
    warnings.push(
      `Package ${pkg} uses a different version pattern (${version}) than most other packages (${dominantPattern}).`
    );
  }
}

// 5. Report results
if (issues.length > 0 || warnings.length > 0) {
  if (issues.length > 0) {
    console.log(
      `\n${colors.red}${colors.bold}Missing Dependencies:${colors.reset}`
    );

    const groupedIssues = issues.reduce((result, issue) => {
      if (!result[issue.package]) {
        result[issue.package] = [];
      }
      result[issue.package].push(issue);
      return result;
    }, {});

    for (const [pkg, pkgIssues] of Object.entries(groupedIssues)) {
      console.log(`\n${colors.yellow}${pkg}${colors.reset}`);

      // Just show up to 3 examples of where the package is used
      const examples = pkgIssues.slice(0, 3);
      examples.forEach((issue) => {
        console.log(`  - ${issue.file}: ${issue.importStatement}`);
      });

      if (pkgIssues.length > 3) {
        console.log(`  - ...and ${pkgIssues.length - 3} more occurrences`);
      }
    }

    console.log(`\n${colors.green}Fix with:${colors.reset}`);
    console.log(`npm install --save ${Array.from(missingPackages).join(" ")}`);
  }

  if (warnings.length > 0) {
    console.log(`\n${colors.yellow}${colors.bold}Warnings:${colors.reset}`);
    warnings.forEach((warning) => {
      console.log(`- ${warning}`);
    });
  }

  process.exit(1); // Exit with error code
} else {
  console.log(
    `\n${colors.green}${colors.bold}All dependencies are properly installed! ✓${colors.reset}`
  );
  process.exit(0); // Exit with success code
}
