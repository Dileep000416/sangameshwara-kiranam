"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Client-side gate for every /admin/* page. This is a UX convenience only —
 * it prevents rendering admin UI before redirecting a non-admin, but it is
 * NOT the security boundary. The real authorization check happens on the
 * backend: every /admin/* Lambda calls requireAdmin() (see
 * backend/src/common/auth.ts), which reads the verified "cognito:groups"
 * claim from the Cognito JWT that API Gateway has already validated. A
 * customer who bypasses this component entirely would still get 403s from
 * every admin API call.
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/admin/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/admin/login?error=not-admin");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />
      </div>
    );
  }

  return <>{children}</>;
}
