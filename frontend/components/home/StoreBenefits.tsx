"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Clock3,
  House,
  ShoppingBasket,
} from "lucide-react";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Trusted local store",
    description:
      "Shop everyday essentials from a store you know and trust.",
  },
  {
    icon: ShoppingBasket,
    title: "Everyday essentials",
    description:
      "Find groceries, household items and daily-use products in one place.",
  },
  {
    icon: House,
    title: "Store & home delivery",
    description:
      "Choose convenient store pickup or have your order delivered to your home.",
  },
  {
    icon: Clock3,
    title: "Simple ordering",
    description:
      "Browse products, add what you need to your cart and place your order easily.",
  },
];

export default function StoreBenefits() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-green-700">
            Why shop with us
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
            Your everyday shopping, made easier.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            From everyday groceries to household essentials, we make local
            shopping simple and convenient.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.article
                key={benefit.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-green-100 bg-[#f8fbf8] p-6 transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Icon size={23} strokeWidth={2} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-green-950">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {benefit.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}