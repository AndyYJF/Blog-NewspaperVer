import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgress } from "@/components/post/ReadingProgress";
import { GrainOverlay } from "@/components/layout/GrainOverlay";
import { MarqueeStrip } from "@/components/layout/MarqueeStrip";
import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  // Recent posts feed for top marquee
  const recent = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 8,
    select: { title: true, titleEn: true },
  });

  const marqueeItems = recent.length
    ? recent.map((p) => (locale === "en" && p.titleEn ? p.titleEn : p.title))
    : [
        locale === "zh" ? "新刊登场 · Vol. I · No. I" : "Now in print · Vol. I · No. I",
        locale === "zh" ? "为耐心的读者而作" : "Made for the patient reader",
        locale === "zh" ? "排版即修养" : "Typography is character",
      ];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <GrainOverlay />
        <ReadingProgress />
        <div className="flex min-h-screen flex-col">
          <MarqueeStrip items={marqueeItems} />
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
