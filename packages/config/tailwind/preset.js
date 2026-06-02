/** @type {import('tailwindcss').Config} */

// Wordly Lab — shared Tailwind preset
// All prototype apps extend this. Edit here, propagates everywhere.
const preset = {
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-roboto)", "Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Brand Blue (2026 rebrand)
        "brand-blue": {
          25: "var(--color-brand-blue-25, #F0F7FF)",
          50: "var(--color-brand-blue-50, #D6EAFF)",
          100: "var(--color-brand-blue-100, #B2D8FF)",
          200: "var(--color-brand-blue-200, #75B8FF)",
          300: "var(--color-brand-blue-300, #3396FF)",
          400: "var(--color-brand-blue-400, #017CFF)",
          500: "var(--color-brand-blue-500, #0063CC)",
          600: "var(--color-brand-blue-600, #0051A8)",
        },
        // Action Teal
        "action-teal": {
          50: "var(--color-action-teal-50, #DBF5FB)",
          100: "var(--color-action-teal-100, #BBEDF7)",
          300: "var(--color-action-teal-300, #49CFE9)",
          400: "var(--color-action-teal-400, #1BC3E4)",
          500: "var(--color-action-teal-500, #169CB6)",
          600: "var(--color-action-teal-600, #128197)",
        },
        // Accent Green
        "accent-green": {
          50: "var(--color-accent-green-50, #DAFBE4)",
          300: "var(--color-accent-green-300, #48EA76)",
          400: "var(--color-accent-green-400, #1BE453)",
          500: "var(--color-accent-green-500, #15B743)",
          600: "var(--color-accent-green-600, #129737)",
        },
        // Semantic — map to CSS vars from tokens.css
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
};

module.exports = preset;
