"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgePercent, ShoppingBag, Sparkles } from "lucide-react";

const offers = [
  {
    title: "Daily Grocery Deals",
    description:
      "Save on everyday essentials, groceries and household products.",
    badge: "Everyday Savings",
    icon: ShoppingBag,
    buttonText: "Shop groceries",
  },
  {
    title: "Special Offers",
    description:
      "Discover selected products and seasonal offers available at our store.",
    badge: "Limited Offers",
    icon: BadgePercent,
    buttonText: "View offers",
  },
];

export default function Offers() {
  return (
    <section
      id="offers"
      className="bg-[#f8fbf8] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-green-700">
            Save more while you shop
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
            Offers made for everyday shopping.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Check out our latest offers and discover more value on products
            you already shop for.
          </p>
        </div>

        {/* Offer cards */}
        <div className="grid gap-5 lg:grid-cols-2">
          {offers.map((offer, index) => {
            const Icon = offer.icon;

            return (
              <motion.article
                key={offer.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-3xl border border-green-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:p-8"
              >
                {/* Decorative background */}
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-50" />

                <div className="relative">
                  {/* Icon */}
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <Icon size={26} strokeWidth={2} />
                  </div>

                  {/* Badge */}
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800">
                    <Sparkles size={13} />
                    {offer.badge}
                  </span>

                  {/* Content */}
                  <h3 className="mt-5 text-2xl font-bold text-green-950">
                    {offer.title}
                  </h3>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
                    {offer.description}
                  </p>

                  {/* Button */}
                  <button
                    type="button"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-800"
                  >
                    {offer.buttonText}
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}