"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const { drawers } = useStore();
  const anyOnline = drawers.some((d) => d.isOnline);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800 h-[58px] flex items-center px-4 md:px-6 gap-4">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 bg-sky-500 rounded-lg flex items-center justify-center">
          <Lock className="w-4 h-4 text-white" />
        </div>
        <span className="font-mono font-bold text-base text-white tracking-tight hidden sm:block">
          SafeDrawer
        </span>
      </Link>

      {/* Status indicator */}
      <div
        className={cn(
          "flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full shrink-0",
          anyOnline
            ? "bg-emerald-950/70 text-emerald-400 border border-emerald-900"
            : "bg-red-950/70 text-red-400 border border-red-900"
        )}
      >
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            anyOnline ? "bg-emerald-400 animate-pulse" : "bg-red-400"
          )}
        />
        <span className="hidden sm:inline">
          {anyOnline ? "Online" : "Offline"}
        </span>
      </div>

      {/* Home link */}
      <div className="ml-auto">
        {pathname !== "/" && (
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-200 font-mono transition-colors"
          >
            ← Přehled
          </Link>
        )}
      </div>
    </nav>
  );
}
