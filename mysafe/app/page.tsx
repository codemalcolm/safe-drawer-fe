"use client";

import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/mockDb";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import OfflineWarning from "@/components/OfflineWarning";

export default function DashboardPage() {
  const { device, logs, toggleDevice, addToast } = useStore();
  const incidents = logs.filter((l) => l.result === "incident");

  function handleToggle() {
    const next = device.status === "online" ? "offline" : "online";
    toggleDevice();
    addToast(
      `Zařízení přepnuto do režimu ${next}.`,
      next === "online" ? "success" : "warning"
    );
  }

  return (
    <div>
      {device.status === "offline" && <OfflineWarning />}

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 mt-2">
        {/* Left: device info */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              Stav zařízení
            </p>
            <div className="mb-4">
              <Badge variant={device.status} />
            </div>
            <dl className="space-y-3">
              <DeviceRow label="ID zařízení"       value={device.id} />
              <DeviceRow label="Poslední sync"      value={fmtDate(device.lastSync)} />
              <DeviceRow label="Čekající události"  value={String(device.pendingEvents)} highlight={device.pendingEvents > 0} />
              <DeviceRow label="Incidenty celkem"   value={String(incidents.length)}    highlight={incidents.length > 0} />
            </dl>
            <Button
              variant={device.status === "online" ? "outline" : "primary"}
              size="sm"
              className="w-full mt-5 justify-center"
              onClick={handleToggle}
            >
              {device.status === "online" ? "📴 Simulovat offline" : "📶 Simulovat online"}
            </Button>
          </div>

          {incidents.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-3">
                ⚠ Bezpečnostní incidenty
              </p>
              <ul className="space-y-2">
                {incidents.map((i) => (
                  <li key={i.id} className="text-sm text-amber-800">
                    <span className="font-mono text-xs text-amber-600">{fmtDate(i.timestamp)}</span>
                    <br />
                    {i.incidentType === "forcedOpening" ? "Pokus o násilné otevření" : "Neoprávněná manipulace"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: welcome */}
        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex items-center justify-center min-h-[320px]">
          <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-teal/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative text-center px-8 py-10">
            <div className="text-5xl mb-5">🔒</div>
            <h1 className="font-mono font-bold text-3xl text-teal-dark leading-tight">
              Vítejte ve Vašem<br />zabezpečeném šuplíku.
            </h1>
            <p className="text-slate-400 text-sm mt-3">
              Správa RFID přístupu · Historie · Vzdálené odemknutí
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-baseline py-2 border-b border-slate-100 last:border-none">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className={`font-mono text-xs ${highlight ? "text-amber-600 font-bold" : "text-slate-700"}`}>
        {value}
      </dd>
    </div>
  );
}
