"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CartItem, Product } from "@/types";

const GUEST_CART_STORAGE_KEY = "sangameshwara.guestCart";

/**
 * Cart state management for guest checkout (spec section 15).
 *
 * This store uses a WhatsApp-order model with no customer login, so the cart
 * lives entirely in the browser's localStorage. On checkout, the cart's
 * { productId, quantity } pairs are POSTed to the public /guest-orders
 * endpoint, which re-reads the authoritative price and stock from DynamoDB.
 *
 * Every price shown here is a client-side snapshot for display only — the
 * backend never trusts it (see backend/src/functions/orders/create-guest.ts).
 */

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function readGuestCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeGuestCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage once on mount (client only).
  useEffect(() => {
    setCartItems(readGuestCart());
    setIsLoading(false);
  }, []);

  // Persist to localStorage whenever the cart changes.
  const persist = useCallback((items: CartItem[]) => {
    setCartItems(items);
    writeGuestCart(items);
  }, []);

  const addToCart = useCallback(
    async (product: Product, quantity = 1) => {
      setCartItems((current) => {
        const existing = current.find((item) => item.productId === product.productId);
        const next = existing
          ? current.map((item) =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          : [
              ...current,
              {
                productId: product.productId,
                productName: product.productName,
                unit: product.unit,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity,
              },
            ];
        writeGuestCart(next);
        return next;
      });
    },
    []
  );

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems((current) => {
      const next =
        quantity <= 0
          ? current.filter((item) => item.productId !== productId)
          : current.map((item) => (item.productId === productId ? { ...item, quantity } : item));
      writeGuestCart(next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback(async (productId: string) => {
    setCartItems((current) => {
      const next = current.filter((item) => item.productId !== productId);
      writeGuestCart(next);
      return next;
    });
  }, []);

  const increaseQuantity = useCallback(
    async (productId: string) => {
      setCartItems((current) => {
        const item = current.find((i) => i.productId === productId);
        const next = current.map((i) =>
          i.productId === productId ? { ...i, quantity: (item?.quantity ?? 0) + 1 } : i
        );
        writeGuestCart(next);
        return next;
      });
    },
    []
  );

  const decreaseQuantity = useCallback(
    async (productId: string) => {
      setCartItems((current) => {
        const item = current.find((i) => i.productId === productId);
        const nextQty = (item?.quantity ?? 1) - 1;
        const next =
          nextQty <= 0
            ? current.filter((i) => i.productId !== productId)
            : current.map((i) => (i.productId === productId ? { ...i, quantity: nextQty } : i));
        writeGuestCart(next);
        return next;
      });
    },
    []
  );

  const clearCart = useCallback(async () => {
    persist([]);
  }, [persist]);

  const cartCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const value: CartContextType = {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}
