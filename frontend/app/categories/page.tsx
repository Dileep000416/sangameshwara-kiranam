"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import { useCategories } from "@/hooks/useCategories";
import { CategoryCardSkeleton } from "@/components/ui/Skeletons";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategories();

  // Group categories by their top-level parentGroup (e.g. "Fruits & Vegetables")
  // for a KPN Fresh-style grouped browsing experience.
  const grouped = categories.reduce<Record<string, typeof categories>>((acc, category) => {
    (acc[category.parentGroup] ??= []).push(category);
    return acc;
  }, {});

  return (
    <main className="bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-green-700">
            Shop by category
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-green-950 sm:text-5xl lg:text-6xl">
            Find what you need,
            <span className="block text-green-700">
              faster.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Explore our product categories and discover everyday groceries,
            household essentials and other products available at
            Sangameshwara Kiranam & General Store.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} />
          ) : categories.length === 0 ? (
            <EmptyState icon={Package} title="No categories yet" description="Categories will appear here once the admin adds them." />
          ) : (
            Object.entries(grouped).map(([group, groupCategories]) => (
              <div key={group} className="mb-12">
                <h2 className="mb-5 text-2xl font-bold tracking-tight text-green-950">{group}</h2>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {groupCategories.map((category) => (
                    <Link
                      key={category.categoryId}
                      href={`/products?category=${encodeURIComponent(category.categoryId)}`}
                      className="group rounded-3xl border border-green-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700 transition-colors duration-300 group-hover:bg-green-700 group-hover:text-white">
                        <Package size={27} />
                      </div>

                      <h3 className="mt-6 text-xl font-bold text-green-950">{category.name}</h3>

                      {category.description && (
                        <p className="mt-3 text-sm leading-6 text-slate-600">{category.description}</p>
                      )}

                      <div className="mt-5 text-sm font-semibold text-green-700">Explore category →</div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-green-950 px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Looking for a specific product?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-green-100 sm:text-base">
            Browse our products and find the everyday essentials you need.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-green-950 transition hover:bg-green-50"
          >
            Browse all products
          </Link>
        </div>
      </section>
    </main>
  );
}
