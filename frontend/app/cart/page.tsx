"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { CartItemSkeleton } from "@/components/ui/Skeletons";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, cartCount, isLoading } = useCart();

  return (
    <main className="min-h-screen bg-white">
      {/* Cart header */}
      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-100 transition hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Continue shopping
          </Link>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">
                Shopping cart
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Your cart
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-green-100 sm:text-base">
                Review the products you selected before continuing with your
                order.
              </p>
            </div>

            {cartItems.length > 0 && (
              <div className="hidden shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur sm:block">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cart content */}
      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
              <div className="space-y-4">
                <CartItemSkeleton />
                <CartItemSkeleton />
                <CartItemSkeleton />
              </div>
              <div className="h-96 animate-pulse rounded-3xl bg-green-50" />
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty cart */
            <div className="mx-auto max-w-2xl rounded-3xl border border-green-100 bg-green-50/60 px-6 py-14 text-center sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-800">
                <ShoppingCart size={28} aria-hidden="true" />
              </div>

              <h2 className="mt-6 text-2xl font-extrabold text-green-950">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                Looks like you haven&apos;t added anything to your cart yet.
                Explore our products and add your everyday essentials.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-green-900 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-green-950"
              >
                Browse products
              </Link>
            </div>
          ) : (
            /* Filled cart */
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
              {/* Cart items */}
              <div>
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-green-950 sm:text-2xl">
                    Selected products
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Adjust quantities or remove products from your cart.
                  </p>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                    />
                  ))}
                </div>
              </div>

              {/* Cart summary */}
              <CartSummary />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}