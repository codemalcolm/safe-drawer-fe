"use client";

import { useState } from "react";
import { Lock, LockOpen, Wifi, WifiOff } from "lucide-react";
import { Drawer } from "@/lib/types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import AuthModal from "@/components/AuthModal";

interface Props {
  drawer: Drawer;
}

export default function UnlockTab({ drawer }: Props) {
  const { updateDrawer, addAccessLog, addSystemLog, addToast } = useStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleAction() {
    setIsAuthOpen(false);
    setLoading(true);
    setTimeout(() => {
      const newLocked = !drawer.isLocked;
      updateDrawer(drawer.id, { isLocked: newLocked });
      addAccessLog({
        cardId: "remote_unlock",
        timestamp: new Date().toISOString(),
        result: "success",
        drawerId: drawer.id,
      });
      addSystemLog({
        timestamp: new Date().toISOString(),
        type: "info",
        message: newLocked ? "Zamčeno na dálku" : "Odemčeno na dálku",
        drawerId: drawer.id,
      });
      addToast(
        `Šuplík byl úspěšně ${newLocked ? "zamčen" : "odemčen"}.`,
        "success"
      );
      setLoading(false);
    }, 800);
  }

  return (
    <div>
      <h2 className="font-mono font-semibold text-slate-900 mb-6">Vzdálené ovládání</h2>

      <div className="max-w-sm mx-auto">
        {/* Device status */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 mb-6">
          <span className="text-sm font-medium text-slate-700">Stav zařízení</span>
          <div className="flex items-center gap-2">
            {drawer.isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-emerald-700 font-semibold">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600 font-semibold">Offline</span>
              </>
            )}
          </div>
        </div>

        {/* Lock visual */}
        <div className="text-center mb-8">
          <div
            className={cn(
              "w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors",
              drawer.isLocked ? "bg-slate-100" : "bg-sky-50"
            )}
          >
            {loading ? (
              <span className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
            ) : drawer.isLocked ? (
              <Lock className="w-16 h-16 text-slate-400" />
            ) : (
              <LockOpen className="w-16 h-16 text-sky-500" />
            )}
          </div>
          <p className="text-xl font-semibold text-slate-800 mb-1">
            {drawer.isLocked ? "Zámek je zamčen" : "Zámek je odemčen"}
          </p>
          <p className="text-sm text-slate-400">{drawer.name}</p>
        </div>

        {/* Action button */}
        <button
          onClick={() => setIsAuthOpen(true)}
          disabled={!drawer.isOnline || loading}
          className={cn(
            "w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-colors",
            drawer.isOnline && !loading
              ? drawer.isLocked
                ? "bg-sky-600 hover:bg-sky-700 text-white"
                : "bg-slate-700 hover:bg-slate-800 text-white"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          {loading
            ? "Probíhá…"
            : drawer.isLocked
            ? "Odemknout na dálku"
            : "Zamknout"}
        </button>

        {!drawer.isOnline && (
          <p className="text-sm text-slate-400 text-center mt-3">
            Vzdálené ovládání není dostupné v offline režimu
          </p>
        )}
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onConfirm={handleAction}
        title={drawer.isLocked ? "Odemknout zámek" : "Zamknout zámek"}
        message={`Opravdu chcete ${drawer.isLocked ? "odemknout" : "zamknout"} šuplík „${drawer.name}"? Akce bude zaznamenána v historii.`}
        confirmationText={drawer.id}
        actionText="Potvrdit"
        isDanger={false}
      />
    </div>
  );
}
