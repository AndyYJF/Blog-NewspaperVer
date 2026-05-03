import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // 杂志风配色 — CSS 变量驱动，便于切换暗黑
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        subtle: "rgb(var(--color-subtle) / <alpha-value>)",
        rule: "rgb(var(--color-rule) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--color-accent-soft) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-serif-display)", "var(--font-serif-sc)", "Georgia", "serif"],
        body: ["var(--font-serif-body)", "var(--font-serif-sc)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Menlo", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(2.75rem, 6vw, 4.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-xl": ["clamp(2rem, 4.2vw, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-lg": ["clamp(1.5rem, 2.8vw, 2.25rem)", { lineHeight: "1.15" }],
      },
      letterSpacing: {
        tightest: "-0.025em",
        widest: "0.18em",
      },
      maxWidth: {
        prose: "68ch",
        reading: "42rem",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
