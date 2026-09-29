"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const itemTotal = item.price * item.quantity;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-green-200 hover:shadow-md sm:p-5">
      <div className="flex gap-4">
        {/* Product image */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50 sm:h-28 sm:w-28">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="112px"
            className="object-contain p-3"
          />
        </div>

        {/* Product details */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-green-700">
            {item.category}
          </p>

          <h2 className="mt-1 text-sm font-bold leading-5 text-slate-900 sm:text-base">
            {item.name}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {item.unit}
          </p>

          <p className="mt-2 text-base font-extrabold text-green-900">
            ₹{item.price}
          </p>
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          aria-label={`Remove ${item.name} from cart`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>

      {/* Quantity + item total */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        {/* Quantity controls */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => decreaseQuantity(item.id)}
            aria-label={`Decrease quantity of ${item.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-l-xl text-slate-600 transition hover:bg-green-50 hover:text-green-800"
          >
            <Minus
              size={16}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </button>

          <span
            aria-label={`Quantity ${item.quantity}`}
            className="flex h-9 min-w-10 items-center justify-center border-x border-slate-200 px-2 text-sm font-bold text-slate-900"
          >
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => increaseQuantity(item.id)}
            aria-label={`Increase quantity of ${item.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-r-xl text-slate-600 transition hover:bg-green-50 hover:text-green-800"
          >
            <Plus
              size={16}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Item total */}
        <div className="text-right">
          <p className="text-[11px] text-slate-400">
            Item total
          </p>

          <p className="text-base font-extrabold text-green-900">
            ₹{itemTotal}
          </p>
        </div>
      </div>
    </article>
  );
}