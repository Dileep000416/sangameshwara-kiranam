import {
  Apple,
  Coffee,
  CookingPot,
  Droplets,
  House,
  Milk,
  Package,
  ShoppingBasket,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    name: "Staples",
    description: "Rice, atta, dal, flour and everyday kitchen essentials.",
    icon: ShoppingBasket,
  },
  {
    name: "Groceries",
    description: "Essential grocery products for your regular shopping.",
    icon: Package,
  },
  {
    name: "Beverages",
    description: "Tea, coffee, drinks and refreshing everyday beverages.",
    icon: Coffee,
  },
  {
    name: "Snacks",
    description: "Biscuits, chips and snacks for every occasion.",
    icon: Apple,
  },
  {
    name: "Household",
    description: "Useful products for cleaning and everyday household needs.",
    icon: House,
  },
  {
    name: "Personal Care",
    description: "Daily personal-care and hygiene essentials.",
    icon: Sparkles,
  },
  {
    name: "Dairy",
    description: "Everyday dairy products and related essentials.",
    icon: Milk,
  },
  {
    name: "Cooking Essentials",
    description: "Cooking oils, spices and kitchen essentials.",
    icon: CookingPot,
  },
  {
    name: "Other Essentials",
    description: "More useful products for your everyday needs.",
    icon: Droplets,
  },
];

export const metadata = {
  title: "Categories | Sangameshwara Kiranam & General Store",
  description:
    "Explore grocery, household, personal care, beverages, snacks and other product categories at Sangameshwara Kiranam & General Store.",
};

export default function CategoriesPage() {
  return (
    <main className="bg-white">
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
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
              Categories
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
              Shop everyday essentials
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <article
                  key={category.name}
                  className="group rounded-3xl border border-green-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700 transition-colors duration-300 group-hover:bg-green-700 group-hover:text-white">
                    <Icon size={27} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-green-950">
                    {category.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {category.description}
                  </p>

                  <div className="mt-5 text-sm font-semibold text-green-700">
                    Explore category →
                  </div>
                </article>
              );
            })}
          </div>
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
        </div>
      </section>
    </main>
  );
}