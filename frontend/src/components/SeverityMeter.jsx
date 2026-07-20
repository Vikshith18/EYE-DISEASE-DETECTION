export default function SeverityMeter({ value, label = "Severity" }) {
  const color = value >= 60 ? "#e2665a" : value >= 35 ? "#e0b34f" : "#6fbf8b";
  return (
    <div>
      <div className="flex justify-between text-xs font-mono text-ink-slate mb-1">
        <span>{label}</span><span>{value}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-line overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
