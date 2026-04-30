import { Drawer } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_LOCAL_API_URL;

export const deviceService = {
  /**
   * Fetches all devices and maps backend fields to frontend Drawer type
   */
  async getAll(): Promise<Drawer[]> {
    const response = await fetch(`${API_BASE}/devices`);
    if (!response.ok) throw new Error("Failed to fetch devices");

    const jsonResponse = await response.json();

    const data = jsonResponse?.fetchedDevices;

    return data?.map(
      (dev: any): Drawer => ({
        id: dev._id || dev.id,
        drawerName: dev.drawerName,
        drawerLocation: dev.drawerLocation,
        raspberryPiId: dev.raspberryPiId,
        isLocked: dev.isLocked ?? true,
        isOnline: dev.isOnline,
        hasIncident: dev.hasIncident,
        createdAt: dev.createdAt,
        updatedAt: dev.updatedAt,
      }),
    );
  },

  /**
   * Creates a new device on the backend
   */
  async claimDevice(payload: {
    drawerName: string;
    drawerLocation: string;
    raspberryPiId: string;
  }) {
    const response = await fetch(`${API_BASE}/devices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to create device");


    return response.json();
  },
};
