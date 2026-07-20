import { useState } from "react";
import { diseases } from "../data/diseases";
import SeverityMeter from "../components/SeverityMeter";
import { ChevronDown } from "lucide-react";

export default function Diseases() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <div className="font-mono text-xs uppercase tracking-widest text-ink-slateDim mb-2">Reference library</div>
      <h1 className="font-display font-bold text-3xl mb-3">Screen-related eye conditions</h1>
      <p className="text-ink-slate mb-10">
        General information on common conditions linked to heavy screen use. This is educational reference,
        not an assessment of what you personally have.
      </p>

      <div className="flex flex-col gap-3">
        {diseases.map((d) => {
          const open = openId === d.id;
          return (
            <div key={d.id} className="border border-line rounded-xl bg-bg-card overflow-hidden">
              <button onClick={() => setOpenId(open ? null : d.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left">
                <div>
                  <h3 className="font-display font-semibold text-lg">{d.name}</h3>
                  <p className="text-ink-slate text-sm mt-1">{d.description}</p>
                </div>
                <ChevronDown className={`flex-shrink-0 ml-4 transition-transform ${open ? "rotate-180" : ""}`} size={18} />
              </button>

              {open && (
                <div className="px-6 pb-6 border-t border-line pt-5">
                  <div className="mb-4"><SeverityMeter value={d.severity} label="Typical severity range" /></div>

                  <div className="grid sm:grid-cols-2 gap-5 text-sm">
                    <div>
                      <h4 className="font-display font-semibold mb-1.5">Causes</h4>
                      <ul className="text-ink-slate list-disc list-inside space-y-0.5">
                        {d.causes.map((c) => <li key={c}>{c}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-display font-semibold mb-1.5">Symptoms</h4>
                      <ul className="text-ink-slate list-disc list-inside space-y-0.5">
                        {d.symptoms.map((s) => <li key={s}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-display font-semibold mb-1.5">Prevention</h4>
                      <ul className="text-ink-slate list-disc list-inside space-y-0.5">
                        {d.prevention.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-display font-semibold mb-1.5">Risk level</h4>
                      <p className="text-ink-slate">{d.riskLevel}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-line grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-display font-semibold mb-1">Treatment</h4>
                      <p className="text-ink-slate">{d.treatment}</p>
                    </div>
                    <div>
                      <h4 className="font-display font-semibold mb-1">Recommended screen habit</h4>
                      <p className="text-ink-slate">{d.recommendedScreenTime}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
