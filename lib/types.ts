export interface Card {
  id: string;
  note?: string;
  isAuthorized: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
}

export interface Drawer {
  id: string;
  name: string;
  location: string;
  description?: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccessLog {
  id: string;
  cardId: string;
  timestamp: string;
  result: "success" | "denied" | "incident";
  incidentType?: "forcedOpening" | "tamper";
}

export interface Device {
  id: string;
  status: "online" | "offline";
  lastSync: string;
  pendingEvents: number;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  msg: string;
  time: string;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  msg: string;
}
