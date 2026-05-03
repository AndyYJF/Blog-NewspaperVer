"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export function ArticleContent({ content }: { content: string }) {
  return (
    <div className="prose-magazine">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeSlug,
          rehypeKatex,
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: { className: "anchor-link", ariaLabel: "anchor" },
              content: { type: "text", value: "§" },
            },
          ],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
