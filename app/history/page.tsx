"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/mockDb";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

export default function HistoryPage() {
  const { logs, cards } = useStore();

  const sorted = [...logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const incidents = logs.filter((l) => l.result === "incident");

  // Only show the Detail link if the cardId matches a registered card
  function cardExists(cardId: string) {
    return cards.some((c) => c.id === cardId);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-mono font-bold text-2xl text-slate-900">Historie přístupů</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          {logs.length} záznamů · {incidents.length}{" "}
          {incidents.length === 1 ? "incident" : "incidentů"}
        </p>
      </div>

      {/* Incident alert banner */}
      {incidents.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 mb-5">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">
              Detekován bezpečnostní incident
            </p>
            <p className="text-amber-600 text-xs">
              {incidents.length === 1
                ? "Byl zaznamenán 1 pokus o vniknutí."
                : `Bylo zaznamenáno ${incidents.length} pokusů o vniknutí.`}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {sorted.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-sm">Žádné záznamy v historii</p>
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
                    Čas přístupu
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Výsledek
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((log) => (
                  <tr
                    key={log.id}
                    className={
                      log.result === "incident"
                        ? "bg-red-50 border-t border-red-100 hover:bg-red-100 transition-colors"
                        : "border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    }
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm text-teal-dark font-bold">
                          {log.cardId}
                        </span>
                        {log.result === "incident" && (
                          <span className="text-xs text-red-600 font-semibold">
                            — INCIDENT · Pokus o vniknutí
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">
                      {fmtDate(log.timestamp)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          log.result === "success"
                            ? "success"
                            : log.result === "denied"
                            ? "denied"
                            : "incident"
                        }
                      />
                    </td>
                    <td className="px-5 py-4">
                      {cardExists(log.cardId) ? (
                        <Link href={`/cards/${log.cardId}`}>
                          <Button variant="outline" size="sm">
                            Detail →
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-slate-300 text-xs font-mono">—</span>
                      )}
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
