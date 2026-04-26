"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/mockDb";
import { cn } from "@/lib/utils";
import AddCardModal from "@/components/AddCardModal";
import AuthModal from "@/components/AuthModal";

interface Props {
  drawerId: string;
  isOnline: boolean;
}

export default function CardsTab({ drawerId, isOnline }: Props) {
  const { cards, deleteCard, addToast, addSystemLog } = useStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editCard, setEditCard] = useState<typeof cards[0] | null>(null);
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);

  const drawerCards = cards.filter((c) => c.drawerId === drawerId);
  const cardToDelete = drawerCards.find((c) => c.id === deleteCardId);

  function handleDeleteConfirm() {
    if (!cardToDelete) return;
    deleteCard(cardToDelete.id);
    addSystemLog({
      timestamp: new Date().toISOString(),
      type: "warning",
      message: `Karta smazána – ${cardToDelete.cardId}`,
      drawerId,
    });
    addToast(`Karta ${cardToDelete.cardId} byla smazána.`, "warning");
    setDeleteCardId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-mono font-semibold text-slate-900">RFID karty</h2>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-medium hover:bg-sky-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Přidat kartu
        </button>
      </div>

      {drawerCards.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">💳</div>
          <p className="text-sm">Žádné karty nejsou přiřazeny k tomuto šuplíku</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <Th>ID karty</Th>
                <Th>Poznámka</Th>
                <Th>Autorizace</Th>
                <Th>Poslední použití</Th>
                <Th>Akce</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drawerCards.map((card) => (
                <tr key={card.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-sm font-semibold text-slate-800">{card.cardId}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 max-w-[200px] truncate">{card.note || <span className="text-slate-300 italic">—</span>}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      "inline-flex px-2.5 py-1 rounded-full text-xs font-semibold",
                      card.isAuthorized
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    )}>
                      {card.isAuthorized ? "Povolena" : "Zakázána"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-400 font-mono">{fmtDate(card.lastUsed)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditCard(card)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Upravit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (!isOnline) { addToast("Nelze smazat kartu v offline režimu.", "error"); return; }
                          setDeleteCardId(card.id);
                        }}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors",
                          isOnline
                            ? "text-red-400 hover:text-red-600 hover:bg-red-50"
                            : "text-slate-200 cursor-not-allowed"
                        )}
                        title={isOnline ? "Smazat" : "Nedostupné offline"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddCardModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        drawerId={drawerId}
      />

      {editCard && (
        <AddCardModal
          isOpen={true}
          onClose={() => setEditCard(null)}
          drawerId={drawerId}
          isEdit={true}
          cardRecordId={editCard.id}
          defaultValues={{
            cardId: editCard.cardId,
            note: editCard.note,
            isAuthorized: editCard.isAuthorized,
          }}
        />
      )}

      {cardToDelete && (
        <AuthModal
          isOpen={true}
          onClose={() => setDeleteCardId(null)}
          onConfirm={handleDeleteConfirm}
          title="Smazat kartu"
          message={`Opravdu chcete smazat kartu ID ${cardToDelete.cardId}? Tato akce je nevratná.`}
          confirmationText={cardToDelete.cardId}
          actionText="Smazat kartu"
          isDanger={true}
        />
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold font-mono text-slate-500 uppercase tracking-wider">
      {children}
    </th>
  );
}
