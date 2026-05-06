const API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL;

export const cardService = {
  async getAllCards() {
    const res = await fetch(`${API_URL}/cards`);
    if (!res.ok) throw new Error("Nepodařilo se načíst karty");
    const json = await res.json();
    return json.fetchedCards || json.data || json; 
  },

  async createCard(data: any) {
    const res = await fetch(`${API_URL}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Chyba při vytváření karty");
    return await res.json();
  },

  async deleteCard(id: string) {
    const res = await fetch(`${API_URL}/cards/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Chyba při mazání karty");
    return await res.json();
  },

  async updateCard(id: string, data: any) {
    const res = await fetch(`${API_URL}/cards/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Chyba při úpravě karty");
    return await res.json();
  },
};