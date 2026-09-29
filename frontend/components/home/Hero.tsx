import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Truck,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-green-950 text-white">
      <div className="relative">
        {/* Decorative background elements */}
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-green-700/30 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-green-800/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            {/* Content */}
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-700 bg-green-900/70 px-3 py-1.5 text-xs font-semibold text-green-100">
                <span
                  className="h-2 w-2 rounded-full bg-green-300"
                  aria-hidden="true"
                />

                Your local everyday store
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Everything you need,
                <span className="mt-1 block text-green-300">
                  all in one place.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-green-100 sm:text-base sm:leading-8 lg:text-lg">
                Shop groceries, household essentials, personal care products
                and everyday needs from Sangameshwara Kiranam & General Store.
              </p>

              {/* Actions */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-green-950 shadow-lg transition hover:bg-green-50"
                >
                  <ShoppingBag size={18} aria-hidden="true" />
                  Shop Products
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>

                <Link
                  href="/categories"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-green-600 bg-green-900/60 px-5 text-sm font-bold text-white transition hover:bg-green-800"
                >
                  Explore Categories
                </Link>
              </div>

              {/* Trust points */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-xs font-medium text-green-100">
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-green-300"
                    aria-hidden="true"
                  />
                  Everyday essentials
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-green-100">
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-green-300"
                    aria-hidden="true"
                  />
                  Store pickup
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-green-100">
                  <Truck
                    size={17}
                    className="shrink-0 text-green-300"
                    aria-hidden="true"
                  />
                  Home delivery
                </div>
              </div>
            </div>

            {/* Visual panel */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-green-700 bg-gradient-to-br from-green-800 via-green-900 to-green-950 p-5 shadow-2xl sm:p-7">
                {/* Decorative circles */}
                <div
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-green-600/40"
                  aria-hidden="true"
                />

                <div
                  className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full border border-green-600/30"
                  aria-hidden="true"
                />

                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                    Sangameshwara
                  </p>

                  <h2 className="mt-3 max-w-sm text-2xl font-bold leading-tight sm:text-3xl">
                    Your everyday shopping,
                    <span className="block text-green-300">
                      made simple.
                    </span>
                  </h2>

                  {/* Product visual placeholder */}
                  <div className="mt-8 flex min-h-[230px] items-center justify-center rounded-2xl border border-green-700/70 bg-green-950/50">
                    <div className="text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-700 shadow-lg">
                        <ShoppingBag
                          size={38}
                          strokeWidth={1.7}
                          aria-hidden="true"
                        />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-white">
                        Groceries & General Store Essentials
                      </p>

                      <p className="mt-1 text-xs text-green-300">
                        Freshly stocked everyday products
                      </p>
                    </div>
                  </div>

                  {/* Mini information cards */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                      <p className="text-xs text-green-300">
                        Shopping
                      </p>

                      <p className="mt-1 text-sm font-bold text-white">
                        Easy & convenient
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                      <p className="text-xs text-green-300">
                        Delivery
                      </p>

                      <p className="mt-1 text-sm font-bold text-white">
                        Pickup or home
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}