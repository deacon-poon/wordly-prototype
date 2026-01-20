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
          // NEW 2026 Rebrand: Brand Blue 500 is primary, Accent Green 500 is secondary
          "primary": "#0063CC", // Brand Blue 500 - primary brand color from Figma
          "secondary": "#15B743", // Accent Green 500 - secondary brand color from Figma
          "action": "#128197", // Action Teal 600 - for buttons and actions from Figma
          // Legacy aliases (map to new colors)
          "primary-teal": "#0063CC", // Now maps to Brand Blue 500
          "secondary-navy": "#0063CC", // Now maps to Brand Blue 500 (primary)
          "accent-green": "#15B743", // Accent Green 500 (secondary)
          teal: "#0063CC", // Legacy - maps to Brand Blue 500
          pink: "#E0007B", // Deprecated
        },
        // Primary Brand Blue palette - Figma Variables Source of Truth (2026 Rebrand)
        "primary-blue": {
          25: "#F0F7FF", // brand-blue-25 from Figma
          50: "#D6E8FF", // brand-blue-50 from Figma
          100: "#B2D8FF", // brand-blue-100 from Figma
          200: "#75B8FF", // brand-blue-200 from Figma
          300: "#3396FF", // brand-blue-300 from Figma
          400: "#017CFF", // brand-blue-400 from Figma
          500: "#0063CC", // brand-blue-500 from Figma (BASE PRIMARY)
          600: "#0051A8", // brand-blue-600 from Figma
          700: "#00458F", // brand-blue-700 from Figma
          800: "#002C5C", // brand-blue-800 from Figma
          900: "#001E3D", // brand-blue-900 from Figma
        },
        // Action Teal palette - For buttons and interactive elements
        "action-teal": {
          50: "#DBF5F9", // action-teal-50 from Figma
          100: "#BBEDFA", // action-teal-100 from Figma
          200: "#84DFF0", // action-teal-200 from Figma
          300: "#49CFE9", // action-teal-300 from Figma
          400: "#1BC4E4", // action-teal-400 from Figma
          500: "#169CB6", // action-teal-500 from Figma
          600: "#128197", // action-teal-600 from Figma (BASE ACTION)
          700: "#0F6D80", // action-teal-700 from Figma
          800: "#0A4652", // action-teal-800 from Figma
          900: "#072F37", // action-teal-900 from Figma
        },
        // Accent Green palette - Figma Variables Source of Truth (2026 Rebrand)
        "accent-green": {
          50: "#DAF8E5", // accent-green-50 from Figma
          100: "#BBF7CB", // accent-green-100 from Figma (calculated)
          200: "#84F1A2", // accent-green-200 from Figma
          300: "#48EA76", // accent-green-300 from Figma
          400: "#1BE454", // accent-green-400 from Figma
          500: "#15B743", // accent-green-500 from Figma (BASE SECONDARY)
          600: "#129737", // accent-green-600 from Figma
          700: "#0F802F", // accent-green-700 from Figma
          800: "#0A522E", // accent-green-800 from Figma
          900: "#063716", // accent-green-900 from Figma
        },
        // Legacy secondary-green alias - maps to accent-green
        "secondary-green": {
          50: "#DAF8E5",
          100: "#BBF7CB",
          200: "#84F1A2",
          300: "#48EA76",
          400: "#1BE454",
          500: "#15B743",
          600: "#129737",
          700: "#0F802F",
          800: "#0A522E",
          900: "#063716",
        },
        // Legacy aliases - map to new palettes for backward compatibility
        "primary-teal": {
          25: "#F0F7FF",
          50: "#D6E8FF",
          100: "#B2D8FF",
          200: "#75B8FF",
          300: "#3396FF",
          400: "#017CFF",
          500: "#0063CC",
          600: "#0051A8",
          700: "#00458F",
          800: "#002C5C",
          900: "#001E3D",
        },
        "primary-navy": {
          20: "#F0F7FF",
          25: "#F0F7FF",
          50: "#D6E8FF",
          100: "#B2D8FF",
          200: "#75B8FF",
          300: "#3396FF",
          400: "#017CFF",
          500: "#0063CC",
          600: "#0051A8",
          700: "#00458F",
          800: "#002C5C",
          900: "#001E3D",
        },
        "secondary-navy": {
          20: "#F0F7FF",
          25: "#F0F7FF",
          50: "#D6E8FF",
          100: "#B2D8FF",
          200: "#75B8FF",
          300: "#3396FF",
          400: "#017CFF",
          500: "#0063CC",
          600: "#0051A8",
          700: "#00458F",
          800: "#002C5C",
          900: "#001E3D",
        },
        // Legacy teal - now maps to Brand Blue
        teal: {
          50: "#D6E8FF",
          100: "#B2D8FF",
          200: "#75B8FF",
          300: "#3396FF",
          400: "#017CFF",
          500: "#0063CC",
          600: "#0051A8",
          700: "#00458F",
          800: "#002C5C",
          900: "#001E3D",
        },
        // Legacy pink palette (deprecated)
        pink: {
          50: "#FCE6F1",
          100: "#F9BFD9",
          200: "#F693C1",
          300: "#F367A9",
          400: "#F13B91",
          500: "#E0007B",
          600: "#B30062",
          700: "#85004A",
          800: "#570031",
          900: "#290019",
        },
        // Success Green palette - Figma Variables Source of Truth
        success: {
          50: "#e6f6ec", // color/grey/93 from Figma variables
          100: "#c5e8d2", // color/spring green/84 from Figma variables
          200: "#9cd7b0", // color/spring green/73 from Figma variables
          300: "#66c188", // color/spring green/58 from Figma variables
          400: "#34ad67", // color/spring green/44 from Figma variables
          500: "#0c9a4e", // color/spring green/33 from Figma variables
          600: "#0a7b3f", // color/spring green/26 from Figma variables
          700: "#085d2f", // color/spring green/20 from Figma variables
          800: "#053e20", // color/spring green/13 from Figma variables
          900: "#021f10", // color/spring green/6 from Figma variables
        },
        // Error Red palette - Figma Variables Source of Truth
        error: {
          50: "#FCEBEA", // Calculated from base
          100: "#F9CFCC", // Calculated from base
          200: "#f5a8a2", // color/red/80 from Figma variables
          300: "#f07870", // color/red/69 from Figma variables
          400: "#ea4f45", // color/red/59 from Figma variables
          500: "#e62d21", // color/red/52 from Figma variables
          600: "#b8221a", // color/red/41 from Figma variables
          700: "#8a1a13", // color/red/31 from Figma variables
          800: "#5c110d", // color/red/21 from Figma variables
          900: "#2e0906", // color/red/10 from Figma variables
        },
        // Informational Blue palette - Figma Variables Source of Truth
        blue: {
          50: "#EBF5FF", // Calculated from base
          100: "#D1E7FF", // Calculated from base
          200: "#B3D4FF", // Calculated from base
          300: "#84c5ff", // color/azure/76 from Figma variables
          400: "#53b1fd", // color/azure/66 from Figma variables
          500: "#2463eb", // color/azure/53 from Figma variables
          600: "#1d4fd7", // color/azure/48 from Figma variables
          700: "#1e3fae", // color/blue/40 from Figma variables
          800: "#1e3a8a", // color/azure/33 from Figma variables
          900: "#1e2f60", // color/azure/25 from Figma variables
        },
        // Warning Orange palette - Figma Variables Source of Truth
        orange: {
          50: "#fff6eb", // color/grey/96 from Figma variables
          100: "#ffedd5", // color/grey/92 from Figma variables
          200: "#fed7aa", // color/orange/83 from Figma variables
          300: "#fdba74", // color/orange/72 from Figma variables
          400: "#fb923c", // color/orange/61 from Figma variables
          500: "#f97316", // color/orange/53 from Figma variables
          600: "#ea580c", // color/orange/48 from Figma variables
          700: "#c2410c", // color/orange/40 from Figma variables
          800: "#9a3412", // color/orange/34 from Figma variables
          900: "#7c2d12", // color/orange/28 from Figma variables
        },
        // UI Gray palette - Figma Variables Source of Truth
        gray: {
          50: "#f6f9fc", // color/grey/98 from Figma variables
          100: "#eef0f2", // color/grey/94 from Figma variables
          200: "#e3e6e8", // color/grey/90 from Figma variables
          300: "#cdd2d7", // color/azure/82 from Figma variables
          400: "#9ba3ab", // color/grey/64 from Figma variables
          500: "#646e78", // color/grey/43 from Figma variables
          600: "#495057", // color/grey/31 from Figma variables
          700: "#343a40", // color/azure/23 from Figma variables
          800: "#212529", // color/azure/15 from Figma variables
          900: "#121416", // color/azure/8 from Figma variables
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
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
};
