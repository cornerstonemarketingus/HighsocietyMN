import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const CATEGORY_PROMPTS: Record<string, string> = {
  general: "a friendly, open-ended discussion topic for the general lounge",
  "strain-reviews": "a first-person style review of a popular cannabis strain or product format",
  "tips-tricks": "a responsible-use tip or piece of cannabis education",
  events: "a conversation starter about an upcoming vault drop or cannabis event in Minnesota",
  "new-members": "a warm welcome or icebreaker question for new members introducing themselves",
};

export async function POST(req: NextRequest) {
  const session = await auth();
  const cronAuthorized =
    Boolean(process.env.CRON_SECRET) &&
    req.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
  if ((!session?.user?.id || session.user.role !== "ADMIN") && !cronAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as { categorySlug?: string };
  const categorySlugs = Object.keys(CATEGORY_PROMPTS);
  const categorySlug = body.categorySlug && CATEGORY_PROMPTS[body.categorySlug]
    ? body.categorySlug
    : categorySlugs[Math.floor(Math.random() * categorySlugs.length)];

  const category = await db.forumCategory.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    return NextResponse.json({ error: `Forum category "${categorySlug}" does not exist yet.` }, { status: 404 });
  }

  const baseUrl = (process.env.OLLAMA_BASE_URL || (process.env.OLLAMA_API_KEY ? "https://ollama.com" : "")).replace(/\/$/, "");
  if (!baseUrl) {
    return NextResponse.json({ error: "Ollama not configured. Set OLLAMA_BASE_URL or OLLAMA_API_KEY." }, { status: 503 });
  }

  const model = process.env.OLLAMA_MODEL ?? "gemma4:31b";

  const prompt = `Write ${CATEGORY_PROMPTS[categorySlug]} for the member lounge of a high-end cannabis dispensary in Minnesota called "High Society MN".

The thread should be:
- Written in a warm, conversational, first-person voice (as a fellow member or the High Society team, not a bot)
- 3-6 short paragraphs for the opening post
- Specific and interesting, not generic filler
- Free of medical claims; always assume readers are adults 21+
- Never mention pricing, discounts, or anything that reads as an ad

Format: Return JSON with fields: title (string, under 90 characters), content (string, the opening post in plain text with blank lines between paragraphs).`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.OLLAMA_API_KEY) headers.Authorization = `Bearer ${process.env.OLLAMA_API_KEY}`;
  const llmRes = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      options: { num_predict: 900, temperature: 0.9 },
      stream: false,
    }),
  });

  if (!llmRes.ok) {
    return NextResponse.json({ error: "LLM request failed" }, { status: 502 });
  }

  const data = await llmRes.json() as { message?: { content?: string } };
  const rawContent = data.message?.content ?? "";

  let parsed: { title?: string; content?: string } = {};
  try {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]) as typeof parsed;
  } catch {
    parsed = {};
  }

  const title = (parsed.title ?? "").trim();
  const content = (parsed.content ?? rawContent).trim();
  if (!title || !content) {
    return NextResponse.json({ error: "LLM returned an unusable response" }, { status: 502 });
  }

  const authorId = session?.user?.id ?? (await db.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  }))?.id;
  if (!authorId) {
    return NextResponse.json({ error: "Create an admin user before generating posts." }, { status: 503 });
  }

  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const slug = `${base}-${Date.now().toString(36)}`;

  const thread = await db.forumThread.create({
    data: {
      title,
      slug,
      categoryId: category.id,
      authorId,
      posts: { create: { content, authorId } },
    },
    include: {
      category: true,
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { posts: true } },
    },
  });

  return NextResponse.json(thread);
}

export async function GET(req: NextRequest) {
  return POST(req);
}
