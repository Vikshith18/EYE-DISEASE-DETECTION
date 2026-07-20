import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-14 text-center">
      <div className="max-w-xl mx-auto mb-6 p-5 border border-line rounded-xl bg-bg-elevated text-left font-mono text-[12.5px] leading-relaxed text-ink-slate">
        <strong className="text-accent-amberSoft">This application is designed for educational and screening purposes only.</strong>{" "}
        It cannot diagnose eye diseases. Results are based on self-reported symptoms and basic
        image analysis, and should not replace a professional eye examination. If symptoms
        persist or worsen, consult a licensed ophthalmologist or optometrist.
      </div>
      <div className="flex justify-center gap-5 mb-4 font-display text-sm text-ink-slate flex-wrap">
        <Link to="/contact" className="hover:text-ink">About</Link>
        <Link to="/contact" className="hover:text-ink">FAQ</Link>
        <Link to="/contact" className="hover:text-ink">Privacy Policy</Link>
        <Link to="/contact" className="hover:text-ink">Disclaimer</Link>
        <Link to="/contact" className="hover:text-ink">Contact</Link>
      </div>
      <p className="text-ink-slateDim text-[13px] font-display">Netra Rakshak — built for people who forgot to blink today.</p>
    </footer>
  );
}
