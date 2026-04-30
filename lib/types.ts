export interface DrawerIdk {
  id: string;
  drawerName: string;
  drawerLocation: string;
  raspberryPiId: string;
  description?: string;
  isLocked: boolean;
  isOnline: boolean;
  hasIncident?: boolean;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Drawer {
  id: string;
  drawerName: string;
  drawerLocation: string;
  description?: string;
  raspberryPiId: string;
  isLocked: boolean;
  isOnline: boolean;
  hasIncident?: boolean;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RFIDCard {
  id: string;
  cardId: string;
  note: string;
  isAuthorized: boolean;
  lastUsed?: string;
  drawerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccessLog {
  id: string;
  cardId: string;
  timestamp: string;
  result: "success" | "denied" | "incident";
  incidentType?: "forcedOpening" | "tamper";
  drawerId: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
  drawerId: string;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  msg: string;
}
