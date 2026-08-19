import assert from "node:assert/strict";
import test from "node:test";
import { createVaultSeals, validVaultMove } from "../src/components/games/VaultRun";

test("vault movement respects walls and open corridors", () => {
  assert.equal(validVaultMove(16, "up"), 16);
  assert.equal(validVaultMove(16, "left"), 16);
  assert.equal(validVaultMove(16, "right"), 17);
});

test("vault seals are placed only on playable cells", () => {
  const seals = createVaultSeals();
  assert.equal(seals.has(0), false);
  assert.equal(seals.has(16), false);
  assert.equal(seals.has(17), true);
  assert.ok(seals.size > 50);
});
