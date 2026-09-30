"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import type { Category } from "@/types";

interface CategoryFormModalProps {
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}

export function CategoryFormModal({ category, onClose, onSaved }: CategoryFormModalProps) {
  const isEditing = Boolean(category);
  const [name, setName] = useState(category?.name ?? "");
  const [parentGroup, setParentGroup] = useState(category?.parentGroup ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? 100));
  const [active, setActive] = useState(category?.active ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !parentGroup.trim()) {
      setError("Name and group are required.");
      return;
    }

    const payload = {
      name: name.trim(),
      parentGroup: parentGroup.trim(),
      description: description.trim() || undefined,
      sortOrder: Number(sortOrder) || 100,
      active,
    };

    setIsSaving(true);
    try {
      if (isEditing && category) {
        await api.admin.updateCategory(category.categoryId, payload);
      } else {
        await api.admin.createCategory(payload);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Unable to save category.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{isEditing ? "Edit category" : "Add category"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-900">Category name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rice"
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-900">Group *</label>
            <input
              required
              value={parentGroup}
              onChange={(e) => setParentGroup(e.target.value)}
              placeholder="e.g. Grocery & Staples"
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-900">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-900">Sort order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded" />
            Active (visible to customers)
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-11 flex-1 rounded-xl bg-green-800 text-sm font-bold text-white transition hover:bg-green-950 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : isEditing ? "Save changes" : "Add category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
