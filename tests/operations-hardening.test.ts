import test from "node:test";
import assert from "node:assert/strict";
import nextConfig from "../next.config";
import { hasInventoryIntent, ruleBasedResponse } from "../src/lib/chat-fallback";
import { safeAgeGateReturnTo } from "../src/lib/age-gate";

test("inventory requests bypass free-form chat and retain catalog links", () => {
  assert.equal(hasInventoryIntent("Do you have any flower in stock?"), true);
  const summary = "• Golden Goat (Flower) — $35 | /products/golden-goat";
  const reply = ruleBasedResponse("What flower is in stock?", summary);
  assert.match(reply, /Golden Goat/);
  assert.match(reply, /\/products\/golden-goat/);
});

test("age gate return paths remain same-origin", () => {
  assert.equal(safeAgeGateReturnTo("/products?category=flower"), "/products?category=flower");
  assert.equal(safeAgeGateReturnTo("//evil.example/path"), null);
  assert.equal(safeAgeGateReturnTo("/\\evil.example"), null);
  assert.equal(safeAgeGateReturnTo("https://evil.example"), null);
});

test("legacy games and vault URLs keep permanent compatibility redirects", async () => {
  assert.equal(typeof nextConfig.redirects, "function");
  const redirects = await nextConfig.redirects!();
  assert.deepEqual(
    redirects.filter(redirect => redirect.source === "/games" || redirect.source === "/vault"),
    [
      { source: "/vault", destination: "/drops", permanent: true },
      { source: "/games", destination: "/spin", permanent: true },
    ],
  );
});
