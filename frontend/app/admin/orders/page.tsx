"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TableRowSkeleton } from "@/components/ui/Skeletons";
import { api, ApiRequestError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import type { Order, OrderStatus } from "@/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  CREATED: "bg-slate-100 text-slate-700",
  WHATSAPP_REDIRECTED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-amber-100 text-amber-800",
  PACKING: "bg-amber-100 text-amber-800",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-700",
};

function OrdersContent() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.admin
      .listOrders()
      .then((res) => setOrders(res.items))
      .catch((err) => showToast(err instanceof ApiRequestError ? err.message : "Unable to load orders.", "error"))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-950">Orders</h1>
      <p className="mt-1 text-sm text-slate-500">View and manage all customer orders.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} columns={7} />)
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.orderId} className="cursor-pointer hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-green-800">
                    <Link href={`/admin/orders/detail?id=${encodeURIComponent(order.orderId)}`}>{order.orderId}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-900">{order.customerName}</td>
                  <td className="px-4 py-3 text-slate-600">{order.mobileNumber}</td>
                  <td className="px-4 py-3 text-slate-600">{order.items.length}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">₹{order.total}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[order.status]}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <OrdersContent />
      </AdminLayout>
    </AdminGuard>
  );
}
