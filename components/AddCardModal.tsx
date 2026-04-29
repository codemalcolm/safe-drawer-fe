"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import ModalWrapper from "./ModalWrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  drawerId: string;
  isEdit?: boolean;
  cardRecordId?: string;
  defaultValues?: {
    cardId: string;
    note: string;
    isAuthorized: boolean;
  };
}

export default function AddCardModal({
  isOpen,
  onClose,
  drawerId,
  isEdit = false,
  cardRecordId,
  defaultValues,
}: Props) {
  const { cards, addCard, updateCard, addToast, addSystemLog } = useStore();
  const [cardId, setCardId] = useState(defaultValues?.cardId || "");
  const [note, setNote] = useState(defaultValues?.note || "");
  const [isAuthorized, setIsAuthorized] = useState(
    defaultValues?.isAuthorized ?? true,
  );
  const [errors, setErrors] = useState<{ cardId?: string; note?: string }>({});

  if (!isOpen) return null;

  function validate() {
    const e: { cardId?: string; note?: string } = {};
    const trimmed = cardId.trim().toUpperCase();
    if (!trimmed) {
      e.cardId = "ID karty je povinné.";
    } else if (
      !isEdit &&
      cards.some((c) => c.cardId === trimmed && c.drawerId === drawerId)
    ) {
      e.cardId = "Karta s tímto ID je již přiřazena k tomuto šuplíku.";
    }
    if (!note.trim()) e.note = "Poznámka je povinná.";
    return e;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const trimmedId = cardId.trim().toUpperCase();

    if (isEdit && cardRecordId) {
      updateCard(cardRecordId, { note: note.trim(), isAuthorized });
      addToast(`Karta ${trimmedId} byla aktualizována.`, "success");
    } else {
      addCard({ cardId: trimmedId, note: note.trim(), isAuthorized, drawerId });
      addSystemLog({
        timestamp: new Date().toISOString(),
        type: "info",
        message: `Karta přidána – ${trimmedId}`,
        drawerId,
      });
      addToast(`Karta ${trimmedId} byla registrována.`, "success");
    }
    onClose();
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 anim-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md anim-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <h2 className="font-mono font-bold text-base text-slate-900">
              {isEdit ? "Upravit kartu" : "Přidat novou kartu"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                ID karty <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cardId}
                onChange={(e) => {
                  setCardId(e.target.value);
                  setErrors((p) => ({ ...p, cardId: undefined }));
                }}
                placeholder="např. A1B2C3D4"
                disabled={isEdit}
                className={cn(
                  "w-full px-3.5 py-2.5 border rounded-xl text-sm font-mono bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all",
                  errors.cardId
                    ? "border-red-300 focus:ring-red-500/20 focus:border-red-400 text-red-800"
                    : "border-slate-200 focus:ring-sky-500/20 focus:border-sky-400 text-slate-800",
                  isEdit && "opacity-60 cursor-not-allowed",
                )}
                autoFocus={!isEdit}
              />
              {errors.cardId && (
                <p className="text-red-500 text-xs mt-1">{errors.cardId}</p>
              )}
              {isEdit && (
                <p className="text-slate-400 text-xs mt-1">
                  ID karty nelze změnit.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Poznámka <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setErrors((p) => ({ ...p, note: undefined }));
                }}
                placeholder="např. Jan Novák – manažer skladu"
                className={cn(
                  "w-full px-3.5 py-2.5 border rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:bg-white transition-all text-slate-800",
                  errors.note
                    ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                    : "border-slate-200 focus:ring-sky-500/20 focus:border-sky-400",
                )}
                autoFocus={isEdit}
              />
              {errors.note && (
                <p className="text-red-500 text-xs mt-1">{errors.note}</p>
              )}
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-slate-700">
                Autorizace
              </span>
              <button
                type="button"
                onClick={() => setIsAuthorized((v) => !v)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                  isAuthorized ? "bg-emerald-500" : "bg-red-400",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
                    isAuthorized ? "translate-x-6" : "translate-x-1",
                  )}
                />
              </button>
            </div>
            <p className="text-xs text-slate-400 -mt-2">
              {isAuthorized ? "Přístup povolen" : "Přístup zakázán"}
            </p>
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
            >
              Zrušit
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
            >
              {isEdit ? "Uložit změny" : "Přidat kartu"}
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
