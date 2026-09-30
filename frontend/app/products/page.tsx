"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import ProductSearch from "@/components/products/ProductSearch";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") ?? undefined;
  const initialSearch = searchParams.get("search") ?? undefined;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">All products</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Everyday groceries & essentials
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-green-100 sm:text-base">
            Browse our full catalog, search for what you need, or filter by category.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <ProductSearch initialCategoryId={categoryId} initialSearch={initialSearch} />
        </div>
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}
