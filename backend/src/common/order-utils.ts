import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableNames } from "./dynamo";
import type { OrderItemRecord, OrderRecord } from "./types";

const DELIVERY_FEE = Number(process.env.DELIVERY_FEE ?? 30);
const FREE_DELIVERY_THRESHOLD = Number(process.env.FREE_DELIVERY_THRESHOLD ?? 500);
const STORE_NAME = process.env.STORE_NAME ?? "Sangameshwara Kiranam & General Store";

/**
 * Generates a human-friendly, unique order ID in the form ORD-YYYYMMDD-001
 * using an atomic per-day counter item stored in the Orders table
 * (PK = "COUNTER#<date>"). Using DynamoDB's atomic ADD avoids race conditions
 * when multiple customers checkout at the same time.
 */
export async function generateOrderId(): Promise<string> {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const counterKey = `COUNTER#${datePart}`;

  const result = await ddb.send(
    new UpdateCommand({
      TableName: TableNames.ORDERS,
      Key: { orderId: counterKey },
      UpdateExpression: "ADD seq :incr",
      ExpressionAttributeValues: { ":incr": 1 },
      ReturnValues: "UPDATED_NEW",
    })
  );

  const seq = Number(result.Attributes?.seq ?? 1);
  const seqPadded = String(seq).padStart(3, "0");
  return `ORD-${datePart}-${seqPadded}`;
}

export function calculateDeliveryFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

export function buildWhatsAppMessage(order: OrderRecord): string {
  const lines: string[] = [];

  lines.push("NEW GROCERY ORDER");
  lines.push("");
  lines.push(`Order ID: ${order.orderId}`);
  lines.push("");
  lines.push("Customer:");
  lines.push(order.customerName);
  lines.push("");
  lines.push("Mobile:");
  lines.push(order.mobileNumber);
  lines.push("");
  lines.push("Delivery Address:");
  lines.push(order.address + (order.landmark ? ` (Landmark: ${order.landmark})` : ""));
  lines.push("");
  lines.push("-----------------------------");
  lines.push("ITEMS");
  lines.push("");

  for (const item of order.items) {
    lines.push(
      `${item.productName} (${item.unit}) x${item.quantity} @ ₹${item.price} = ₹${item.total}`
    );
  }

  lines.push("");
  lines.push("-----------------------------");
  lines.push(`Subtotal: ₹${order.subtotal}`);
  if (order.discount > 0) {
    lines.push(`Discount: -₹${order.discount}`);
  }
  lines.push(`Delivery: ${order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}`);
  lines.push(`TOTAL: ₹${order.total}`);
  lines.push("");
  lines.push("Please confirm this order.");
  lines.push(`Thank you for shopping with ${STORE_NAME}!`);

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  const adminNumber = (process.env.ADMIN_WHATSAPP_NUMBER ?? "").replace(/[^\d]/g, "");
  if (!adminNumber) {
    throw new Error("ADMIN_WHATSAPP_NUMBER environment variable is not configured.");
  }
  return `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
}

export function computeOrderTotals(items: OrderItemRecord[]) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const discount = 0; // Reserved for future coupon/discount support.
  const total = subtotal + deliveryFee - discount;
  return { subtotal, deliveryFee, discount, total };
}
