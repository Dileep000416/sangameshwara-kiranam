import { ArrowRight, ShoppingCart } from "lucide-react";

import { featuredProducts } from "@/data/products";

export default function FeaturedProducts() {
  return (
    <section
      id="products"
      className="bg-[#f8fbf8] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-green-700">
              Everyday essentials
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
              Featured products
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Popular products from our store, carefully selected for your
              everyday shopping.
            </p>
          </div>

          <a
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition-colors hover:text-green-900"
          >
            View all products
            <ArrowRight size={17} />
          </a>
        </div>

        {/* Product grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-900/5"
            >
              {/* Product image area */}
              <div className="relative flex aspect-square items-center justify-center bg-green-50">
                {product.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-green-700 px-2.5 py-1 text-[11px] font-semibold text-white">
                    {product.badge}
                  </span>
                )}

                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-green-100 bg-white text-sm font-semibold text-green-700 shadow-sm">
                  Product
                </div>
              </div>

              {/* Product information */}
              <div className="p-4 sm:p-5">
                <p className="text-xs font-medium text-slate-500">
                  {product.category}
                </p>

                <h3 className="mt-1.5 min-h-10 text-sm font-bold leading-5 text-green-950 sm:text-base">
                  {product.name}
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  {product.unit}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <p className="text-lg font-bold text-green-800">
                    ₹{product.price}
                  </p>

                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-700 text-white transition-colors hover:bg-green-800"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}