"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ApiRequestError } from "@/lib/api";

type CartItemProps = {
  item: CartItemType;
};

const PLACEHOLDER_IMAGE = "/products/placeholder.svg";

export default function CartItem({ item }: CartItemProps) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const [isBusy, setIsBusy] = useState(false);

  const itemTotal = item.price * item.quantity;

  async function withBusy(action: () => Promise<void>) {
    setIsBusy(true);
    try {
      await action();
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to update cart.", "error");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-green-200 hover:shadow-md sm:p-5">
      <div className="flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50 sm:h-28 sm:w-28">
          <Image
            src={item.imageUrl || PLACEHOLDER_IMAGE}
            alt={item.productName}
            fill
            sizes="112px"
            className="object-contain p-3"
            unoptimized
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold leading-5 text-slate-900 sm:text-base">{item.productName}</h2>

          <p className="mt-1 text-xs text-slate-500">{item.unit}</p>

          <p className="mt-2 text-base font-extrabold text-green-900">₹{item.price}</p>
        </div>

        <button
          type="button"
          onClick={() => withBusy(() => removeFromCart(item.productId))}
          disabled={isBusy}
          aria-label={`Remove ${item.productName} from cart`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center rounded-xl border border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => withBusy(() => decreaseQuantity(item.productId))}
            disabled={isBusy}
            aria-label={`Decrease quantity of ${item.productName}`}
            className="flex h-9 w-9 items-center justify-center rounded-l-xl text-slate-600 transition hover:bg-green-50 hover:text-green-800 disabled:opacity-50"
          >
            <Minus size={16} strokeWidth={2.5} aria-hidden="true" />
          </button>

          <span
            aria-label={`Quantity ${item.quantity}`}
            className="flex h-9 min-w-10 items-center justify-center border-x border-slate-200 px-2 text-sm font-bold text-slate-900"
          >
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => withBusy(() => increaseQuantity(item.productId))}
            disabled={isBusy}
            aria-label={`Increase quantity of ${item.productName}`}
            className="flex h-9 w-9 items-center justify-center rounded-r-xl text-slate-600 transition hover:bg-green-50 hover:text-green-800 disabled:opacity-50"
          >
            <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>

        <div className="text-right">
          <p className="text-[11px] text-slate-400">Item total</p>
          <p className="text-base font-extrabold text-green-900">₹{itemTotal}</p>
        </div>
      </div>
    </article>
  );
}
