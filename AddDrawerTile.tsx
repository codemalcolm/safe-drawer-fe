import { Plus } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function AddDrawerTile({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-white hover:border-sky-300 hover:shadow-sm transition-all duration-200 flex flex-col items-center justify-center min-h-[200px] group"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-sky-50 flex items-center justify-center mb-3 transition-colors">
        <Plus className="w-6 h-6 text-slate-400 group-hover:text-sky-500 transition-colors" />
      </div>
      <span className="text-sm font-medium text-slate-400 group-hover:text-sky-600 transition-colors">
        Přidat šuplík
      </span>
    </button>
  );
}
