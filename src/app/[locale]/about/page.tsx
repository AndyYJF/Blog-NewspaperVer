import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/lib/utils";
import { Ornament } from "@/components/layout/Ornament";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { title } = siteConfig();

  const content =
    locale === "zh"
      ? {
          eyebrow: "关于",
          h1: "关于这本杂志",
          lede: "一份关于阅读、写作与缓慢观察的私人杂志。",
          body: [
            `欢迎来到 **${title}**——一份不追逐时事、不撰写攻略、不喧哗也不抢夺注意力的杂志。`,
            "我们感兴趣的是：一段优雅的句子如何呼吸，一个人如何在嘈杂的时代里保持安静，一段代码如何同时具备工程性和美感。",
            "你将读到关于排版、设计、技术、文学与生活的随笔。它们不是热点，但希望它们足够耐读。",
            "如果你也在寻找一处可以停下来的地方，欢迎留下评论或订阅 RSS。我们这里没有时间线，只有发表的时间。",
          ],
          colophon: "Set in Fraunces, Source Serif 4, Instrument Serif & Noto Serif SC. Built with Next.js, Prisma, and a great deal of patience.",
        }
      : {
          eyebrow: "About",
          h1: "About this Magazine",
          lede: "A small magazine about reading, writing, and slow observation.",
          body: [
            `Welcome to **${title}** — a magazine that doesn't chase headlines, doesn't write listicles, and doesn't compete for your attention.`,
            "We are interested in how a graceful sentence breathes, how a person stays quiet in a noisy age, and how code can be both engineered and beautiful.",
            "You will find essays on typography, design, technology, literature, and life. None of them are urgent, but we hope they reward patience.",
            "If you too are looking for somewhere to pause, leave a comment, or subscribe via RSS. There is no timeline here — only the time of publication.",
          ],
          colophon: "Set in Fraunces, Source Serif 4, Instrument Serif & Noto Serif SC. Built with Next.js, Prisma, and a great deal of patience.",
        };

  return (
    <div className="container py-16">
      <article className="mx-auto max-w-2xl">
        <p className="eyebrow text-center text-accent">{content.eyebrow}</p>
        <h1 className="masthead mt-4 text-center text-display-2xl">
          {content.h1}
        </h1>
        <p className="mt-6 text-center font-italic italic text-xl text-muted">
          {content.lede}
        </p>
        <Ornament className="my-12" />
        <div className="prose-magazine">
          {content.body.map((p, i) => (
            <p
              key={i}
              dangerouslySetInnerHTML={{
                __html: p.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          ))}
        </div>
        <Ornament className="my-12" />
        <p className="text-center font-italic italic text-sm leading-relaxed text-muted">
          {content.colophon}
        </p>
      </article>
    </div>
  );
}
