/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");
const { fontFamily } = require("tailwindcss/defaultTheme");

function hsl(h, s, l) {
  return `hsl(${h} ${s}% ${l}%)`;
}

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        brand: {
          "primary-teal": "#128197", // Base primary teal-500
          "secondary-navy": "#0B1C3A", // Base secondary navy-500
          "accent-light-blue": "#26C7E6", // Base accent light blue-500
          // Legacy colors (deprecated)
          teal: "#118197",
          pink: "#E0007B",
        },
        // New Primary Teal palette
        "primary-teal": {
          25: "#F0FCFC",
          50: "#E6F4F7",
          100: "#C5E8EE",
          200: "#84DEF0",
          300: "#5CB9CA",
          400: "#30A3B7",
          500: "#118197", // Base primary teal
          600: "#0C687A",
          700: "#08505D",
          800: "#063840",
          900: "#021F24",
        },
        // New Secondary Navy palette
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
        // New Accent Light Blue palette
        "accent-light-blue": {
          50: "#F0F9FB",
          100: "#D6EDF3",
          200: "#AFDAE6",
          300: "#7BC2D3",
          400: "#51C4DC",
          500: "#26C7E6", // Base accent light blue
          600: "#1FA5C1",
          700: "#18839C",
          800: "#116177",
          900: "#0A3F52",
        },
        // New Accent Green palette
        "accent-green": {
          50: "hsl(158 50% 97%)",
          100: "hsl(158 60% 90%)",
          200: "hsl(158 65% 82%)",
          300: "hsl(158 70% 73%)",
          400: "hsl(158 72% 63%)",
          500: "hsl(158 74% 54%)", // Base accent green #28E6B6
          600: "hsl(158 76% 45%)",
          700: "hsl(158 78% 36%)",
          800: "hsl(158 80% 27%)",
          900: "hsl(158 82% 18%)",
        },
        // Legacy Extended brand teal palette (deprecated)
        teal: {
          50: "#E6F4F7",
          100: "#C5E8EE",
          200: "#84DEF0",
          300: "#5CB9CA",
          400: "#30A3B7",
          500: "#118197", // Legacy base teal
          600: "#0C687A",
          700: "#08505D",
          800: "#063840",
          900: "#021F24",
        },
        // Legacy Extended brand pink palette (deprecated)
        pink: {
          50: "#FCE6F1",
          100: "#F9BFD9",
          200: "#F693C1",
          300: "#F367A9",
          400: "#F13B91",
          500: "#E0007B", // Legacy base pink
          600: "#B30062",
          700: "#85004A",
          800: "#570031",
          900: "#290019",
        },
        // Semantic green palette for affirmative actions
        success: {
          50: "#E6F6EC",
          100: "#C5E8D2",
          200: "#9CD7B0",
          300: "#66C188",
          400: "#34AD67",
          500: "#0C9A4E", // Base green
          600: "#0A7B3F",
          700: "#085D2F",
          800: "#053E20",
          900: "#021F10",
        },
        // Semantic red palette for destructive actions
        error: {
          50: "#FCEBEA",
          100: "#F9CFCC",
          200: "#F5A8A2",
          300: "#F07870",
          400: "#EA4F45",
          500: "#E62D21", // Base red
          600: "#B8221A",
          700: "#8A1A13",
          800: "#5C110D",
          900: "#2E0906",
        },
        // Blue palette for informational purposes (links, info states)
        blue: {
          50: "hsl(var(--blue-50) / <alpha-value>)",
          100: "hsl(var(--blue-100) / <alpha-value>)",
          200: "hsl(var(--blue-200) / <alpha-value>)",
          300: "hsl(var(--blue-300) / <alpha-value>)",
          400: "hsl(var(--blue-400) / <alpha-value>)",
          500: "hsl(var(--blue-500) / <alpha-value>)", // Base informational blue
          600: "hsl(var(--blue-600) / <alpha-value>)",
          700: "hsl(var(--blue-700) / <alpha-value>)",
          800: "hsl(var(--blue-800) / <alpha-value>)",
          900: "hsl(var(--blue-900) / <alpha-value>)",
        },
        // Orange palette for warnings
        orange: {
          50: "hsl(var(--orange-50) / <alpha-value>)",
          100: "hsl(var(--orange-100) / <alpha-value>)",
          200: "hsl(var(--orange-200) / <alpha-value>)",
          300: "hsl(var(--orange-300) / <alpha-value>)",
          400: "hsl(var(--orange-400) / <alpha-value>)",
          500: "hsl(var(--orange-500) / <alpha-value>)", // Base warning orange
          600: "hsl(var(--orange-600) / <alpha-value>)",
          700: "hsl(var(--orange-700) / <alpha-value>)",
          800: "hsl(var(--orange-800) / <alpha-value>)",
          900: "hsl(var(--orange-900) / <alpha-value>)",
        },
        // Extended UI gray palette
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
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["var(--font-roboto)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
