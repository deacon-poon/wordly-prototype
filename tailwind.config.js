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
          50: "#E8F6F8",
          100: "#C5E8ED",
          200: "#9DD9E0",
          300: "#6AC4D1",
          400: "#3DAFC2",
          500: "#128197", // Base primary teal
          600: "#0F6F85",
          700: "#0C5D73",
          800: "#094B61",
          900: "#06394F",
        },
        // New Secondary Navy palette
        "secondary-navy": {
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
          50: "#E9FAFD",
          100: "#C8F2FA",
          200: "#9BEAF6",
          300: "#5EDBEF",
          400: "#3BD1EA",
          500: "#26C7E6", // Base accent light blue
          600: "#20A8C4",
          700: "#1A89A2",
          800: "#146A80",
          900: "#0E4B5E",
        },
        // Legacy Extended brand teal palette (deprecated)
        teal: {
          50: "#E6F4F7",
          100: "#C5E8EE",
          200: "#9ED2DC",
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
