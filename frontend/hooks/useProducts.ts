"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiRequestError } from "@/lib/api";
import type { PaginatedResponse, Product } from "@/types";

interface UseProductsOptions {
  category?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}

interface UseProductsResult {
  products: Product[];
  pagination: PaginatedResponse<Product>["pagination"] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches products from GET /products with optional category/search/featured
 * filters and pagination. Debounces nothing itself — callers (e.g. the
 * search box) are responsible for debouncing user input before changing
 * `search`, to avoid firing an API call on every keystroke.
 */
export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { category, search, featured, page, pageSize } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Product>["pagination"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    api
      .listProducts({ category, search, featured, page, pageSize })
      .then((response) => {
        if (cancelled) return;
        setProducts(response.items);
        setPagination(response.pagination);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiRequestError ? err.message : "Unable to load products. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, search, featured, page, pageSize, refetchIndex]);

  const refetch = useCallback(() => setRefetchIndex((i) => i + 1), []);

  return { products, pagination, isLoading, error, refetch };
}
