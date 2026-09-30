"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { CategoryCardSkeleton } from "@/components/ui/Skeletons";

export default function Categories() {
  const { categories, isLoading, error } = useCategories();

  return (
    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              Shop essentials
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-green-950 sm:text-3xl">
              Shop by Category
            </h2>

            <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
              Find everyday groceries and household essentials in one place.
            </p>
          </div>

          <Link
            href="/categories"
            className="hidden shrink-0 text-sm font-semibold text-green-800 transition hover:text-green-950 sm:inline-flex"
          >
            View all
            <span className="ml-1" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible lg:grid-cols-5">
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => <CategoryCardSkeleton key={i} />)
                : categories.slice(0, 10).map((category) => (
                    <Link
                      key={category.categoryId}
                      href={`/products?category=${encodeURIComponent(category.categoryId)}`}
                      className="group min-w-[180px] rounded-2xl border border-green-100 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-md sm:min-w-0"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-950 text-white transition duration-200 group-hover:bg-green-800">
                        <Package size={24} strokeWidth={1.8} aria-hidden="true" />
                      </div>

                      <h3 className="mt-4 text-sm font-bold text-green-950">{category.name}</h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">{category.parentGroup}</p>

                      <div className="mt-3 text-xs font-semibold text-green-700 transition group-hover:text-green-950">
                        Explore →
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        )}

        {/* Mobile view-all */}
        <Link
          href="/categories"
          className="mt-4 flex w-full items-center justify-center rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-100 sm:hidden"
        >
          View all categories
          <span className="ml-1" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
