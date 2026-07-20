import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend,
} from "chart.js";
import { Download } from "lucide-react";
import { getHistory, getSessionId, reportUrl } from "../utils/api";
import { causeMeta } from "../data/causeEngine";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Progress() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getHistory(getSessionId());
        setEntries(data);
      } catch {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const chartData = {
    labels: entries.map((e) => new Date(e.created_at).toLocaleDateString()),
    datasets: Object.keys(causeMeta).map((key) => ({
      label: causeMeta[key].name,
      data: entries.map((e) => e.cause_scores[key]),
      borderColor: causeMeta[key].color,
      backgroundColor: causeMeta[key].color,
      tension: 0.3,
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <div className="font-mono text-xs uppercase tracking-widest text-ink-slateDim mb-2">Track over time</div>
      <h1 className="font-display font-bold text-3xl mb-8">Your progress</h1>

      {loading ? (
        <p className="text-ink-slate">Loading your history…</p>
      ) : entries.length === 0 ? (
        <div className="bg-bg-card border border-line rounded-2xl p-10 text-center">
          <p className="text-ink-slate">No checks saved yet on this device. Run an Eye Check to start tracking.</p>
        </div>
      ) : (
        <>
          <div className="bg-bg-card border border-line rounded-2xl p-6 mb-8">
            <Line data={chartData} options={{
              responsive: true,
              scales: {
                y: { min: 0, max: 100, ticks: { color: "#8492a6" }, grid: { color: "#2a3441" } },
                x: { ticks: { color: "#8492a6" }, grid: { color: "#2a3441" } },
              },
              plugins: { legend: { labels: { color: "#ecedf1", font: { size: 11 } } } },
            }} />
          </div>

          <div className="flex flex-col gap-3">
            {entries.slice().reverse().map((e) => (
              <div key={e.id} className="bg-bg-card border border-line rounded-xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-display font-semibold text-sm">{new Date(e.created_at).toLocaleString()}</p>
                  <p className="text-ink-slate text-sm mt-0.5">{e.primary_cause || "No dominant cause"}</p>
                </div>
                <a href={reportUrl(e.id)} className="flex items-center gap-1.5 text-xs border border-line rounded-lg px-3.5 py-2 hover:border-accent-blueDim flex-shrink-0">
                  <Download size={13} /> PDF
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
