import ProductCard from "@/components/products/ProductCard";
import { featuredProducts } from "@/data/products";

export const metadata = {
  title: "Products | Sangameshwara Kiranam & General Store",
  description:
    "Browse groceries, staples and everyday essentials available at Sangameshwara Kiranam & General Store.",
};

export default function ProductsPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
            Our products
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-green-950 sm:text-5xl">
            Everyday essentials,
            <span className="block text-green-700">
              all in one place.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Browse products available at Sangameshwara Kiranam & General
            Store. More products and categories will be added as the store
            catalogue grows.
          </p>
        </div>
      </section>

      {/* Product listing */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
              Product catalogue
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
              Available products
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Explore some of the everyday products available at our store.
            </p>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom information */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-green-950 px-6 py-10 sm:px-10 sm:py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">
              Sangameshwara Kiranam
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Everyday essentials, close to home.
            </h2>

            <p className="mt-4 text-sm leading-6 text-green-100 sm:text-base">
              We are building a convenient way for our customers to explore
              products and place orders for store pickup or home delivery.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}