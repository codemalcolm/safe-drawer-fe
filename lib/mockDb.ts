import { AccessLog, Device, Notification } from "./types";

// Cards are now fetched from the real API (/api/v1/cards).
// The mock data below is kept only for Access Logs, Device status,
// and Notifications — until those endpoints are also ready.

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
