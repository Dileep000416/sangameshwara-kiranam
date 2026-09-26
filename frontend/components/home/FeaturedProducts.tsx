import { ShoppingCart } from "lucide-react";
import { featuredProducts } from "@/data/products";

export default function FeaturedProducts() {
  

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

          <button
            type="button"
            className="w-fit rounded-xl border border-green-200 px-5 py-3 text-sm font-semibold text-green-800 transition hover:border-green-600 hover:bg-green-50"
          >
            View all products
          </button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <article
              key={product.id}
              className="group rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Product image placeholder */}
              <div className="flex aspect-square items-center justify-center rounded-xl bg-green-50">
                <span className="text-4xl">🛒</span>
              </div>

              <div className="pt-4">
                <p className="text-xs font-medium text-green-700">
                  {product.category}
                </p>

                <h3 className="mt-1 min-h-10 text-sm font-bold leading-5 text-slate-900">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-base font-bold text-green-800">
                    ₹{product.price}
                  </span>

                  <button
                    type="button"
                    aria-label={`Add ${product.name} to cart`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 text-white transition hover:bg-green-800"
                  >
                    <ShoppingCart size={16} />
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