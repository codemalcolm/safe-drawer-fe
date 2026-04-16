export default function OfflineWarning({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm font-medium mb-5">
      <span className="text-base">⚠️</span>
      {message ?? "Zařízení je offline. Změny budou synchronizovány po obnovení připojení."}
    </div>
  );
}
