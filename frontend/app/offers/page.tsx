"use client";

import Navbar from "@/components/home/Navbar";
import ProductCard from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeletons";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProducts } from "@/hooks/useProducts";
import { Percent } from "lucide-react";

/**
 * Deals page (spec section 11). The public /products API does not expose a
 * dedicated "discounted only" filter, so this page fetches the catalog and
 * filters client-side for products with discount > 0 — acceptable at the
 * current catalog scale (see the pagination note in
 * backend/src/functions/products/list.ts).
 */
export default function OffersPage() {
  const { products, isLoading, error, refetch } = useProducts({ page: 1, pageSize: 60 });
  const deals = products.filter((p) => p.discount > 0);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">Deals</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Offers & discounts
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-green-100 sm:text-base">
            Everyday essentials at their best prices right now.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : deals.length === 0 ? (
            <EmptyState
              icon={Percent}
              title="No active deals right now"
              description="Check back soon — the store adds new discounts regularly."
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {deals.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
