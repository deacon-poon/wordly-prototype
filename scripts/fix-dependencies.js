#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

// Colors for terminal output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

console.log(`${colors.bold}Running dependency checker...${colors.reset}`);

try {
  // Run the dependency checker in a way that we can capture its output
  const checkScript = path.join(__dirname, "check-dependencies.js");

  try {
    // If the check passes, nothing to do
    execSync(`node ${checkScript}`, { stdio: "inherit" });
    console.log(
      `\n${colors.green}${colors.bold}✅ No missing dependencies found!${colors.reset}`
    );
    process.exit(0);
  } catch (error) {
    // The script exited with non-zero status, which means there are missing dependencies
    console.log(
      `\n${colors.yellow}${colors.bold}Missing dependencies detected. Attempting to fix...${colors.reset}`
    );

    // Run it again to capture the output
    const output = execSync(`node ${checkScript}`, { encoding: "utf-8" });

    // Parse the output for the fix command
    const fixCommandMatch = output.match(/npm install --save (.*?)(\n|$)/);

    if (fixCommandMatch && fixCommandMatch[1]) {
      const packagesToInstall = fixCommandMatch[1].trim();

      if (packagesToInstall) {
        console.log(
          `\n${colors.blue}Installing missing packages: ${packagesToInstall}${colors.reset}`
        );

        try {
          // Try to install the packages
          execSync(`npm install --save ${packagesToInstall}`, {
            stdio: "inherit",
          });
          console.log(
            `\n${colors.green}${colors.bold}✅ Dependencies installed successfully!${colors.reset}`
          );

          // Run the check again to verify it worked
          try {
            execSync(`node ${checkScript}`, { stdio: "inherit" });
            console.log(
              `\n${colors.green}${colors.bold}✅ All dependency issues fixed!${colors.reset}`
            );
            process.exit(0);
          } catch (e) {
            console.log(
              `\n${colors.yellow}${colors.bold}⚠️ Some dependency issues may still remain.${colors.reset}`
            );
            console.log(
              `Run this script again or check manually with: node ${checkScript}`
            );
            process.exit(1);
          }
        } catch (installError) {
          console.error(
            `\n${colors.red}${colors.bold}❌ Failed to install dependencies:${colors.reset}`
          );
          console.error(installError.message);
          process.exit(1);
        }
      }
    } else {
      console.log(
        `\n${colors.yellow}${colors.bold}⚠️ Could not determine which packages to install.${colors.reset}`
      );
      console.log(`Please check the issues manually with: node ${checkScript}`);
      process.exit(1);
    }
  }
} catch (error) {
  console.error(
    `\n${colors.red}${colors.bold}❌ Error running dependency checker:${colors.reset}`
  );
  console.error(error.message);
  process.exit(1);
}
