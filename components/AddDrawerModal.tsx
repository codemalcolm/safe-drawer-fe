"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  drawerId?: string;
  defaultValues?: {
    name: string;
    location: string;
    description: string;
    isLocked: boolean;
  };
}

export default function AddDrawerModal({
  isOpen,
  onClose,
  isEdit = false,
  drawerId,
  defaultValues,
}: Props) {
  const { addDrawer, updateDrawer, addToast } = useStore();
  const [name, setName] = useState(defaultValues?.name || "");
  const [location, setLocation] = useState(defaultValues?.location || "");
  const [description, setDescription] = useState(defaultValues?.description || "");
  const [isLocked, setIsLocked] = useState(defaultValues?.isLocked ?? true);
  const [errors, setErrors] = useState<{ name?: string; location?: string }>({});

  useEffect(() => {
    if (isOpen && defaultValues) {
      setName(defaultValues.name);
      setLocation(defaultValues.location);
      setDescription(defaultValues.description);
      setIsLocked(defaultValues.isLocked);
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function validate() {
    const e: { name?: string; location?: string } = {};
    if (!name.trim()) e.name = "Název je povinný.";
    if (!location.trim()) e.location = "Umístění je povinné.";
    return e;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    if (isEdit && drawerId) {
      updateDrawer(drawerId, {
        name: name.trim(),
        location: location.trim(),
        description: description.trim(),
        isLocked,
      });
      addToast(`Šuplík „${name.trim()}" byl aktualizován.`, "success");
    } else {
      addDrawer({
        name: name.trim(),
        location: location.trim(),
        description: description.trim(),
        isLocked,
        isOnline: true,
        hasIncident: false,
      });
      addToast(`Šuplík „${name.trim()}" byl přidán.`, "success");
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 anim-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md anim-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="font-mono font-bold text-base text-slate-900">
            {isEdit ? "Upravit šuplík" : "Přidat nový šuplík"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Field label="Název" required error={errors.name}>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
              placeholder="např. Sklad A"
              className={inputCls(!!errors.name)}
              autoFocus
            />
          </Field>

          <Field label="Umístění" required error={errors.location}>
            <input
              type="text"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setErrors((p) => ({ ...p, location: undefined })); }}
              placeholder="např. Přízemí – Sklady"
              className={inputCls(!!errors.location)}
            />
          </Field>

          <Field label="Popis" optional>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Krátký popis obsahu nebo účelu…"
              rows={2}
              className={inputCls(false) + " resize-none"}
            />
          </Field>

          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-slate-700">Počáteční stav zámku</span>
            <button
              type="button"
              onClick={() => setIsLocked((v) => !v)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                isLocked ? "bg-slate-400" : "bg-sky-500"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
                  isLocked ? "translate-x-1" : "translate-x-6"
                )}
              />
            </button>
          </div>
          <p className="text-xs text-slate-400 -mt-2">{isLocked ? "Zamčeno" : "Odemčeno"}</p>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
          >
            Zrušit
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
          >
            {isEdit ? "Uložit změny" : "Přidat šuplík"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, required, optional, error, children,
}: {
  label: string; required?: boolean; optional?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {optional && <span className="text-slate-400 font-normal ml-1">(volitelné)</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full px-3.5 py-2.5 border rounded-xl text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all",
    hasError
      ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
      : "border-slate-200 focus:ring-sky-500/20 focus:border-sky-400"
  );
}
