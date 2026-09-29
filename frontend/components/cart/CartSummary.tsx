"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartSummary() {
  const {
    cartCount,
    cartTotal,
    clearCart,
  } = useCart();

  return (
    <aside className="rounded-3xl border border-green-100 bg-green-50/60 p-5 sm:p-6">
      {/* Summary heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-900 text-white">
          <ShoppingBag size={20} aria-hidden="true" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-green-950">
            Order summary
          </h2>

          <p className="text-xs text-slate-500">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </div>

      {/* Price information */}
      <div className="mt-6 space-y-3 border-t border-green-100 pt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">
            Subtotal
          </span>

          <span className="font-semibold text-slate-900">
            ₹{cartTotal}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">
            Delivery
          </span>

          <span className="font-semibold text-green-700">
            Calculated later
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="mt-5 border-t border-green-200 pt-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Cart total
            </p>

            <p className="mt-1 text-2xl font-extrabold tracking-tight text-green-950">
              ₹{cartTotal}
            </p>
          </div>
        </div>
      </div>

      {/* Continue shopping */}
      <Link
        href="/products"
        className="mt-6 flex h-12 w-full items-center justify-center rounded-xl border border-green-200 bg-white px-4 text-sm font-bold text-green-800 transition hover:border-green-300 hover:bg-green-50"
      >
        Continue shopping
      </Link>

      {/* Future order flow */}
      <button
        type="button"
        disabled
        className="mt-3 flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-green-900 px-4 text-sm font-bold text-white opacity-50"
        title="Order flow will be enabled in a later step"
      >
        Proceed to order
        <ArrowRight size={17} aria-hidden="true" />
      </button>

      {/* Clear cart */}
      <button
        type="button"
        onClick={clearCart}
        className="mt-4 flex w-full items-center justify-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-red-600"
      >
        <Trash2 size={14} aria-hidden="true" />
        Clear cart
      </button>
    </aside>
  );
}