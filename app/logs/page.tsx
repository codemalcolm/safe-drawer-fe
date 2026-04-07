"use client";

import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/mockDb";
import { cn } from "@/lib/utils";

const typeStyles: Record<string, { row: string; badge: string; icon: string; label: string }> = {
  success: {
    row:   "hover:bg-emerald-50",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon:  "✓",
    label: "Úspěch",
  },
  error: {
    row:   "hover:bg-red-50",
    badge: "bg-red-50 text-red-700 border-red-200",
    icon:  "✕",
    label: "Chyba",
  },
  warning: {
    row:   "bg-amber-50/40 hover:bg-amber-50",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon:  "⚠",
    label: "Varování",
  },
  info: {
    row:   "hover:bg-slate-50",
    badge: "bg-teal-dim text-teal-dark border-teal/20",
    icon:  "ℹ",
    label: "Info",
  },
};

export default function LogsPage() {
  const { notifications } = useStore();

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  const warnings = notifications.filter((n) => n.type === "warning" || n.type === "error");

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-mono font-bold text-2xl text-slate-900">Systémové logy</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          {notifications.length} záznamů · {warnings.length} varování
        </p>
      </div>

      {/* Warning banner */}
      {warnings.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 mb-5">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">
              Jsou přítomna systémová varování
            </p>
            <p className="text-amber-600 text-xs">
              {warnings.length === 1
                ? "Byl zaznamenán 1 záznam vyžadující pozornost."
                : `Bylo zaznamenáno ${warnings.length} záznamů vyžadujících pozornost.`}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {sorted.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-sm">Žádné systémové záznamy</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-950">
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Čas
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Typ
                  </th>
                  <th className="text-left px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Zpráva
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((n) => {
                  const s = typeStyles[n.type] ?? typeStyles.info;
                  return (
                    <tr
                      key={n.id}
                      className={cn("border-t border-slate-100 transition-colors", s.row)}
                    >
                      <td className="px-5 py-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                        {fmtDate(n.time)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border",
                            s.badge
                          )}
                        >
                          {s.icon} {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">{n.msg}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
