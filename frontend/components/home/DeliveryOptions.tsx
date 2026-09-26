"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  House,
  MapPin,
  ShoppingBag,
  Store,
} from "lucide-react";

const deliveryOptions = [
  {
    icon: Store,
    title: "Store Pickup",
    description:
      "Place your order online and collect it from Sangameshwara Kiranam & General Store.",
    points: [
      "Convenient pickup from the store",
      "Choose your preferred pickup time",
      "No home delivery required",
    ],
  },
  {
    icon: House,
    title: "Home Delivery",
    description:
      "Order your everyday essentials online and get them delivered to your home.",
    points: [
      "Convenient doorstep delivery",
      "Suitable for everyday shopping",
      "Delivery availability based on location",
    ],
  },
];

export default function DeliveryOptions() {
  return (
    <section className="bg-[#f8fbf8] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-green-700">
            Shop your way
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
            Pick up from the store or get it delivered.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Choose the option that works best for you when placing your order.
          </p>
        </div>

        {/* Options */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {deliveryOptions.map((option, index) => {
            const Icon = option.icon;

            return (
              <motion.article
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="relative overflow-hidden rounded-3xl border border-green-100 bg-white p-7 shadow-sm sm:p-9"
              >
                {/* Decorative circle */}
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-green-50" />

                <div className="relative">
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <Icon size={27} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-2xl font-bold text-green-950">
                    {option.title}
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                    {option.description}
                  </p>

                  {/* Points */}
                  <ul className="mt-6 space-y-3">
                    {option.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm text-slate-700"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                          ✓
                        </span>

                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Small info row */}
                  <div className="mt-7 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-800">
                      <ShoppingBag size={14} />
                      Easy ordering
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-800">
                      {index === 0 ? (
                        <>
                          <MapPin size={14} />
                          Store collection
                        </>
                      ) : (
                        <>
                          <Clock3 size={14} />
                          Convenient delivery
                        </>
                      )}
                    </span>
                  </div>

                  {/* Future action */}
                  <button
                    type="button"
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
                  >
                    Start shopping
                    <ArrowRight size={17} />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-center">
          <p className="text-sm font-medium text-green-900">
            Delivery availability and service areas will be confirmed during
            checkout.
          </p>
        </div>
      </div>
    </section>
  );
}