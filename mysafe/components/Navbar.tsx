"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/mockDb";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/cards",   label: "Správa karet" },
  { href: "/history", label: "Historie" },
  { href: "/unlock",  label: "Odemknutí" },
];

const notifStyles = {
  success: "text-emerald-600",
  error:   "text-red-600",
  warning: "text-amber-600",
  info:    "text-teal-light",
};
const notifIcons = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };

export default function Navbar() {
  const pathname = usePathname();
  const { device, notifications } = useStore();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950 border-b-2 border-teal h-[60px] flex items-center px-4 md:px-6 gap-2">
      {/* Brand */}
      <Link href="/" className="font-mono font-bold text-lg text-teal-light tracking-tight shrink-0">
        MySafe
      </Link>

      {/* Device indicator */}
      <div
        className={cn(
          "flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full shrink-0",
          device.status === "online"
            ? "bg-emerald-950/60 text-emerald-400"
            : "bg-red-950/60 text-red-400"
        )}
      >
        <span
          className={cn(
            "w-2 h-2 rounded-full",
            device.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-red-400"
          )}
        />
        <span className="hidden sm:inline">{device.status === "online" ? "Online" : "Offline"}</span>
      </div>

      {/* Nav links */}
      <div className="flex items-stretch ml-2 mr-auto gap-0 overflow-x-auto">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center h-[60px] px-3 md:px-4 text-xs md:text-sm font-medium whitespace-nowrap transition-colors",
                "border-b-2 -mb-0.5",
                active
                  ? "text-teal-light border-teal-light"
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Notifications */}
      <div className="relative shrink-0">
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm transition-colors"
        >
          🔔
          {notifications.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            {/* Panel */}
            <div className="absolute right-0 top-[calc(100%+8px)] w-72 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
              <div className="bg-slate-950 px-4 py-3 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Notifikace
                </span>
                <button
                  className="text-slate-500 hover:text-slate-300 text-base"
                  onClick={() => setNotifOpen(false)}
                >
                  ×
                </button>
              </div>
              {notifications.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-6">Žádné notifikace</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 border-b border-slate-100 last:border-none">
                    <div className="flex items-start gap-2 text-sm text-slate-700">
                      <span className={cn("font-bold shrink-0", notifStyles[n.type])}>
                        {notifIcons[n.type]}
                      </span>
                      <span>{n.msg}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-1">{fmtDate(n.time)}</p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
