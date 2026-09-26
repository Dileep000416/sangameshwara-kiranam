import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Phone } from "lucide-react";
import { featuredProducts } from "@/data/products";

type ProductDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  return featuredProducts.map((product) => ({
    id: String(product.id),
  }));
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  const product = featuredProducts.find(
    (item) => String(item.id) === id
  );

  if (!product) {
    return {
      title: "Product Not Found | Sangameshwara Kiranam",
    };
  }

  return {
    title: `${product.name} | Sangameshwara Kiranam & General Store`,
    description: `${product.name} available at Sangameshwara Kiranam & General Store. Price: ₹${product.price} for ${product.unit}.`,
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;

  const product = featuredProducts.find(
    (item) => String(item.id) === id
  );

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Breadcrumb / Back */}
      <section className="border-b border-green-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-900"
          >
            <ArrowLeft size={17} />
            Back to products
          </Link>
        </div>
      </section>

      {/* Product Details */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
            {/* Product Image */}
            <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-green-100 bg-white p-8 shadow-sm sm:min-h-[500px]">
              <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-3xl bg-green-50">
                <span className="text-8xl">🛒</span>
              </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
                {product.category}
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-green-950 sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              {product.badge && (
                <div className="mt-5">
                  <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
                    {product.badge}
                  </span>
                </div>
              )}

              <div className="mt-7">
                <span className="text-3xl font-bold text-green-800">
                  ₹{product.price}
                </span>

                <span className="ml-2 text-base text-slate-500">
                  / {product.unit}
                </span>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-7">
                <h2 className="text-lg font-bold text-slate-900">
                  Product information
                </h2>

                <dl className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                    <dt className="text-sm text-slate-500">
                      Category
                    </dt>

                    <dd className="text-sm font-semibold text-slate-900">
                      {product.category}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                    <dt className="text-sm text-slate-500">
                      Pack size
                    </dt>

                    <dd className="text-sm font-semibold text-slate-900">
                      {product.unit}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                    <dt className="text-sm text-slate-500">
                      Availability
                    </dt>

                    <dd className="text-sm font-semibold text-green-700">
                      Available in store
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-800"
                >
                  <ShoppingCart size={19} />
                  Add to cart
                </button>

                <a
                  href="tel:9392638378"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-6 py-3.5 text-sm font-bold text-green-800 transition hover:bg-green-50"
                >
                  <Phone size={18} />
                  Contact Store
                </a>
              </div>

              {/* Store note */}
              <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5">
                <p className="text-sm font-semibold text-green-900">
                  Need help with this product?
                </p>

                <p className="mt-1 text-sm leading-6 text-green-800">
                  Contact Sangameshwara Kiranam & General Store for
                  availability, quantity and ordering information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}