"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmationText: string;
  actionText: string;
  isDanger?: boolean;
}

export default function AuthModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmationText,
  actionText,
  isDanger = true,
}: Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  if (!isOpen) return null;

  function handleClose() {
    setInput("");
    setError("");
    onClose();
  }

  function handleSubmit() {
    if (!input.trim()) { setError("Toto pole je povinné."); return; }
    if (input !== confirmationText) { setError("Text se neshoduje."); return; }
    onConfirm();
    setInput("");
    setError("");
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 anim-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md anim-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="font-mono font-bold text-base text-slate-900">{title}</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className={cn(
            "flex items-start gap-3 p-4 rounded-xl border",
            isDanger ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
          )}>
            <AlertTriangle className={cn("w-5 h-5 shrink-0 mt-0.5", isDanger ? "text-red-600" : "text-amber-600")} />
            <p className={cn("text-sm", isDanger ? "text-red-800" : "text-amber-800")}>{message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Pro potvrzení opište:{" "}
              <code className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                {confirmationText}
              </code>
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              placeholder={`Opište: ${confirmationText}`}
              className={cn(
                "w-full px-3.5 py-2.5 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:bg-white transition-all bg-slate-50 text-slate-800",
                error
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                  : "border-slate-200 focus:ring-sky-500/20 focus:border-sky-400"
              )}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <p className="text-xs text-slate-400">Tato akce je nevratná.</p>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={handleClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium">
            Zrušit
          </button>
          <button
            onClick={handleSubmit}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors",
              isDanger ? "bg-red-600 hover:bg-red-700" : "bg-sky-600 hover:bg-sky-700"
            )}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
}
