
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { featuredProducts } from "@/data/products";

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = featuredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Search UI */}
      <div className="mb-8 rounded-2xl border border-green-100 bg-green-50/60 p-4 sm:p-5">
        <label
          htmlFor="product-search"
          className="mb-2 block text-sm font-semibold text-green-950"
        >
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
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search for rice, atta, salt..."
            className="h-12 w-full rounded-xl border border-green-200 bg-white pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
          />
        </div>
      </div>

      {/* Category UI */}
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold text-green-950">
          Browse by category
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            className="whitespace-nowrap rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
          >
            All
          </button>

          <button
            type="button"
            className="whitespace-nowrap rounded-full border border-green-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
          >
            Staples
          </button>

          <button
            type="button"
            className="whitespace-nowrap rounded-full border border-green-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
          >
            Groceries
          </button>

          <button
            type="button"
            className="whitespace-nowrap rounded-full border border-green-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
          >
            Beverages
          </button>
        </div>
      </div>

      {/* Product count */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredProducts.length}
          </span>{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Product results */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-green-100 bg-green-50/60 px-6 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <Search
              size={24}
              className="text-green-700"
              aria-hidden="true"
            />
          </div>

          <h3 className="mt-5 text-lg font-bold text-green-950">
            No products found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            We couldn&apos;t find any products matching{" "}
            <span className="font-semibold text-slate-800">
              &quot;{searchQuery}&quot;
            </span>
            . Try searching with another product name.
          </p>
        </div>
      )}
    </>
  );
}

