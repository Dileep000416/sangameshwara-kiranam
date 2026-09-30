"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

const FREE_DELIVERY_THRESHOLD = 500;
const DELIVERY_FEE = 30;

export default function CartSummary() {
  const {
    cartCount,
    cartTotal,
    clearCart,
  } = useCart();

  // Estimate only — the backend recalculates the authoritative delivery fee
  // and total from scratch when the order is created.
  const deliveryFee = cartTotal === 0 ? 0 : cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const estimatedTotal = cartTotal + deliveryFee;

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
            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
          </span>
        </div>

        {cartTotal > 0 && cartTotal < FREE_DELIVERY_THRESHOLD && (
          <p className="text-xs text-slate-500">
            Add ₹{FREE_DELIVERY_THRESHOLD - cartTotal} more for free delivery.
          </p>
        )}
      </div>

      {/* Total */}
      <div className="mt-5 border-t border-green-200 pt-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Estimated total
            </p>

            <p className="mt-1 text-2xl font-extrabold tracking-tight text-green-950">
              ₹{estimatedTotal}
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

      {/* Checkout */}
      <Link
        href="/checkout"
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-900 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-green-950"
      >
        Proceed to checkout
        <ArrowRight size={17} aria-hidden="true" />
      </Link>

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