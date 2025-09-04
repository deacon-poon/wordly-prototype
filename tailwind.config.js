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
          "primary-teal": "#128197", // primitives/color/primary-teal/teal-500 - Figma variables
          "secondary-navy": "#0b1c3a", // primitives/color/secondary-navy/navy-500 - Figma variables
          "accent-green": "#28e6b6", // primitives/color/accent-green/green-500 - Figma variables
          // Legacy colors (deprecated)
          teal: "#118197",
          pink: "#E0007B",
        },
        // Primary Teal palette - Figma Variables Source of Truth
        "primary-teal": {
          25: "#F0FCFC",
          50: "#e8f9fc", // primitives/color/primary-teal/teal-50 from Figma variables
          100: "#bbedf7", // primitives/color/primary-teal/teal-100 from Figma variables
          200: "#84def0", // primitives/color/primary-teal/teal-200 from Figma variables
          300: "#56d2eb", // primitives/color/primary-teal/teal-300 from Figma variables
          400: "#1bc3e4", // primitives/color/primary-teal/teal-400 from Figma variables
          500: "#128197", // primitives/color/primary-teal/teal-500 from Figma variables
          600: "#0f6d80", // primitives/color/primary-teal/teal-600 from Figma variables
          700: "#0d5d6d", // primitives/color/primary-teal/teal-700 from Figma variables
          800: "#0a4652", // primitives/color/primary-teal/teal-800 from Figma variables
          900: "#072f37", // primitives/color/primary-teal/teal-900 from Figma variables
        },
        // Secondary Navy palette - Figma Variables Source of Truth
        "secondary-navy": {
          25: "#F4F6FA",
          50: "#d4e1f7", // primitives/color/secondary-navy/navy-50 from Figma variables
          100: "#94b3eb", // primitives/color/secondary-navy/navy-100 from Figma variables
          200: "#5486de", // primitives/color/secondary-navy/navy-200 from Figma variables
          300: "#255dc1", // primitives/color/secondary-navy/navy-300 from Figma variables
          400: "#183e81", // primitives/color/secondary-navy/navy-400 from Figma variables
          500: "#0b1c3a", // primitives/color/secondary-navy/navy-500 from Figma variables
          600: "#0a1933", // primitives/color/secondary-navy/navy-600 from Figma variables
          700: "#030811", // primitives/color/secondary-navy/navy-700 from Figma variables
          800: "#050E1F",
          900: "#030916",
        },
                // Accent Green palette - Figma Variables Source of Truth  
        "accent-green": {
          50: "#E8FCF7", // Calculated from base
          100: "#C8F9EC", // Calculated from base
          200: "#BAF7E8", // Calculated from base
          300: "#8DF2D8", // Calculated from base
          400: "#5FECC9", // Calculated from base
          500: "#28e6b6", // primitives/color/accent-green/green-500 from Figma variables
          600: "#15B78E", // Calculated from base
          700: "#10896A", // Calculated from base
          800: "#0B5B47", // Calculated from base
          900: "#052E23", // Calculated from base
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
  plugins: [require("tailwindcss-animate")],
};
