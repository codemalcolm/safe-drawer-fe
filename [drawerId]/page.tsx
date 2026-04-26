"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { useStore } from "@/lib/store";
import CardsTab from "@/components/tabs/CardsTab";
import HistoryTab from "@/components/tabs/HistoryTab";
import UnlockTab from "@/components/tabs/UnlockTab";
import LogsTab from "@/components/tabs/LogsTab";
import SettingsTab from "@/components/tabs/SettingsTab";
import AddDrawerModal from "@/components/AddDrawerModal";
import { cn } from "@/lib/utils";

type TabId = "cards" | "history" | "unlock" | "logs" | "settings";

const TABS: { id: TabId; label: string }[] = [
  { id: "cards",    label: "Karty" },
  { id: "history",  label: "Historie" },
  { id: "unlock",   label: "Odemknout" },
  { id: "logs",     label: "Logy" },
  { id: "settings", label: "Nastavení" },
];

export default function DrawerDetailPage() {
  const { drawerId } = useParams<{ drawerId: string }>();
  const { drawers } = useStore();
  const [activeTab, setActiveTab] = useState<TabId>("cards");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const drawer = drawers.find((d) => d.id === drawerId);

  if (!drawer) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg font-medium text-slate-600 mb-2">Šuplík nenalezen</p>
        <Link href="/" className="text-sky-600 hover:underline text-sm mt-1">← Zpět na přehled</Link>
      </div>
    );
  }

  return (
    <div className="anim-fade-up">
      {/* Offline banner */}
      {!drawer.isOnline && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="text-sm text-amber-800 font-medium">
            Toto zařízení je offline – změny budou synchronizovány po obnovení připojení
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mt-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Zpět
          </Link>
          <div>
            <h1 className="font-mono font-bold text-2xl text-slate-900 tracking-tight">{drawer.name}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{drawer.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Online/offline badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-mono",
              drawer.isOnline
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            )}
          >
            {drawer.isOnline ? (
              <><Wifi className="w-3 h-3" /> Online</>
            ) : (
              <><WifiOff className="w-3 h-3" /> Offline</>
            )}
          </span>

          {/* Lock badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
              drawer.isLocked
                ? "bg-slate-100 text-slate-700 border border-slate-200"
                : "bg-sky-50 text-sky-700 border border-sky-200"
            )}
          >
            {drawer.isLocked ? "🔒 Zamčeno" : "🔓 Odemčeno"}
          </span>

          <button
            onClick={() => setIsEditOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Nastavení šuplíku"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Tab bar */}
        <div className="border-b border-slate-200 overflow-x-auto">
          <div className="flex min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "text-sky-600 border-sky-600 bg-sky-50/50"
                    : "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "cards"   && <CardsTab   drawerId={drawer.id} isOnline={drawer.isOnline} />}
          {activeTab === "history" && <HistoryTab  drawerId={drawer.id} />}
          {activeTab === "unlock"  && <UnlockTab   drawer={drawer} />}
          {activeTab === "logs"    && <LogsTab     drawerId={drawer.id} />}
          {activeTab === "settings" && <SettingsTab drawer={drawer} />}
        </div>
      </div>

      {/* Edit drawer modal */}
      <AddDrawerModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        isEdit={true}
        drawerId={drawer.id}
        defaultValues={{
          name: drawer.name,
          location: drawer.location,
          description: drawer.description || "",
          isLocked: drawer.isLocked,
        }}
      />
    </div>
  );
}
