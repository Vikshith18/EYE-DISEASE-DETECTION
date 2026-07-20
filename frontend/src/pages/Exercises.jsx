import { exercises } from "../data/exercises";

export default function Exercises() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <div className="font-mono text-xs uppercase tracking-widest text-ink-slateDim mb-2">Take a break</div>
      <h1 className="font-display font-bold text-3xl mb-3">Eye exercises</h1>
      <p className="text-ink-slate mb-10">Short, simple routines to relax and re-mobilize your eyes between screen sessions.</p>

      <div className="grid sm:grid-cols-2 gap-5">
        {exercises.map((ex) => (
          <div key={ex.id} className="bg-bg-card border border-line rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-lg">{ex.name}</h3>
              <span className="font-mono text-xs text-accent-amberSoft border border-line rounded-full px-2.5 py-1">{ex.duration}</span>
            </div>
            <ol className="text-sm text-ink-slate list-decimal list-inside space-y-1 mb-3">
              {ex.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
            <p className="text-sm text-accent-blue">{ex.benefits}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
