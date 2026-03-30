"use client";

import { cn } from "@/lib/utils";

interface Props {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export default function Switch({ checked, onChange, disabled, label }: Props) {
  return (
    <label className={cn("flex items-center gap-3 cursor-pointer select-none", disabled && "opacity-50 cursor-not-allowed")}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={cn(
            "w-11 h-6 rounded-full transition-colors duration-200",
            checked ? "bg-teal" : "bg-slate-200"
          )}
        />
        <div
          className={cn(
            "absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </div>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}
