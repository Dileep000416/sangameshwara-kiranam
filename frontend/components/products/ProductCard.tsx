"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ApiRequestError } from "@/lib/api";

type ProductCardProps = {
  product: Product;
};

const PLACEHOLDER_IMAGE = "/products/placeholder.svg";

export default function ProductCard({ product }: ProductCardProps) {
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const { showToast } = useToast();
  const [isBusy, setIsBusy] = useState(false);

  const cartItem = cartItems.find((item) => item.productId === product.productId);
  const outOfStock = !product.inStock || product.stockQuantity <= 0;

  async function handleAdd() {
    if (outOfStock) {
      showToast("This product is currently out of stock.", "error");
      return;
    }
    setIsBusy(true);
    try {
      await addToCart(product);
      showToast(`${product.productName} added to cart`, "success");
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to update cart.", "error");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleIncrease() {
    setIsBusy(true);
    try {
      await increaseQuantity(product.productId);
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to update cart.", "error");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDecrease() {
    setIsBusy(true);
    try {
      await decreaseQuantity(product.productId);
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to update cart.", "error");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg">
      <Link
        href={`/products/detail?id=${encodeURIComponent(product.productId)}`}
        className="relative block aspect-square overflow-hidden bg-slate-50"
      >
        {product.discount > 0 && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-green-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            {product.discount}% OFF
          </div>
        )}

        {outOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">Out of stock</span>
          </div>
        )}

        <Image
          src={product.imageUrl || PLACEHOLDER_IMAGE}
          alt={product.productName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-5 transition duration-500 group-hover:scale-105"
          unoptimized
        />
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-green-700">{product.categoryName}</p>

        <Link href={`/products/detail?id=${encodeURIComponent(product.productId)}`}>
          <h3 className="mt-1.5 min-h-[42px] text-sm font-bold leading-5 text-slate-900 sm:text-base">
            {product.productName}
          </h3>
        </Link>

        {product.brand && <p className="mt-0.5 text-xs text-slate-400">{product.brand}</p>}

        <p className="mt-1 text-xs text-slate-500">{product.unit}</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-lg font-extrabold tracking-tight text-green-900 sm:text-xl">₹{product.price}</p>
              {product.originalPrice > product.price && (
                <p className="text-xs text-slate-400 line-through">₹{product.originalPrice}</p>
              )}
            </div>
            <p className="text-[11px] text-slate-400">per {product.unit}</p>
          </div>

          {cartItem ? (
            <div className="flex h-10 shrink-0 items-center rounded-xl border border-green-200 bg-green-50 sm:h-11">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={isBusy}
                aria-label={`Decrease quantity of ${product.productName}`}
                className="flex h-full w-9 items-center justify-center rounded-l-xl text-green-800 transition hover:bg-green-100 disabled:opacity-50"
              >
                <Minus size={15} strokeWidth={2.5} aria-hidden="true" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-green-900">{cartItem.quantity}</span>
              <button
                type="button"
                onClick={handleIncrease}
                disabled={isBusy || outOfStock}
                aria-label={`Increase quantity of ${product.productName}`}
                className="flex h-full w-9 items-center justify-center rounded-r-xl text-green-800 transition hover:bg-green-100 disabled:opacity-50"
              >
                <Plus size={15} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={isBusy || outOfStock}
              aria-label={`Add ${product.productName} to cart`}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-800 text-white shadow-sm transition hover:bg-green-950 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 sm:h-11 sm:w-11"
            >
              <ShoppingCart size={19} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
