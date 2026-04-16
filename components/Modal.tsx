"use client";

import { useEffect } from "react";
import Button from "./Button";

interface Props {
  title: string;
  description?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger";
  loading?: boolean;
}

export default function Modal({ title, description, children, onConfirm, onCancel, confirmLabel = "Potvrdit", cancelLabel = "Zrušit", confirmVariant = "primary", loading = false }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && !loading) onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel, loading]);

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => !loading && onCancel()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-mono font-bold text-lg text-slate-900 mb-3">{title}</h2>
        {description && <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>}
        {children && <div className="mb-6">{children}</div>}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={loading}>{cancelLabel}</Button>
          {onConfirm && (
            <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
