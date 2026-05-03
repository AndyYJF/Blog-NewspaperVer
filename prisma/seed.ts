/* eslint-disable */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme";
const adminName = process.env.ADMIN_NAME ?? "Editor";

async function main() {
  // 1. 管理员
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: adminName },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: "admin",
      bio: "Editor-in-Chief. Reading, writing, and quietly observing.",
    },
  });
  console.log(`[seed] admin: ${admin.email}`);

  // 2. 分类
  const categories = await Promise.all(
    [
      { slug: "essays", name: "随笔", nameEn: "Essays", description: "短文与思考" },
      { slug: "tech", name: "技术", nameEn: "Technology", description: "工程与设计" },
      { slug: "culture", name: "文化", nameEn: "Culture", description: "书影与生活" },
    ].map((c) =>
      prisma.category.upsert({
        where: { slug: c.slug },
        update: c,
        create: c,
      })
    )
  );

  // 3. 标签
  const tagNames = ["设计", "排版", "Next.js", "AI", "随想", "书评", "Typography", "React"];
  const tags = await Promise.all(
    tagNames.map((name) => {
      const slug = name.toLowerCase().replace(/[^\p{L}\d]+/gu, "-");
      return prisma.tag.upsert({
        where: { slug },
        update: { name },
        create: { slug, name },
      });
    })
  );

  // 4. 示例文章（3 篇）
  const samples = [
    {
      slug: "the-quiet-craft-of-typography",
      title: "排版，是一种安静的手艺",
      titleEn: "The Quiet Craft of Typography",
      excerpt: "好的排版从不发出声音，它只是让文字呼吸得更顺畅。",
      excerptEn: "Good typography is never loud — it simply lets the words breathe.",
      coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600",
      coverCaption: "Photo by Aaron Burden on Unsplash",
      featured: true,
      status: "published",
      categorySlug: "essays",
      tagSlugs: ["设计", "排版", "typography"],
      content: `当我们谈论排版，我们在谈论什么？

不是字体名称的清单，也不是某种神秘的网格学问。**排版的本质是节奏** —— 字与字、行与行、段与段之间的呼吸。

> 文字应当像水一样流过页面，读者甚至不会察觉到它的存在。
> —— Beatrice Warde

## 三个常被忽略的细节

1. **行高**：长文阅读的行高应该在 1.6 到 1.8 之间。
2. **字偶距**：大标题需要负字距，正文则保持默认。
3. **段落首行缩进**：在衬线字体的杂志版式里，缩进比段间距更优雅。

## 杂志风的精髓

杂志的版式美感来自**对约束的尊重**。12 列网格、固定的段宽、克制的字体层级——它们不是束缚，而是让信息变得清晰的工具。

\`\`\`css
.prose {
  max-width: 65ch;
  line-height: 1.7;
  hanging-punctuation: first last;
}
\`\`\`

这不是关于风格的选择，这是关于**对读者的尊重**。
`,
    },
    {
      slug: "building-a-blog-with-next-and-prisma",
      title: "用 Next.js 与 Prisma 搭建一个属于自己的杂志",
      titleEn: "Building a Magazine with Next.js & Prisma",
      excerpt: "从零到一，记录一个全栈博客系统的设计与实现。",
      excerptEn: "From zero to one — designing a full-stack blogging engine.",
      coverImage: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1600",
      coverCaption: "Photo by Igor Miske on Unsplash",
      featured: false,
      status: "published",
      categorySlug: "tech",
      tagSlugs: ["next.js", "react", "ai"],
      content: `这是一份关于自建博客的笔记。

## 为什么不用现成的方案？

Hugo、Hexo、Ghost 都是好工具，但当你想要一些"独属于自己"的细节——例如：

- 一个杂志风的首字下沉
- 阅读进度条的颜色与正文呼应
- AI 自动生成的中文摘要

你会发现，自建是最自由的路径。

## 技术栈选择

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| ORM  | Prisma + SQLite |
| 认证 | NextAuth v5 |
| AI   | DeepSeek API |

## 一些有趣的取舍

为什么是 SQLite？因为它**就是文件**。备份就是复制；恢复就是粘贴。对于一个个人博客，这种简洁本身就是美德。

\`\`\`ts
const post = await prisma.post.findUnique({
  where: { slug },
  include: { tags: true, author: true },
});
\`\`\`

下一篇我会写如何让暗黑模式切换更优雅——使用 View Transitions API 制造圆形扩散的过渡。
`,
    },
    {
      slug: "on-reading-slowly",
      title: "缓慢阅读的练习",
      titleEn: "On Reading Slowly",
      excerpt: "在信息洪流的时代，慢一点，反而是一种激进。",
      excerptEn: "In an age of information torrents, slowness is the new radical act.",
      coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600",
      coverCaption: "Photo by Sincerely Media on Unsplash",
      featured: false,
      status: "published",
      categorySlug: "culture",
      tagSlugs: ["书评", "随想"],
      content: `每天醒来，第一件事不再是端起书，而是滑动屏幕。

## 我们都成了 Skimming Reader

林肯曾用三周时间反复阅读莎士比亚的一段独白。今天，我们用三秒钟决定要不要点开一篇文章。

> 慢阅读不是关于速度的反叛，而是关于注意力的重新分配。

## 三个小练习

1. **每周一本纸质书**：iPad 的反光会暴露你的疲劳，但纸不会。
2. **不带手机的散步**：让一段思考有机会从开头走到结尾。
3. **写读书笔记**：用钢笔。慢，但每一笔都在加固记忆。

## 写在最后

我们已经习惯了"摘要"和"要点"。但有些东西——例如一段诗、一个隐喻、一个无言的眼神——只能在缓慢中显形。
`,
    },
  ];

  for (const s of samples) {
    const cat = categories.find((c) => c.slug === s.categorySlug);
    const postTags = tags.filter((t) => s.tagSlugs.some((ts) => t.slug.toLowerCase() === ts.toLowerCase()));
    const readingMinutes = Math.max(1, Math.round(s.content.length / 600));
    await prisma.post.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        title: s.title,
        titleEn: s.titleEn,
        excerpt: s.excerpt,
        excerptEn: s.excerptEn,
        content: s.content,
        coverImage: s.coverImage,
        coverCaption: s.coverCaption,
        featured: s.featured,
        status: s.status,
        readingTime: readingMinutes,
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: cat?.id,
        tags: { connect: postTags.map((t) => ({ id: t.id })) },
      },
    });
    console.log(`[seed] post: ${s.title}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
