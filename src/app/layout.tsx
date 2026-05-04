import "@/styles/globals.css";
import "@/styles/typography.css";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.min.css";
import type { Metadata } from "next";
import { Fraunces, Instrument_Serif, Source_Serif_4, DM_Sans, JetBrains_Mono, Noto_Serif_SC } from "next/font/google";
import { getSiteConfig } from "@/lib/settings";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-italic",
  weight: ["400"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  style: ["normal", "italic"],
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sc",
  weight: ["300", "400", "500", "700", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
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
      className={`${fraunces.variable} ${instrument.variable} ${sourceSerif.variable} ${notoSerifSC.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
