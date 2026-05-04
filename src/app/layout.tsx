import "@/styles/globals.css";
import "@/styles/typography.css";
import type { Metadata } from "next";
import { Fraunces, Source_Serif_4, DM_Sans, JetBrains_Mono, Noto_Serif_SC } from "next/font/google";
import { getSiteConfig } from "@/lib/settings";

// Fraunces variable — handles BOTH display (opsz/SOFT axes) and italic styles.
// Replaces the previous Instrument Serif italic dependency.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

// Source Serif 4 — body text (normal only, italic delegated to Fraunces).
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Noto Serif SC — Chinese fallback, only 2 weights.
const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sc",
  weight: ["400", "700"],
});

// DM Sans — UI labels / eyebrows, 3 weights.
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

// JetBrains Mono — code blocks. Variable font (no weight array needed).
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getSiteConfig();
  return {
    title: { default: cfg.title, template: `%s · ${cfg.title}` },
    description: cfg.tagline,
    metadataBase: new URL(cfg.url),
    alternates: { types: { "application/rss+xml": "/rss.xml" } },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh"
      suppressHydrationWarning
      className={`${fraunces.variable} ${sourceSerif.variable} ${notoSerifSC.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
