import Image from "next/image";
import { ShoppingCart } from "lucide-react";

import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-green-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-6 transition duration-300 group-hover:scale-105"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-green-700 px-3 py-1 text-xs font-bold text-white">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product information */}
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
          {product.category}
        </p>

        <h3 className="mt-2 min-h-12 text-base font-bold leading-6 text-slate-900">
          {product.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {product.unit}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-green-800">
            ₹{product.price}
          </span>

          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-700 text-white transition hover:bg-green-800"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}