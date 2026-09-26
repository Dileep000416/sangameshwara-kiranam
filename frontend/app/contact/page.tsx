import {
  Clock3,
  MapPin,
  Phone,
  Store,
} from "lucide-react";

import { storeInfo } from "@/data/store";

export const metadata = {
  title: "Contact Us | Sangameshwara Kiranam & General Store",
  description:
    "Contact Sangameshwara Kiranam & General Store in Jagathgirigutta, Hyderabad. Find our address, phone number and store location.",
};

export default function ContactPage() {
  const fullAddress = `${storeInfo.address.line1}, ${storeInfo.address.line2}, ${storeInfo.address.area}, ${storeInfo.address.city}, ${storeInfo.address.state} - ${storeInfo.address.pincode}`;

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-green-700">
            Get in touch
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-green-950 sm:text-5xl lg:text-6xl">
            Contact our store.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Have a question about a product, price or availability? Get in
            touch with Sangameshwara Kiranam & General Store.
          </p>
        </div>
      </section>

      {/* Contact information */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Phone */}
          <article className="rounded-3xl border border-green-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Phone size={24} />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.15em] text-green-700">
              Call Us
            </p>

            <h2 className="mt-2 text-xl font-bold text-green-950">
              {storeInfo.phone}
            </h2>

            <a
              href={`tel:${storeInfo.phone}`}
              className="mt-5 inline-flex rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Call Store
            </a>
          </article>

          {/* Address */}
          <article className="rounded-3xl border border-green-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <MapPin size={24} />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.15em] text-green-700">
              Visit Us
            </p>

            <h2 className="mt-2 text-xl font-bold text-green-950">
              Our Store
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {fullAddress}
            </p>

            <p className="mt-2 text-sm font-medium text-green-700">
              Landmark: {storeInfo.landmark}
            </p>
          </article>

          {/* Store */}
          <article className="rounded-3xl border border-green-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg md:col-span-2 lg:col-span-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Store size={24} />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.15em] text-green-700">
              Store
            </p>

            <h2 className="mt-2 text-xl font-bold text-green-950">
              {storeInfo.name}
            </h2>

            <div className="mt-4 flex items-start gap-3">
              <Clock3
                size={19}
                className="mt-0.5 shrink-0 text-green-700"
              />

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Store Hours
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {storeInfo.hours.weekdays}
                </p>

                <p className="text-sm text-slate-600">
                  Weekend: {storeInfo.hours.weekend}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Location section */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-green-950">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:items-center lg:p-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">
                Find Us
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Sangameshwara Kiranam & General Store
              </h2>

              <p className="mt-5 text-sm leading-7 text-green-100 sm:text-base">
                {fullAddress}
              </p>

              <p className="mt-3 text-sm font-medium text-green-300">
                Near {storeInfo.landmark.replace("Near ", "")}
              </p>
            </div>

            <div className="flex min-h-56 items-center justify-center rounded-2xl bg-green-900/70">
              <div className="text-center">
                <MapPin
                  size={42}
                  className="mx-auto text-green-300"
                />

                <p className="mt-4 font-semibold text-white">
                  Jagathgirigutta
                </p>

                <p className="mt-1 text-sm text-green-200">
                  Hyderabad, Telangana
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}