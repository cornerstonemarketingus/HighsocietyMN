import assert from "node:assert/strict";
import test from "node:test";
import { extractAssistantReply } from "../src/lib/llm-response";
import { ollamaEndpoint, requestOllamaReply } from "../src/lib/ollama";

test("extracts replies from supported LLM response shapes", () => {
  assert.equal(
    extractAssistantReply({ choices: [{ message: { content: "OpenAI reply" } }] }),
    "OpenAI reply",
  );
  assert.equal(
    extractAssistantReply({ choices: [{ text: "Legacy reply" }] }),
    "Legacy reply",
  );
  assert.equal(
    extractAssistantReply({ message: { content: "Ollama reply" } }),
    "Ollama reply",
  );
  assert.equal(extractAssistantReply({ output_text: "Output reply" }), "Output reply");
  assert.equal(extractAssistantReply({ response: "Native reply" }), "Native reply");
});

test("builds native Ollama chat endpoints without duplicating the api segment", () => {
  assert.equal(ollamaEndpoint("http://127.0.0.1:11434"), "http://127.0.0.1:11434/api/chat");
  assert.equal(ollamaEndpoint("https://ollama.example/api/"), "https://ollama.example/api/chat");
  assert.throws(() => ollamaEndpoint("  "), /cannot be empty/);
});

test("sends native non-streaming Ollama chat requests", { concurrency: false }, async () => {
  const previousBaseUrl = process.env.OLLAMA_BASE_URL;
  const previousModel = process.env.OLLAMA_MODEL;
  const previousFetch = globalThis.fetch;
  let capturedUrl = "";
  let capturedBody: Record<string, unknown> = {};

  process.env.OLLAMA_BASE_URL = "https://ollama.example";
  process.env.OLLAMA_MODEL = "qwen3:8b";
  globalThis.fetch = async (input, init) => {
    capturedUrl = String(input);
    capturedBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return new Response(JSON.stringify({ message: { content: "Grounded reply" } }), { status: 200 });
  };

  try {
    const reply = await requestOllamaReply([{ role: "user", content: "What should I try?" }]);
    assert.equal(reply, "Grounded reply");
    assert.equal(capturedUrl, "https://ollama.example/api/chat");
    assert.equal(capturedBody.model, "qwen3:8b");
    assert.equal(capturedBody.stream, false);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousBaseUrl === undefined) delete process.env.OLLAMA_BASE_URL;
    else process.env.OLLAMA_BASE_URL = previousBaseUrl;
    if (previousModel === undefined) delete process.env.OLLAMA_MODEL;
    else process.env.OLLAMA_MODEL = previousModel;
  }
});

test("joins structured content and rejects empty responses", () => {
  assert.equal(
    extractAssistantReply({
      choices: [{ message: { content: [{ text: "Part one. " }, { text: "Part two." }] } }],
    }),
    "Part one. Part two.",
  );
  assert.equal(extractAssistantReply({ choices: [] }), null);
  assert.equal(extractAssistantReply({ response: "   " }), null);
});
