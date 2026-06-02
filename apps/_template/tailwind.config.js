const preset = require("@wordly/config/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...preset,
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
