"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/mockDb";
import { fetchCards } from "@/lib/api";
import { Card } from "@/lib/types";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

type LoadState = "loading" | "ok" | "error";

export default function CardsPage() {
  const { addToast } = useStore();
  const [cards,     setCards]   = useState<Card[]>([]);
  const [loadState, setLoad]    = useState<LoadState>("loading");
  const [usingMock, setMock]    = useState(false);

  async function load() {
    setLoad("loading");
    try {
      const result = await fetchCards();
      setCards(result.data);
      setMock(result.usingMock);
      setLoad("ok");
    } catch {
      // fetchCards never throws — if we get here something truly unexpected happened
      addToast("Chyba při načítání karet.", "error");
      setLoad("error");
    }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-mono font-bold text-2xl text-slate-900">Správa karet</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {loadState === "ok"
              ? `${cards.length} registrovaných RFID karet${usingMock ? " · demo data" : ""}`
              : "\u00A0"}
          </p>
        </div>
        <Link href="/cards/add">
          <Button variant="primary">+ Přidat kartu</Button>
        </Link>
      </div>

      {/* Mock data banner */}
      {usingMock && loadState === "ok" && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-amber-800 text-sm">
          <span className="text-base">🔌</span>
          <span>Backend není dostupný — zobrazena demo data. Změny se ukládají pouze lokálně.</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Loading */}
        {loadState === "loading" && (
          <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
            <span className="w-5 h-5 border-2 border-slate-200 border-t-teal rounded-full animate-spin" />
            <span className="text-sm">Načítání karet…</span>
          </div>
        )}

        {/* Error */}
        {loadState === "error" && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-slate-500 text-sm mb-4">Nepodařilo se načíst karty.</p>
            <Button variant="outline" size="sm" onClick={load}>Zkusit znovu</Button>
          </div>
        )}

        {/* Empty */}
        {loadState === "ok" && cards.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">💳</div>
            <p className="text-sm">Žádné karty nejsou registrovány</p>
          </div>
        )}

        {/* Table */}
        {loadState === "ok" && cards.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-950">
                  {["ID karty", "Poznámka", "Autorizace", "Poslední použití", "Akce"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr key={card.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm text-teal-dark font-bold">{card.id}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 max-w-[180px] truncate">
                      {card.note || <span className="text-slate-300 italic">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={card.isAuthorized ? "authorized" : "unauthorized"} />
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-400 hidden md:table-cell">
                      {fmtDate(card.lastUsed)}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/cards/${card.id}`}>
                        <Button variant="outline" size="sm">Detail →</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
