/**
 * lib/api.ts
 *
 * Thin wrapper around the cards REST API.
 *
 * OFFLINE BEHAVIOUR (v4.1):
 *   When the backend is unreachable (network error / connection refused),
 *   every function falls back to in-memory mock data so the UI always has
 *   something to display — exactly as MySafe v3 behaved.
 *
 *   Key rule: `notFound` is ONLY set to true when the backend is reachable
 *   and explicitly returns HTTP 404. A network failure NEVER produces a
 *   "not found" screen — mock data is shown instead.
 *
 * Mutation fallbacks (POST / PUT / DELETE) simulate success locally so the
 * user can still interact in demo mode.
 */

import { Card } from "./types";
import { MOCK_CARDS, uid } from "./mockDb";
import { CARDS_API } from "@/config/variables";

// In-memory card store — only used when the backend is unreachable.
// Starts as a copy of MOCK_CARDS so mutations during a session are consistent.
let mockStore: Card[] = MOCK_CARDS.map((c) => ({ ...c }));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true when the error looks like a network / connection failure. */
function isNetworkError(err: unknown): boolean {
  if (err instanceof TypeError) return true;
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes("failed to fetch") ||
      msg.includes("network") ||
      msg.includes("econnrefused") ||
      msg.includes("fetch")
    );
  }
  return false;
}

function now(): string {
  return new Date().toISOString();
}

// ─── GET /api/v1/cards ────────────────────────────────────────────────────────

export async function fetchCards(): Promise<{ data: Card[]; usingMock: boolean }> {
  try {
    const res = await fetch(CARDS_API, { cache: "no-store" });
    if (!res.ok) {
      console.error(`[api] fetchCards → HTTP ${res.status}`);
      throw new Error(`HTTP ${res.status}`);
    }
    const data: Card[] = await res.json();
    return { data, usingMock: false };
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn("[api] fetchCards → backend unreachable, using mock data.", err);
    } else {
      console.error("[api] fetchCards → unexpected error, using mock data.", err);
    }
    return { data: [...mockStore], usingMock: true };
  }
}

// ─── GET /api/v1/cards/:id ────────────────────────────────────────────────────
//
// IMPORTANT: `notFound: true` is ONLY returned when the backend responds with
// an explicit HTTP 404. Any kind of network failure causes a mock-data fallback
// so the UI never shows an error screen just because the server is down.

export async function fetchCard(
  id: string
): Promise<{ data: Card | null; usingMock: boolean; notFound: boolean }> {
  try {
    const res = await fetch(`${CARDS_API}/${id}`, { cache: "no-store" });

    if (res.status === 404) {
      return { data: null, usingMock: false, notFound: true };
    }
    if (!res.ok) {
      console.error(`[api] fetchCard(${id}) → HTTP ${res.status}`);
      throw new Error(`HTTP ${res.status}`);
    }
    const data: Card = await res.json();
    return { data, usingMock: false, notFound: false };
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn(`[api] fetchCard(${id}) → backend unreachable, using mock data.`, err);
    } else {
      console.error(`[api] fetchCard(${id}) → unexpected error, using mock data.`, err);
    }

    // Try exact match first, then case-insensitive, then first available mock card.
    const exactMatch = mockStore.find((c) => c.id === id);
    const ciMatch    = mockStore.find((c) => c.id.toUpperCase() === id.toUpperCase());
    const fallback   = exactMatch ?? ciMatch ?? (mockStore[0] ?? null);

    // If the fallback card has a different ID, synthesise a card with the correct ID
    // so the UI displays the right card ID in demo mode.
    let card: Card | null = fallback;
    if (card && card.id !== id) {
      card = { ...card, id };
    }

    return { data: card, usingMock: true, notFound: false };
  }
}

// ─── POST /api/v1/cards ───────────────────────────────────────────────────────

export type CreateCardPayload = { id: string; note: string; isAuthorized: boolean };
export type CreateResult =
  | { ok: true; card: Card; usingMock: boolean }
  | { ok: false; status: number; message: string };

export async function createCard(payload: CreateCardPayload): Promise<CreateResult> {
  try {
    const res = await fetch(CARDS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 400) {
      const body = await res.json().catch(() => ({}));
      const message = (body as { message?: string }).message ?? "Chyba validace na straně serveru.";
      console.error("[api] createCard → 400 Bad Request:", body);
      return { ok: false, status: 400, message };
    }
    if (!res.ok) {
      console.error(`[api] createCard → HTTP ${res.status}`);
      return { ok: false, status: res.status, message: "Chyba při vytváření karty." };
    }

    const card: Card = await res.json();
    return { ok: true, card, usingMock: false };
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn("[api] createCard → backend unreachable, simulating locally.", err);
    } else {
      console.error("[api] createCard → unexpected error, simulating locally.", err);
    }
    const newCard: Card = {
      id: payload.id,
      note: payload.note,
      isAuthorized: payload.isAuthorized,
      createdAt: now(),
      updatedAt: now(),
    };
    mockStore = [newCard, ...mockStore];
    return { ok: true, card: newCard, usingMock: true };
  }
}

// ─── PUT /api/v1/cards/:id ────────────────────────────────────────────────────

export type UpdateCardPayload = Partial<Pick<Card, "note" | "isAuthorized">>;
export type UpdateResult =
  | { ok: true; card: Card; usingMock: boolean }
  | { ok: false; status: number; message: string };

export async function updateCard(id: string, payload: UpdateCardPayload): Promise<UpdateResult> {
  try {
    const res = await fetch(`${CARDS_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 404) {
      console.error(`[api] updateCard(${id}) → 404 Not Found`);
      return { ok: false, status: 404, message: "Karta nenalezena." };
    }
    if (!res.ok) {
      console.error(`[api] updateCard(${id}) → HTTP ${res.status}`);
      return { ok: false, status: res.status, message: "Chyba při úpravě karty." };
    }

    const body = await res.json();
    const card: Card = (body as { updatedCard?: Card }).updatedCard ?? (body as Card);
    return { ok: true, card, usingMock: false };
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn(`[api] updateCard(${id}) → backend unreachable, simulating locally.`, err);
    } else {
      console.error(`[api] updateCard(${id}) → unexpected error, simulating locally.`, err);
    }
    const existing = mockStore.find((c) => c.id === id);
    if (existing) {
      const updated: Card = { ...existing, ...payload, updatedAt: now() };
      mockStore = mockStore.map((c) => (c.id === id ? updated : c));
      return { ok: true, card: updated, usingMock: true };
    }
    // Card was synthesised (not in mock store) — persist it now
    const synthesised: Card = {
      id,
      note: payload.note ?? "",
      isAuthorized: payload.isAuthorized ?? false,
      createdAt: now(),
      updatedAt: now(),
    };
    mockStore = [synthesised, ...mockStore];
    return { ok: true, card: synthesised, usingMock: true };
  }
}

// ─── DELETE /api/v1/cards/:id ─────────────────────────────────────────────────

export type DeleteResult =
  | { ok: true; usingMock: boolean }
  | { ok: false; status: number; message: string };

export async function deleteCard(id: string): Promise<DeleteResult> {
  try {
    const res = await fetch(`${CARDS_API}/${id}`, { method: "DELETE" });

    if (res.status === 404) {
      console.error(`[api] deleteCard(${id}) → 404 Not Found`);
      return { ok: false, status: 404, message: "Karta nenalezena." };
    }
    if (!res.ok) {
      console.error(`[api] deleteCard(${id}) → HTTP ${res.status}`);
      return { ok: false, status: res.status, message: "Chyba při mazání karty." };
    }

    return { ok: true, usingMock: false };
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn(`[api] deleteCard(${id}) → backend unreachable, simulating locally.`, err);
    } else {
      console.error(`[api] deleteCard(${id}) → unexpected error, simulating locally.`, err);
    }
    mockStore = mockStore.filter((c) => c.id !== id);
    return { ok: true, usingMock: true };
  }
}
