import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Search engines and AI assistants (ChatGPT, Claude, Gemini, Perplexity, Copilot, Apple) are all welcome:
// being readable by them is how the restaurant shows up when people ask "where should I eat in Dublin 4?".
const AI_AND_SEARCH_BOTS = [
    "Googlebot",
    "Bingbot",
    "Google-Extended",
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Applebot",
    "Applebot-Extended",
    "DuckAssistBot",
    "CCBot",
    "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: "*", allow: "/", disallow: ["/admin/"] },
            { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow: ["/admin/"] },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
