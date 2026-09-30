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

import { api, ApiRequestError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Cart, CartItem, Product } from "@/types";

const GUEST_CART_STORAGE_KEY = "sangameshwara.guestCart";

/**
 * Cart state management (spec section 15).
 *
 * - Signed-in customers: the cart always lives in DynamoDB, fetched/mutated
 *   through the authenticated /cart API. This is the source of truth.
 * - Guests (not signed in): a temporary cart is kept in localStorage only,
 *   purely so browsing feels normal before login. On successful login, the
 *   guest cart is merged into the server-side cart item-by-item and then
 *   cleared from localStorage.
 *
 * Every price shown here is a client-side snapshot for display only — the
 * backend always re-reads the authoritative price from DynamoDB when an
 * order is created (see backend/src/functions/orders/create.ts).
 */

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  refresh: () => Promise<void>;
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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMergedGuestCart, setHasMergedGuestCart] = useState(false);

  const loadServerCart = useCallback(async () => {
    try {
      setError(null);
      const cart = await api.getCart();
      setCartItems(cart.items);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Unable to load your cart.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setCartItems(readGuestCart());
      setIsLoading(false);
      return;
    }

    (async () => {
      if (!hasMergedGuestCart) {
        const guestItems = readGuestCart();
        for (const item of guestItems) {
          try {
            await api.addToCart(item.productId, item.quantity);
          } catch {
            // Best-effort merge; skip items that fail (e.g. gone out of stock).
          }
        }
        writeGuestCart([]);
        setHasMergedGuestCart(true);
      }
      await loadServerCart();
    })();
  }, [isAuthenticated, authLoading, hasMergedGuestCart, loadServerCart]);

  const addToCart = useCallback(
    async (product: Product, quantity = 1) => {
      if (!isAuthenticated) {
        setCartItems((current) => {
          const existing = current.find((item) => item.productId === product.productId);
          const next = existing
            ? current.map((item) =>
                item.productId === product.productId ? { ...item, quantity: item.quantity + quantity } : item
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
        return;
      }

      try {
        setError(null);
        const cart: Cart = await api.addToCart(product.productId, quantity);
        setCartItems(cart.items);
      } catch (err) {
        setError(err instanceof ApiRequestError ? err.message : "Unable to update cart.");
        throw err;
      }
    },
    [isAuthenticated]
  );

  const setQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!isAuthenticated) {
        setCartItems((current) => {
          const next =
            quantity <= 0
              ? current.filter((item) => item.productId !== productId)
              : current.map((item) => (item.productId === productId ? { ...item, quantity } : item));
          writeGuestCart(next);
          return next;
        });
        return;
      }

      try {
        setError(null);
        const cart = await api.updateCartItem(productId, quantity);
        setCartItems(cart.items);
      } catch (err) {
        setError(err instanceof ApiRequestError ? err.message : "Unable to update cart.");
        throw err;
      }
    },
    [isAuthenticated]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (!isAuthenticated) {
        setCartItems((current) => {
          const next = current.filter((item) => item.productId !== productId);
          writeGuestCart(next);
          return next;
        });
        return;
      }

      try {
        setError(null);
        const cart = await api.removeFromCart(productId);
        setCartItems(cart.items);
      } catch (err) {
        setError(err instanceof ApiRequestError ? err.message : "Unable to update cart.");
        throw err;
      }
    },
    [isAuthenticated]
  );

  const increaseQuantity = useCallback(
    async (productId: string) => {
      const current = cartItems.find((item) => item.productId === productId);
      await setQuantity(productId, (current?.quantity ?? 0) + 1);
    },
    [cartItems, setQuantity]
  );

  const decreaseQuantity = useCallback(
    async (productId: string) => {
      const current = cartItems.find((item) => item.productId === productId);
      await setQuantity(productId, (current?.quantity ?? 1) - 1);
    },
    [cartItems, setQuantity]
  );

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      writeGuestCart([]);
      return;
    }

    for (const item of cartItems) {
      await removeFromCart(item.productId);
    }
  }, [isAuthenticated, cartItems, removeFromCart]);

  const cartCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const value: CartContextType = {
    cartItems,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartCount,
    cartTotal,
    refresh: loadServerCart,
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
