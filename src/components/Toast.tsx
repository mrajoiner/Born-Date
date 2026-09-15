import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export interface ToastData {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium transition-all ${
          toast.type === "success"
            ? "bg-[#090909] text-white border-black"
            : toast.type === "error"
            ? "bg-red-900 text-white border-red-950"
            : "bg-white text-[#090909] border-[#E7E0D1]"
        }`}
      >
        {toast.type === "success" ? (
          <CheckCircle className="w-4 h-4 text-[#FAF082]" />
        ) : toast.type === "error" ? (
          <AlertCircle className="w-4 h-4 text-red-300" />
        ) : null}

        <span>{toast.message}</span>

        <button
          onClick={onDismiss}
          className="ml-2 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
