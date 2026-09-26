import {
  Heart,
  ShieldCheck,
  ShoppingBasket,
  MapPin,
  Store,
} from "lucide-react";

export const metadata = {
  title: "About Us | Sangameshwara Kiranam & General Store",
  description:
    "Learn more about Sangameshwara Kiranam & General Store, your local destination for groceries, household essentials and everyday products.",
};

const values = [
  {
    icon: ShoppingBasket,
    title: "Everyday Essentials",
    description:
      "From groceries and staples to household and personal care products, we aim to make everyday shopping simple.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Store",
    description:
      "We focus on providing useful everyday products with clear pricing and a convenient shopping experience.",
  },
  {
    icon: Heart,
    title: "Local & Customer Focused",
    description:
      "Our goal is to serve the local community with convenience, reliability and friendly service.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-green-700">
            About Sangameshwara
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-green-950 sm:text-5xl lg:text-6xl">
            Your local store for
            <span className="block text-green-700">
              everyday essentials.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            Sangameshwara Kiranam & General Store is your neighborhood
            destination for groceries, household essentials and everyday
            products.
          </p>
        </div>
      </section>

      {/* Store introduction */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-green-700">
              Our Store
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
              Everything you need, closer to home.
            </h2>

            <div className="mt-6 space-y-4 text-base leading-7 text-slate-600">
              <p>
                Sangameshwara Kiranam & General Store is focused on making
                everyday shopping convenient for the local community.
              </p>

              <p>
                Our store brings together essential groceries, staples,
                household products, beverages, snacks and other everyday
                necessities in one convenient place.
              </p>

              <p>
                Through this website, we are making it easier for customers
                to discover products, explore offers and connect with the
                store.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-green-100 bg-green-50 p-6 sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-white">
              <Store size={28} />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-green-950">
              Sangameshwara
            </h3>

            <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-green-700">
              Kiranam & General Store
            </p>

            <div className="mt-6 flex gap-3">
              <MapPin className="mt-1 shrink-0 text-green-700" size={20} />

              <p className="text-sm leading-6 text-slate-600">
                H. No. 42-478/301, Srinidhi Hills Road No. 9,
                Jagathgirigutta, Alwyn Colony, Hyderabad - 500037.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-green-700">
              What matters to us
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-green-950 sm:text-4xl">
              Simple shopping. Local convenience.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-green-950">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-green-950">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">
                Visit Our Store
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                We are here for your everyday needs.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-green-100 sm:text-base">
                Find us near Water Plant in Jagathgirigutta, Hyderabad.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-green-700">
              <MapPin size={30} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}