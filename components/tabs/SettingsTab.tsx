"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Drawer } from "@/lib/types";
import { fmtDate } from "@/lib/mockDb";
import { useStore } from "@/lib/store";
import AuthModal from "@/components/AuthModal";

interface Props {
  drawer: Drawer;
}

export default function SettingsTab({ drawer }: Props) {
  const router = useRouter();
  const { deleteDrawer, addToast } = useStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  function handleDelete() {
    deleteDrawer(drawer.id);
    addToast(`Šuplík „${drawer.drawerName}" byl smazán.`, "warning");
    router.push("/");
  }

  return (
    <div>
      <h2 className="font-mono font-semibold text-slate-900 mb-6">
        Nastavení šuplíku
      </h2>

      <div className="max-w-lg space-y-6">
        {/* Info section */}
        <div>
          <h3 className="text-xs font-semibold font-mono text-slate-500 uppercase tracking-wider mb-3">
            Základní informace
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200">
            <InfoRow label="ID šuplíku" value={drawer.id} mono />
            <InfoRow label="Název" value={drawer.drawerName} />
            <InfoRow label="Umístění" value={drawer.drawerLocation} />
            {drawer.description && (
              <InfoRow label="Popis" value={drawer.description} />
            )}
            <InfoRow
              label="Stav zámku"
              value={drawer.isLocked ? "Zamčeno" : "Odemčeno"}
            />
            <InfoRow
              label="Připojení"
              value={drawer.isOnline ? "Online" : "Offline"}
            />
            <InfoRow label="Vytvořeno" value={fmtDate(drawer.createdAt)} mono />
            <InfoRow
              label="Aktualizováno"
              value={fmtDate(drawer.updatedAt)}
              mono
            />
          </div>
        </div>

        {/* Danger zone */}
        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-xs font-semibold font-mono text-red-500 uppercase tracking-wider mb-3">
            Nebezpečná zóna
          </h3>
          <div className="border border-red-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900 mb-1">
                  Smazat tento šuplík
                </p>
                <p className="text-sm text-slate-500">
                  Trvale odstraní šuplík včetně všech přiřazených karet a
                  historie. Tato akce je nevratná.
                </p>
              </div>
              <button
                onClick={() => setIsDeleteOpen(true)}
                className="shrink-0 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Smazat
              </button>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Smazat šuplík"
        message={`Opravdu chcete trvale smazat šuplík „${drawer.name}"? Odstraní se všechny přiřazené karty a záznamy.`}
        confirmationText={drawer.id}
        actionText="Smazat šuplík"
        isDanger={true}
      />
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline px-4 py-3 gap-4">
      <span className="text-sm text-slate-500 shrink-0">{label}</span>
      <span
        className={`text-sm font-medium text-slate-800 text-right break-all ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
