"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { TableRowSkeleton } from "@/components/ui/Skeletons";
import { api, ApiRequestError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import type { Category, Product } from "@/types";

const PLACEHOLDER_IMAGE = "/products/placeholder.svg";

function ProductsContent() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([api.admin.listProducts(), api.admin.listCategories()]);
      setProducts(productsRes.items);
      setCategories(categoriesRes.items);
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to load products.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = products.filter((p) => p.productName.toLowerCase().includes(searchTerm.toLowerCase()));

  function openAddModal() {
    setEditingProduct(null);
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setIsModalOpen(true);
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.productName}"? This cannot be undone.`)) return;
    setDeletingId(product.productId);
    try {
      await api.admin.deleteProduct(product.productId);
      showToast("Product deleted.", "success");
      setProducts((current) => current.filter((p) => p.productId !== product.productId));
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to delete product.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleActive(product: Product) {
    try {
      const updated = await api.admin.updateProduct(product.productId, { active: !product.active });
      setProducts((current) => current.map((p) => (p.productId === product.productId ? updated : p)));
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to update product.", "error");
    }
  }

  async function handleStockChange(product: Product, value: string) {
    const stockQuantity = Number(value);
    if (Number.isNaN(stockQuantity) || stockQuantity < 0) return;
    try {
      const updated = await api.admin.updateStock(product.productId, stockQuantity);
      setProducts((current) => current.map((p) => (p.productId === product.productId ? updated : p)));
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to update stock.", "error");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-950">Products</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your product catalog, prices, stock and images.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          disabled={categories.length === 0}
          className="flex items-center gap-2 rounded-xl bg-green-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-950 disabled:opacity-50"
          title={categories.length === 0 ? "Create a category first" : undefined}
        >
          <Plus size={17} />
          Add product
        </button>
      </div>

      <div className="mt-6">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="h-11 w-full max-w-sm rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} columns={7} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.productId}>
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-50">
                      <Image
                        src={product.imageUrl || PLACEHOLDER_IMAGE}
                        alt={product.productName}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="max-w-[200px] px-4 py-3 font-medium text-slate-900">
                    <p className="truncate">{product.productName}</p>
                    <p className="text-xs text-slate-400">{product.unit}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{product.categoryName}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">₹{product.price}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      defaultValue={product.stockQuantity}
                      onBlur={(e) => handleStockChange(product, e.target.value)}
                      className="h-9 w-20 rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-green-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(product)}
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        product.active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {product.active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(product)}
                        aria-label={`Edit ${product.productName}`}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-green-700"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product.productId}
                        aria-label={`Delete ${product.productName}`}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            load();
          }}
        />
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ProductsContent />
      </AdminLayout>
    </AdminGuard>
  );
}
