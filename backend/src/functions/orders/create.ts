import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { GetCommand, PutCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import { getUserId } from "@common/auth";
import { fail, handleError, ok, parseBody } from "@common/http";
import { requireIndianMobile, requireString, optionalString } from "@common/validation";
import { buildWhatsAppMessage, buildWhatsAppUrl, computeOrderTotals, generateOrderId } from "@common/order-utils";
import type { CartRecord, OrderItemRecord, OrderRecord, ProductRecord } from "@common/types";

interface CreateOrderRequest {
  name: string;
  mobileNumber: string;
  address: string;
  landmark?: string;
}

/**
 * POST /orders
 *
 * Business-critical flow (see spec sections 17, 18, 25, 39):
 *   1. Load the customer's server-side cart (never trust a cart sent by the client).
 *   2. Re-read every product's current price and stock from DynamoDB.
 *   3. Reject the order if the cart is empty or any item is out of stock.
 *   4. Atomically decrement stock for every item using a DynamoDB transaction
 *      with a condition (stockQuantity >= quantity), so concurrent checkouts
 *      for the last unit of a product cannot oversell it.
 *   5. Persist the order (status = CREATED) before generating the WhatsApp
 *      redirect, so the order always exists even if the redirect fails.
 *   6. Clear the customer's cart.
 */
export async function handler(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const userId = getUserId(event);

    const body = parseBody<CreateOrderRequest>(event);
    const name = requireString(body.name, "name", { maxLength: 120 });
    const mobileNumber = requireIndianMobile(body.mobileNumber);
    const address = requireString(body.address, "address", { maxLength: 300 });
    const landmark = optionalString(body.landmark, "landmark", { maxLength: 120 });

    const cartResponse = await ddb.send(
      new GetCommand({ TableName: TableNames.CARTS, Key: { userId } })
    );
    const cart = cartResponse.Item as CartRecord | undefined;

    if (!cart || cart.items.length === 0) {
      return fail(400, "Your cart is empty.");
    }

    // Re-validate every product's live price + stock. This is the single
    // source of truth for the order total — frontend-submitted totals are
    // never used.
    const orderItems: OrderItemRecord[] = [];
    for (const cartItem of cart.items) {
      const productResponse = await ddb.send(
        new GetCommand({ TableName: TableNames.PRODUCTS, Key: { productId: cartItem.productId } })
      );
      const product = productResponse.Item as ProductRecord | undefined;

      if (!product || !product.active) {
        return fail(409, `${cartItem.productName} is no longer available.`);
      }
      if (!product.inStock || product.stockQuantity < cartItem.quantity) {
        return fail(409, `${product.productName} is currently out of stock.`);
      }

      orderItems.push({
        productId: product.productId,
        productName: product.productName,
        unit: product.unit,
        price: product.price,
        quantity: cartItem.quantity,
        total: product.price * cartItem.quantity,
      });
    }

    const { subtotal, deliveryFee, discount, total } = computeOrderTotals(orderItems);
    const orderId = await generateOrderId();
    const now = new Date().toISOString();

    const order: OrderRecord = {
      orderId,
      customerId: userId,
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
      // Atomically decrement stock for every item and persist the order in a
      // single all-or-nothing transaction. If any product's stock changed
      // concurrently and no longer satisfies the condition, the whole
      // transaction is rejected and no stock is touched.
      await ddb.send(
        new TransactWriteCommand({
          TransactItems: [
            ...orderItems.map((item) => ({
              Update: {
                TableName: TableNames.PRODUCTS,
                Key: { productId: item.productId },
                UpdateExpression:
                  "SET stockQuantity = stockQuantity - :qty, inStock = (stockQuantity - :qty) > :zero",
                ConditionExpression: "active = :true AND stockQuantity >= :qty",
                ExpressionAttributeValues: {
                  ":qty": item.quantity,
                  ":zero": 0,
                  ":true": true,
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

    // Order is durably stored — clear the cart, then hand back the WhatsApp URL.
    await ddb.send(
      new PutCommand({
        TableName: TableNames.CARTS,
        Item: { userId, items: [], updatedAt: now } as CartRecord,
      })
    );

    let whatsappUrl: string | null = null;
    try {
      whatsappUrl = buildWhatsAppUrl(order.whatsappMessage);
    } catch (err) {
      console.error("Failed to build WhatsApp URL:", err);
    }

    return ok(
      {
        order,
        whatsappUrl,
      },
      201
    );
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
