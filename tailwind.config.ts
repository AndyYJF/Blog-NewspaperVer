import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2.5rem" },
      screens: { "2xl": "1340px" },
    },
    extend: {
      colors: {
        // Editorial / fine-magazine palette — driven by CSS variables
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        subtle: "rgb(var(--color-subtle) / <alpha-value>)",
        rule: "rgb(var(--color-rule) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--color-accent-soft) / <alpha-value>)",
        brass: "rgb(var(--color-brass) / <alpha-value>)",
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
      },
      fontFamily: {
        // Display via Fraunces variable — characterful editorial serif
        display: ["var(--font-display)", "var(--font-sc)", "Georgia", "serif"],
        italic: ["var(--font-display-italic)", "var(--font-sc)", "Georgia", "serif"],
        body: ["var(--font-body)", "var(--font-sc)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Menlo", "monospace"],
        // Aliased for legacy
        serif: ["var(--font-display)", "var(--font-sc)", "Georgia", "serif"],
      },
      fontSize: {
        "display-3xl": ["clamp(3.25rem, 8vw, 6.5rem)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        "display-2xl": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.0", letterSpacing: "-0.028em" }],
        "display-xl": ["clamp(2rem, 4.2vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(1.5rem, 2.8vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.012em" }],
      },
      letterSpacing: {
        tightest: "-0.035em",
        widest: "0.22em",
        eyebrow: "0.28em",
      },
      maxWidth: {
        prose: "68ch",
        reading: "44rem",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
        gentle: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "rule-draw": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "letters-in": {
          "0%": { opacity: "0", letterSpacing: "0.1em", filter: "blur(4px)" },
          "100%": { opacity: "1", letterSpacing: "normal", filter: "blur(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "subtle-pan": {
          "0%": { transform: "scale(1.05) translate(0, 0)" },
          "100%": { transform: "scale(1.05) translate(-1%, 0.5%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "rule-draw": "rule-draw 800ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "letters-in": "letters-in 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee 60s linear infinite",
        "subtle-pan": "subtle-pan 20s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
