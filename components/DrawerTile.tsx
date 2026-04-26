"use client";

import Link from "next/link";
import { Lock, LockOpen, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Drawer } from "@/lib/types";
import { fmtDate } from "@/lib/mockDb";
import { cn } from "@/lib/utils";

interface Props {
  drawer: Drawer;
}

export default function DrawerTile({ drawer }: Props) {
  return (
    <Link
      href={`/drawer/${drawer.id}`}
      className={cn(
        "block bg-white border rounded-2xl p-6 hover:shadow-md transition-all duration-200 relative group",
        drawer.hasIncident
          ? "border-red-200 hover:border-red-300"
          : "border-slate-200 hover:border-sky-300"
      )}
    >
      {/* Incident pulse dot */}
      {drawer.hasIncident && (
        <span className="absolute top-4 right-4 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
      )}

      {/* Lock icon */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            drawer.isLocked ? "bg-slate-100" : "bg-sky-50"
          )}
        >
          {drawer.isLocked ? (
            <Lock className="w-5 h-5 text-slate-500" />
          ) : (
            <LockOpen className="w-5 h-5 text-sky-500" />
          )}
        </div>
      </div>

      {/* Name & location */}
      <h3 className="font-semibold text-slate-900 text-base mb-1 group-hover:text-sky-700 transition-colors">
        {drawer.name}
      </h3>
      <p className="text-sm text-slate-400 mb-4 truncate">{drawer.location}</p>

      {/* Status badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            drawer.isLocked
              ? "bg-slate-100 text-slate-600"
              : "bg-sky-50 text-sky-700"
          )}
        >
          {drawer.isLocked ? (
            <><Lock className="w-3 h-3" /> Zamčeno</>
          ) : (
            <><LockOpen className="w-3 h-3" /> Odemčeno</>
          )}
        </span>

        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            drawer.isOnline
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          )}
        >
          {drawer.isOnline ? (
            <><Wifi className="w-3 h-3" /> Online</>
          ) : (
            <><WifiOff className="w-3 h-3" /> Offline</>
          )}
        </span>

        {drawer.hasIncident && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
            <AlertCircle className="w-3 h-3" /> Incident
          </span>
        )}
      </div>

      {/* Last used */}
      {drawer.lastUsed && (
        <p className="text-xs text-slate-300 font-mono mt-3">
          {fmtDate(drawer.lastUsed)}
        </p>
      )}
    </Link>
  );
}
