import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { GetCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import { fail, handleError, ok, parseBody } from "@common/http";
import { requireIndianMobile, requireNumber, requireString, optionalString } from "@common/validation";
import { buildWhatsAppMessage, buildWhatsAppUrl, computeOrderTotals, generateOrderId } from "@common/order-utils";
import type { OrderItemRecord, OrderRecord, ProductRecord } from "@common/types";

interface GuestCartItemInput {
  productId: string;
  quantity: number;
}

interface CreateGuestOrderRequest {
  name: string;
  mobileNumber: string;
  address: string;
  landmark?: string;
  items: GuestCartItemInput[];
}

/**
 * POST /guest-orders  (PUBLIC — no authentication)
 *
 * Guest checkout for a WhatsApp-order grocery store (no customer login/OTP).
 * The customer's cart lives only in their browser (localStorage) and is sent
 * in the request body as a list of { productId, quantity }.
 *
 * Security note: although this endpoint is unauthenticated, it still NEVER
 * trusts any price, name, or total from the client. For every line it
 * re-reads the authoritative price and live stock from DynamoDB, and it
 * decrements stock atomically (same TransactWrite + condition as the
 * authenticated order path), so a guest cannot oversell stock or manipulate
 * pricing. The only client-provided values used verbatim are the contact
 * details (name/mobile/address), which the admin re-confirms over WhatsApp
 * anyway.
 */
export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const body = parseBody<CreateGuestOrderRequest>(event);
    const name = requireString(body.name, "name", { maxLength: 120 });
    const mobileNumber = requireIndianMobile(body.mobileNumber);
    const address = requireString(body.address, "address", { maxLength: 300 });
    const landmark = optionalString(body.landmark, "landmark", { maxLength: 120 });

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return fail(400, "Your cart is empty.");
    }
    if (body.items.length > 100) {
      return fail(400, "Too many items in the cart.");
    }

    // Normalize + validate the incoming cart lines. Collapse duplicate
    // productIds so a repeated line can't bypass the per-product stock check.
    const quantityByProduct = new Map<string, number>();
    for (const raw of body.items) {
      const productId = requireString(raw.productId, "items[].productId");
      const quantity = requireNumber(raw.quantity, "items[].quantity", { min: 1, max: 99 });
      quantityByProduct.set(productId, (quantityByProduct.get(productId) ?? 0) + quantity);
    }

    const orderItems: OrderItemRecord[] = [];
    const willBeOutOfStock = new Map<string, boolean>();
    for (const [productId, quantity] of quantityByProduct) {
      const productResponse = await ddb.send(
        new GetCommand({ TableName: TableNames.PRODUCTS, Key: { productId } })
      );
      const product = productResponse.Item as ProductRecord | undefined;

      if (!product || !product.active) {
        return fail(409, "One or more items are no longer available. Please review your cart.");
      }
      if (!product.inStock || product.stockQuantity < quantity) {
        return fail(409, `${product.productName} is currently out of stock.`);
      }

      // Will the product hit zero stock after this order? Used to set the
      // derived inStock flag. The authoritative oversell guard is the
      // ConditionExpression (stockQuantity >= :qty) in the transaction below.
      willBeOutOfStock.set(productId, product.stockQuantity - quantity <= 0);

      orderItems.push({
        productId: product.productId,
        productName: product.productName,
        unit: product.unit,
        price: product.price,
        quantity,
        total: product.price * quantity,
      });
    }

    const { subtotal, deliveryFee, discount, total } = computeOrderTotals(orderItems);
    const orderId = await generateOrderId();
    const now = new Date().toISOString();

    const order: OrderRecord = {
      orderId,
      customerId: "GUEST",
      customerName: name,
      mobileNumber,
      address,
      landmark,
      items: orderItems,
      subtotal,
      deliveryFee,
      discount,
      total,
      status: "CREATED",
      createdAt: now,
      updatedAt: now,
    };
    order.whatsappMessage = buildWhatsAppMessage(order);

    try {
      await ddb.send(
        new TransactWriteCommand({
          TransactItems: [
            ...orderItems.map((item) => ({
              Update: {
                TableName: TableNames.PRODUCTS,
                Key: { productId: item.productId },
                UpdateExpression: "SET stockQuantity = stockQuantity - :qty, inStock = :inStock",
                ConditionExpression: "active = :true AND stockQuantity >= :qty",
                ExpressionAttributeValues: {
                  ":qty": item.quantity,
                  ":true": true,
                  ":inStock": !willBeOutOfStock.get(item.productId),
                },
              },
            })),
            {
              Put: {
                TableName: TableNames.ORDERS,
                Item: order,
                ConditionExpression: "attribute_not_exists(orderId)",
              },
            },
          ],
        })
      );
    } catch (err) {
      if (err instanceof ConditionalCheckFailedException || isTransactionCancelled(err)) {
        return fail(409, "One or more items in your cart just went out of stock. Please review your cart.");
      }
      throw err;
    }

    let whatsappUrl: string | null = null;
    try {
      whatsappUrl = buildWhatsAppUrl(order.whatsappMessage);
    } catch (err) {
      console.error("Failed to build WhatsApp URL:", err);
    }

    return ok({ order, whatsappUrl }, 201);
  } catch (err) {
    return handleError(err);
  }
}

function isTransactionCancelled(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as { name?: string }).name === "TransactionCanceledException"
  );
}
