"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PackageSearch, User } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { api, ApiRequestError } from "@/lib/api";
import type { Order, UserProfile } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    Promise.all([api.getMe(), api.listMyOrders()])
      .then(([me, orderList]) => {
        setProfile(me);
        setOrders(orderList.items);
        setName(me.name ?? "");
        setEmail(me.email ?? "");
        setLine1(me.address?.line1 ?? "");
        setCity(me.address?.city ?? "");
        setState(me.address?.state ?? "");
        setPincode(me.address?.pincode ?? "");
      })
      .catch(() => {
        showToast("Unable to load your profile.", "error");
      })
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, showToast]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateMe({
        name,
        email: email || undefined,
        address: line1 ? { line1, city, state, pincode } : undefined,
      });
      setProfile(updated);
      showToast("Profile updated.", "success");
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="border-b border-green-100 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900">
            <ArrowLeft size={16} />
            Back to home
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-green-950">My account</h1>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          {/* Profile form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Profile details</h2>
                <p className="text-xs text-slate-500">{profile?.mobileNumber}</p>
              </div>
            </div>

            {isLoading ? (
              <div className="mt-6 space-y-3">
                <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Full name
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Email (optional)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label htmlFor="line1" className="mb-1.5 block text-sm font-semibold text-slate-900">
                    Address
                  </label>
                  <input
                    id="line1"
                    value={line1}
                    onChange={(event) => setLine1(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="City"
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                  <input
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    placeholder="State"
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <input
                  value={pincode}
                  onChange={(event) => setPincode(event.target.value)}
                  placeholder="Pincode"
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-green-800 text-sm font-bold text-white transition hover:bg-green-950 disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </form>
            )}
          </div>

          {/* Order history */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <PackageSearch size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">My orders</h2>
            </div>

            {isLoading ? (
              <div className="mt-6 space-y-3">
                <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ) : orders.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500">You haven&apos;t placed any orders yet.</p>
            ) : (
              <div className="mt-6 space-y-3">
                {orders.map((order) => (
                  <div key={order.orderId} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900">{order.orderId}</p>
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800">
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"} · ₹{order.total}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
