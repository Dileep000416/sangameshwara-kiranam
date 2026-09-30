export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-square animate-pulse bg-slate-100" />
      <div className="space-y-2 p-3.5 sm:p-4">
        <div className="h-2.5 w-16 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-12 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 flex items-center justify-between">
          <div className="h-5 w-14 animate-pulse rounded bg-slate-100" />
          <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="min-w-[180px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:min-w-0">
      <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-100" />
      <div className="mt-4 h-4 w-24 animate-pulse rounded bg-slate-100" />
      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-100" />
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex gap-4">
        <div className="h-24 w-24 shrink-0 animate-pulse rounded-xl bg-slate-100 sm:h-28 sm:w-28" />
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-16 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-12 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        </td>
      ))}
    </tr>
  );
}
