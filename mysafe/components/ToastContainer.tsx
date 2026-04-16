"use client";

import { useStore } from "@/lib/store";

const icons = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };
const styles = {
  success: "border-l-emerald-500",
  error:   "border-l-red-500",
  warning: "border-l-amber-500",
  info:    "border-l-teal",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-[72px] right-4 z-[200] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-start gap-3 bg-white rounded-xl shadow-xl border border-slate-100 border-l-4 px-4 py-3 ${styles[t.type]}`}>
          <span className="text-base mt-0.5 font-mono font-bold">{icons[t.type]}</span>
          <span className="flex-1 text-sm text-slate-700 leading-snug">{t.msg}</span>
          <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
        </div>
      ))}
    </div>
  );
}
