import { getSiteConfig } from "./settings";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chat(
  messages: ChatMessage[],
  opts?: { temperature?: number; max_tokens?: number }
) {
  const cfg = await getSiteConfig();
  const apiKey = cfg.ai.apiKey || process.env.DEEPSEEK_API_KEY;
  const baseUrl = cfg.ai.baseUrl || "https://api.deepseek.com";
  const model = cfg.ai.model || "deepseek-chat";
  if (!apiKey) throw new Error("DeepSeek API key is not configured. Set it in /admin/settings.");

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
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
