import { Drawer, RFIDCard, AccessLog, SystemLog } from "./types";

export function uid(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export function fmtDate(dateInput?: string | number): string {
  if (!dateInput) return "—";

  // If the input is a string that looks like a number -> convert it to a number
  const parsedValue = typeof dateInput === "string" && /^\d+$/.test(dateInput) 
    ? parseInt(dateInput, 10) 
    : dateInput;

  const date = new Date(parsedValue);

  // Check if the date is actually valid
  if (isNaN(date.getTime())) return "Invalidní datum";

  return date.toLocaleString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
export const INITIAL_DRAWERS: Drawer[] = [
  {
    id: "DRW-001",
    drawerName: "Sklad A",
    drawerLocation: "Přízemí – Sklady",
    raspberryPiId: "0000sd02a5",
    description: "Hlavní skladový prostor pro elektroniku",
    isLocked: true,
    isOnline: true,
    hasIncident: false,
    lastUsed: "2026-04-25T14:30:00Z",
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2026-04-25T14:30:00Z",
  },
  {
    id: "DRW-002",
    drawerName: "Kancelář – Archiv",
    drawerLocation: "2. patro – Administrativní část",
    raspberryPiId: "000022515",
    description: "Archivní dokumenty a smlouvy",
    isLocked: false,
    isOnline: false,
    hasIncident: true,
    lastUsed: "2026-04-25T09:15:00Z",
    createdAt: "2025-02-14T11:00:00Z",
    updatedAt: "2026-04-25T09:15:00Z",
  },
  {
    id: "DRW-003",
    drawerName: "Serverovna",
    drawerLocation: "Suterén",
    raspberryPiId: "0005s6a1d6",
    description: "Přístup k serverovým skříním",
    isLocked: true,
    isOnline: true,
    hasIncident: false,
    lastUsed: "2026-04-24T16:45:00Z",
    createdAt: "2025-03-01T08:00:00Z",
    updatedAt: "2026-04-24T16:45:00Z",
  },
  {
    id: "DRW-004",
    drawerName: "Laboratoř",
    drawerLocation: "1. patro – Vývojové oddělení",
    raspberryPiId: "00x66sd2a6",
    isLocked: true,
    isOnline: false,
    hasIncident: false,
    lastUsed: "2026-04-25T11:20:00Z",
    createdAt: "2025-04-01T08:00:00Z",
    updatedAt: "2026-04-25T11:20:00Z",
  },
];

export const INITIAL_CARDS: RFIDCard[] = [
  {
    id: "C001",
    cardId: "A1B2C3D4",
    note: "Jan Novák – manažer skladu",
    isAuthorized: true,
    lastUsed: "2026-04-25T14:30:00Z",
    drawerId: "DRW-001",
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2026-04-25T14:30:00Z",
  },
  {
    id: "C002",
    cardId: "E5F6G7H8",
    note: "Eva Svobodová – účetní",
    isAuthorized: true,
    lastUsed: "2026-04-25T09:15:00Z",
    drawerId: "DRW-001",
    createdAt: "2025-02-03T11:30:00Z",
    updatedAt: "2026-04-25T09:15:00Z",
  },
  {
    id: "C003",
    cardId: "I9J0K1L2",
    note: "Petr Dvořák – technik",
    isAuthorized: false,
    lastUsed: "2026-04-24T08:10:00Z",
    drawerId: "DRW-001",
    createdAt: "2025-03-01T08:00:00Z",
    updatedAt: "2026-04-24T08:10:00Z",
  },
  {
    id: "C004",
    cardId: "M3N4O5P6",
    note: "Marie Procházková – asistentka",
    isAuthorized: true,
    lastUsed: "2026-04-24T16:30:00Z",
    drawerId: "DRW-002",
    createdAt: "2025-02-20T10:00:00Z",
    updatedAt: "2026-04-24T16:30:00Z",
  },
  {
    id: "C005",
    cardId: "Q7R8S9T0",
    note: "Neznámá karta",
    isAuthorized: false,
    drawerId: "DRW-002",
    createdAt: "2025-04-01T12:00:00Z",
    updatedAt: "2025-04-01T12:00:00Z",
  },
  {
    id: "C006",
    cardId: "U1V2W3X4",
    note: "Lukáš Beneš – IT správce",
    isAuthorized: true,
    lastUsed: "2026-04-24T16:45:00Z",
    drawerId: "DRW-003",
    createdAt: "2025-01-20T09:00:00Z",
    updatedAt: "2026-04-24T16:45:00Z",
  },
];

export const INITIAL_ACCESS_LOGS: AccessLog[] = [
  {
    id: "L001",
    cardId: "A1B2C3D4",
    timestamp: "2026-04-25T14:30:00Z",
    result: "success",
    drawerId: "DRW-001",
  },
  {
    id: "L002",
    cardId: "I9J0K1L2",
    timestamp: "2026-04-25T14:25:00Z",
    result: "denied",
    drawerId: "DRW-001",
  },
  {
    id: "L003",
    cardId: "E5F6G7H8",
    timestamp: "2026-04-25T09:15:00Z",
    result: "success",
    drawerId: "DRW-001",
  },
  {
    id: "L004",
    cardId: "Q7R8S9T0",
    timestamp: "2026-04-25T09:10:00Z",
    result: "incident",
    incidentType: "forcedOpening",
    drawerId: "DRW-002",
  },
  {
    id: "L005",
    cardId: "M3N4O5P6",
    timestamp: "2026-04-24T16:30:00Z",
    result: "success",
    drawerId: "DRW-002",
  },
  {
    id: "L006",
    cardId: "remote_unlock",
    timestamp: "2026-04-24T16:45:00Z",
    result: "success",
    drawerId: "DRW-003",
  },
];

export const INITIAL_SYSTEM_LOGS: SystemLog[] = [
  {
    id: "S001",
    timestamp: "2026-04-25T14:30:00Z",
    type: "info",
    message: "Přístup povolen – karta A1B2C3D4",
    drawerId: "DRW-001",
  },
  {
    id: "S002",
    timestamp: "2026-04-25T14:25:00Z",
    type: "warning",
    message: "Přístup zamítnut – neautorizovaná karta I9J0K1L2",
    drawerId: "DRW-001",
  },
  {
    id: "S003",
    timestamp: "2026-04-25T09:10:00Z",
    type: "error",
    message: "Detekován incident – pokus o vniknutí neznámou kartou Q7R8S9T0",
    drawerId: "DRW-002",
  },
  {
    id: "S004",
    timestamp: "2026-04-24T16:45:00Z",
    type: "info",
    message: "Odemčeno na dálku",
    drawerId: "DRW-003",
  },
  {
    id: "S005",
    timestamp: "2026-04-24T10:00:00Z",
    type: "info",
    message: "Karta přidána – U1V2W3X4",
    drawerId: "DRW-003",
  },
];
