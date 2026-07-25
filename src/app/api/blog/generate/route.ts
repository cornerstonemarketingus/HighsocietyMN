import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const TOPICS = [
  "The Benefits of Microdosing Cannabis for Creativity",
  "Understanding Terpenes: The Aromatic Compounds in Cannabis",
  "Indica vs Sativa vs Hybrid: What Does It All Mean?",
  "How to Choose the Right Cannabis Strain for Sleep",
  "Minnesota Cannabis Laws: What You Need to Know in 2024",
  "The Art of the Perfect Cannabis Pairing: Food and Flower",
  "Live Resin vs Distillate: Which Extract is Right for You?",
  "Cannabis and Wellness: A Modern Approach to Self-Care",
  "Top Cannabis Strains for Social Situations",
  "The Science Behind the Entourage Effect",
];

export async function POST(req: NextRequest) {
  const session = await auth();
  const cronAuthorized =
    Boolean(process.env.CRON_SECRET) &&
    req.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
  if ((!session?.user?.id || session.user.role !== "ADMIN") && !cronAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as { topic?: string };
  const topic = body.topic ?? TOPICS[Math.floor(Math.random() * TOPICS.length)];

  const baseUrl = (process.env.OLLAMA_BASE_URL || (process.env.OLLAMA_API_KEY ? "https://ollama.com" : "")).replace(/\/$/, "");
  if (!baseUrl) {
    return NextResponse.json({ error: "Ollama not configured. Set OLLAMA_BASE_URL or OLLAMA_API_KEY." }, { status: 503 });
  }

  const model = process.env.OLLAMA_MODEL ?? "gemma4:31b";

  const prompt = `Write an engaging, SEO-optimized blog post for a high-end cannabis dispensary in Minnesota called "High Society MN" about the topic: "${topic}".

The post should be:
- 600-800 words
- Informative and professional
- Include relevant cannabis terminology
- Emphasize quality and luxury experience
- Include a compelling introduction, 3-4 sections with headers, and a conclusion
- Reference Minnesota's legal cannabis market where appropriate
- Always remind readers that cannabis is for adults 21+
- Written in a friendly, knowledgeable tone

Format: Return JSON with fields: title (string), excerpt (string, 1-2 sentences), content (string, full HTML content with <h2> tags for sections, <p> tags for paragraphs).`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.OLLAMA_API_KEY) headers.Authorization = `Bearer ${process.env.OLLAMA_API_KEY}`;
  const llmRes = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      options: { num_predict: 1500, temperature: 0.8 },
      stream: false,
    }),
  });

  if (!llmRes.ok) {
    return NextResponse.json({ error: "LLM request failed" }, { status: 502 });
  }

  const data = await llmRes.json() as { message?: { content?: string } };
  const rawContent = data.message?.content ?? "";

  let parsed: { title?: string; excerpt?: string; content?: string } = {};
  try {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]) as typeof parsed;
  } catch {
    parsed = { title: topic, excerpt: topic, content: `<p>${rawContent}</p>` };
  }

  const slug = (parsed.title ?? topic)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const authorId = session?.user?.id ?? (await db.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  }))?.id;
  if (!authorId) {
    return NextResponse.json({ error: "Create an admin user before generating posts." }, { status: 503 });
  }

  const post = await db.blogPost.create({
    data: {
      title: parsed.title ?? topic,
      slug: `${slug}-${Date.now()}`,
      excerpt: parsed.excerpt ?? "",
      content: parsed.content ?? rawContent,
      authorId,
      published: true,
      publishedAt: new Date(),
    },
  });

  return NextResponse.json(post);
}

export async function GET(req: NextRequest) {
  return POST(req);
}
