"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/mockDb";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

export default function UnlockPage() {
  const { device, addLog, addToast, addNotification } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [locked,      setLocked]      = useState(true);

  const isOffline = device.status === "offline";
  const lockEmoji = isOffline || locked ? "🔒" : "🔓";

  function handleUnlock() {
    if (isOffline) {
      addToast("Zařízení je offline – vzdálené odemknutí není dostupné.", "error");
      return;
    }
    setShowConfirm(true);
  }

  function confirmUnlock() {
    setLoading(true);
    setTimeout(() => {
      addLog({ cardId: "remote_unlock", timestamp: new Date().toISOString(), result: "success" });
      addToast("Akce byla úspěšně provedena.", "success");
      addNotification("Šuplík byl vzdáleně odemčen.", "info");
      setLocked(false);
      setLoading(false);
      setShowConfirm(false);
    }, 1200);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-mono font-bold text-2xl text-slate-900">Odemknutí na dálku</h1>
        <p className="text-slate-400 text-sm mt-0.5">Vzdálené odemknutí zabezpečeného šuplíku</p>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-10">
        <div className="text-7xl mb-5 select-none transition-all duration-300">{lockEmoji}</div>

        <h2 className="font-mono font-bold text-xl text-slate-800 mb-2">Vzdálené odemknutí šuplíku</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-8">
          Tato funkce umožňuje vzdáleně odemknout zabezpečený šuplík. Akce bude zaznamenána v historii přístupů.
        </p>

        {/* Device status card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 w-full max-w-sm mb-8 text-left">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Stav zařízení</p>
          <dl className="space-y-3">
            <Row label="ID zařízení"           value={device.id} />
            <Row label="Stav"                  value={<Badge variant={device.status} />} />
            <Row label="Poslední synchronizace" value={fmtDate(device.lastSync)} />
            <Row label="Čekající události"      value={String(device.pendingEvents)} />
          </dl>
        </div>

        {isOffline && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-5 py-3.5 mb-6 max-w-sm w-full">
            <span className="text-lg">⚠️</span>
            <p className="text-red-700 text-sm font-medium text-left">
              Zařízení je offline. Vzdálené odemknutí není dostupné.
            </p>
          </div>
        )}

        <Button
          size="lg"
          onClick={() => { setLocked(true); handleUnlock(); }}
          disabled={isOffline}
        >
          {lockEmoji} {locked ? "Odemknout šuplík na dálku" : "Zamknout šuplík na dálku"}
        </Button>
      </div>

      {showConfirm && (
        <Modal
          title="🔓 Potvrdit odemknutí"
          description="Opravdu chcete vzdáleně odemknout šuplík? Tato akce bude zaznamenána v historii přístupů."
          onConfirm={confirmUnlock}
          onCancel={() => { if (!loading) setShowConfirm(false); }}
          loading={loading}
        />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 last:border-none last:pb-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="font-mono text-xs text-slate-700">{value}</dd>
    </div>
  );
}
