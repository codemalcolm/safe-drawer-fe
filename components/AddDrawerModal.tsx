"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Upload, FileJson, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDrawerModal({ isOpen, onClose }: Props) {
  const { addToast } = useStore();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [piId, setPiId] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isImportMode, setIsImportMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 3. Reset inputs when modal opens/closes
  const resetForm = () => {
    setName("");
    setLocation("");
    setPiId("");
    setFileName(null);
    setIsImportMode(false);
    setLoading(false);
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleFileUpload = (file: File) => {
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      addToast("Prosím nahrajte pouze .json soubor", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.raspberryPiId) {
          setPiId(json.raspberryPiId);
          setFileName(file.name); // 2. Store filename for UI
          addToast("Soubor nahrán", "success");
        } else {
          addToast("JSON neobsahuje raspberryPiId", "error");
        }
      } catch (err) {
        addToast("Neplatný JSON soubor", "error");
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!name || !location || !piId) {
      addToast("Prosím vyplňte všechna pole", "error");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_LOCAL_API_URL;
      const response = await fetch(`${apiUrl}/devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drawerName: name,
          drawerLocation: location,
          raspberryPiId: piId,
        }),
      });

      if (!response.ok) throw new Error();

      addToast("Zařízení bylo úspěšně vytvořeno", "success");
      onClose(); // This triggers the useEffect reset
    } catch (error) {
      addToast("Chyba při odesílání dat", "error");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 anim-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden anim-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="font-mono font-bold text-base text-slate-900 uppercase tracking-tight">
            Nové zařízení
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Static Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">
                Název šuplíku
              </label>
              <input
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none transition-all text-sm"
                placeholder="např. Sklad A"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">
                Umístění
              </label>
              <input
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none transition-all text-sm"
                placeholder="např. Přízemí"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            {/* Switch Label Row */}
            <div className="flex items-center justify-between ml-1">
              <label className="block text-xs font-bold text-slate-400 uppercase">
                {isImportMode ? "Konfigurační soubor" : "Číslo zařízení"}
              </label>
              <button
                onClick={() => {
                  setIsImportMode(!isImportMode);
                  setPiId("");
                  setFileName(null);
                }}
                className={cn(
                  "w-10 h-5 rounded-full transition-colors relative",
                  isImportMode ? "bg-sky-500" : "bg-slate-300",
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-transform",
                    isImportMode ? "left-6" : "left-1",
                  )}
                />
              </button>
            </div>

            {/* Conditional Input Slot */}
            {!isImportMode ? (
              <input
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none font-mono text-sm"
                placeholder="Zadejte ID zařízení..."
                value={piId}
                onChange={(e) => setPiId(e.target.value)}
              />
            ) : (
              <div className="relative">
                {!fileName ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files[0])
                        handleFileUpload(e.dataTransfer.files[0]);
                    }}
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                    className={cn(
                      "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer py-10",
                      isDragging
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100",
                    )}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".json"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileUpload(e.target.files[0])
                      }
                    />
                    <Upload className="w-5 h-5 text-slate-400 mb-2" />
                    <p className="text-xs font-medium text-slate-500">
                      Klikněte nebo přetáhněte .json
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 bg-sky-50 border border-sky-100 rounded-xl group transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileJson className="w-5 h-5 text-sky-500 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-sky-900 truncate">
                          {fileName}
                        </p>
                        <p className="text-[10px] text-sky-600 font-mono truncate">
                          {piId}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFileName(null);
                        setPiId("");
                      }}
                      className="p-1.5 text-sky-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Zrušit
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="flex-1 py-2.5 bg-sky-600 text-white text-sm font-bold rounded-xl hover:bg-sky-700 disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-sky-200"
          >
            {loading ? "Odesílání..." : "Přidat zařízení"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
