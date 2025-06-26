/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary Teal palette - 70%
        "primary-teal": {
          25: "#F0FCFC",
          50: "#E0F8F8",
          100: "#B3EFEF",
          200: "#80E5E5",
          300: "#4DD8D8",
          400: "#26C7CC",
          500: "#128197", // Base primary teal
          600: "#0F7287",
          700: "#0C6377",
          800: "#095466",
          900: "#064556",
        },
        // Secondary Navy palette - 20%
        "secondary-navy": {
          25: "#F4F6FA",
          50: "#E8EDF5",
          100: "#C5D3E8",
          200: "#9BB4D9",
          300: "#6688C4",
          400: "#3A5FAF",
          500: "#0B1C3A", // Base secondary navy
          600: "#091731",
          700: "#071228",
          800: "#050E1F",
          900: "#030916",
        },
        // Accent Green palette - 10%
        "accent-green": {
          50: "#F8FCFB",
          100: "#DEF7F0",
          200: "#BDF0E2",
          300: "#85E5CC",
          400: "#4DDAB8",
          500: "#28E6B6", // Base accent green
          600: "#1BB89A",
          700: "#178A7B",
          800: "#155C5D",
          900: "#0F3E3F",
        },
        // UI Gray palette
        gray: {
          50: "#F8F9FA",
          100: "#EEF0F2",
          200: "#E3E6E8",
          300: "#CDD2D7",
          400: "#9BA3AB",
          500: "#646E78",
          600: "#495057",
          700: "#343A40",
          800: "#212529",
          900: "#121416",
        },
        // Legacy support
        wordly: {
          blue: "#28E6B6", // Maps to accent-green-500
          teal: "#128197", // Maps to primary-teal-500
          navy: "#0B1C3A", // Maps to secondary-navy-500
        },
      },
      fontFamily: {
        // Using system fonts for mobile
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
