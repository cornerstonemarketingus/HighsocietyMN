import { db } from "@/lib/db";
import { requestOllamaReply } from "@/lib/ollama";

export const BLOG_TOPICS = [
  "A practical guide to reading cannabis product labels",
  "Terpenes and aroma: how to shop with your senses",
  "Flower, edibles, vapes, and concentrates: choosing a format",
  "How to build a thoughtful low-dose cannabis routine",
  "What makes small-batch flower feel premium",
  "Live resin, rosin, and distillate explained",
  "Responsible cannabis storage for an adult household",
  "How freshness, cure, and storage shape flower quality",
  "Planning a relaxed cannabis tasting with friends",
  "Why potency is only one part of choosing cannabis",
] as const;

const COVER_BY_TOPIC = [
  { terms: ["edible", "dose", "label"], image: "/images/categories/edibles.svg" },
  { terms: ["vape", "distillate", "resin"], image: "/images/categories/vapes.svg" },
  { terms: ["rosin", "concentrate", "extract"], image: "/images/categories/concentrates.svg" },
  { terms: ["drink", "beverage"], image: "/images/categories/beverages.svg" },
  { terms: ["storage", "accessor"], image: "/images/categories/accessories.svg" },
] as const;

export function blogCoverFor(title: string, existing?: string | null) {
  if (existing?.trim()) return existing;
  const normalized = title.toLowerCase();
  return COVER_BY_TOPIC.find(group => group.terms.some(term => normalized.includes(term)))?.image
    ?? "/images/categories/flower.svg";
}

export function slugifyBlogTitle(title: string) {
  return title.toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 90);
}

export function parseBlogDraft(raw: string) {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("The model did not return a JSON blog draft");
  const value = JSON.parse(match[0]) as Record<string, unknown>;
  const title = typeof value.title === "string" ? value.title.trim() : "";
  const excerpt = typeof value.excerpt === "string" ? value.excerpt.trim() : "";
  const content = typeof value.content === "string" ? value.content.trim() : "";
  if (title.length < 12 || title.length > 140 || excerpt.length < 40 || excerpt.length > 320 || content.length < 1_800 || content.length > 12_000) {
    throw new Error("The model returned an incomplete or oversized blog draft");
  }
  if (/<script|<iframe|javascript:/i.test(content)) throw new Error("The model returned unsafe content");
  return { title, excerpt, content };
}

function chooseTopic(recentTitles: readonly string[], requested?: string) {
  if (requested?.trim()) return requested.trim().slice(0, 180);
  const normalized = recentTitles.map(title => title.toLowerCase());
  return BLOG_TOPICS.find(topic => !normalized.some(title => title.includes(topic.toLowerCase().split(":")[0]))) ?? BLOG_TOPICS[new Date().getUTCDate() % BLOG_TOPICS.length];
}

export async function generateAndPublishBlog(options: { authorId: string; topic?: string }) {
  const recent = await db.blogPost.findMany({ orderBy: { publishedAt: "desc" }, take: 20, select: { title: true } });
  const topic = chooseTopic(recent.map(post => post.title), options.topic);
  const reply = await requestOllamaReply([
    {
      role: "system",
      content: "You are the High Society MN editorial desk. Write useful, polished cannabis education for adults 21+. Never give medical advice, diagnose conditions, promise effects, invent product availability, or state legal rules as current fact. Encourage readers to verify labels, laws, and personal health questions with authoritative professionals. Return JSON only.",
    },
    {
      role: "user",
      content: `Create an original 650-850 word article about: ${topic}\n\nReturn one JSON object with title, excerpt, and content. Content must be plain text with section headings beginning with ##, short paragraphs, and optional bullet lines beginning with -. Do not use HTML. Mention responsible adult use and secure storage naturally. Do not mention AI or claim the article was written by a person.`,
    },
  ], { temperature: 0.65, numPredict: 2_200 });
  if (!reply) throw new Error("Ollama is not configured");
  const draft = parseBlogDraft(reply);
  const slug = `${slugifyBlogTitle(draft.title)}-${new Date().toISOString().slice(0, 10)}`;
  const duplicate = await db.blogPost.findFirst({ where: { OR: [{ slug }, { title: draft.title }] }, select: { id: true } });
  if (duplicate) throw new Error("A matching blog post already exists");
  return db.blogPost.create({
    data: {
      ...draft,
      slug,
      image: blogCoverFor(`${draft.title} ${topic}`),
      authorId: options.authorId,
      published: true,
      publishedAt: new Date(),
    },
  });
}
