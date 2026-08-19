type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as JsonRecord
    : null;
}

function extractText(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (!Array.isArray(value)) return null;

  const text = value
    .map((part) => {
      const record = asRecord(part);
      return record && typeof record.text === "string" ? record.text : "";
    })
    .join("")
    .trim();

  return text || null;
}

export function extractAssistantReply(payload: unknown): string | null {
  const root = asRecord(payload);
  if (!root) return null;

  const choices = Array.isArray(root.choices) ? root.choices : [];
  const firstChoice = asRecord(choices[0]);
  const choiceMessage = firstChoice ? asRecord(firstChoice.message) : null;
  const directMessage = asRecord(root.message);

  return (
    extractText(choiceMessage?.content) ??
    extractText(firstChoice?.text) ??
    extractText(directMessage?.content) ??
    extractText(root.output_text) ??
    extractText(root.response)
  );
}
