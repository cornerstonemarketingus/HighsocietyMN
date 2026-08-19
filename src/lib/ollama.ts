import { extractAssistantReply } from "@/lib/llm-response";

export interface OllamaMessage {
  readonly role: "system" | "user" | "assistant";
  readonly content: string;
}

const DEFAULT_TIMEOUT_MS = 30_000;

function timeoutMs(): number {
  const configured = Number(process.env.OLLAMA_TIMEOUT_MS ?? process.env.LLM_TIMEOUT_MS);
  return Number.isFinite(configured) && configured >= 1_000
    ? Math.min(configured, 120_000)
    : DEFAULT_TIMEOUT_MS;
}

export function ollamaEndpoint(baseUrl: string): string {
  const normalized = baseUrl.trim().replace(/\/+$/, "");
  if (!normalized) throw new Error("OLLAMA_BASE_URL cannot be empty");
  return normalized.endsWith("/api") ? `${normalized}/chat` : `${normalized}/api/chat`;
}

export async function requestOllamaReply(
  messages: readonly OllamaMessage[],
  options: { temperature?: number; numPredict?: number } = {},
): Promise<string | null> {
  const baseUrl = process.env.OLLAMA_BASE_URL?.trim();
  if (!baseUrl) return null;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.OLLAMA_API_KEY) headers.Authorization = `Bearer ${process.env.OLLAMA_API_KEY}`;

  const response = await fetch(ollamaEndpoint(baseUrl), {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL?.trim() || "llama3.2",
      messages,
      stream: false,
      options: {
        temperature: options.temperature ?? 0.55,
        num_predict: options.numPredict ?? 500,
      },
    }),
    signal: AbortSignal.timeout(timeoutMs()),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}`);
  }

  return extractAssistantReply(await response.json());
}
