import { useEffect, useState } from "react";

export type ToastVariant = "SUCCESS" | "ERROR" | "INFO";

export interface ToastData {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const variantStyles: Record<ToastVariant, string> = {
  SUCCESS: "bg-green-700 text-white",
  ERROR: "bg-red-600 text-white",
  INFO: "bg-gray-800 text-white",
};

const variantIcons: Record<ToastVariant, string> = {
  SUCCESS: "✓",
  ERROR: "✕",
  INFO: "ℹ",
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div
      className={`flex min-w-[280px] items-center gap-3 rounded-lg px-4 py-3 shadow-lg transition-all duration-300 ${
        variantStyles[toast.variant]
      } ${isExiting ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}
      onClick={handleDismiss}
      role="alert"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
        {variantIcons[toast.variant]}
      </span>
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        className="ml-2 text-white/70 hover:text-white"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
