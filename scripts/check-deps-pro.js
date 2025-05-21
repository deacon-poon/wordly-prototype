#!/usr/bin/env node

const { spawn, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Terminal colors
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

console.log(
  `${colors.bold}Running professional dependency check...${colors.reset}`
);

// Check if dependency-cruiser is installed
try {
  execSync("npx depcruise --version", { stdio: "ignore" });
} catch (error) {
  console.log(
    `${colors.yellow}Installing dependency-cruiser...${colors.reset}`
  );
  try {
    execSync("npm install --save-dev dependency-cruiser", { stdio: "inherit" });
  } catch (error) {
    console.error(
      `${colors.red}Failed to install dependency-cruiser.${colors.reset}`
    );
    process.exit(1);
  }
}

// Make sure we have a configuration file
const configFile = path.join(process.cwd(), ".dependency-cruiser.js");
if (!fs.existsSync(configFile)) {
  console.log(
    `${colors.yellow}Creating default dependency-cruiser configuration...${colors.reset}`
  );
  try {
    execSync("npx depcruise --init", { stdio: "inherit" });
  } catch (error) {
    console.error(
      `${colors.red}Failed to create configuration file.${colors.reset}`
    );
    process.exit(1);
  }
}

// Run dependency-cruiser to validate dependencies
console.log(`${colors.blue}Validating dependencies...${colors.reset}`);

const depcruise = spawn("npx", [
  "depcruise",
  "--config",
  ".dependency-cruiser.js",
  "--output-type",
  "err-long",
  "./src",
]);

let output = "";
let errors = "";

depcruise.stdout.on("data", (data) => {
  output += data.toString();
});

depcruise.stderr.on("data", (data) => {
  errors += data.toString();
});

depcruise.on("close", (code) => {
  if (code !== 0) {
    console.error(
      `${colors.red}${colors.bold}Dependency validation failed!${colors.reset}`
    );

    // Parse the output to extract missing dependencies
    const missingDeps = new Set();
    const missingDepRegex = /to '([^']+)'.+not\sfound\sin\spackage\.json/g;
    let match;

    while ((match = missingDepRegex.exec(output)) !== null) {
      missingDeps.add(match[1].split("/")[0]);
    }

    if (missingDeps.size > 0) {
      console.log(
        `\n${colors.red}${colors.bold}Missing Dependencies:${colors.reset}`
      );
      missingDeps.forEach((dep) => {
        console.log(`- ${dep}`);
      });

      console.log(`\n${colors.green}Fix with:${colors.reset}`);
      console.log(`npm install --save ${Array.from(missingDeps).join(" ")}`);
    }

    if (errors) {
      console.error(`\n${colors.red}Errors:${colors.reset}\n${errors}`);
    }

    process.exit(1);
  } else {
    console.log(
      `${colors.green}${colors.bold}All dependencies are valid! ✓${colors.reset}`
    );

    // Check if GraphViz is installed before trying to generate graphs
    let graphvizInstalled = false;
    try {
      execSync("which dot", { stdio: "ignore" });
      graphvizInstalled = true;
    } catch (error) {
      // GraphViz not installed
    }

    if (graphvizInstalled) {
      // Generate a dependency graph visualization for documentation
      console.log(
        `\n${colors.blue}Generating dependency graph...${colors.reset}`
      );
      try {
        const graphDir = path.join(process.cwd(), "docs");
        if (!fs.existsSync(graphDir)) {
          fs.mkdirSync(graphDir, { recursive: true });
        }

        execSync(
          "npx depcruise --config .dependency-cruiser.js --output-type dot src | dot -T svg > docs/dependency-graph.svg",
          { stdio: "inherit" }
        );

        console.log(
          `${colors.green}Dependency graph generated at docs/dependency-graph.svg${colors.reset}`
        );
      } catch (error) {
        console.log(
          `${colors.yellow}Could not generate dependency graph: ${error.message}${colors.reset}`
        );
      }
    } else {
      console.log(
        `${colors.yellow}GraphViz not installed - skipping dependency graph generation.${colors.reset}`
      );
      console.log(
        `${colors.yellow}Install GraphViz to enable visualization features.${colors.reset}`
      );
    }

    // Run our basic check script as well to catch CSS processor dependencies
    console.log(
      `\n${colors.blue}Running additional checks for CSS dependencies...${colors.reset}`
    );
    try {
      execSync("node " + path.join(__dirname, "check-dependencies.js"), {
        stdio: "inherit",
      });
    } catch (error) {
      // The check-dependencies.js script will have its own output
      process.exit(1);
    }

    process.exit(0);
  }
});
