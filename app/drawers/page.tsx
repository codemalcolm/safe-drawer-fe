"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { uid, fmtDate } from "@/lib/mockDb";
import { Drawer } from "@/lib/types";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
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

export default function DrawersPage() {
  const { drawers, updateDrawer, deleteDrawer, addToast } = useStore();

  const [editingDrawer, setEditingDrawer] = useState<Drawer | null>(null);
  const [editForm, setEditForm] = useState<DrawerFormState>(emptyForm());
  const [editErrors, setEditErrors] = useState<Partial<DrawerFormState>>({});

  const [deletingDrawer, setDeletingDrawer] = useState<Drawer | null>(null);

  function validateForm(f: DrawerFormState): Partial<DrawerFormState> {
    const e: Partial<DrawerFormState> = {};
    if (!f.name.trim()) e.name = "Název je povinný.";
    if (!f.location.trim()) e.location = "Umístění je povinné.";
    
    return e;
  }

  // ── Edit ──────────────────────────────────────────────────────────────────

  function openEdit(d: Drawer) {
    setEditingDrawer(d);
    setEditForm({
      name: d.name,
      location: d.location,
      description: d.description || "",
      isLocked: d.isLocked,
    });
    setEditErrors({});
  }

  function handleEditSave() {
    const errs = validateForm(editForm);
    if (Object.keys(errs).length > 0) { setEditErrors(errs); return; }
    updateDrawer(editingDrawer!.id, {
      name: editForm.name.trim(),
      location: editForm.location.trim(),
      description: editForm.description.trim(),
      isLocked: editForm.isLocked,
    });
    addToast(`Šuplík „${editForm.name}" byl aktualizován.`, "success");
    setEditingDrawer(null);
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  function handleDelete() {
    if (!deletingDrawer) return;
    deleteDrawer(deletingDrawer.id);
    addToast(`Šuplík „${deletingDrawer.name}" byl odstraněn.`, "warning");
    setDeletingDrawer(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-mono font-bold text-2xl text-slate-900">Správa šuplíků</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {drawers.length} registrovaných šuplíků
          </p>
        </div>
        <Link href="/drawers/add">
          <Button variant="primary">
            + Přidat šuplík
          </Button>
        </Link>
      </div>

      {/* ── Drawers table ── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {drawers.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">🗄️</div>
            <p className="text-sm">Žádné šuplíky nejsou registrovány</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-950">
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    ID
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Název
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">
                    Umístění
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Zámek
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">
                    Aktualizováno
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody>
                {drawers.map((d) => (
                  <tr key={d.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-teal-dark font-bold">{d.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{d.name}</p>
                        {d.description && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{d.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500 hidden md:table-cell max-w-[180px]">
                      <span className="truncate block">{d.location}</span>
                    </td>
  
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          d.isLocked
                            ? "bg-teal-dim text-teal-dark"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        <span>{d.isLocked ? "🔒" : "🔓"}</span>
                        {d.isLocked ? "Zamčeno" : "Odemčeno"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-400 hidden lg:table-cell">
                      {fmtDate(d.updatedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Button variant="outline" size="sm" onClick={() => openEdit(d)}>
                        ✏️ Upravit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit modal ── */}
      {editingDrawer && (
        <Modal
          title={`Upravit šuplík – ${editingDrawer.id}`}
          onConfirm={handleEditSave}
          onCancel={() => setEditingDrawer(null)}
          confirmLabel="Uložit změny"
          footerLeft={
            <Button
              variant="danger"
              onClick={() => {
                setDeletingDrawer(editingDrawer);
                setEditingDrawer(null);
              }}
            >
              Smazat
            </Button>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Název <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => { setEditForm((p) => ({ ...p, name: e.target.value })); setEditErrors((p) => ({ ...p, name: undefined })); }}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 focus:bg-white transition-all"
              />
              {editErrors.name && <p className="text-red-500 text-xs mt-1">{editErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Umístění <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => { setEditForm((p) => ({ ...p, location: e.target.value })); setEditErrors((p) => ({ ...p, location: undefined })); }}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 focus:bg-white transition-all"
              />
              {editErrors.location && <p className="text-red-500 text-xs mt-1">{editErrors.location}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Popis</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 focus:bg-white transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete modal ── */}
      {deletingDrawer && (
        <Modal
          title="Smazat šuplík"
          description={`Opravdu chcete trvale odstranit šuplík „${deletingDrawer.name}" (${deletingDrawer.id})? Tato akce je nevratná.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingDrawer(null)}
          confirmLabel="Smazat"
          confirmVariant="danger"
        />
      )}
    </div>
  );
}
