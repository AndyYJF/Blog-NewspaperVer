/* eslint-disable */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: "admin" } });
  if (!admin) throw new Error("No admin user — run main seed first.");

  const techCat = await prisma.category.findUnique({ where: { slug: "tech" } });

  const content = `当我们用文字描述算法时，一图胜过千言。当我们用文字描述数学时，一个公式胜过一段散文。

本文展示如何在文章中混合使用 **LaTeX 数学公式**与 **Mermaid 图表**，并保持杂志式的排版美感。

## 一段简单的数学

行内公式 $E = mc^2$ 是物理学最优雅的等式之一。

居中行间公式：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}
$$

或者一个矩阵：

$$
\\mathbf{A} = \\begin{pmatrix}
a_{11} & a_{12} & a_{13} \\\\
a_{21} & a_{22} & a_{23} \\\\
a_{31} & a_{32} & a_{33}
\\end{pmatrix}
$$

## 一段流程图

下面是一个简单的请求处理流程：

\`\`\`mermaid
flowchart LR
  A[用户] -->|HTTP 请求| B(Next.js Edge)
  B --> C{是否缓存?}
  C -->|是| D[返回缓存]
  C -->|否| E[查询数据库]
  E --> F[Prisma + SQLite]
  F --> G[渲染 RSC]
  G --> D
\`\`\`

## 一段时序图

\`\`\`mermaid
sequenceDiagram
  participant U as 读者
  participant B as 浏览器
  participant S as 服务器
  participant DB as 数据库
  U->>B: 访问 /zh/posts/...
  B->>S: GET 请求
  S->>DB: prisma.post.findUnique
  DB-->>S: Post 数据
  S->>S: ReactMarkdown + KaTeX + Mermaid
  S-->>B: HTML
  B-->>U: 页面呈现
\`\`\`

## 一个甘特图（编辑日历）

\`\`\`mermaid
gantt
  title 本期出版日程
  dateFormat YYYY-MM-DD
  section 撰稿
  排版手艺          :a1, 2026-04-01, 7d
  缓慢阅读          :a2, after a1, 5d
  section 编辑
  审稿              :b1, 2026-04-10, 5d
  上版              :b2, after b1, 3d
\`\`\`

## 一些更深的数学

著名的欧拉恒等式：

$$
e^{i\\pi} + 1 = 0
$$

将五个最重要的数学常数 $0, 1, \\pi, e, i$ 以最简洁的方式联系起来。

求和符号示例：

$$
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}
$$

## 写在最后

> 公式与图表，从来不是冷冰冰的符号——它们也是一种排版。

无论是数学还是流程图，它们都是文字的延伸。我们希望这本杂志能让它们变得和段落一样优雅。
`;

  const slug = "latex-and-mermaid-demo";
  const tagSet = await prisma.tag.findMany({
    where: { slug: { in: ["next.js", "ai", "设计"] } },
  });

  await prisma.post.upsert({
    where: { slug },
    update: { content, status: "published" },
    create: {
      slug,
      title: "数学、图表与排版的共处之道",
      titleEn: "Math, Diagrams & The Art of Typography",
      excerpt: "如何在文章中优雅地混合 LaTeX 公式与 Mermaid 图表？",
      excerptEn: "How to elegantly mix LaTeX formulas with Mermaid diagrams in editorial writing?",
      content,
      coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600",
      coverCaption: "Photo by ThisisEngineering on Unsplash",
      status: "published",
      featured: false,
      readingTime: Math.max(2, Math.round(content.length / 600)),
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: techCat?.id,
      aiSummary: "这是一篇技术演示，展示如何在杂志风博客中渲染 LaTeX 数学公式与 Mermaid 流程图、时序图、甘特图，并保持优雅的排版。",
      tags: { connect: tagSet.map((t) => ({ id: t.id })) },
    },
  });
  console.log("[seed] demo post created.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
