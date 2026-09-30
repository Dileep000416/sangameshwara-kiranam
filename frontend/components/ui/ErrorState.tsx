import { AlertTriangle, RotateCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle size={24} className="text-red-600" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-red-900">Something went wrong</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
        >
          <RotateCw size={16} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}
