"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/mockDb";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

export default function CardsPage() {
  const { cards } = useStore();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-mono font-bold text-2xl text-slate-900">Správa karet</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {cards.length} registrovaných RFID karet
          </p>
        </div>
        <Link href="/cards/add">
          <Button variant="primary">+ Přidat kartu</Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {cards.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">💳</div>
            <p className="text-sm">Žádné karty nejsou registrovány</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-950">
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    ID karty
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Poznámka
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Autorizace
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">
                    Poslední použití
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr
                    key={card.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm text-teal-dark font-bold">
                        {card.id}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 max-w-[180px] truncate">
                      {card.note || (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={card.isAuthorized ? "authorized" : "unauthorized"} />
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-400 hidden md:table-cell">
                      {fmtDate(card.lastUsed)}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/cards/${card.id}`}>
                        <Button variant="outline" size="sm">
                          Detail →
                        </Button>
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
