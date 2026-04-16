// ─── API Configuration ────────────────────────────────────────────────────────
// Change API_BASE_URL here if the backend URL changes — no need to touch
// any other file.

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

export const CARDS_API = `${API_BASE_URL}/cards`;
