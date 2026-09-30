// Shared domain types for the grocery e-commerce backend.
// Mirrors the DynamoDB item shapes (see infrastructure/lib/database-stack.ts).

export type UserRole = "CUSTOMER" | "ADMIN";
export type AccountStatus = "ACTIVE" | "DISABLED";

export interface UserRecord {
  userId: string; // Cognito sub
  mobileNumber: string; // E.164, e.g. +91XXXXXXXXXX
  name: string;
  email?: string;
  address?: {
    line1: string;
    line2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  role: UserRole;
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRecord {
  categoryId: string;
  name: string;
  slug: string;
  parentGroup: string; // top-level grouping, e.g. "Fruits & Vegetables"
  description?: string;
  imageUrl?: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRecord {
  productId: string;
  slug: string;
  productName: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  brand?: string;
  price: number; // current selling price (INR, in rupees)
  originalPrice: number; // MRP
  discount: number; // percentage, derived but stored for fast reads
  unit: string; // e.g. "1 kg", "500 ml", "1 piece"
  imageUrl?: string;
  imageKey?: string; // S3 object key
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
  active: boolean;
  searchKeywords: string[]; // lowercase tokens for search
  createdAt: string;
  updatedAt: string;
}

export interface CartItemRecord {
  productId: string;
  productName: string;
  unit: string;
  price: number; // price snapshot at time of adding (re-validated at checkout)
  imageUrl?: string;
  quantity: number;
}

export interface CartRecord {
  userId: string;
  items: CartItemRecord[];
  updatedAt: string;
}

export type OrderStatus =
  | "CREATED"
  | "WHATSAPP_REDIRECTED"
  | "CONFIRMED"
  | "PACKING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItemRecord {
  productId: string;
  productName: string;
  unit: string;
  price: number; // authoritative price captured server-side at order time
  quantity: number;
  total: number;
}

export interface OrderRecord {
  orderId: string;
  customerId: string;
  customerName: string;
  mobileNumber: string;
  address: string;
  landmark?: string;
  items: OrderItemRecord[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  whatsappMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JwtClaims {
  sub: string;
  phone_number?: string;
  "cognito:groups"?: string[] | string;
  [key: string]: unknown;
}
