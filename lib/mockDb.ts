import { Card, AccessLog, Device, Notification } from "./types";

// ─── Seed data ────────────────────────────────────────────────────────────────

export const INITIAL_CARDS: Card[] = [
  {
    id: "A1B2C3D4",
    note: "Jan Novák – vedoucí skladu",
    isAuthorized: true,
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-03-10T14:22:00Z",
    lastUsed: "2025-03-28T08:45:00Z",
  },
  {
    id: "F9E8D7C6",
    note: "Marie Svobodová",
    isAuthorized: false,
    createdAt: "2025-02-03T11:30:00Z",
    updatedAt: "2025-03-01T10:00:00Z",
    lastUsed: "2025-03-15T16:20:00Z",
  },
  {
    id: "1234ABCD",
    note: "",
    isAuthorized: true,
    createdAt: "2025-03-01T08:00:00Z",
    updatedAt: "2025-03-01T08:00:00Z",
    lastUsed: undefined,
  },
  {
    id: "DEAD0001",
    note: "Testovací karta",
    isAuthorized: false,
    createdAt: "2024-12-20T12:00:00Z",
    updatedAt: "2025-01-05T09:15:00Z",
    lastUsed: "2025-01-05T09:15:00Z",
  },
];

export const INITIAL_LOGS: AccessLog[] = [
  { id: "L001", cardId: "A1B2C3D4", timestamp: "2025-03-28T08:45:00Z", result: "success" },
  { id: "L002", cardId: "F9E8D7C6", timestamp: "2025-03-27T17:30:00Z", result: "denied" },
  {
    id: "L003",
    cardId: "UNKNOWN99",
    timestamp: "2025-03-26T02:14:00Z",
    result: "incident",
    incidentType: "forcedOpening",
  },
  { id: "L004", cardId: "A1B2C3D4", timestamp: "2025-03-25T09:01:00Z", result: "success" },
  { id: "L005", cardId: "1234ABCD", timestamp: "2025-03-24T14:55:00Z", result: "success" },
  { id: "L006", cardId: "DEAD0001", timestamp: "2025-03-22T11:10:00Z", result: "denied" },
];

export const INITIAL_DEVICE: Device = {
  id: "DRAWER-01",
  status: "online",
  lastSync: "2025-03-28T10:00:00Z",
  pendingEvents: 0,
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "N001",
    type: "warning",
    msg: "Detekován bezpečnostní incident – pokus o vniknutí",
    time: "2025-03-26T02:14:00Z",
  },
  {
    id: "N002",
    type: "info",
    msg: "Zařízení synchronizováno",
    time: "2025-03-28T10:00:00Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function uid(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export function fmtDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
