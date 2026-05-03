/**
 * DeepSeek API 客户端（OpenAI 兼容协议）
 */

const BASE = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
const MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chat(messages: ChatMessage[], opts?: { temperature?: number; max_tokens?: number }) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not configured");

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: opts?.temperature ?? 0.6,
      max_tokens: opts?.max_tokens ?? 400,
      stream: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DeepSeek API ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content as string;
}

export async function summarizeArticle(title: string, content: string, locale: "zh" | "en" = "zh") {
  const sys =
    locale === "zh"
      ? "你是一位简练的杂志编辑。用 80-120 字概括文章主旨，语气克制、有文学性，不使用列表，不重复标题，仅输出摘要正文。"
      : "You are a concise magazine editor. Summarize the essay in 60-90 English words. Restrained, literary tone. No lists, no repeating the title. Output only the summary.";
  return chat([
    { role: "system", content: sys },
    { role: "user", content: `Title: ${title}\n\n${content.slice(0, 6000)}` },
  ]);
}
