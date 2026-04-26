"use client";

import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: "border-l-emerald-500 text-emerald-700",
  error:   "border-l-red-500 text-red-700",
  warning: "border-l-amber-500 text-amber-700",
  info:    "border-l-sky-500 text-sky-700",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-[70px] right-4 z-[200] flex flex-col gap-2 w-80">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 bg-white rounded-xl shadow-xl border border-slate-100 border-l-4 px-4 py-3 anim-slide-right",
              styles[t.type]
            )}
          >
            <Icon className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="flex-1 text-sm text-slate-700 leading-snug">{t.msg}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
