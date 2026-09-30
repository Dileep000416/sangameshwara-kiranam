"use client";

import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeletons";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProducts } from "@/hooks/useProducts";
import { ShoppingBag } from "lucide-react";

export default function FeaturedProducts() {
  const { products, isLoading, error, refetch } = useProducts({ featured: true, page: 1 });

  return (
    <section id="products" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-green-700">
              Popular picks
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
              Everyday essentials
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Shop some of the products our customers regularly pick up from
              Sangameshwara Kiranam & General Store.
            </p>
          </div>

          <Link
            href="/products"
            className="w-fit rounded-xl border border-green-200 px-5 py-3 text-sm font-semibold text-green-800 transition hover:border-green-600 hover:bg-green-50"
          >
            View all products
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No featured products yet"
            description="Check back soon, or browse the full catalog."
            action={
              <Link
                href="/products"
                className="inline-flex rounded-xl bg-green-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-950"
              >
                Browse all products
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
