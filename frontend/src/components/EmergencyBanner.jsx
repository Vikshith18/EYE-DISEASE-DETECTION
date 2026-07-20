import { AlertTriangle } from "lucide-react";

export default function EmergencyBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 p-5 rounded-xl border-2 border-state-danger bg-state-danger/10 mb-6" role="alert">
      <AlertTriangle className="text-state-danger flex-shrink-0 mt-0.5" size={22} />
      <div>
        <p className="font-display font-bold text-state-danger mb-1">Seek care now</p>
        <p className="text-sm text-ink">{message}</p>
      </div>
    </div>
  );
}
