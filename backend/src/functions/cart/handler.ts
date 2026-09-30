import type {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TableNames } from "@common/dynamo";
import { getUserId } from "@common/auth";
import { ApiError, fail, handleError, ok, parseBody } from "@common/http";
import { requireNumber, requireString } from "@common/validation";
import type { CartItemRecord, CartRecord, ProductRecord } from "@common/types";

/**
 * The cart is scoped strictly to the authenticated user's own Cognito sub
 * (partition key = userId from the verified JWT). There is no way for a
 * request to read or write another user's cart because the key is never
 * taken from client input.
 */

async function loadCart(userId: string): Promise<CartRecord> {
  const response = await ddb.send(
    new GetCommand({ TableName: TableNames.CARTS, Key: { userId } })
  );
  return (response.Item as CartRecord) ?? { userId, items: [], updatedAt: new Date().toISOString() };
}

async function saveCart(cart: CartRecord): Promise<void> {
  cart.updatedAt = new Date().toISOString();
  await ddb.send(new PutCommand({ TableName: TableNames.CARTS, Item: cart }));
}

async function fetchProduct(productId: string): Promise<ProductRecord> {
  const response = await ddb.send(
    new GetCommand({ TableName: TableNames.PRODUCTS, Key: { productId } })
  );
  const product = response.Item as ProductRecord | undefined;
  if (!product || !product.active) {
    throw new ApiError(404, "Product not found.");
  }
  return product;
}

/** GET /cart */
export async function getCart(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const userId = getUserId(event);
    const cart = await loadCart(userId);
    return ok(cart);
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /cart
 * Body: { productId, quantity }
 * Adds a product to the cart (or increments quantity if already present).
 * Product price/name/unit are always re-read from DynamoDB, never trusted
 * from the request body, so a customer cannot manipulate cart pricing.
 */
export async function addToCart(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const userId = getUserId(event);
    const body = parseBody<{ productId?: string; quantity?: number }>(event);
    const productId = requireString(body.productId, "productId");
    const quantity = requireNumber(body.quantity ?? 1, "quantity", { min: 1, max: 99 });

    const product = await fetchProduct(productId);
    if (!product.inStock || product.stockQuantity < 1) {
      return fail(409, "This product is currently out of stock.");
    }

    const cart = await loadCart(userId);
    const existingIndex = cart.items.findIndex((item) => item.productId === productId);

    if (existingIndex >= 0) {
      cart.items[existingIndex]!.quantity += quantity;
    } else {
      const newItem: CartItemRecord = {
        productId: product.productId,
        productName: product.productName,
        unit: product.unit,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
      };
      cart.items.push(newItem);
    }

    await saveCart(cart);
    return ok(cart);
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PUT /cart/{productId}
 * Body: { quantity }
 * Sets the exact quantity for a product already in the cart.
 */
export async function updateCartItem(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const userId = getUserId(event);
    const productId = event.pathParameters?.productId;
    if (!productId) {
      throw new ApiError(400, "productId is required.");
    }
    const body = parseBody<{ quantity?: number }>(event);
    const quantity = requireNumber(body.quantity, "quantity", { min: 0, max: 99 });

    const cart = await loadCart(userId);
    const existingIndex = cart.items.findIndex((item) => item.productId === productId);

    if (existingIndex < 0) {
      return fail(404, "Product not found in cart.");
    }

    if (quantity === 0) {
      cart.items.splice(existingIndex, 1);
    } else {
      // Refresh price snapshot from the catalog in case it changed.
      const product = await fetchProduct(productId);
      cart.items[existingIndex]!.quantity = quantity;
      cart.items[existingIndex]!.price = product.price;
    }

    await saveCart(cart);
    return ok(cart);
  } catch (err) {
    return handleError(err);
  }
}

/** DELETE /cart/{productId} */
export async function removeFromCart(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    const userId = getUserId(event);
    const productId = event.pathParameters?.productId;
    if (!productId) {
      throw new ApiError(400, "productId is required.");
    }

    const cart = await loadCart(userId);
    cart.items = cart.items.filter((item) => item.productId !== productId);

    await saveCart(cart);
    return ok(cart);
  } catch (err) {
    return handleError(err);
  }
}
