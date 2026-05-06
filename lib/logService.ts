import { Drawer } from "./types";

export const logService = {
  async getAll() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/logs`);
    if (!response.ok) throw new Error("Failed to fetch logs");
    
    const jsonResponse = await response.json();
    return jsonResponse.fetchedLogs || jsonResponse.data || [];
  }
};