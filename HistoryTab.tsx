"use client";

import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/mockDb";
import { cn } from "@/lib/utils";

interface Props {
  drawerId: string;
}

export default function HistoryTab({ drawerId }: Props) {
  const { accessLogs } = useStore();
  const logs = [...accessLogs]
    .filter((l) => l.drawerId === drawerId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const incidents = logs.filter((l) => l.result === "incident");

  return (
    <div>
      <h2 className="font-mono font-semibold text-slate-900 mb-5">Historie přístupu</h2>

      {incidents.length > 0 && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">
              Detekováno {incidents.length} {incidents.length === 1 ? "incident" : "incidentů"}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">Zaznamenány neautorizované pokusy o přístup</p>
          </div>
        </div>
      )}

      {logs.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm">Zatím žádná historie přístupu</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <Th>Čas</Th>
                <Th>ID karty</Th>
                <Th>Výsledek</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className={cn(
                    "transition-colors",
                    log.result === "incident"
                      ? "bg-red-50 hover:bg-red-100"
                      : "hover:bg-slate-50"
                  )}
                >
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{fmtDate(log.timestamp)}</td>
                  <td className="px-4 py-3.5 font-mono text-sm font-semibold text-slate-800">{log.cardId}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      {log.result === "success" && (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-emerald-700 font-medium">Úspěch</span>
                        </>
                      )}
                      {log.result === "denied" && (
                        <>
                          <XCircle className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-500">Zamítnuto</span>
                        </>
                      )}
                      {log.result === "incident" && (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-700 font-semibold">Incident</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold font-mono text-slate-500 uppercase tracking-wider">
      {children}
    </th>
  );
}
