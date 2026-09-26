import {
  Baby,
  Coffee,
  Cookie,
  Droplets,
  Milk,
  Package,
  Sparkles,
  Wheat,
} from "lucide-react";

const categories = [
  {
    name: "Staples",
    description: "Rice, flour & grains",
    icon: Wheat,
  },
  {
    name: "Groceries",
    description: "Everyday essentials",
    icon: Package,
  },
  {
    name: "Household",
    description: "Home care essentials",
    icon: Sparkles,
  },
  {
    name: "Snacks",
    description: "Tasty everyday treats",
    icon: Cookie,
  },
  {
    name: "Beverages",
    description: "Drinks & refreshments",
    icon: Coffee,
  },
  {
    name: "Personal Care",
    description: "Daily care products",
    icon: Droplets,
  },
  {
    name: "Baby Care",
    description: "Essentials for little ones",
    icon: Baby,
  },
  {
    name: "Dairy",
    description: "Milk & dairy products",
    icon: Milk,
  },
];

export default function Categories() {
  return (
    <section
      id="categories"
      className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-green-700">
            Browse our store
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
            Shop by category
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Find the everyday essentials you need, organized to make your
            shopping simple and convenient.
          </p>
        </div>

        {/* Category grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <a
                key={category.name}
                href="#products"
                className="group rounded-2xl border border-slate-100 bg-[#f8fbf8] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-green-100 hover:bg-green-50 hover:shadow-lg hover:shadow-green-900/5 sm:p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700 transition-colors duration-200 group-hover:bg-green-700 group-hover:text-white">
                  <Icon size={23} strokeWidth={1.8} />
                </div>

                <h3 className="mt-5 text-base font-bold text-green-950">
                  {category.name}
                </h3>

                <p className="mt-1.5 text-sm leading-5 text-slate-500">
                  {category.description}
                </p>

                <span className="mt-4 inline-block text-xs font-semibold text-green-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Browse category →
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}