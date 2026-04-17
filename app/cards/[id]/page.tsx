"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/mockDb";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Switch from "@/components/Switch";
import OfflineWarning from "@/components/OfflineWarning";

export default function CardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { cards, updateCard, deleteCard, device, addToast, addNotification } = useStore();

  const card = cards.find((c) => c.id === params.id);

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAuth, setPendingAuth] = useState<boolean | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editNote, setEditNote] = useState("");

  if (!card) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-3">❓</div>
        <p className="text-slate-500 mb-4">Karta nebyla nalezena.</p>
        <Link href="/cards">
          <Button variant="outline">← Zpět na seznam</Button>
        </Link>
      </div>
    );
  }

  function requestToggle() {
    if (device.status === "offline") {
      addToast("Nelze měnit autorizaci – zařízení je offline.", "error");
      return;
    }
    setPendingAuth(!card!.isAuthorized);
    setShowConfirm(true);
  }

  function confirmToggle() {
    if (pendingAuth === null) return;
    updateCard(card!.id, { isAuthorized: pendingAuth });
    addToast(
      `Autorizace karty ${card!.id} byla ${pendingAuth ? "povolena" : "zakázána"}.`,
      "success"
    );
    addNotification(
      `Autorizace karty ${card!.id} změněna na: ${pendingAuth ? "povolena" : "zakázána"}`,
      "info"
    );
    setShowConfirm(false);
  }

  function openEditModal() {
    setEditNote(card!.note || "");
    setShowEditModal(true);
  }

  function confirmEdit() {
    updateCard(card!.id, { note: editNote.trim() });
    addToast(`Karta ${card!.id} byla aktualizována.`, "success");
    setShowEditModal(false);
  }

  function confirmDelete() {
    deleteCard(card!.id);
    addToast(`Karta ${card!.id} byla odstraněna.`, "warning");
    addNotification(`Karta ${card!.id} byla odstraněna ze systému.`, "warning");
    router.push("/cards");
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-mono font-bold text-2xl text-slate-900">Detail karty</h1>
          <p className="text-slate-400 text-sm font-mono mt-0.5">{card.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/cards">
            <Button variant="outline">← Zpět</Button>
          </Link>
        </div>
      </div>

      {device.status === "offline" && (
        <OfflineWarning message="Zařízení je offline. Změny autorizace nejsou dostupné." />
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-2xl">
        {/* Detail grid */}
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
          Informace o kartě
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <DetailField label="ID karty" value={card.id} mono />
          <DetailField label="Poznámka" value={card.note || "—"} />
          <DetailField label="Vytvořena" value={fmtDate(card.createdAt)} mono />
          <DetailField label="Aktualizována" value={fmtDate(card.updatedAt)} mono />
          <DetailField
            label="Poslední použití"
            value={fmtDate(card.lastUsed)}
            mono
            className="sm:col-span-2"
          />
        </div>

        {/* Authorization */}
        <div className="border-t border-slate-100 pt-6">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
            Autorizace přístupu
          </p>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <Switch
                  checked={card.isAuthorized}
                  onChange={requestToggle}
                  disabled={device.status === "offline"}
                />
              </div>
              {device.status === "offline" && (
                <p className="text-xs text-slate-400 mt-2 italic">
                  Přepnutí dostupné pouze v online režimu.
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={openEditModal}>
                ✏️ Upravit
              </Button>
              <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                🗑 Smazat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth toggle confirmation modal */}
      {showConfirm && (
        <Modal
          title="Potvrdit změnu autorizace"
          description={`Opravdu chcete změnit stav karty ${card.id} na "${
            pendingAuth ? "povolena" : "zakázána"
          }"? Tato akce ovlivní přístup k zařízení.`}
          onConfirm={confirmToggle}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Edit modal */}
      {showEditModal && (
        <Modal
          title="Upravit kartu"
          onConfirm={confirmEdit}
          onCancel={() => setShowEditModal(false)}
          confirmLabel="Uložit změny"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                ID karty
              </label>
              <div className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-400 bg-slate-50 font-mono">
                {card.id}
              </div>
              <p className="text-xs text-slate-400 mt-1">ID karty nelze měnit.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Poznámka
              </label>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="Jméno držitele, oddělení…"
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <Modal
          title="Smazat kartu"
          description={`Opravdu chcete trvale odstranit kartu ${card.id}${card.note ? ` (${card.note})` : ""}? Tato akce je nevratná.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          confirmLabel="Smazat"
          confirmVariant="danger"
        />
      )}
    </div>
  );
}

function DetailField({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 ${className ?? ""}`}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </p>
      <p className={`text-sm text-slate-800 break-all ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
