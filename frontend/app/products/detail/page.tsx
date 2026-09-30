"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Phone, Plus, ShoppingCart } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import { ErrorState } from "@/components/ui/ErrorState";
import { api, ApiRequestError } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { storeInfo } from "@/data/store";
import type { Product } from "@/types";

const PLACEHOLDER_IMAGE = "/products/placeholder.svg";

/**
 * Product detail route uses a query string (?id=...) rather than a dynamic
 * path segment (/products/[id]). Static export requires every dynamic-segment
 * page's params to be enumerable at build time via generateStaticParams,
 * which is incompatible with a product catalog that the admin manages live
 * in DynamoDB after deployment. A query-string route works identically on
 * a static host with no server and needs no rebuild when products change.
 */
function ProductDetailContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const { cartItems, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!productId) {
      setError("No product was specified.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    api
      .getProduct(productId)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiRequestError && err.status === 404
              ? "This product could not be found."
              : "Unable to load this product. Please try again."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const cartItem = product ? cartItems.find((item) => item.productId === product.productId) : undefined;
  const outOfStock = product ? !product.inStock || product.stockQuantity <= 0 : false;

  async function handleAdd() {
    if (!product) return;
    setIsBusy(true);
    try {
      await addToCart(product);
      showToast(`${product.productName} added to cart`, "success");
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to update cart.", "error");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleQuantityChange(delta: 1 | -1) {
    if (!product) return;
    setIsBusy(true);
    try {
      if (delta === 1) await increaseQuantity(product.productId);
      else await decreaseQuantity(product.productId);
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to update cart.", "error");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

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

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
              <div className="aspect-square animate-pulse rounded-3xl bg-white" />
              <div className="space-y-4">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ) : error || !product ? (
            <ErrorState message={error ?? "Product not found."} />
          ) : (
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
              {/* Product Image */}
              <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-green-100 bg-white p-8 shadow-sm sm:min-h-[500px]">
                <div className="relative aspect-square w-full max-w-md">
                  <Image
                    src={product.imageUrl || PLACEHOLDER_IMAGE}
                    alt={product.productName}
                    fill
                    sizes="500px"
                    className="object-contain"
                    unoptimized
                    priority
                  />
                </div>
              </div>

              {/* Product Information */}
              <div className="flex flex-col justify-center">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">{product.categoryName}</p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-green-950 sm:text-4xl lg:text-5xl">
                  {product.productName}
                </h1>

                {product.brand && <p className="mt-2 text-base text-slate-500">{product.brand}</p>}

                {product.discount > 0 && (
                  <div className="mt-5">
                    <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
                      {product.discount}% OFF
                    </span>
                  </div>
                )}

                <div className="mt-7 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-green-800">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-slate-400 line-through">₹{product.originalPrice}</span>
                  )}
                  <span className="text-base text-slate-500">/ {product.unit}</span>
                </div>

                {product.description && (
                  <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600">{product.description}</p>
                )}

                <div className="mt-8 border-t border-slate-200 pt-7">
                  <h2 className="text-lg font-bold text-slate-900">Product information</h2>

                  <dl className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                      <dt className="text-sm text-slate-500">Category</dt>
                      <dd className="text-sm font-semibold text-slate-900">{product.categoryName}</dd>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                      <dt className="text-sm text-slate-500">Pack size</dt>
                      <dd className="text-sm font-semibold text-slate-900">{product.unit}</dd>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                      <dt className="text-sm text-slate-500">Availability</dt>
                      <dd className={`text-sm font-semibold ${outOfStock ? "text-red-600" : "text-green-700"}`}>
                        {outOfStock ? "Out of stock" : "In stock"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {cartItem ? (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-green-200 bg-green-50">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={isBusy}
                        aria-label="Decrease quantity"
                        className="flex h-12 w-12 items-center justify-center text-green-800 transition hover:bg-green-100 disabled:opacity-50"
                      >
                        <Minus size={18} aria-hidden="true" />
                      </button>
                      <span className="w-10 text-center text-base font-bold text-green-900">{cartItem.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        disabled={isBusy || outOfStock}
                        aria-label="Increase quantity"
                        className="flex h-12 w-12 items-center justify-center text-green-800 transition hover:bg-green-100 disabled:opacity-50"
                      >
                        <Plus size={18} aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAdd}
                      disabled={isBusy || outOfStock}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      <ShoppingCart size={19} />
                      {outOfStock ? "Out of stock" : "Add to cart"}
                    </button>
                  )}

                  <a
                    href={`tel:${storeInfo.phone}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-6 py-3.5 text-sm font-bold text-green-800 transition hover:bg-green-50"
                  >
                    <Phone size={18} />
                    Contact Store
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={null}>
      <ProductDetailContent />
    </Suspense>
  );
}
