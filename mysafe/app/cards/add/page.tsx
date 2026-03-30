"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { uid } from "@/lib/mockDb";
import Button from "@/components/Button";
import Switch from "@/components/Switch";
import OfflineWarning from "@/components/OfflineWarning";

export default function AddCardPage() {
  const router = useRouter();
  const { cards, addCard, device, addToast } = useStore();

  const [cardId, setCardId] = useState("");
  const [note, setNote] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit() {
    const trimmed = cardId.trim().toUpperCase();

    if (!trimmed) {
      setError("ID karty je povinné.");
      return;
    }
    if (cards.find((c) => c.id === trimmed)) {
      setError("Karta s tímto ID již existuje v systému.");
      return;
    }

    const now = new Date().toISOString();
    addCard({
      id: trimmed,
      note: note.trim(),
      isAuthorized: authorized,
      createdAt: now,
      updatedAt: now,
    });

    addToast(`Karta ${trimmed} byla úspěšně registrována.`, "success");
    router.push("/cards");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-mono font-bold text-2xl text-slate-900">Přidat novou kartu</h1>
        <p className="text-slate-400 text-sm mt-0.5">Registrace nové RFID karty do systému</p>
      </div>

      {device.status === "offline" && (
        <OfflineWarning message="Zařízení je offline. Karta bude synchronizována po obnovení připojení." />
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-lg">
        {/* Card ID */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            ID karty <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cardId}
            onChange={(e) => { setCardId(e.target.value); setError(""); }}
            placeholder="např. AB12CD34"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 focus:bg-white transition-all"
          />
          {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
        </div>

        {/* Note */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Poznámka <span className="text-slate-400 font-normal">(volitelné)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Jméno držitele, oddělení…"
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Authorization */}
        <div className="mb-7 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Autorizace</label>
          <Switch
            checked={authorized}
            onChange={setAuthorized}
            label={authorized ? "Přístup povolen" : "Přístup zakázán"}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleSubmit}>Potvrdit</Button>
          <Link href="/cards">
            <Button variant="outline">Zrušit</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
