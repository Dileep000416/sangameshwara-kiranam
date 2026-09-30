"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, ShoppingBag } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { api, ApiRequestError } from "@/lib/api";

const FREE_DELIVERY_THRESHOLD = 500;
const DELIVERY_FEE = 30;

/**
 * Checkout flow (spec sections 16-17, 40):
 *   1. Collect/confirm customer contact + delivery details.
 *   2. Submit -> backend re-validates stock/prices, persists the order in
 *      DynamoDB, and returns a ready-to-use WhatsApp deep link.
 *   3. Redirect to WhatsApp. If the redirect fails for any reason (popup
 *      blocked, etc.), the order is already saved — we show the order ID
 *      and an "Open WhatsApp" button so nothing is lost.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, mobileNumber } = useAuth();
  const { cartItems, cartTotal, isLoading: cartLoading, refresh } = useCart();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState(mobileNumber?.replace("+91", "") ?? "");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ orderId: string; whatsappUrl: string | null } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [authLoading, isAuthenticated, router]);

  const deliveryFee = cartTotal === 0 ? 0 : cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const estimatedTotal = cartTotal + deliveryFee;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const digits = phone.replace(/\D/g, "");
    const mobile = digits.length === 10 ? `+91${digits}` : digits.startsWith("91") ? `+${digits}` : phone;

    setIsSubmitting(true);
    try {
      const response = await api.createOrder({
        name: name.trim(),
        mobileNumber: mobile,
        address: address.trim(),
        landmark: landmark.trim() || undefined,
      });

      setResult({ orderId: response.order.orderId, whatsappUrl: response.whatsappUrl });
      await refresh();

      if (response.whatsappUrl) {
        window.open(response.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Unable to create your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (result) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <section className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6">
          <div className="w-full max-w-lg rounded-3xl border border-green-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
              <ShoppingBag size={30} />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-green-950">Your order has been created successfully.</h1>
            <p className="mt-2 text-sm text-slate-600">
              Order ID: <span className="font-bold text-green-900">{result.orderId}</span>
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Please confirm your order on WhatsApp so the store can start preparing it.
            </p>

            {result.whatsappUrl ? (
              <a
                href={result.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700"
              >
                <MessageCircle size={19} />
                Open WhatsApp
              </a>
            ) : (
              <p className="mt-6 text-sm text-red-600">
                We could not generate a WhatsApp link automatically. Please call the store and reference your order ID.
              </p>
            )}

            <div className="mt-6">
              <Link href="/products" className="text-sm font-semibold text-green-700 hover:text-green-900">
                Continue shopping
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-green-100 hover:text-white">
            <ArrowLeft size={16} />
            Back to cart
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Checkout</h1>
          <p className="mt-2 text-sm text-green-100">Review your order and confirm via WhatsApp.</p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Customer details form */}
          <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold text-slate-900">Delivery details</h2>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-900">
                Full name
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-slate-900">
                Mobile number
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-100">
                <span className="pl-4 text-sm font-semibold text-slate-500">+91</span>
                <input
                  id="phone"
                  required
                  inputMode="numeric"
                  maxLength={10}
                  value={phone.replace(/^\+91/, "")}
                  onChange={(event) => setPhone(event.target.value)}
                  className="h-12 w-full rounded-xl bg-transparent px-2 text-sm outline-none"
                  placeholder="9XXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="mb-1.5 block text-sm font-semibold text-slate-900">
                Delivery address
              </label>
              <textarea
                id="address"
                required
                rows={3}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                placeholder="House no, street, area, city, pincode"
              />
            </div>

            <div>
              <label htmlFor="landmark" className="mb-1.5 block text-sm font-semibold text-slate-900">
                Landmark (optional)
              </label>
              <input
                id="landmark"
                value={landmark}
                onChange={(event) => setLandmark(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                placeholder="Near..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cartLoading || cartItems.length === 0}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle size={18} />
              {isSubmitting ? "Placing order..." : "Place Order on WhatsApp"}
            </button>
          </form>

          {/* Order summary */}
          <aside className="rounded-3xl border border-green-100 bg-green-50/60 p-6 sm:p-7">
            <h2 className="text-lg font-bold text-green-950">Order summary</h2>

            <div className="mt-5 space-y-3">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{item.productName}</p>
                    <p className="text-xs text-slate-500">
                      {item.unit} × {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-bold text-green-900">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t border-green-200 pt-5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="font-semibold text-green-700">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-green-200 pt-4">
              <span className="text-sm font-medium text-slate-500">Estimated total</span>
              <span className="text-2xl font-extrabold text-green-950">₹{estimatedTotal}</span>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Final pricing is confirmed by the store based on current stock and prices at the time your order is placed.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
