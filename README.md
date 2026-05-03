# Quill & Press · 杂志风全栈博客

一个为耐心读者打造的全栈博客系统。**杂志/编辑式**设计、衬线字体网格排版、**克制而精致的动效**，配备完整的内容管理后台与轻量 AI 能力。

> _"好的排版从不发出声音，它只是让文字呼吸得更顺畅。"_

---

## 特性

### 阅读端
- **杂志风版式**：12 列网格、Playfair Display + Source Serif + Noto Serif SC、首字下沉、报头排版
- **首页**：Hero 特色文章 + 横版突出 + 三列网格
- **文章详情**：粘性侧栏 TOC、阅读进度条、首字下沉、Pull Quote、自动锚点
- **暗黑模式**：基于 `View Transitions API` 的圆形扩散过渡（不闪烁）
- **中英双语**：`/zh` `/en` 路由切换，文案/标题/摘要均可分语言
- **RSS 2.0** 订阅源 + Sitemap + robots.txt
- **Giscus 评论**：基于 GitHub Discussions，主题自动同步

### 写作端
- **管理员登录**：仅一个账号，bcrypt + JWT
- **双栏 Markdown 编辑器**：左源码 / 右实时预览（滚动同步）
- **杂志元信息**：slug、英文标题、摘要、封面图、分类、标签、Featured 开关
- **图片上传**：拖入封面或上传到 `public/uploads/`
- **AI 生成摘要**：DeepSeek API（OpenAI 兼容协议）一键生成
- **草稿/发布**：状态切换、发布时自动写入 `publishedAt`

### 动效（克制原则）
- 滚动 FadeIn（IntersectionObserver，一次性，不打扰）
- 卡片 hover 图片 `scale(1.03)` + 标题颜色补间
- 链接下划线滑入
- 主题切换 `View Transitions` 圆形扩散 500ms
- 阅读进度条 1px Spring 平滑

---

## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | Next.js 15 (App Router + RSC + TypeScript) |
| 样式 | Tailwind CSS v3 + CSS Variables |
| 数据 | SQLite + Prisma ORM |
| 认证 | NextAuth v5 (Auth.js) Credentials |
| Markdown | react-markdown + remark-gfm + remark-math + rehype-highlight + rehype-katex |
| 评论 | Giscus |
| AI | DeepSeek (OpenAI 兼容) |
| 国际化 | next-intl |
| 动效 | Framer Motion + View Transitions API |
| 字体 | Playfair Display / Source Serif 4 / Noto Serif SC / Inter / JetBrains Mono |

---

## 快速开始

### 1. 安装依赖

```bash
cd my-blog
npm install
```

> 若网络不畅，可换 `pnpm install` 或 `cnpm`。

### 2. 配置环境变量

复制 `.env.example` 到 `.env`，按需修改：

```bash
cp .env.example .env
```

至少需要：
- `DATABASE_URL="file:./dev.db"`（SQLite 文件，开箱即用）
- `AUTH_SECRET`：用 `openssl rand -base64 32` 生成
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`：seed 时创建的管理员
- `DEEPSEEK_API_KEY`：可选，启用 AI 摘要
- `NEXT_PUBLIC_GISCUS_*`：可选，启用评论

### 3. 初始化数据库 + 种子

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

种子数据包括：1 个管理员、3 个分类、若干标签、3 篇示例文章。

### 4. 启动开发服务器

```bash
npm run dev
```

访问：
- 前台：<http://localhost:3000>
- 后台：<http://localhost:3000/admin/login>

---

## 项目结构

```
my-blog/
├── prisma/
│   ├── schema.prisma          # 数据模型（Post / User / Category / Tag）
│   └── seed.ts                # 初始数据
├── src/
│   ├── app/
│   │   ├── [locale]/          # 中英前台路由
│   │   ├── admin/             # 后台（不参与 i18n）
│   │   ├── api/               # 服务端 API
│   │   ├── rss.xml/           # RSS feed
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/            # Header / Footer / 主题切换
│   │   ├── post/              # 文章组件 (TOC / 进度条 / 评论 / 卡片)
│   │   ├── editor/            # 双栏 Markdown 编辑器
│   │   └── animation/         # FadeIn / PageTransition
│   ├── lib/                   # prisma / auth / deepseek / i18n / markdown / rss
│   ├── styles/                # globals.css + typography.css (.prose-magazine)
│   ├── messages/              # zh.json / en.json 文案
│   └── middleware.ts          # i18n + admin 鉴权
└── public/uploads/            # 文章图片
```

---

## 核心约定

### 数据流
- **前台**：使用 RSC 直接 `prisma.post.findMany(...)`，零客户端水合负担
- **后台**：客户端组件通过 `/api/posts/*` 读写
- **AI 摘要**：`/api/ai/summary` 接收 `title + content`，调 DeepSeek 返回 80–120 字中文摘要

### 设计 Token
- 颜色全部走 CSS 变量（`--color-paper / --color-ink / --color-accent ...`），主题切换时只换变量
- 字体走 `next/font/google` 子集化，零额外网络请求
- 排版样式集中在 `src/styles/typography.css` 的 `.prose-magazine`，包括首字下沉、引文、列表、代码块、水平线装饰 ❦

### 动效原则
**只在以下场景使用动效**：
- 信息进入视图（FadeIn 8px 上移，一次性）
- 用户主动交互（hover、click 反馈）
- 状态切换（主题、语言）

**绝不使用**：粒子、视差、复杂的 stagger、自动播放的 hero 视频、loading 旋转环超过 200ms

---

## 部署

### Vercel（推荐）
1. 推送到 GitHub
2. Import 到 Vercel
3. 配置环境变量（含 `DATABASE_URL`、`AUTH_SECRET`、`AUTH_URL`、`DEEPSEEK_API_KEY`）
4. SQLite 在 Vercel 不持久 — 生产环境建议切到 **Turso (libSQL)** 或 **Postgres (Neon)**：
   - 修改 `prisma/schema.prisma` 的 `provider`
   - `npm run db:push`

### 自托管
```bash
npm run build
npm run start
```

配合 systemd / pm2 + Caddy 反代即可。

---

## 验证清单

- [ ] 首页：Hero 文章 + 网格列表，字体加载无 FOUT
- [ ] 详情页：Drop Cap 显示、TOC 粘性高亮当前章节、进度条流畅
- [ ] 主题切换：圆形扩散过渡，无闪烁
- [ ] 中英切换：URL 段切换，文案/排序生效
- [ ] `/admin/login`：登录后进入 dashboard
- [ ] `/admin/posts/new`：双栏编辑器实时预览，AI 摘要生成 OK
- [ ] `/rss.xml` 与 `/sitemap.xml` 返回合法 XML
- [ ] Giscus 评论加载（需要先在 GitHub Discussions 配置）

---

## 后续可拓展
- 全文搜索（FlexSearch / Pagefind）
- 草稿自动保存到 IndexedDB
- 邮件订阅（Resend）
- 图片转 webp + CDN
- AI 自动推荐相关文章

---

© Made with Next.js, Prisma, and a great deal of patience.
