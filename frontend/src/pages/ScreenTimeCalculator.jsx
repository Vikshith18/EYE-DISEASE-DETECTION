import { useState } from "react";
import { calcScreenTime } from "../utils/api";

export default function ScreenTimeCalculator() {
  const [hours, setHours] = useState({ phone: "", laptop: "", tv: "", tablet: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function calculate() {
    setLoading(true);
    const payload = Object.fromEntries(Object.entries(hours).map(([k, v]) => [k, parseFloat(v) || 0]));
    const res = await calcScreenTime(payload);
    setResult(res);
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-14">
      <div className="font-mono text-xs uppercase tracking-widest text-ink-slateDim mb-2">Know your numbers</div>
      <h1 className="font-display font-bold text-3xl mb-3">Daily screen time calculator</h1>
      <p className="text-ink-slate mb-8">Add up your typical day across devices.</p>

      <div className="bg-bg-card border border-line rounded-2xl p-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            ["phone", "Phone"], ["laptop", "Laptop / Computer"], ["tv", "TV"], ["tablet", "Tablet"],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-xs font-mono text-ink-slate uppercase tracking-wide mb-1.5 block">{label} (hrs)</span>
              <input type="number" min="0" step="0.5" value={hours[key]}
                onChange={(e) => setHours({ ...hours, [key]: e.target.value })}
                className="w-full bg-bg border border-line rounded-lg px-3 py-2.5 text-ink focus:border-accent-blue outline-none" />
            </label>
          ))}
        </div>
        <button onClick={calculate} disabled={loading}
          className="font-display font-semibold px-6 py-3 rounded-lg text-bg w-full" style={{ background: "linear-gradient(90deg, #4fa3e3, #3a7bab)" }}>
          {loading ? "Calculating…" : "Calculate"}
        </button>

        {result && (
          <div className="mt-8 pt-8 border-t border-line">
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div><div className="font-display font-bold text-2xl">{result.total_hours}h</div><p className="text-xs text-ink-slate mt-1">Total</p></div>
              <div><div className="font-display font-bold text-2xl text-state-caution">{result.risk_percent}%</div><p className="text-xs text-ink-slate mt-1">Risk</p></div>
              <div><div className="font-display font-bold text-2xl text-state-success">{result.health_score}</div><p className="text-xs text-ink-slate mt-1">Health score</p></div>
            </div>
            <div className="flex flex-col gap-2">
              {result.recommendations.map((r, i) => (
                <div key={i} className="text-sm bg-bg-elevated border border-line rounded-lg px-4 py-2.5">{r}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
