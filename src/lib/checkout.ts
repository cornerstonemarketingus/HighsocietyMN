export const ORDER_TAX_RATE = 0.08875;
export const MAX_ITEM_QUANTITY = 10;

export type CheckoutProduct = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  published: boolean;
  inStock: boolean;
  stockQuantity: number;
};

export type CheckoutTotals = {
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
};

export function toCents(value: number): number {
  if (!Number.isFinite(value) || value < 0) throw new Error("Invalid monetary value");
  return Math.round(value * 100);
}

export function calculateCheckoutTotals(
  items: Pick<CheckoutProduct, "price" | "quantity">[],
  taxRate = ORDER_TAX_RATE,
): CheckoutTotals {
  if (!Number.isFinite(taxRate) || taxRate < 0) throw new Error("Invalid tax rate");

  const subtotalCents = items.reduce((sum, item) => {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_ITEM_QUANTITY) {
      throw new Error("Invalid quantity");
    }
    return sum + toCents(item.price) * item.quantity;
  }, 0);
  const taxCents = Math.round(subtotalCents * taxRate);

  return { subtotalCents, taxCents, totalCents: subtotalCents + taxCents };
}

export function validateCheckoutProducts(items: CheckoutProduct[]): string | null {
  if (items.length === 0) return "Cart is empty";
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_ITEM_QUANTITY) {
      return "Cart contains an invalid quantity";
    }
    if (!item.published || !item.inStock || item.stockQuantity < item.quantity) {
      return `${item.name} is no longer available in the requested quantity`;
    }
    if (!Number.isFinite(item.price) || item.price < 0) return `${item.name} has invalid pricing`;
  }
  return null;
}

export function isPaidSessionValid(input: {
  paymentStatus: string;
  amountTotal: number | null;
  expectedTotalCents: number;
}): boolean {
  return input.paymentStatus === "paid" && input.amountTotal === input.expectedTotalCents;
}

export function shouldConfirmOrder(status: string): boolean {
  return status === "PENDING";
}

export function shouldReleaseReservation(status: string): boolean {
  return status === "PENDING";
}
