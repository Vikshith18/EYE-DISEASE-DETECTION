import { useEffect, useState } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { Download, Droplets, Moon as MoonIcon } from "lucide-react";
import { scoreAnswers, causeMeta, causeNotes } from "../data/causeEngine";
import { saveHistory, getSessionId, reportUrl } from "../utils/api";

const verdictClass = {
  affected: "text-state-danger border-state-danger/40 bg-state-danger/10",
  mild: "text-state-caution border-state-caution/40 bg-state-caution/10",
  clear: "text-state-success border-state-success/40 bg-state-success/10",
};

export default function Results() {
  const location = useLocation();
  const { answers, imageResult } = location.state || {};
  const [entryId, setEntryId] = useState(null);
  const [saving, setSaving] = useState(true);

  if (!answers) return <Navigate to="/scan" replace />;

  const { results, primaryCause, primaryKey } = scoreAnswers(answers);

  useEffect(() => {
    async function persist() {
      const causeScores = {};
      results.forEach((r) => { causeScores[r.key] = Math.round(Math.min(r.pct, 1) * 100); });

      const payload = {
        session_id: getSessionId(),
        cause_scores: causeScores,
        primary_cause: primaryCause,
        notes: null,
      };
      if (imageResult && imageResult.ok) {
        payload.image_indicators = {
          redness_index: imageResult.redness_index,
          openness_index: imageResult.openness_index,
          puffiness_proxy: imageResult.puffiness_proxy,
        };
      }
      try {
        const res = await saveHistory(payload);
        setEntryId(res.entry?.id);
      } catch {
        // Non-fatal -- results still display even if saving history fails
      } finally {
        setSaving(false);
      }
    }
    persist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <div className="font-mono text-xs uppercase tracking-widest text-ink-slateDim mb-2">Your result</div>
      <h1 className="font-display font-bold text-3xl mb-8">What's affecting your eyes</h1>

      <div className="bg-bg-card border border-line rounded-2xl p-8 text-center mb-6">
        <div className="font-mono text-xs uppercase tracking-widest text-ink-slateDim mb-2.5">Most likely primary cause</div>
        <div className="font-display font-bold text-2xl mb-2.5" style={{ color: primaryKey ? causeMeta[primaryKey].color : "#6fbf8b" }}>
          {primaryCause || "No dominant cause detected"}
        </div>
        <p className="text-ink-slate text-sm max-w-md mx-auto">
          {primaryKey ? causeNotes[primaryKey][results.find(r => r.key === primaryKey).verdict.key]
            : "Your answers don't strongly point to any single cause right now. Keep an eye on your habits and recheck periodically."}
        </p>
      </div>

      {imageResult && (
        <div className="bg-bg-card border border-line rounded-2xl p-6 mb-6">
          <h3 className="font-display font-semibold mb-3">Image-based indicators</h3>
          {imageResult.ok ? (
            <>
              <div className="grid grid-cols-3 gap-4 text-center mb-3">
                <div><div className="font-display font-bold text-xl">{imageResult.redness_index}</div><p className="text-xs text-ink-slate mt-1">Redness index</p></div>
                <div><div className="font-display font-bold text-xl">{imageResult.openness_index}</div><p className="text-xs text-ink-slate mt-1">Openness index</p></div>
                <div><div className="font-display font-bold text-xl">{imageResult.puffiness_proxy}</div><p className="text-xs text-ink-slate mt-1">Puffiness proxy</p></div>
              </div>
              <p className="text-xs text-ink-slateDim font-mono">{imageResult.disclaimer}</p>
            </>
          ) : (
            <p className="text-sm text-ink-slate">{imageResult.reason || "Photo could not be analyzed."}</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3.5 mb-8">
        {results.map((r) => {
          const meta = causeMeta[r.key];
          return (
            <div key={r.key} className="bg-bg-card border border-line rounded-xl p-5">
              <div className="flex items-center justify-between mb-2.5 gap-3">
                <span className="font-display font-semibold text-sm">{meta.name}</span>
                <span className={`font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full border flex-shrink-0 ${verdictClass[r.verdict.key]}`}>
                  {r.verdict.label}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden mb-3">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(r.pct, 1) * 100}%`, background: meta.color }} />
              </div>
              <p className="text-sm text-ink-slate">{causeNotes[r.key][r.verdict.key]}</p>
            </div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-bg-card border border-line rounded-xl p-5 flex gap-3">
          <Droplets className="text-accent-blue flex-shrink-0" size={20} />
          <div>
            <h4 className="font-display font-semibold text-sm mb-1">Hydration reminder</h4>
            <p className="text-ink-slate text-sm">Dehydration can worsen dry eye symptoms. Keep water nearby during long screen sessions.</p>
          </div>
        </div>
        <div className="bg-bg-card border border-line rounded-xl p-5 flex gap-3">
          <MoonIcon className="text-accent-amber flex-shrink-0" size={20} />
          <div>
            <h4 className="font-display font-semibold text-sm mb-1">Sleep recommendation</h4>
            <p className="text-ink-slate text-sm">Aim for 7-8 hours, and try to stop screens an hour before bed.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/exercises" className="font-display font-semibold px-6 py-3 rounded-lg text-bg text-sm" style={{ background: "linear-gradient(90deg, #4fa3e3, #3a7bab)" }}>
          See eye exercises
        </Link>
        {entryId && (
          <a href={reportUrl(entryId)} className="flex items-center gap-2 text-sm border border-line rounded-lg px-5 py-3 hover:border-accent-blueDim">
            <Download size={15} /> Download PDF report
          </a>
        )}
        <Link to="/scan" className="text-sm border border-line rounded-lg px-5 py-3 hover:border-accent-blueDim">Retake the check</Link>
      </div>
      {saving && <p className="text-xs text-ink-slateDim font-mono mt-4">Saving to your progress history…</p>}
    </div>
  );
}
