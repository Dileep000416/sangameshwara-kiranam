"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f8fbf8]">
      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-green-100/60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-green-50 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-100 bg-white px-3.5 py-2 shadow-sm">
              <MapPin size={15} className="text-green-700" />

              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-green-800">
                Your local everyday store
              </span>
            </div>

            {/* Heading */}
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-green-950 sm:text-5xl lg:text-6xl">
              Everything you need,
              <span className="block text-green-700">
                closer to home.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Shop groceries, household essentials and everyday products
              from Sangameshwara Kiranam & General Store.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#categories"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-700/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-800"
              >
                Shop Products
                <ArrowRight size={17} />
              </a>

              <a
                href="#offers"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-6 py-3.5 text-sm font-semibold text-green-800 transition-all duration-200 hover:border-green-300 hover:bg-green-50"
              >
                View Offers
              </a>
            </div>

            {/* Search */}
            <div className="mt-8 max-w-xl">
              <label
                htmlFor="hero-search"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                What are you looking for?
              </label>

              <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm transition-shadow focus-within:border-green-300 focus-within:ring-4 focus-within:ring-green-100">
                <Search
                  size={20}
                  className="ml-3 shrink-0 text-slate-400"
                />

                <input
                  id="hero-search"
                  type="search"
                  placeholder="Search rice, oil, snacks..."
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  className="hidden rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800 sm:block"
                >
                  Search
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto w-full max-w-xl"
          >
            {/* Main visual card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-green-100 bg-white p-5 shadow-[0_24px_70px_rgba(20,83,45,0.12)] sm:p-7">
              {/* Top label */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-700">
                    Sangameshwara
                  </p>

                  <p className="mt-1 text-lg font-bold text-green-950">
                    Everyday essentials
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                  <ShoppingBag size={22} />
                </div>
              </div>

              {/* Grocery visual */}
              <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="flex aspect-square items-center justify-center rounded-3xl bg-green-50">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                      🌾
                    </div>

                    <p className="mt-3 text-sm font-semibold text-green-900">
                      Staples
                    </p>
                  </div>
                </div>

                <div className="flex aspect-square items-center justify-center rounded-3xl bg-emerald-50">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                      🥫
                    </div>

                    <p className="mt-3 text-sm font-semibold text-green-900">
                      Groceries
                    </p>
                  </div>
                </div>

                <div className="flex aspect-square items-center justify-center rounded-3xl bg-lime-50">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                      🧴
                    </div>

                    <p className="mt-3 text-sm font-semibold text-green-900">
                      Household
                    </p>
                  </div>
                </div>

                <div className="flex aspect-square items-center justify-center rounded-3xl bg-green-50">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                      🍪
                    </div>

                    <p className="mt-3 text-sm font-semibold text-green-900">
                      Snacks
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom information */}
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-green-900 p-4 text-white">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Truck size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Store pickup & home delivery
                  </p>

                  <p className="mt-0.5 text-xs text-green-100">
                    Choose the option that works for you.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}