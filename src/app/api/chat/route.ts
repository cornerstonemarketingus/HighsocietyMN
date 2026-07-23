import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function ruleBasedResponse(message: string, productSummary: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("hour") || lower.includes("open") || lower.includes("close")) {
    return "Our team is available Monday–Saturday 10am–9pm and Sunday 11am–7pm, with delivery service available Tuesday, Thursday, and Saturday.";
  }
  if (lower.includes("pickup") || lower.includes("delivery") || lower.includes("order")) {
    return "High Society MN is delivery-only — no in-person pickup. We deliver on Tuesday, Thursday, and Saturday throughout Saint Paul and the greater Minneapolis–Saint Paul metro area.";
  }
  if (lower.includes("drop") || lower.includes("new product") || lower.includes("restock")) {
    return "New product drops happen every Tuesday, Thursday, and Saturday at 10am. Check our Drops page to see what's landing next.";
  }
  if (lower.includes("thc") || lower.includes("cbd") || lower.includes("potency")) {
    return "All our products are third-party lab tested, and THC/CBD percentages are listed on each product page. I can also help you compare potency options for adults 21+.";
  }
  if (lower.includes("discount") || lower.includes("coupon") || lower.includes("promo") || lower.includes("deal")) {
    return "Sign up for our newsletter to get 10% off your first delivery order and be first to hear about fresh drops and exclusive offers.";
  }
  if (lower.includes("flower")) {
    return "Our flower selection includes premium sativa, indica, and hybrid strains. Browse the Flower category for current availability, terpene profiles, and THC/CBD details.";
  }
  if (lower.includes("edible")) {
    return "We carry a wide range of edibles including gummies, chocolates, mints, and more. They're precisely dosed for consistency — start low and go slow.";
  }
  if (lower.includes("vape") || lower.includes("cartridge")) {
    return "Our vape lineup includes live resin and full-spectrum options across sativa, indica, and hybrid profiles. Check the Vapes section for current inventory.";
  }
  if (lower.includes("concentrate") || lower.includes("wax") || lower.includes("rosin") || lower.includes("shatter")) {
    return "We carry premium concentrates including live rosin, badder, and shatter. These are high-potency products best suited for experienced adult consumers.";
  }
  if (lower.includes("product") || lower.includes("available") || lower.includes("sell") || lower.includes("carry")) {
    return `We carry flower, edibles, vapes, concentrates, beverages, and accessories. Here's a quick overview of current inventory:\n\n${productSummary}\n\nYou can browse the full menu on our Shop page and place a delivery order for eligible areas.`;
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("help")) {
    return "Hey there! 👋 Welcome to High Society MN. I can help with product recommendations, delivery info, drops, and general cannabis questions for adults 21+. What can I help you with today?";
  }
  return `Thanks for your question! I'm here to help with product info, delivery details, drops, and more.\n\nWe carry flower, edibles, vapes, concentrates, beverages, and accessories, and we deliver Tuesday, Thursday, and Saturday across Saint Paul and the greater Minneapolis–Saint Paul metro area.\n\nIs there something specific I can help you with?`;
}

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

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    if (process.env.LLM_BASE_URL) {
      const model = process.env.LLM_MODEL ?? "llama3.2";
      const baseUrl = process.env.LLM_BASE_URL.replace(/\/$/, "");

      const llmRes = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.slice(-10),
          ],
          max_tokens: 500,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (llmRes.ok) {
        const data = await llmRes.json() as { choices?: Array<{ message?: { content?: string } }> };
        const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
        return NextResponse.json({ reply });
      }
    }

    const reply = ruleBasedResponse(lastUserMessage, productSummary);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Chat service unavailable" }, { status: 500 });
  }
}
