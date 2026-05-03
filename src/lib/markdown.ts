/**
 * Markdown 工具：提取目录（TOC）与生成 slug
 * 渲染交给 react-markdown 在客户端/RSC 完成。
 */

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function slugifyHeading(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** 从 markdown 源码中提取 H2/H3 标题，构建 TOC */
export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split(/\r?\n/);
  const items: TocItem[] = [];
  let inCodeBlock = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`]/g, "").trim();
      items.push({ level, text, id: slugifyHeading(text) });
    }
  }
  return items;
}

/** 简易的纯文本提取，用于 AI 总结输入 */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "") // 代码块
    .replace(/`[^`]*`/g, "") // 行内代码
    .replace(/!\[[^\]]*]\([^)]*\)/g, "") // 图片
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1") // 链接
    .replace(/^>+\s?/gm, "") // 引用
    .replace(/[*_~]{1,2}([^*_~]+)[*_~]{1,2}/g, "$1") // 强调
    .replace(/^#{1,6}\s+/gm, "") // 标题
    .replace(/^-{3,}$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
