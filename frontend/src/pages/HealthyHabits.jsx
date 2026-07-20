import { habits } from "../data/habits";

const categories = [...new Set(habits.map((h) => h.category))];

export default function HealthyHabits() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <div className="font-mono text-xs uppercase tracking-widest text-ink-slateDim mb-2">Daily upkeep</div>
      <h1 className="font-display font-bold text-3xl mb-3">Healthy screen habits</h1>
      <p className="text-ink-slate mb-10">Small, repeatable habits that add up over weeks, not one-time fixes.</p>

      <div className="flex flex-col gap-8">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wide text-accent-amberSoft mb-3">{cat}</h3>
            <div className="flex flex-col gap-2">
              {habits.filter((h) => h.category === cat).map((h) => (
                <div key={h.text} className="bg-bg-card border border-line rounded-lg px-4 py-3 text-sm">{h.text}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
