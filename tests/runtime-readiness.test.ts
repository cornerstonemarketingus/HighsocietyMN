import assert from "node:assert/strict";
import test from "node:test";
import { getRuntimeReadiness, hasGoogleCredentials } from "../src/lib/runtime-readiness";

test("reports complete capabilities without exposing values", () => {
  const result = getRuntimeReadiness({
    DATABASE_URL: "secret-db-url",
    AUTH_SECRET: "secret",
    AUTH_URL: "https://example.com",
    STRIPE_SECRET_KEY: "sk_secret",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_value",
    STRIPE_WEBHOOK_SECRET: "whsec_value",
    GOOGLE_CLIENT_ID: "client",
    GOOGLE_CLIENT_SECRET: "client-secret",
  });

  assert.equal(result.required.database, true);
  assert.equal(result.capabilities.stripeCheckout, true);
  assert.equal(result.capabilities.googleSignIn, true);
  assert.doesNotMatch(JSON.stringify(result), /secret-db-url|sk_secret|client-secret/);
});

test("flags partial provider configuration", () => {
  const result = getRuntimeReadiness({ GOOGLE_CLIENT_ID: "client", STRIPE_SECRET_KEY: "key" });
  assert.equal(result.partial.googleSignIn, true);
  assert.equal(result.partial.stripe, true);
  assert.equal(hasGoogleCredentials({ GOOGLE_CLIENT_ID: "client" }), false);
});
