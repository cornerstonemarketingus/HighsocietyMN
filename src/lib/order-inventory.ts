import { db } from "@/lib/db";
import { shouldReleaseReservation } from "@/lib/checkout";

export async function releasePendingOrder(orderId: string): Promise<boolean> {
  return db.$transaction(async transaction => {
    const order = await transaction.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order || !shouldReleaseReservation(order.status)) return false;
    const cancelled = await transaction.order.updateMany({
      where: { id: orderId, status: "PENDING" },
      data: { status: "CANCELLED" },
    });
    if (cancelled.count !== 1) return false;

    for (const item of order.items) {
      await transaction.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { increment: item.quantity }, inStock: true },
      });
      await transaction.cartItem.upsert({
        where: { userId_productId: { userId: order.userId, productId: item.productId } },
        update: { quantity: { increment: item.quantity } },
        create: { userId: order.userId, productId: item.productId, quantity: item.quantity },
      });
    }
    return true;
  });
}
