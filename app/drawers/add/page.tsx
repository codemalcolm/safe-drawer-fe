"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { uid } from "@/lib/mockDb";
import { Drawer } from "@/lib/types";
import Button from "@/components/Button";
import Switch from "@/components/Switch";

type DrawerFormState = {
  name: string;
  location: string;
  description: string;
  isLocked: boolean;
};

const emptyForm = (): DrawerFormState => ({
  name: "",
  location: "",
  description: "",
  isLocked: true,
});

export default function AddDrawerPage() {
  const router = useRouter();
  const { addDrawer, addToast } = useStore();

  const [form, setForm] = useState<DrawerFormState>(emptyForm());
  const [errors, setErrors] = useState<Partial<DrawerFormState>>({});

  function validateForm(f: DrawerFormState): Partial<DrawerFormState> {
    const e: Partial<DrawerFormState> = {};
    if (!f.name.trim()) e.name = "Název je povinný.";
    if (!f.location.trim()) e.location = "Umístění je povinné.";
    return e;
  }

  function handleAdd() {
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const now = new Date().toISOString();
    const drawer: Drawer = {
      id: `DRW-${uid()}`,
      name: form.name.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      isLocked: form.isLocked,
      createdAt: now,
      updatedAt: now,
    };
    addDrawer(drawer);
    addToast(`Šuplík „${drawer.name}" byl přidán.`, "success");
    router.push("/drawers");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-mono font-bold text-2xl text-slate-900">Nový šuplík</h1>
        <p className="text-slate-400 text-sm mt-0.5">Registrace nového šuplíku do systému</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Název <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm((p) => ({ ...p, name: e.target.value }));
                setErrors((p) => ({ ...p, name: undefined }));
              }}
              placeholder="např. Sklad A – Hlavní šuplík"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 focus:bg-white transition-all"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Location */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Umístění <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => {
                setForm((p) => ({ ...p, location: e.target.value }));
                setErrors((p) => ({ ...p, location: undefined }));
              }}
              placeholder="např. Budova A, patro 1, místnost 104"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 focus:bg-white transition-all"
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Popis <span className="text-slate-400 font-normal">(volitelné)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Krátký popis obsahu nebo účelu šuplíku…"
              rows={2}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Locked switch */}
          <div className="flex flex-col justify-end">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Stav zámku</label>
            <Switch
              checked={form.isLocked}
              onChange={(val) => setForm((p) => ({ ...p, isLocked: val }))}
              label={form.isLocked ? "Zamčeno" : "Odemčeno"}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-slate-100">
          <Button onClick={handleAdd}>Přidat šuplík</Button>
          <Link href="/drawers">
            <Button variant="outline">Zrušit</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
