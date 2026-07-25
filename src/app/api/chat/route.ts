import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as {
      messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const products = await db.product.findMany({
      where: { published: true, inStock: true },
      include: { category: true },
      take: 30,
      orderBy: { featured: "desc" },
    });

    const productSummary = products
      .map(
        (p) =>
          `• ${p.name} (${p.category.name}) — $${p.price}${p.thcContent ? ` | THC: ${p.thcContent}%` : ""}${p.cbdContent ? ` | CBD: ${p.cbdContent}%` : ""}${p.strain ? ` | ${p.strain}` : ""}`
      )
      .join("\n");

    const systemPrompt = `You are a friendly, knowledgeable budtender assistant for High Society MN, Minnesota's premier cannabis dispensary.

Your role:
- Help customers choose the right cannabis products for their needs
- Answer questions about strains, effects, dosing, and product types
- Provide information about store hours, ordering, and delivery
- Promote new drops (every Tuesday, Thursday, Saturday at 10am)
- Mention the newsletter 10% discount when relevant
- Always remind customers that products are for adults 21+ only
- Never provide medical advice; direct medical questions to a healthcare provider

Store info:
- Hours: Mon–Sat 10am–9pm, Sun 11am–7pm
- Fulfillment: Delivery only on Tuesday, Thursday, and Saturday
- No in-person pickup
- Delivery available in Saint Paul and the greater Minneapolis-Saint Paul metro area
- New drops: Every Tuesday, Thursday & Saturday

Current inventory:
${productSummary}

Be warm, professional, and concise. Use cannabis-friendly language but stay legal and responsible.`;

    if (!process.env.LLM_BASE_URL) {
      return NextResponse.json(
        { error: "Bud Seeker is not configured. Set LLM_BASE_URL in Vercel." },
        { status: 503 },
      );
    }

    const model = process.env.LLM_MODEL ?? "llama3.2";
    const baseUrl = process.env.LLM_BASE_URL.replace(/\/$/, "");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.LLM_API_KEY) headers.Authorization = `Bearer ${process.env.LLM_API_KEY}`;

    const llmRes = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...messages.slice(-10)],
        max_tokens: 500,
        temperature: 0.7,
        stream: false,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!llmRes.ok) {
      console.error("Private LLM request failed:", llmRes.status, await llmRes.text());
      return NextResponse.json({ error: "Bud Seeker model is temporarily unavailable." }, { status: 502 });
    }

    const data = await llmRes.json() as { choices?: Array<{ message?: { content?: string } }> };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ error: "Bud Seeker returned an empty response." }, { status: 502 });
    }
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Chat service unavailable" }, { status: 500 });
  }
}
