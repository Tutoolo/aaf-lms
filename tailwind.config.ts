import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Brand palette — sourced from CSS variables in globals.css
        gold: {
          DEFAULT: "var(--gold)",
          light: "var(--gold-light)",
          pale: "var(--gold-pale)",
        },
        brown: {
          deep: "var(--brown-deep)",
          mid: "var(--brown-mid)",
          warm: "var(--brown-warm)",
        },
        terra: {
          DEFAULT: "var(--terra)",
          light: "var(--terra-light)",
        },
        cream: {
          DEFAULT: "var(--cream)",
          mid: "var(--cream-mid)",
        },
        ink: "var(--ink)",
        muted: "var(--text-muted)",
        act1: "var(--act1)",
        act2: "var(--act2)",
        act3: "var(--act3)",
        // shadcn/ui semantic tokens
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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui"],
      },
      backgroundImage: {
        "diamond-grid":
          "repeating-linear-gradient(45deg, rgba(201,146,42,0.06) 0 1px, transparent 1px 24px), repeating-linear-gradient(-45deg, rgba(201,146,42,0.06) 0 1px, transparent 1px 24px)",
        "warm-grid":
          "repeating-linear-gradient(0deg, rgba(250,244,236,0.04) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(250,244,236,0.04) 0 1px, transparent 1px 32px)",
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
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.4s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
