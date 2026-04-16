"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/cards",   label: "Správa karet" },
  { href: "/history", label: "Historie" },
  { href: "/unlock",  label: "Odemknutí" },
  { href: "/logs",    label: "Logy" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { device } = useStore();

  return (
    <nav className="sticky top-0 z-50 bg-slate-950 border-b-2 border-teal h-[60px] flex items-center px-4 md:px-6 gap-2">
      <Link href="/" className="font-mono font-bold text-lg text-teal-light tracking-tight shrink-0">
        MySafe
      </Link>

      {/* Device status pill */}
      <div className={cn(
        "flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full shrink-0",
        device.status === "online" ? "bg-emerald-950/60 text-emerald-400" : "bg-red-950/60 text-red-400"
      )}>
        <span className={cn(
          "w-2 h-2 rounded-full",
          device.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-red-400"
        )} />
        <span className="hidden sm:inline">
          {device.status === "online" ? "Online" : "Offline"}
        </span>
      </div>

      {/* Nav links — no overflow to avoid scrollbar */}
      <div className="flex items-stretch ml-2 mr-auto gap-0">
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
    </nav>
  );
}
