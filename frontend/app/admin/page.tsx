"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  IndianRupee,
  ListOrdered,
  Package,
  PackageX,
  ShoppingBag,
  Users,
} from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { api, ApiRequestError } from "@/lib/api";
import type { DashboardStats } from "@/types";

const statCards: Array<{
  key: keyof DashboardStats;
  label: string;
  icon: typeof Package;
  format?: (value: number) => string;
}> = [
  { key: "totalProducts", label: "Total products", icon: Package },
  { key: "activeProducts", label: "Active products", icon: ShoppingBag },
  { key: "outOfStockProducts", label: "Out of stock", icon: PackageX },
  { key: "totalCustomers", label: "Total customers", icon: Users },
  { key: "totalOrders", label: "Total orders", icon: ListOrdered },
  { key: "pendingOrders", label: "Pending orders", icon: AlertTriangle },
  { key: "todaysOrders", label: "Today's orders", icon: CalendarClock },
  { key: "todaysOrderValue", label: "Today's order value", icon: IndianRupee, format: (v) => `₹${v}` },
];

function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .admin.dashboard()
      .then(setStats)
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Unable to load dashboard stats."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-950">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Overview of your store's products, customers and orders.</p>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            const value = stats ? stats[card.key] : undefined;
            return (
              <div key={card.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Icon size={19} />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
                {isLoading ? (
                  <div className="mt-2 h-7 w-16 animate-pulse rounded bg-slate-100" />
                ) : (
                  <p className="mt-1 text-2xl font-extrabold text-green-950">
                    {card.format && value !== undefined ? card.format(value) : value ?? "—"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <DashboardContent />
      </AdminLayout>
    </AdminGuard>
  );
}
