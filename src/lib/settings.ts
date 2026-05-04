import { prisma } from "./prisma";
import { unstable_cache, revalidateTag } from "next/cache";

/**
 * Editable site settings — stored in the `Setting` table.
 * Values fall back to environment variables for first-run / dev use.
 */
export const SETTINGS_TAG = "site-settings";

/** Schema definition — drives both DB seeding and the admin form. */
export const settingsSchema = [
  // General
  { key: "site.title",   label: "Site title",   type: "text",     group: "general", order: 1, envVar: "NEXT_PUBLIC_SITE_TITLE",   default: "Quill & Press" },
  { key: "site.tagline", label: "Tagline",      type: "text",     group: "general", order: 2, envVar: "NEXT_PUBLIC_SITE_TAGLINE", default: "A magazine of essays, ideas, and quiet observations" },
  { key: "site.url",     label: "Public URL",   type: "url",      group: "general", order: 3, envVar: "NEXT_PUBLIC_SITE_URL",     default: "http://localhost:3000" },
  { key: "site.about",   label: "About blurb",  type: "textarea", group: "general", order: 4, default: "Made for the patient reader." },

  // Giscus
  { key: "giscus.repo",       label: "Giscus repo (user/repo)", type: "text", group: "comments", order: 1, envVar: "NEXT_PUBLIC_GISCUS_REPO",        default: "" },
  { key: "giscus.repoId",     label: "Giscus repo ID",          type: "text", group: "comments", order: 2, envVar: "NEXT_PUBLIC_GISCUS_REPO_ID",     default: "" },
  { key: "giscus.category",   label: "Giscus category",         type: "text", group: "comments", order: 3, envVar: "NEXT_PUBLIC_GISCUS_CATEGORY",    default: "Announcements" },
  { key: "giscus.categoryId", label: "Giscus category ID",      type: "text", group: "comments", order: 4, envVar: "NEXT_PUBLIC_GISCUS_CATEGORY_ID", default: "" },

  // AI
  { key: "ai.apiKey",  label: "DeepSeek API key", type: "password", group: "ai", order: 1, secret: true, envVar: "DEEPSEEK_API_KEY",  default: "" },
  { key: "ai.baseUrl", label: "DeepSeek base URL", type: "url",     group: "ai", order: 2,               envVar: "DEEPSEEK_BASE_URL", default: "https://api.deepseek.com" },
  { key: "ai.model",   label: "DeepSeek model",    type: "text",    group: "ai", order: 3,               envVar: "DEEPSEEK_MODEL",    default: "deepseek-chat" },
] as const;

export type SettingDef = (typeof settingsSchema)[number];

/** Load all settings as a flat object. Cached, tagged for revalidation. */
export const loadSettings = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const rows = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    // Fill missing keys with env / defaults
    for (const s of settingsSchema) {
      if (map[s.key] === undefined || map[s.key] === null) {
        const envVal = (s as SettingDef & { envVar?: string }).envVar
          ? process.env[(s as SettingDef & { envVar?: string }).envVar!]
          : undefined;
        map[s.key] = envVal ?? s.default;
      }
    }
    return map;
  },
  ["site-settings"],
  { tags: [SETTINGS_TAG] }
);

export function invalidateSettings() {
  revalidateTag(SETTINGS_TAG);
}

/** Async helper for server components and API routes */
export async function getSiteConfig() {
  const s = await loadSettings();
  return {
    title: s["site.title"] ?? "Quill & Press",
    tagline: s["site.tagline"] ?? "",
    url: s["site.url"] ?? "http://localhost:3000",
    about: s["site.about"] ?? "",
    giscus: {
      repo: s["giscus.repo"] ?? "",
      repoId: s["giscus.repoId"] ?? "",
      category: s["giscus.category"] ?? "Announcements",
      categoryId: s["giscus.categoryId"] ?? "",
    },
    ai: {
      apiKey: s["ai.apiKey"] ?? "",
      baseUrl: s["ai.baseUrl"] ?? "https://api.deepseek.com",
      model: s["ai.model"] ?? "deepseek-chat",
    },
  };
}
