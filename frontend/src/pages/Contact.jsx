import { useState } from "react";

const faqs = [
  { q: "Is this a medical diagnosis?", a: "No. Netra Rakshak is a self-screening and educational tool. It cannot diagnose eye disease. Always see a licensed eye care professional for an actual diagnosis." },
  { q: "How does the photo analysis work?", a: "It uses standard OpenCV image processing (face/eye detection plus color and brightness analysis) to compute a redness index, an openness index, and a puffiness proxy. These are measured indicators, not outputs of a trained disease-classification model, and they're sensitive to lighting and camera quality." },
  { q: "Where is my data stored?", a: "Questionnaire results and image-derived indicators (not the photo itself) are stored in a local SQLite database, tied to a random session ID stored in your browser. Nothing is shared externally by this app." },
  { q: "What should I do if a result says 'Affected'?", a: "Treat it as a prompt to look at your habits and, if it doesn't improve or if it's the vision category, see an optometrist or ophthalmologist." },
];

export default function Contact() {
  const [open, setOpen] = useState(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <div className="font-mono text-xs uppercase tracking-widest text-ink-slateDim mb-2">About & support</div>
      <h1 className="font-display font-bold text-3xl mb-8">Contact & info</h1>

      <div className="bg-bg-card border border-line rounded-2xl p-7 mb-6">
        <h3 className="font-display font-semibold text-lg mb-2">About this project</h3>
        <p className="text-ink-slate text-sm">
          Netra Rakshak is a self-screening tool for digital eye strain, built alongside a
          companion hardware project: smart spectacles carrying IR temperature, time-of-flight,
          IMU, ambient light, and photodiode sensors on an ESP32-S3, meant to eventually measure
          these same causes directly instead of relying on self-report.
        </p>
      </div>

      <div className="bg-bg-card border border-line rounded-2xl p-7 mb-6">
        <h3 className="font-display font-semibold text-lg mb-4">FAQ</h3>
        <div className="flex flex-col gap-2">
          {faqs.map((f, i) => (
            <div key={i} className="border border-line rounded-lg overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left px-4 py-3 font-display font-medium text-sm">
                {f.q}
              </button>
              {open === i && <p className="px-4 pb-3 text-ink-slate text-sm">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-card border border-line rounded-2xl p-7 mb-6">
        <h3 className="font-display font-semibold text-lg mb-2">Privacy policy</h3>
        <p className="text-ink-slate text-sm">
          No account or personal identity is required. A random session ID is generated in your
          browser to associate your check-ins for the progress tracker. Uploaded photos are
          analyzed in-memory on the backend and are not retained after the response is returned.
        </p>
      </div>

      <div className="bg-bg-card border border-line rounded-2xl p-7 mb-6">
        <h3 className="font-display font-semibold text-lg mb-2">Disclaimer</h3>
        <p className="text-ink-slate text-sm">
          This application is designed for educational and screening purposes only. It cannot
          diagnose eye diseases. Results are based on self-reported symptoms and basic image
          analysis, and should not replace a professional eye examination.
        </p>
      </div>

      <div className="bg-bg-card border border-line rounded-2xl p-7">
        <h3 className="font-display font-semibold text-lg mb-4">Get in touch</h3>
        {sent ? (
          <p className="text-state-success text-sm">Thanks -- this form is a local demo and isn't wired to send anywhere yet.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input required placeholder="Your name" className="bg-bg border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent-blue" />
            <input required type="email" placeholder="Email" className="bg-bg border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent-blue" />
            <textarea required placeholder="Message" rows={4} className="bg-bg border border-line rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent-blue" />
            <button type="submit" className="font-display font-semibold px-6 py-3 rounded-lg text-bg" style={{ background: "linear-gradient(90deg, #4fa3e3, #3a7bab)" }}>
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
