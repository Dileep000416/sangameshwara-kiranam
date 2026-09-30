"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ErrorState } from "@/components/ui/ErrorState";
import { api, ApiRequestError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import type { Order, OrderStatus } from "@/types";

const ORDER_STATUSES: OrderStatus[] = [
  "CREATED",
  "WHATSAPP_REDIRECTED",
  "CONFIRMED",
  "PACKING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

function OrderDetailContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError("No order was specified.");
      setIsLoading(false);
      return;
    }
    api.admin
      .getOrder(orderId)
      .then(setOrder)
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Unable to load this order."))
      .finally(() => setIsLoading(false));
  }, [orderId]);

  async function handleStatusChange(status: OrderStatus) {
    if (!order) return;
    setIsUpdating(true);
    try {
      const updated = await api.admin.updateOrderStatus(order.orderId, status);
      setOrder(updated);
      showToast("Order status updated.", "success");
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to update order status.", "error");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900">
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      {isLoading ? (
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-slate-100" />
      ) : error || !order ? (
        <div className="mt-6">
          <ErrorState message={error ?? "Order not found."} />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-xl font-bold text-green-950">{order.orderId}</h1>
              <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Customer</p>
                <p className="mt-1 font-semibold text-slate-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Mobile</p>
                <p className="mt-1 font-semibold text-slate-900">{order.mobileNumber}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase text-slate-400">Delivery address</p>
                <p className="mt-1 text-slate-700">
                  {order.address}
                  {order.landmark ? ` (Landmark: ${order.landmark})` : ""}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <p className="text-xs font-semibold uppercase text-slate-400">Items</p>
              <div className="mt-3 space-y-2">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-slate-900">{item.productName}</p>
                      <p className="text-xs text-slate-500">
                        {item.unit} × {item.quantity} @ ₹{item.price}
                      </p>
                    </div>
                    <p className="font-bold text-slate-900">₹{item.total}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-1.5 border-t border-slate-100 pt-6 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>{order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-green-950">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Status panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-bold text-slate-900">Order status</p>
            <p className="mt-1 text-xs text-slate-500">Update the order's status as you process it.</p>

            <div className="mt-4 space-y-2">
              {ORDER_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdating || order.status === status}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    order.status === status
                      ? "bg-green-800 text-white"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  } disabled:cursor-not-allowed`}
                >
                  {status.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrderDetailPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Suspense fallback={null}>
          <OrderDetailContent />
        </Suspense>
      </AdminLayout>
    </AdminGuard>
  );
}
