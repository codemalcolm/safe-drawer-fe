"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import {
  INITIAL_CARDS,
  INITIAL_DEVICE,
  INITIAL_LOGS,
  INITIAL_NOTIFICATIONS,
  uid,
} from "./mockDb";
import { Card, AccessLog, Device, Notification, Toast } from "./types";

// ─── Context shape ────────────────────────────────────────────────────────────

interface StoreCtx {
  cards: Card[];
  logs: AccessLog[];
  device: Device;
  notifications: Notification[];
  toasts: Toast[];

  addCard: (card: Card) => void;
  updateCard: (id: string, patch: Partial<Card>) => void;
  addLog: (log: Omit<AccessLog, "id">) => void;
  toggleDevice: () => void;
  addToast: (msg: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
  addNotification: (msg: string, type?: Notification["type"]) => void;
}

const StoreContext = createContext<StoreCtx | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [logs, setLogs] = useState<AccessLog[]>(INITIAL_LOGS);
  const [device, setDevice] = useState<Device>(INITIAL_DEVICE);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addCard = useCallback((card: Card) => {
    setCards((prev) => [...prev, card]);
  }, []);

  const updateCard = useCallback((id: string, patch: Partial<Card>) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c))
    );
  }, []);

  const addLog = useCallback((log: Omit<AccessLog, "id">) => {
    setLogs((prev) => [{ ...log, id: uid() }, ...prev]);
  }, []);

  const toggleDevice = useCallback(() => {
    setDevice((d) => {
      const next = d.status === "online" ? "offline" : "online";
      return {
        ...d,
        status: next,
        lastSync: next === "online" ? new Date().toISOString() : d.lastSync,
        pendingEvents: next === "offline" ? 3 : 0,
      };
    });
  }, []);

  const addToast = useCallback((msg: string, type: Toast["type"] = "success") => {
    const id = uid();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addNotification = useCallback(
    (msg: string, type: Notification["type"] = "info") => {
      setNotifications((prev) => [
        { id: uid(), type, msg, time: new Date().toISOString() },
        ...prev,
      ]);
    },
    []
  );

  return (
    <StoreContext.Provider
      value={{
        cards,
        logs,
        device,
        notifications,
        toasts,
        addCard,
        updateCard,
        addLog,
        toggleDevice,
        addToast,
        removeToast,
        addNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
