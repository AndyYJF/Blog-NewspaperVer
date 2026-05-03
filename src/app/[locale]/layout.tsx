import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgress } from "@/components/post/ReadingProgress";
import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n";

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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <ReadingProgress />
        <div className="flex min-h-screen flex-col">
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
