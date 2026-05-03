import "@/styles/globals.css";
import "@/styles/typography.css";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.min.css";
import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, Inter, JetBrains_Mono, Noto_Serif_SC } from "next/font/google";
import { siteConfig } from "@/lib/utils";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif-display",
  weight: ["400", "600", "700", "800", "900"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif-body",
  weight: ["400", "500", "600", "700"],
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif-sc",
  weight: ["400", "500", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: { default: siteConfig().title, template: `%s · ${siteConfig().title}` },
  description: siteConfig().tagline,
  metadataBase: new URL(siteConfig().url),
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh"
      suppressHydrationWarning
      className={`${playfair.variable} ${sourceSerif.variable} ${notoSerifSC.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
