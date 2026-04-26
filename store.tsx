"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import {
  INITIAL_CARDS,
  INITIAL_DRAWERS,
  INITIAL_ACCESS_LOGS,
  INITIAL_SYSTEM_LOGS,
  uid,
} from "./mockDb";
import { Drawer, RFIDCard, AccessLog, SystemLog, Toast } from "./types";

interface StoreCtx {
  drawers: Drawer[];
  cards: RFIDCard[];
  accessLogs: AccessLog[];
  systemLogs: SystemLog[];
  toasts: Toast[];

  addDrawer: (drawer: Omit<Drawer, "id" | "createdAt" | "updatedAt">) => string;
  updateDrawer: (id: string, patch: Partial<Drawer>) => void;
  deleteDrawer: (id: string) => void;

  addCard: (card: Omit<RFIDCard, "id" | "createdAt" | "updatedAt">) => void;
  updateCard: (id: string, patch: Partial<RFIDCard>) => void;
  deleteCard: (id: string) => void;

  addAccessLog: (log: Omit<AccessLog, "id">) => void;
  addSystemLog: (log: Omit<SystemLog, "id">) => void;

  addToast: (msg: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [drawers, setDrawers] = useState<Drawer[]>(INITIAL_DRAWERS);
  const [cards, setCards] = useState<RFIDCard[]>(INITIAL_CARDS);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(INITIAL_ACCESS_LOGS);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(INITIAL_SYSTEM_LOGS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ─── Drawers ──────────────────────────────────────────────────────────────
  const addDrawer = useCallback((data: Omit<Drawer, "id" | "createdAt" | "updatedAt">): string => {
    const now = new Date().toISOString();
    const id = `DRW-${uid()}`;
    setDrawers((prev) => [...prev, { ...data, id, createdAt: now, updatedAt: now }]);
    return id;
  }, []);

  const updateDrawer = useCallback((id: string, patch: Partial<Drawer>) => {
    setDrawers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d))
    );
  }, []);

  const deleteDrawer = useCallback((id: string) => {
    setDrawers((prev) => prev.filter((d) => d.id !== id));
    setCards((prev) => prev.filter((c) => c.drawerId !== id));
    setAccessLogs((prev) => prev.filter((l) => l.drawerId !== id));
    setSystemLogs((prev) => prev.filter((l) => l.drawerId !== id));
  }, []);

  // ─── Cards ────────────────────────────────────────────────────────────────
  const addCard = useCallback((data: Omit<RFIDCard, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    setCards((prev) => [...prev, { ...data, id: uid(), createdAt: now, updatedAt: now }]);
  }, []);

  const updateCard = useCallback((id: string, patch: Partial<RFIDCard>) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c))
    );
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ─── Logs ─────────────────────────────────────────────────────────────────
  const addAccessLog = useCallback((log: Omit<AccessLog, "id">) => {
    setAccessLogs((prev) => [{ ...log, id: uid() }, ...prev]);
  }, []);

  const addSystemLog = useCallback((log: Omit<SystemLog, "id">) => {
    setSystemLogs((prev) => [{ ...log, id: uid() }, ...prev]);
  }, []);

  // ─── Toasts ───────────────────────────────────────────────────────────────
  const addToast = useCallback((msg: string, type: Toast["type"] = "success") => {
    const id = uid();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        drawers, cards, accessLogs, systemLogs, toasts,
        addDrawer, updateDrawer, deleteDrawer,
        addCard, updateCard, deleteCard,
        addAccessLog, addSystemLog,
        addToast, removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
