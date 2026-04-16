"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import {
  INITIAL_DEVICE,
  INITIAL_LOGS,
  INITIAL_NOTIFICATIONS,
  uid,
} from "./mockDb";
import { AccessLog, Device, Notification, Toast } from "./types";

// Cards are intentionally NOT stored here anymore.
// Each /cards page fetches directly from the API so the data is always fresh.
// The store still manages: logs, device, notifications, toasts.

interface StoreCtx {
  logs: AccessLog[];
  device: Device;
  notifications: Notification[];
  toasts: Toast[];

  addLog: (log: Omit<AccessLog, "id">) => void;
  toggleDevice: () => void;
  addToast: (msg: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
  addNotification: (msg: string, type?: Notification["type"]) => void;
}

const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<AccessLog[]>(INITIAL_LOGS);
  const [device, setDevice] = useState<Device>(INITIAL_DEVICE);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<Toast[]>([]);

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
        logs,
        device,
        notifications,
        toasts,
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

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
