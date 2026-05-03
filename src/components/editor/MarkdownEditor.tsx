"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { Save, Send, Sparkles, Eye, EyeOff, Trash2, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";

type Tag = { id: string; name: string; slug: string };
type Category = { id: string; name: string; slug: string };

export interface InitialPost {
  id?: string;
  title?: string;
  titleEn?: string | null;
  slug?: string;
  excerpt?: string | null;
  excerptEn?: string | null;
  content?: string;
  coverImage?: string | null;
  coverCaption?: string | null;
  status?: "draft" | "published";
  featured?: boolean;
  categoryId?: string | null;
  aiSummary?: string | null;
  tagIds?: string[];
}

export function MarkdownEditor({
  initial,
  categories,
  tags,
}: {
  initial?: InitialPost;
  categories: Category[];
  tags: Tag[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [tagIds, setTagIds] = useState<string[]>(initial?.tagIds ?? []);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [aiSummary, setAiSummary] = useState(initial?.aiSummary ?? "");
  const [previewVisible, setPreviewVisible] = useState(true);

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // 自动生成 slug
  useEffect(() => {
    if (!slug && title) setSlug(slugify(title));
  }, [title, slug]);

  // 滚动同步：编辑器与预览
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const onScrollEditor = () => {
    if (!editorRef.current || !previewRef.current) return;
    const e = editorRef.current;
    const ratio = e.scrollTop / Math.max(1, e.scrollHeight - e.clientHeight);
    previewRef.current.scrollTop = ratio * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
  };

  const wordCount = useMemo(() => {
    const cn = (content.match(/[一-龥]/g) ?? []).length;
    const en = content.replace(/[一-龥]/g, " ").split(/\s+/).filter(Boolean).length;
    return cn + en;
  }, [content]);

  async function save(status: "draft" | "published") {
    setSaving(true);
    setError(null);
    const payload = {
      title,
      titleEn: titleEn || null,
      slug: slug || undefined,
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      status,
      featured,
      categoryId: categoryId || null,
      tagIds,
      aiSummary: aiSummary || null,
    };
    try {
      const url = isEdit ? `/api/posts/${initial!.id}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error?.toString?.() ?? `HTTP ${res.status}`);
      }
      const post = await res.json();
      if (!isEdit) router.push(`/admin/posts/${post.id}/edit`);
      else router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function generateSummary() {
    if (!title || !content) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, locale: "zh" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "AI failed");
      setAiSummary(data.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI failed");
    } finally {
      setGenerating(false);
    }
  }

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) return data.url as string;
    throw new Error(data.error ?? "Upload failed");
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  async function deletePost() {
    if (!isEdit) return;
    if (!confirm("Delete this post permanently?")) return;
    await fetch(`/api/posts/${initial!.id}`, { method: "DELETE" });
    router.push("/admin/posts");
    router.refresh();
  }

  function toggleTag(id: string) {
    setTagIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="flex flex-wrap items-center gap-3 border-b border-rule px-6 py-3">
        <input
          type="text"
          placeholder="Untitled essay"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 min-w-[240px] bg-transparent font-serif text-2xl font-bold tracking-tightest outline-none placeholder:text-muted"
        />
        <span className="hidden font-sans text-xs uppercase tracking-widest text-muted md:inline">
          {wordCount} words
        </span>
        <button
          onClick={() => setPreviewVisible((v) => !v)}
          className="inline-flex items-center gap-2 border border-rule px-3 py-1.5 font-sans text-xs uppercase tracking-widest transition-colors hover:bg-subtle"
        >
          {previewVisible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          Preview
        </button>
        <button
          onClick={() => save("draft")}
          disabled={saving}
          className="inline-flex items-center gap-2 border border-rule px-3 py-1.5 font-sans text-xs uppercase tracking-widest transition-colors hover:bg-subtle disabled:opacity-50"
        >
          <Save className="size-3.5" />
          Draft
        </button>
        <button
          onClick={() => save("published")}
          disabled={saving}
          className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-1.5 font-sans text-xs uppercase tracking-widest text-paper transition-colors hover:bg-accent hover:border-accent disabled:opacity-50"
        >
          <Send className="size-3.5" />
          {saving ? "Saving…" : "Publish"}
        </button>
      </header>

      {error && (
        <div className="border-b border-accent bg-accent-soft/50 px-6 py-2 font-sans text-sm text-accent">
          {error}
        </div>
      )}

      <div className="grid flex-1 overflow-hidden lg:grid-cols-[1fr,1fr]">
        {/* 编辑面板 */}
        <div className="flex flex-col overflow-hidden border-r border-rule">
          {/* 元信息折叠区 */}
          <details className="border-b border-rule bg-subtle/30 open:bg-subtle/50">
            <summary className="cursor-pointer select-none px-6 py-3 font-sans text-xs uppercase tracking-widest text-muted">
              Metadata
            </summary>
            <div className="space-y-3 px-6 pb-5">
              <Field label="Slug">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border-b border-rule bg-transparent py-1 font-mono text-sm outline-none focus:border-accent"
                />
              </Field>
              <Field label="Title (English)">
                <input
                  type="text"
                  value={titleEn ?? ""}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full border-b border-rule bg-transparent py-1 outline-none focus:border-accent"
                />
              </Field>
              <Field label="Excerpt">
                <textarea
                  value={excerpt ?? ""}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full resize-none border-b border-rule bg-transparent py-1 outline-none focus:border-accent"
                />
              </Field>
              <Field label="Cover image">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={coverImage ?? ""}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://… or /uploads/…"
                    className="flex-1 border-b border-rule bg-transparent py-1 font-mono text-xs outline-none focus:border-accent"
                  />
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-1 border border-rule px-2 py-1 font-sans text-xs"
                  >
                    <ImageIcon className="size-3" /> Upload
                  </button>
                </div>
              </Field>
              <Field label="Section">
                <select
                  value={categoryId ?? ""}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full border-b border-rule bg-transparent py-1 font-sans text-sm outline-none focus:border-accent"
                >
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tags">
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => {
                    const on = tagIds.includes(t.id);
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => toggleTag(t.id)}
                        className={`border px-2 py-0.5 font-sans text-xs uppercase tracking-widest transition-colors ${
                          on
                            ? "border-accent bg-accent text-paper"
                            : "border-rule text-muted hover:border-accent hover:text-accent"
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Featured">
                <label className="inline-flex items-center gap-2 font-sans text-sm">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  Show as the issue's featured essay
                </label>
              </Field>
              <Field label="AI summary">
                <div className="space-y-2">
                  <textarea
                    value={aiSummary ?? ""}
                    onChange={(e) => setAiSummary(e.target.value)}
                    rows={3}
                    placeholder="Auto-generated summary or write your own…"
                    className="w-full resize-none border border-rule bg-paper px-2 py-1 font-serif italic outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={generateSummary}
                    disabled={generating || !content}
                    className="inline-flex items-center gap-1.5 border border-accent px-3 py-1 font-sans text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-paper disabled:opacity-50"
                  >
                    <Sparkles className="size-3" />
                    {generating ? "Thinking…" : "Generate with AI"}
                  </button>
                </div>
              </Field>
              {isEdit && (
                <div className="border-t border-rule pt-3">
                  <button
                    type="button"
                    onClick={deletePost}
                    className="inline-flex items-center gap-1 border border-rule px-3 py-1 font-sans text-xs uppercase tracking-widest text-muted transition-colors hover:bg-accent hover:text-paper hover:border-accent"
                  >
                    <Trash2 className="size-3" /> Delete post
                  </button>
                </div>
              )}
            </div>
          </details>

          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onScroll={onScrollEditor}
            spellCheck={false}
            placeholder="Write your essay in Markdown…"
            className="flex-1 resize-none bg-paper px-8 py-6 font-mono text-[14px] leading-7 outline-none placeholder:italic placeholder:text-muted"
          />
        </div>

        {/* 预览面板 */}
        {previewVisible && (
          <div ref={previewRef} className="overflow-y-auto bg-paper px-8 py-6">
            <div className="prose-magazine">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeSlug, rehypeKatex, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
              >
                {content || "_Preview will appear here…_"}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-1">{label}</p>
      {children}
    </div>
  );
}
