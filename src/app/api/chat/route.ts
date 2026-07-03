import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Lightweight rule-based fallback when OPENAI_API_KEY is not set
function ruleBasedResponse(message: string, productSummary: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("hour") || lower.includes("open") || lower.includes("close")) {
    return "We're open Monday–Saturday 10am–9pm and Sunday 11am–7pm. Stop by and see us!";
  }
  if (lower.includes("pickup") || lower.includes("order")) {
    return "All orders are available for in-store pickup. Place your order online and we'll have it ready when you arrive — just bring a valid 21+ ID.";
  }
  if (lower.includes("drop") || lower.includes("new product") || lower.includes("restock")) {
    return "New product drops happen every Tuesday, Thursday, and Saturday at 10am! Keep an eye on our Drops page for what's coming next.";
  }
  if (lower.includes("thc") || lower.includes("cbd") || lower.includes("potency")) {
    return "All our products are third-party lab tested. THC and CBD percentages are listed on each product page. We're happy to help you find the right potency for your needs!";
  }
  if (lower.includes("discount") || lower.includes("coupon") || lower.includes("promo") || lower.includes("deal")) {
    return "Sign up for our newsletter to get 10% off your first order! You'll also be the first to hear about new drops and exclusive deals.";
  }
  if (lower.includes("flower")) {
    return "Our flower selection includes premium sativa, indica, and hybrid strains. Check out the Flower category in our shop for current availability and THC/CBD info.";
  }
  if (lower.includes("edible")) {
    return "We carry a wide range of edibles — gummies, chocolates, mints, and more. Edibles are precisely dosed for a consistent experience. Start low, go slow!";
  }
  if (lower.includes("vape") || lower.includes("cartridge")) {
    return "Our vape cartridges include live resin and full-spectrum options in sativa, indica, and hybrid blends. Check the Vapes section for current stock.";
  }
  if (lower.includes("concentrate") || lower.includes("wax") || lower.includes("rosin") || lower.includes("shatter")) {
    return "We carry high-quality concentrates including live rosin, badder, and shatter. These are high-potency products recommended for experienced consumers.";
  }
  if (lower.includes("product") || lower.includes("available") || lower.includes("sell") || lower.includes("carry")) {
    return `We carry flower, edibles, vapes, concentrates, beverages, and accessories. Here's a quick overview of our current inventory:\n\n${productSummary}\n\nVisit our Shop page to see everything with prices and details!`;
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("help")) {
    return "Hey there! 👋 Welcome to High Society MN — Minnesota's premier cannabis dispensary. I can help you with product info, store hours, ordering, and more. What can I help you with today?";
  }
  return `Thanks for your question! I'm here to help with product info, store hours, ordering, and more.\n\nWe carry flower, edibles, vapes, concentrates, beverages, and accessories. You can browse our full selection on the Shop page.\n\nIs there something specific I can help you with?`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as {
      messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    // Fetch product summary for context
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
- Provide information about store hours, ordering, and pickup
- Promote new drops (every Tuesday, Thursday, Saturday at 10am)
- Mention the newsletter 10% discount when relevant
- Always remind customers that products are for adults 21+ only
- Never provide medical advice; direct medical questions to a healthcare provider

Store info:
- Location: Minneapolis, MN
- Hours: Mon–Sat 10am–9pm, Sun 11am–7pm
- Fulfillment: In-store pickup only (bring valid 21+ ID)
- New drops: Every Tuesday, Thursday & Saturday

Current inventory:
${productSummary}

Be warm, professional, and concise. Use cannabis-friendly language but stay legal and responsible.`;

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    // Use OpenAI if key is configured
    if (process.env.OPENAI_API_KEY) {
      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-10), // keep last 10 turns for context
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
      return NextResponse.json({ reply });
    }

    // Fallback rule-based response
    const reply = ruleBasedResponse(lastUserMessage, productSummary);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Chat service unavailable" }, { status: 500 });
  }
}
