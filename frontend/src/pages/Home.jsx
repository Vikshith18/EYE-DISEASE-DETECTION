import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "7+ hrs", label: "Average daily screen time for working adults" },
  { value: "~60%", label: "Report at least one digital eye strain symptom" },
  { value: "1-2x / yr", label: "Recommended frequency for a professional eye checkup" },
];

export default function Home() {
  return (
    <div>
      <div className="relative px-6 pt-14 pb-16 text-center overflow-hidden"
        style={{ background: "radial-gradient(ellipse 700px 400px at 50% -10%, rgba(79,163,227,0.18), transparent)" }}>

        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-accent-blue bg-accent-blue/10 border border-accent-blue/30 px-3.5 py-1.5 rounded-full mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-amber pulse-dot" /> CAUSE-LEVEL EYE STRAIN CHECK
        </div>

        <svg width="170" viewBox="0 0 200 120" className="mx-auto mb-2">
          <path d="M10 60 Q100 10 190 60 Q100 110 10 60 Z" fill="none" stroke="#4fa3e3" strokeWidth="2" opacity="0.5" />
          <g className="iris-hero">
            <circle cx="100" cy="60" r="28" fill="url(#irisGrad)" />
            <circle cx="100" cy="60" r="12" fill="#10151c" />
            <circle cx="93" cy="53" r="4" fill="#fff" opacity="0.7" />
          </g>
          <path className="eyelid-top" d="M10 60 Q100 5 190 60 L190 60 Q100 30 10 60 Z" fill="#10151c" />
          <path className="eyelid-bottom" d="M10 60 Q100 115 190 60 L190 60 Q100 90 10 60 Z" fill="#10151c" />
          <defs>
            <linearGradient id="irisGrad" x1="72" y1="32" x2="128" y2="88">
              <stop stopColor="#4fa3e3" /><stop offset="1" stopColor="#f2a65a" />
            </linearGradient>
          </defs>
        </svg>

        <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight max-w-2xl mx-auto mb-5">
          Not just "strained."{" "}
          <span style={{ background: "linear-gradient(90deg, #4fa3e3, #f2a65a)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            Find out exactly why.
          </span>
        </h1>
        <p className="text-ink-slate text-lg max-w-md mx-auto mb-10">
          Netra Rakshak checks your eyes against the real causes of screen-related strain, using your habits and, optionally, a quick photo.
        </p>

        <Link to="/scan" className="inline-flex items-center gap-2 font-display font-semibold px-7 py-3.5 rounded-xl text-bg"
          style={{ background: "linear-gradient(90deg, #4fa3e3, #3a7bab)" }}>
          Check My Eyes <ArrowRight size={17} />
        </Link>
      </div>

      <section className="px-6 py-14 border-t border-line bg-bg-elevated">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-bg-card border border-line rounded-xl p-6 text-center">
              <div className="font-display font-extrabold text-3xl text-accent-blue mb-2">{s.value}</div>
              <p className="text-sm text-ink-slate">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-ink-slateDim font-mono mt-6 max-w-lg mx-auto">
          Figures are general public-health reference points for context, not a claim about you individually.
        </p>
      </section>

      <section className="px-6 py-14">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl mb-3">Regular eye checkups matter</h2>
          <p className="text-ink-slate">
            No self-check tool, this one included, can replace a comprehensive eye exam. Adults should
            generally see an eye care professional every one to two years, and sooner if symptoms are
            new, worsening, or affecting daily life.
          </p>
        </div>
      </section>
    </div>
  );
}
