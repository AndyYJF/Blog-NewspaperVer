"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { MermaidBlock } from "./MermaidBlock";

const components: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const lang = match?.[1];
    const value = String(children ?? "");

    // Mermaid diagrams — render with mermaid.js
    if (lang === "mermaid") {
      return <MermaidBlock code={value.replace(/\n$/, "")} />;
    }

    // Inline code (not in pre)
    // react-markdown v9 distinguishes inline vs block via parent — handled by default
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  // Wrap pre blocks with a header showing language
  pre({ children, ...props }) {
    return <pre {...props}>{children}</pre>;
  },
};

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
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
