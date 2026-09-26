import type { APIRoute } from "astro";
import { siteConfig } from "@/config/site";

/**
 * robots.txt — generated so the Sitemap line always matches the canonical origin.
 * AI answer engines (ChatGPT, Claude, Perplexity, Gemini, Copilot) are explicitly
 * allowed: being cited by them is a traffic source (GEO), and the content is
 * public reference data.
 */
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "YandexBot",
];

export const GET: APIRoute = () => {
  const body = [
    "User-agent: *",
    "Allow: /",
    // Search result pages are client-rendered and thin — keep crawl budget for real pages.
    "Disallow: /arama/?",
    "",
    ...aiCrawlers.flatMap((ua) => [
      `User-agent: ${ua}`,
      "Allow: /",
      "Disallow: /arama/?",
      "",
    ]),
    `Sitemap: ${siteConfig.url}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
