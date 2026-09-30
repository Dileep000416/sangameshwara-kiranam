"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, UploadCloud } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import type { Category, Product } from "@/types";

interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

const PLACEHOLDER_IMAGE = "/products/placeholder.svg";

export function ProductFormModal({ product, categories, onClose, onSaved }: ProductFormModalProps) {
  const { showToast } = useToast();
  const isEditing = Boolean(product);

  const [productName, setProductName] = useState(product?.productName ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.categoryId ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [originalPrice, setOriginalPrice] = useState(String(product?.originalPrice ?? ""));
  const [unit, setUnit] = useState(product?.unit ?? "1 kg");
  const [stockQuantity, setStockQuantity] = useState(String(product?.stockQuantity ?? "0"));
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [active, setActive] = useState(product?.active ?? true);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [imageKey, setImageKey] = useState(product?.imageKey ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId && categories[0]) setCategoryId(categories[0].categoryId);
  }, [categories, categoryId]);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("Please choose a JPEG, PNG, or WebP image.", "error");
      return;
    }

    setIsUploading(true);
    try {
      const { uploadUrl, key, publicUrl } = await api.admin.getUploadUrl(file.type);

      const putResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!putResponse.ok) {
        throw new Error("Upload failed");
      }

      setImageUrl(publicUrl);
      setImageKey(key);
      showToast("Image uploaded.", "success");
    } catch {
      showToast("Unable to upload image. Please try again.", "error");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const priceNum = Number(price);
    const originalPriceNum = Number(originalPrice);
    const stockNum = Number(stockQuantity);

    if (!productName.trim() || !categoryId || Number.isNaN(priceNum) || Number.isNaN(originalPriceNum)) {
      setError("Please fill in all required fields with valid values.");
      return;
    }

    const category = categories.find((c) => c.categoryId === categoryId);

    const payload = {
      productName: productName.trim(),
      description: description.trim() || undefined,
      categoryId,
      categoryName: category?.name ?? "",
      brand: brand.trim() || undefined,
      price: priceNum,
      originalPrice: originalPriceNum,
      unit: unit.trim(),
      stockQuantity: stockNum,
      featured,
      active,
      imageUrl: imageUrl || undefined,
      imageKey: imageKey || undefined,
    };

    setIsSaving(true);
    try {
      if (isEditing && product) {
        await api.admin.updateProduct(product.productId, payload);
        showToast("Product updated.", "success");
      } else {
        await api.admin.createProduct(payload);
        showToast("Product created.", "success");
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Unable to save product.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{isEditing ? "Edit product" : "Add product"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <Image src={imageUrl || PLACEHOLDER_IMAGE} alt="Product" fill className="object-contain p-2" unoptimized />
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <UploadCloud size={16} />
              {isUploading ? "Uploading..." : "Upload image"}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
            </label>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-900">Product name *</label>
            <input
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-900">Category *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
              >
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-900">Brand</label>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-900">Price (₹) *</label>
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-900">MRP (₹) *</label>
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-900">Unit *</label>
              <input
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="1 kg"
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-900">Stock quantity *</label>
            <input
              required
              type="number"
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded" />
              Active (visible to customers)
            </label>
          </div>

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
              {isSaving ? "Saving..." : isEditing ? "Save changes" : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
