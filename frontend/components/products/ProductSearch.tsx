"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeletons";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface ProductSearchProps {
  initialCategoryId?: string;
  initialSearch?: string;
}

export default function ProductSearch({ initialCategoryId, initialSearch }: ProductSearchProps) {
  const [searchInput, setSearchInput] = useState(initialSearch ?? "");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategoryId);

  const debouncedSearch = useDebouncedValue(searchInput, 350);
  const { categories } = useCategories();
  const { products, isLoading, error, refetch } = useProducts({
    search: debouncedSearch || undefined,
    category: selectedCategory,
  });

  return (
    <>
      {/* Search UI */}
      <div className="mb-8 rounded-2xl border border-green-100 bg-green-50/60 p-4 sm:p-5">
        <label htmlFor="product-search" className="mb-2 block text-sm font-semibold text-green-950">
          Search products
        </label>

        <div className="relative max-w-2xl">
          <Search
            size={20}
            strokeWidth={2}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <input
            id="product-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search for rice, atta, salt..."
            className="h-12 w-full rounded-xl border border-green-200 bg-white pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
          />
        </div>
      </div>

      {/* Category filter chips */}
      {categories.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold text-green-950">Browse by category</p>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategory(undefined)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
                !selectedCategory
                  ? "bg-green-700 text-white hover:bg-green-800"
                  : "border border-green-200 bg-white text-slate-700 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category.categoryId}
                type="button"
                onClick={() => setSelectedCategory(category.categoryId)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
                  selectedCategory === category.categoryId
                    ? "bg-green-700 text-white hover:bg-green-800"
                    : "border border-green-200 bg-white text-slate-700 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product count */}
      {!isLoading && !error && (
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{products.length}</span>{" "}
            {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      )}

      {/* Product results */}
      {isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No products found"
          description={
            searchInput
              ? `We couldn't find any products matching "${searchInput}". Try searching with another product name.`
              : "No products are available in this category yet."
          }
        />
      )}
    </>
  );
}
