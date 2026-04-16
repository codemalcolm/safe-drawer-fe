import { cn } from "@/lib/utils";

type Variant = "success" | "denied" | "incident" | "authorized" | "unauthorized" | "online" | "offline";

const styles: Record<Variant, string> = {
  success:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  denied:       "bg-red-50 text-red-700 border-red-200",
  incident:     "bg-amber-50 text-amber-700 border-amber-200",
  authorized:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  unauthorized: "bg-red-50 text-red-700 border-red-200",
  online:       "bg-emerald-50 text-emerald-700 border-emerald-200",
  offline:      "bg-red-50 text-red-700 border-red-200",
};

const labels: Record<Variant, string> = {
  success:      "✓ Povolen",
  denied:       "✕ Zamítnut",
  incident:     "⚠ Incident",
  authorized:   "✓ Povolena",
  unauthorized: "✕ Zakázána",
  online:       "Online",
  offline:      "Offline",
};

interface Props {
  variant: Variant;
  label?: string;
  className?: string;
}

export default function Badge({ variant, label, className }: Props) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border",
      styles[variant],
      className
    )}>
      {label ?? labels[variant]}
    </span>
  );
}
