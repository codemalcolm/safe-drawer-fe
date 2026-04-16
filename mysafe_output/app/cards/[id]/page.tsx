"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/mockDb";
import { fetchCard, updateCard, deleteCard } from "@/lib/api";
import { Card } from "@/lib/types";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Switch from "@/components/Switch";
import OfflineWarning from "@/components/OfflineWarning";

type LoadState = "loading" | "ok" | "notfound" | "error";
type ModalState = "none" | "auth" | "edit" | "delete";

export default function CardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { device, addToast, addNotification } = useStore();

  const cardId = params.id as string;

  const [card,      setCard]   = useState<Card | null>(null);
  const [loadState, setLoad]   = useState<LoadState>("loading");
  const [usingMock, setMock]   = useState(false);
  const [modal,     setModal]  = useState<ModalState>("none");
  const [saving,    setSaving] = useState(false);

  // Edit form state
  const [editNote, setEditNote] = useState("");
  const [editAuth, setEditAuth] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  async function load() {
    setLoad("loading");
    const result = await fetchCard(cardId);

    // notFound is ONLY true when the backend is reachable and returns 404.
    // Network failures always provide mock data (result.usingMock === true).
    if (result.notFound) { setLoad("notfound"); return; }
    if (!result.data)    { setLoad("error");    return; }

    setCard(result.data);
    setMock(result.usingMock);
    setLoad("ok");
  }

  useEffect(() => { load(); }, [cardId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth toggle ────────────────────────────────────────────────────────────
  function requestAuthToggle() {
    if (device.status === "offline") {
      addToast("Nelze měnit autorizaci – zařízení je offline.", "error");
      return;
    }
    setModal("auth");
  }

  async function confirmAuthToggle() {
    if (!card) return;
    const newAuth = !card.isAuthorized;
    setSaving(true);
    const result = await updateCard(cardId, { isAuthorized: newAuth });
    setSaving(false);
    setModal("none");

    if (!result.ok) {
      addToast(result.message, "error");
      return;
    }

    setCard(result.card);
    setMock(result.usingMock);
    addToast(
      `Autorizace karty ${card.id} byla ${newAuth ? "povolena" : "zakázána"}.${result.usingMock ? " (lokálně)" : ""}`,
      "success"
    );
    addNotification(
      `Autorizace karty ${card.id} změněna na: ${newAuth ? "povolena" : "zakázána"}`,
      "info"
    );
  }

  // ── Edit ───────────────────────────────────────────────────────────────────
  function openEdit() {
    if (!card) return;
    setEditNote(card.note ?? "");
    setEditAuth(card.isAuthorized);
    setModal("edit");
  }

  async function confirmEdit() {
    if (!card) return;
    setSaving(true);
    const result = await updateCard(cardId, { note: editNote.trim(), isAuthorized: editAuth });
    setSaving(false);
    setModal("none");

    if (!result.ok) {
      addToast(result.message, "error");
      return;
    }

    setCard(result.card);
    setMock(result.usingMock);
    addToast(
      `Karta byla úspěšně upravena.${result.usingMock ? " (lokálně, backend nedostupný)" : ""}`,
      "success"
    );
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function confirmDelete() {
    if (!card) return;
    setSaving(true);
    const result = await deleteCard(cardId);
    setSaving(false);
    setModal("none");

    if (!result.ok) {
      addToast(result.message, "error");
      return;
    }

    addToast(
      `Karta ${card.id} byla smazána.${result.usingMock ? " (lokálně, backend nedostupný)" : ""}`,
      "success"
    );
    router.push("/cards");
  }

  // ── Render states ──────────────────────────────────────────────────────────
  if (loadState === "loading") {
    return (
      <div className="flex items-center justify-center gap-3 py-32 text-slate-400">
        <span className="w-5 h-5 border-2 border-slate-200 border-t-teal rounded-full animate-spin" />
        <span className="text-sm">Načítání…</span>
      </div>
    );
  }

  // notFound is ONLY shown when the backend confirmed 404 (server was reachable)
  if (loadState === "notfound") {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-3">❓</div>
        <p className="text-slate-500 mb-4">Karta nenalezena.</p>
        <Link href="/cards"><Button variant="outline">← Zpět na seznam</Button></Link>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-slate-500 mb-4">Nepodařilo se načíst detail karty.</p>
        <Button variant="outline" onClick={load}>Zkusit znovu</Button>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-mono font-bold text-2xl text-slate-900">Detail karty</h1>
          <p className="text-slate-400 text-sm font-mono mt-0.5">{card.id}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={openEdit}>✏️ Upravit</Button>
          <Button variant="danger"  size="sm" onClick={() => setModal("delete")}>🗑 Smazat</Button>
          <Link href="/cards"><Button variant="outline">← Zpět</Button></Link>
        </div>
      </div>

      {/* Offline / mock data banner */}
      {usingMock && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-amber-800 text-sm">
          <span className="text-base">🔌</span>
          <span>
            Backend není dostupný — zobrazena demo data. Změny se ukládají pouze lokálně.
          </span>
        </div>
      )}

      {device.status === "offline" && (
        <OfflineWarning message="Zařízení je offline. Změny autorizace nejsou dostupné." />
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-2xl">
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
          Informace o kartě
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <DetailField label="ID karty"         value={card.id}                mono />
          <DetailField label="Poznámka"         value={card.note || "—"} />
          <DetailField label="Vytvořena"        value={fmtDate(card.createdAt)} mono />
          <DetailField label="Aktualizována"    value={fmtDate(card.updatedAt)} mono />
          <DetailField label="Poslední použití" value={fmtDate(card.lastUsed)}  mono className="sm:col-span-2" />
        </div>

        {/* Authorization toggle */}
        <div className="border-t border-slate-100 pt-6">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
            Autorizace přístupu
          </p>
          <Switch
            checked={card.isAuthorized}
            onChange={requestAuthToggle}
            disabled={device.status === "offline"}
          />
          {device.status === "offline" && (
            <p className="text-xs text-slate-400 mt-2 italic">
              Přepnutí dostupné pouze v online režimu.
            </p>
          )}
        </div>
      </div>

      {/* Auth confirm modal */}
      {modal === "auth" && (
        <Modal
          title="Potvrdit změnu autorizace"
          description={`Opravdu chcete změnit stav karty ${card.id} na "${!card.isAuthorized ? "povolena" : "zakázána"}"? Tato akce ovlivní přístup k zařízení.`}
          onConfirm={confirmAuthToggle}
          onCancel={() => setModal("none")}
          loading={saving}
        />
      )}

      {/* Edit modal */}
      {modal === "edit" && (
        <Modal
          title="✏️ Upravit kartu"
          onConfirm={confirmEdit}
          onCancel={() => setModal("none")}
          loading={saving}
          confirmLabel="Uložit"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">ID karty</label>
              <input
                type="text"
                value={card.id}
                disabled
                className="w-full px-4 py-2.5 border border-slate-100 rounded-xl text-sm bg-slate-100 text-slate-400 font-mono cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Poznámka</label>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={3}
                placeholder="Jméno držitele, oddělení…"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 focus:bg-white transition-all resize-none"
              />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Autorizace</label>
              <Switch
                checked={editAuth}
                onChange={setEditAuth}
                label={editAuth ? "Přístup povolen" : "Přístup zakázán"}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm modal */}
      {modal === "delete" && (
        <Modal
          title="🗑 Smazat kartu"
          description={`Opravdu chcete smazat kartu ${card.id}${card.note ? ` (${card.note})` : ""}? Tato akce je nevratná.`}
          onConfirm={confirmDelete}
          onCancel={() => setModal("none")}
          confirmLabel="Smazat"
          confirmVariant="danger"
          loading={saving}
        />
      )}
    </div>
  );
}

function DetailField({
  label, value, mono, className,
}: {
  label: string; value: string; mono?: boolean; className?: string;
}) {
  return (
    <div className={`bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 ${className ?? ""}`}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className={`text-sm text-slate-800 break-all ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
