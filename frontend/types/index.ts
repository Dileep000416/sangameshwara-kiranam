// Shared frontend types, mirroring the backend's DynamoDB item shapes
// (see backend/src/common/types.ts). Kept as plain data types with no
// framework dependencies so they can be used in both client and server
// components.

export interface Product {
  productId: string;
  slug: string;
  productName: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  brand?: string;
  price: number;
  originalPrice: number;
  discount: number;
  unit: string;
  imageUrl?: string;
  imageKey?: string;
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
  active: boolean;
  searchKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  categoryId: string;
  name: string;
  slug: string;
  parentGroup: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  unit: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
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

export interface OrderItem {
  productId: string;
  productName: string;
  unit: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  orderId: string;
  customerId: string;
  customerName: string;
  mobileNumber: string;
  address: string;
  landmark?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  whatsappMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  mobileNumber: string;
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
  role: "CUSTOMER" | "ADMIN";
  accountStatus: "ACTIVE" | "DISABLED";
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  todaysOrders: number;
  todaysOrderValue: number;
}
