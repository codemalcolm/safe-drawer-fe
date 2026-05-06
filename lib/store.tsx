"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { INITIAL_DEVICE, INITIAL_NOTIFICATIONS, INITIAL_DRAWERS, uid } from "./mockDb";
import { Card, AccessLog, Device, Notification, Toast, Drawer } from "./types";
import { cardService } from "./cardService";
import { logService } from "./logService";

interface StoreCtx {
  cards: Card[];
  logs: AccessLog[];
  device: Device;
  notifications: Notification[];
  toasts: Toast[];
  drawers: Drawer[];
  fetchCards: () => Promise<void>;
  fetchLogs: () => Promise<void>;
  addCard: (data: any) => Promise<void>;
  updateCard: (id: string, patch: Partial<Card>) => void;
  deleteCard: (id: string) => Promise<void>;
  addLog: (log: Omit<AccessLog, "id">) => void;
  toggleDevice: () => void;
  addToast: (msg: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
  addNotification: (msg: string, type?: Notification["type"]) => void;
  addDrawer: (drawer: Drawer) => void;
  updateDrawer: (id: string, patch: Partial<Drawer>) => void;
  deleteDrawer: (id: string) => void;
}

const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [device, setDevice] = useState<Device>(INITIAL_DEVICE);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [drawers, setDrawers] = useState<Drawer[]>(INITIAL_DRAWERS);

  const fetchCards = useCallback(async () => {
    try {
      const data = await cardService.getAllCards();
      setCards(data);
    } catch (err) {
      addToast("Karty se nenačetly", "error");
    }
  }, []);

  const addCard = useCallback(async (cardData: any) => {
    try {
      const newCard = await cardService.createCard(cardData);
      setCards((prev) => [...prev, newCard]);
      addToast("Karta přidána", "success");
    } catch (err) {
      addToast("Nepovedlo se přidat kartu", "error");
    }
  }, []);

  const deleteCard = useCallback(async (id: string) => {
    try {
      await cardService.deleteCard(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
      addToast("Karta pryč", "success");
    } catch (err) {
      addToast("Chyba při mazání", "error");
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await logService.getAll();
      setLogs(res);
    } catch (e) {
      addToast("Logy nejdou načíst", "error");
    }
  }, []);

  const addLog = useCallback((log: Omit<AccessLog, "id">) => {
    setLogs((prev) => [{ ...log, id: uid() }, ...prev]);
  }, []);

  const updateCard = useCallback((id: string, patch: Partial<Card>) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c))
    );
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

  const addNotification = useCallback((msg: string, type: Notification["type"] = "info") => {
    setNotifications((prev) => [
      { id: uid(), type, msg, time: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const addDrawer = (drawer: Drawer) => setDrawers((p) => [...p, drawer]);
  const updateDrawer = (id: string, patch: Partial<Drawer>) => {
    setDrawers((p) => p.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };
  const deleteDrawer = (id: string) => setDrawers((p) => p.filter((d) => d.id !== id));

  return (
    <StoreContext.Provider
      value={{
        cards, logs, device, notifications, toasts, drawers,
        fetchCards, fetchLogs, addCard, updateCard, deleteCard,
        addLog, toggleDevice, addToast, removeToast, addNotification,
        addDrawer, updateDrawer, deleteDrawer,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore error");
  return ctx;
}