import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { extractAssistantReply } from "@/lib/llm-response";
import { requestOllamaReply } from "@/lib/ollama";
import { hasInventoryIntent, ruleBasedResponse } from "@/lib/chat-fallback";
import { exceedsBodyLimit, isAgeVerified, rateLimit, readBoundedJson } from "@/lib/request-guards";

export const dynamic = "force-dynamic";

const INVENTORY_TIMEOUT_MS = 2_000;
const DEFAULT_LLM_TIMEOUT_MS = 30_000;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2_000;

interface ChatMessage {
  readonly role: "user" | "assistant";
  readonly content: string;
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0 &&
    candidate.content.length <= MAX_MESSAGE_LENGTH
  );
}

function llmTimeoutMs(): number {
  const configured = Number(process.env.LLM_TIMEOUT_MS);
  return Number.isFinite(configured) && configured >= 1_000
    ? Math.min(configured, 120_000)
    : DEFAULT_LLM_TIMEOUT_MS;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Operation timed out")), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}

function summarizeProducts(products: Array<{
  name: string; slug: string; price: number; thcContent: number | null; cbdContent?: number | null;
  strain: string | null; category: { name: string };
}>) {
  return products.map(product =>
    `• ${product.name} (${product.category.name}) — $${product.price}${product.thcContent ? ` | THC: ${product.thcContent}%` : ""}${product.cbdContent ? ` | CBD: ${product.cbdContent}%` : ""}${product.strain ? ` | ${product.strain}` : ""} | /products/${product.slug}`
  ).join("\n");
}

export async function POST(req: NextRequest) {
  try {
    if (!isAgeVerified(req)) return NextResponse.json({ error: "Age verification required" }, { status: 403 });
    if (exceedsBodyLimit(req, 50_000)) return NextResponse.json({ error: "Request is too large" }, { status: 413 });
    const retryAfter = rateLimit(req, "chat", 12, 60_000);
    if (retryAfter) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
    const body = await readBoundedJson<{ messages?: unknown }>(req, 50_000);
    const messages = body.messages;

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > MAX_MESSAGES ||
      !messages.every(isChatMessage)
    ) {
      return NextResponse.json(
        { error: "Provide 1–20 valid user or assistant messages." },
        { status: 400 },
      );
    }

    // Important: never hard-fail the chat endpoint when DB isn't ready.
    let productSummary = "";
    try {
      const products = await withTimeout(
        db.product.findMany({
          where: { published: true, inStock: true },
          include: { category: true },
          take: 30,
          orderBy: { featured: "desc" },
        }),
        INVENTORY_TIMEOUT_MS,
      );

      productSummary = summarizeProducts(products);
    } catch (dbErr) {
      console.warn(
        "Chat API DB query failed; continuing without inventory:",
        dbErr
      );
      productSummary = "";
    }

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

Grounding rules:
- Only describe a product as available when it appears in Current inventory above
- Never invent a product, price, potency, promotion, policy, or product URL
- If inventory is empty or does not answer the question, say you cannot verify it and direct the customer to the Shop page

Be warm, professional, and concise. Use cannabis-friendly language but stay legal and responsible.`;

    const lastUserMessage =
      [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    // Inventory answers must come from the normalized catalog, never model memory.
    if (hasInventoryIntent(lastUserMessage)) {
      return NextResponse.json({ reply: ruleBasedResponse(lastUserMessage, productSummary) });
    }

    if (process.env.OLLAMA_BASE_URL) {
      try {
        const reply = await requestOllamaReply([
          { role: "system", content: systemPrompt },
          ...messages.slice(-10),
        ]);
        if (reply) return NextResponse.json({ reply });
      } catch (ollamaErr) {
        console.warn("Chat API Ollama request failed; using fallback:", ollamaErr);
      }
    }

    if (process.env.LLM_BASE_URL) {
      try {
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
          signal: AbortSignal.timeout(llmTimeoutMs()),
        });

        if (llmRes.ok) {
          const reply = extractAssistantReply(await llmRes.json());
          if (reply) return NextResponse.json({ reply });
        } else {
          console.warn("Chat API LLM returned a non-success status:", llmRes.status);
        }
      } catch (llmErr) {
        console.warn("Chat API LLM request failed; using local fallback:", llmErr);
      }
    }

    const reply = ruleBasedResponse(lastUserMessage, productSummary);
    return NextResponse.json({ reply });
  } catch (err) {
    if (err instanceof RangeError) return NextResponse.json({ error: err.message }, { status: 413 });
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Chat service unavailable" },
      { status: 500 }
    );
  }
}

