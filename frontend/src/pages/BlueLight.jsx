import { blueLightInfo } from "../data/habits";

export default function BlueLight() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <div className="font-mono text-xs uppercase tracking-widest text-ink-slateDim mb-2">Worth knowing</div>
      <h1 className="font-display font-bold text-3xl mb-8">Blue light, explained</h1>

      <div className="bg-bg-card border border-line rounded-2xl p-7 mb-5">
        <h3 className="font-display font-semibold text-lg mb-2">What it is</h3>
        <p className="text-ink-slate text-sm">{blueLightInfo.what}</p>
      </div>

      <div className="bg-bg-card border border-line rounded-2xl p-7 mb-5">
        <h3 className="font-display font-semibold text-lg mb-3">Its effects</h3>
        <ul className="text-ink-slate text-sm space-y-2 list-disc list-inside">
          {blueLightInfo.effects.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </div>

      <div className="bg-bg-card border border-line rounded-2xl p-7">
        <h3 className="font-display font-semibold text-lg mb-3">How to reduce exposure</h3>
        <ul className="text-ink-slate text-sm space-y-2 list-disc list-inside">
          {blueLightInfo.reduce.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>
    </div>
  );
}
