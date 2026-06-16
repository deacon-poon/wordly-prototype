const path = require("path");

const config = {
  stories: [
    // packages/ui — single source of truth for all component stories
    "../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/ui/src/**/*.mdx",
    // Root-level narrative/intro stories only (NOT component stories)
    "../src/stories/**/*.mdx",
    "../src/stories/**/*.stories.@(js|jsx|ts|tsx)",
    // Migrated portal "workspace kit" components (Angular → React)
    "../src/components/workspace/**/*.stories.@(js|jsx|ts|tsx)",
    // Track-A core primitives + design-system docs
    "../src/components/ui/**/*.stories.@(js|jsx|ts|tsx)",
    // Ported wordly-react-components-lib (MUI → shadcn) experience components
    "../src/components/experience/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    // Add support for path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../src"),
    };
    return config;
  },
};

module.exports = config;
