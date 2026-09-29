"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg">
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {/* Badge */}
        {product.badge && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-green-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            {product.badge}
          </div>
        )}

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-5 transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Product information */}
      <div className="p-3.5 sm:p-4">
        {/* Category */}
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-green-700">
          {product.category}
        </p>

        {/* Product name */}
        <h3 className="mt-1.5 min-h-[42px] text-sm font-bold leading-5 text-slate-900 sm:text-base">
          {product.name}
        </h3>

        {/* Unit */}
        <p className="mt-1 text-xs text-slate-500">
          {product.unit}
        </p>

        {/* Price + cart */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-green-900 sm:text-xl">
              ₹{product.price}
            </p>

            <p className="text-[11px] text-slate-400">
              per {product.unit}
            </p>
          </div>

          <button
  type="button"
  onClick={() => {
    alert(`BUTTON WORKS: ${product.name}`);
    console.log("BUTTON CLICKED:", product.name);
    addToCart(product);
  }}
  aria-label={`Add ${product.name} to cart`}
  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-800 text-white shadow-sm transition hover:bg-green-950 active:scale-95 sm:h-11 sm:w-11"
>
          <ShoppingCart size={19} strokeWidth={2} aria-hidden="true" />
        </button>
        </div>
      </div>
    </article>
  );
}