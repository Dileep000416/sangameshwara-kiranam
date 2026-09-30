import { env } from "./env";
import type {
  Cart,
  Category,
  DashboardStats,
  Order,
  PaginatedResponse,
  Product,
  UserProfile,
} from "@/types";

export class ApiRequestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type TokenGetter = () => Promise<string | null>;

/**
 * Thin fetch wrapper around the API Gateway HTTP API. Every authenticated
 * call attaches the customer's Cognito ID token as a Bearer token; the
 * backend re-verifies it via the API Gateway JWT authorizer, so a stale or
 * tampered token is rejected before any Lambda code runs.
 */
class ApiClient {
  private getToken: TokenGetter | null = null;

  setTokenGetter(getter: TokenGetter) {
    this.getToken = getter;
  }

  private async request<T>(
    path: string,
    options: { method?: string; body?: unknown; auth?: boolean } = {}
  ): Promise<T> {
    if (!env.apiUrl) {
      throw new ApiRequestError(0, "The store's API is not configured yet. Please try again later.");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.auth) {
      const token = this.getToken ? await this.getToken() : null;
      if (!token) {
        throw new ApiRequestError(401, "Please log in to continue.");
      }
      headers.Authorization = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(`${env.apiUrl}${path}`, {
        method: options.method ?? "GET",
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      });
    } catch {
      throw new ApiRequestError(0, "Unable to reach the server. Please check your connection and try again.");
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : undefined;

    if (!response.ok) {
      const message = (data && typeof data === "object" && "error" in data ? data.error : undefined) as
        | string
        | undefined;
      throw new ApiRequestError(response.status, message ?? "Something went wrong. Please try again.");
    }

    return data as T;
  }

  // --- Public -----------------------------------------------------------
  listProducts(
    params: { category?: string; search?: string; featured?: boolean; page?: number; pageSize?: number } = {}
  ) {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.featured) query.set("featured", "true");
    if (params.page) query.set("page", String(params.page));
    if (params.pageSize) query.set("pageSize", String(params.pageSize));
    const qs = query.toString();
    return this.request<PaginatedResponse<Product>>(`/products${qs ? `?${qs}` : ""}`);
  }

  getProduct(productId: string) {
    return this.request<Product>(`/products/${encodeURIComponent(productId)}`);
  }

  listCategories() {
    return this.request<{ items: Category[] }>("/categories");
  }

  // --- Customer (authenticated) ----------------------------------------
  getMe() {
    return this.request<UserProfile>("/me", { auth: true });
  }

  updateMe(body: Partial<Pick<UserProfile, "name" | "email" | "address">>) {
    return this.request<UserProfile>("/me", { method: "PUT", body, auth: true });
  }

  getCart() {
    return this.request<Cart>("/cart", { auth: true });
  }

  addToCart(productId: string, quantity = 1) {
    return this.request<Cart>("/cart", { method: "POST", body: { productId, quantity }, auth: true });
  }

  updateCartItem(productId: string, quantity: number) {
    return this.request<Cart>(`/cart/${encodeURIComponent(productId)}`, {
      method: "PUT",
      body: { quantity },
      auth: true,
    });
  }

  removeFromCart(productId: string) {
    return this.request<Cart>(`/cart/${encodeURIComponent(productId)}`, { method: "DELETE", auth: true });
  }

  createOrder(body: { name: string; mobileNumber: string; address: string; landmark?: string }) {
    return this.request<{ order: Order; whatsappUrl: string | null }>("/orders", {
      method: "POST",
      body,
      auth: true,
    });
  }

  listMyOrders() {
    return this.request<{ items: Order[] }>("/orders", { auth: true });
  }

  getMyOrder(orderId: string) {
    return this.request<Order>(`/orders/${encodeURIComponent(orderId)}`, { auth: true });
  }

  // --- Admin --------------------------------------------------------------
  admin = {
    listProducts: () => this.request<{ items: Product[] }>("/admin/products", { auth: true }),
    createProduct: (body: Partial<Product>) =>
      this.request<Product>("/admin/products", { method: "POST", body, auth: true }),
    updateProduct: (productId: string, body: Partial<Product>) =>
      this.request<Product>(`/admin/products/${encodeURIComponent(productId)}`, {
        method: "PUT",
        body,
        auth: true,
      }),
    deleteProduct: (productId: string) =>
      this.request<{ deleted: boolean }>(`/admin/products/${encodeURIComponent(productId)}`, {
        method: "DELETE",
        auth: true,
      }),
    updateStock: (productId: string, stockQuantity: number) =>
      this.request<Product>(`/admin/products/${encodeURIComponent(productId)}/stock`, {
        method: "PUT",
        body: { stockQuantity },
        auth: true,
      }),
    getUploadUrl: (contentType: string) =>
      this.request<{ uploadUrl: string; key: string; publicUrl: string }>("/admin/products/upload-url", {
        method: "POST",
        body: { contentType },
        auth: true,
      }),
    listCategories: () => this.request<{ items: Category[] }>("/admin/categories", { auth: true }),
    createCategory: (body: Partial<Category>) =>
      this.request<Category>("/admin/categories", { method: "POST", body, auth: true }),
    updateCategory: (categoryId: string, body: Partial<Category>) =>
      this.request<Category>(`/admin/categories/${encodeURIComponent(categoryId)}`, {
        method: "PUT",
        body,
        auth: true,
      }),
    deleteCategory: (categoryId: string) =>
      this.request<{ deleted: boolean }>(`/admin/categories/${encodeURIComponent(categoryId)}`, {
        method: "DELETE",
        auth: true,
      }),
    listOrders: () => this.request<{ items: Order[] }>("/admin/orders", { auth: true }),
    getOrder: (orderId: string) => this.request<Order>(`/admin/orders/${encodeURIComponent(orderId)}`, { auth: true }),
    updateOrderStatus: (orderId: string, status: Order["status"]) =>
      this.request<Order>(`/admin/orders/${encodeURIComponent(orderId)}`, {
        method: "PUT",
        body: { status },
        auth: true,
      }),
    dashboard: () => this.request<DashboardStats>("/admin/dashboard", { auth: true }),
  };
}

export const api = new ApiClient();
