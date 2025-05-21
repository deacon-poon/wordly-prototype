/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-orphans",
      severity: "warn",
      comment:
        "This module is not depended on by any other module and is not a recognized entry point. It might be unused.",
      from: { orphan: true },
      to: {},
    },
    {
      name: "not-to-deprecated",
      comment:
        "This module depends on a deprecated module. Consider refactoring to use an alternative.",
      severity: "warn",
      from: {},
      to: { dependencyTypes: ["deprecated"] },
    },
    {
      name: "no-circular",
      severity: "warn",
      comment:
        "This dependency is part of a circular relationship. You might want to revise your solution.",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-non-package-json",
      severity: "error",
      comment:
        "This module depends on a module that's not in package.json. Either add it there or fix the import.",
      from: {},
      to: {
        dependencyTypes: ["npm-no-pkg", "npm-unknown"],
      },
    },
    {
      name: "not-to-dev-dep",
      severity: "error",
      comment:
        "This module depends on a module that's in package.json as a dev dependency. Depending on a dev dependency in production is generally a bad idea.",
      from: {
        pathNot: "^(tests|spec|cypress|e2e|test-helpers|scripts)",
      },
      to: {
        dependencyTypes: ["npm-dev"],
      },
    },
    {
      name: "no-duplicate-dep-types",
      comment:
        "This module occurs both as a dependency and a dev dependency. That's generally a bad idea.",
      severity: "warn",
      from: {},
      to: {
        moreThanOneDependencyType: true,
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
      dependencyTypes: [
        "npm",
        "npm-dev",
        "npm-optional",
        "npm-peer",
        "npm-bundled",
        "npm-no-pkg",
      ],
    },
    exclude: {
      path: [
        ".next",
        "storybook-static",
        "node_modules",
        "dist",
        "out",
        "build",
        ".cache",
      ],
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
      extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
    },
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+",
      },
      archi: {
        collapsePattern: "^(node_modules|packages|src|lib|app|components)/",
      },
    },
  },
};
