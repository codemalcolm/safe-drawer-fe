"use client";

import { Info, AlertTriangle, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/mockDb";
import { cn } from "@/lib/utils";

interface Props {
  drawerId: string;
}

export default function LogsTab({ drawerId }: Props) {
  const { systemLogs } = useStore();
  const logs = [...systemLogs]
    .filter((l) => l.drawerId === drawerId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const errorLogs = logs.filter((l) => l.type === "error");

  const logStyles = {
    error:   { bg: "bg-red-50 border-red-200",    icon: AlertCircle,   iconCls: "text-red-600",   textCls: "text-red-900",   subCls: "text-red-600" },
    warning: { bg: "bg-amber-50 border-amber-200", icon: AlertTriangle, iconCls: "text-amber-600", textCls: "text-amber-900", subCls: "text-amber-600" },
    info:    { bg: "bg-sky-50 border-sky-200",     icon: Info,          iconCls: "text-sky-600",   textCls: "text-sky-900",   subCls: "text-sky-600" },
    success: { bg: "bg-emerald-50 border-emerald-200", icon: Info,      iconCls: "text-emerald-600", textCls: "text-emerald-900", subCls: "text-emerald-600" },
  };

  return (
    <div>
      <h2 className="font-mono font-semibold text-slate-900 mb-5">Systémové záznamy</h2>

      {errorLogs.length > 0 && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 text-sm">Nepřečtené chyby ({errorLogs.length})</p>
            <p className="text-xs text-red-700 mt-0.5">Zkontrolujte níže uvedené chybové záznamy</p>
          </div>
        </div>
      )}

      {logs.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-sm">Zatím žádné systémové záznamy</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
            const s = logStyles[log.type] ?? logStyles.info;
            const Icon = s.icon;
            return (
              <div
                key={log.id}
                className={cn("p-4 border rounded-xl flex items-start gap-3", s.bg)}
              >
                <Icon className={cn("w-4 h-4 shrink-0 mt-0.5", s.iconCls)} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", s.textCls)}>{log.message}</p>
                  <p className={cn("text-xs font-mono mt-1", s.subCls)}>{fmtDate(log.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
