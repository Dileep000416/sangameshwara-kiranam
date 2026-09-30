"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CategoryFormModal } from "@/components/admin/CategoryFormModal";
import { TableRowSkeleton } from "@/components/ui/Skeletons";
import { api, ApiRequestError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import type { Category } from "@/types";

function CategoriesContent() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    try {
      const res = await api.admin.listCategories();
      setCategories(res.items);
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to load categories.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleToggleActive(category: Category) {
    try {
      const updated = await api.admin.updateCategory(category.categoryId, { active: !category.active });
      setCategories((current) => current.map((c) => (c.categoryId === category.categoryId ? updated : c)));
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to update category.", "error");
    }
  }

  async function handleDelete(category: Category) {
    if (!confirm(`Delete "${category.name}"? Products in this category will remain but lose their category link.`)) return;
    setDeletingId(category.categoryId);
    try {
      await api.admin.deleteCategory(category.categoryId);
      showToast("Category deleted.", "success");
      setCategories((current) => current.filter((c) => c.categoryId !== category.categoryId));
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Unable to delete category.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-950">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">Organize your catalog into categories customers can browse.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-green-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-950"
        >
          <Plus size={17} />
          Add category
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Group</th>
              <th className="px-4 py-3">Sort order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No categories yet.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.categoryId}>
                  <td className="px-4 py-3 font-medium text-slate-900">{category.name}</td>
                  <td className="px-4 py-3 text-slate-600">{category.parentGroup}</td>
                  <td className="px-4 py-3 text-slate-600">{category.sortOrder}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(category)}
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        category.active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {category.active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(category);
                          setIsModalOpen(true);
                        }}
                        aria-label={`Edit ${category.name}`}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-green-700"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        disabled={deletingId === category.categoryId}
                        aria-label={`Delete ${category.name}`}
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
        <CategoryFormModal
          category={editingCategory}
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

export default function AdminCategoriesPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <CategoriesContent />
      </AdminLayout>
    </AdminGuard>
  );
}
