import Link from "next/link";
import {
  ArrowRight,
  
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const offers = [
  {
    eyebrow: "Everyday Value",
    title: "Everything you need for your daily shopping.",
    description:
      "Explore groceries, household essentials and everyday products available at Sangameshwara.",
    icon: ShoppingBag,
    href: "/products",
    featured: true,
  },
  {
    eyebrow: "Store Specials",
    title: "Discover products worth adding to your basket.",
    description:
      "Browse our growing catalogue and discover products for your home and family.",
    icon: Sparkles,
    href: "/products",
    featured: false,
  },
];

export default function Offers() {
  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              Shop smarter
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-green-950 sm:text-3xl">
              Offers & Deals
            </h2>

            <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
              Discover everyday value and products selected for your shopping
              needs.
            </p>
          </div>

          <Link
            href="/offers"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-green-800 transition hover:text-green-950 sm:inline-flex"
          >
            View all
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Offer cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((offer) => {
            const Icon = offer.icon;

            return (
              <article
                key={offer.eyebrow}
                className={`group relative overflow-hidden rounded-3xl ${
                  offer.featured
                    ? "bg-green-950"
                    : "border border-green-100 bg-white"
                }`}
              >
                {/* Decorative background */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full ${
                    offer.featured
                      ? "bg-green-700/30"
                      : "bg-green-100/70"
                  } blur-2xl`}
                  aria-hidden="true"
                />

                <div className="relative p-6 sm:p-8">
                  {/* Icon */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      offer.featured
                        ? "bg-green-800 text-green-100"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    <Icon size={23} aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <p
                    className={`mt-6 text-xs font-bold uppercase tracking-[0.18em] ${
                      offer.featured
                        ? "text-green-300"
                        : "text-green-700"
                    }`}
                  >
                    {offer.eyebrow}
                  </p>

                  <h3
                    className={`mt-2 max-w-lg text-2xl font-bold tracking-tight sm:text-3xl ${
                      offer.featured
                        ? "text-white"
                        : "text-green-950"
                    }`}
                  >
                    {offer.title}
                  </h3>

                  <p
                    className={`mt-3 max-w-lg text-sm leading-6 ${
                      offer.featured
                        ? "text-green-100"
                        : "text-slate-600"
                    }`}
                  >
                    {offer.description}
                  </p>

                  {/* CTA */}
                  <Link
                    href={offer.href}
                    className={`mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                      offer.featured
                        ? "bg-white text-green-950 hover:bg-green-50"
                        : "bg-green-800 text-white hover:bg-green-950"
                    }`}
                  >
                    Explore Products
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <Link
          href="/offers"
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-green-200 bg-white px-4 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-50 sm:hidden"
        >
          View all offers
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}