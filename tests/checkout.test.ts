import assert from "node:assert/strict";
import test from "node:test";
import { calculateCheckoutTotals, isPaidSessionValid, shouldConfirmOrder, shouldReleaseReservation, toCents, validateCheckoutProducts } from "../src/lib/checkout";

test("checkout totals use integer cents and include tax", () => {
  assert.deepEqual(calculateCheckoutTotals([{ price: 19.99, quantity: 2 }]), {
    subtotalCents: 3998,
    taxCents: 355,
    totalCents: 4353,
  });
  assert.equal(toCents(10.005), 1001);
});

test("checkout rejects invalid quantities and unavailable stock", () => {
  const base = { id: "p1", name: "Flower", price: 30, quantity: 1, published: true, inStock: true, stockQuantity: 1 };
  assert.equal(validateCheckoutProducts([base]), null);
  assert.match(validateCheckoutProducts([{ ...base, quantity: 0 }]) ?? "", /invalid quantity/i);
  assert.match(validateCheckoutProducts([{ ...base, quantity: 2 }]) ?? "", /no longer available/i);
  assert.match(validateCheckoutProducts([{ ...base, published: false }]) ?? "", /no longer available/i);
  assert.throws(() => calculateCheckoutTotals([{ price: 30, quantity: 0 }]), /Invalid quantity/);
});

test("paid session validation requires both paid status and exact order total", () => {
  assert.equal(isPaidSessionValid({ paymentStatus: "paid", amountTotal: 4353, expectedTotalCents: 4353 }), true);
  assert.equal(isPaidSessionValid({ paymentStatus: "unpaid", amountTotal: 4353, expectedTotalCents: 4353 }), false);
  assert.equal(isPaidSessionValid({ paymentStatus: "paid", amountTotal: 3998, expectedTotalCents: 4353 }), false);
});

test("order transitions are idempotent once pending state is consumed", () => {
  assert.equal(shouldConfirmOrder("PENDING"), true);
  assert.equal(shouldReleaseReservation("PENDING"), true);
  for (const status of ["CONFIRMED", "READY", "COMPLETED", "CANCELLED", "REFUNDED"]) {
    assert.equal(shouldConfirmOrder(status), false);
    assert.equal(shouldReleaseReservation(status), false);
  }
});
