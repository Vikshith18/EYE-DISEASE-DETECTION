import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/diseases", label: "Conditions" },
  { to: "/scan", label: "Eye Check" },
  { to: "/exercises", label: "Exercises" },
  { to: "/habits", label: "Habits" },
  { to: "/screentime", label: "Screen Time" },
  { to: "/blue-light", label: "Blue Light" },
  { to: "/progress", label: "Progress" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-bg/80 border-b border-line">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <path d="M2 20 Q20 4 38 20 Q20 36 2 20 Z" stroke="#4fa3e3" strokeWidth="2.2" fill="none" />
            <circle cx="20" cy="20" r="7" fill="url(#navGrad)" />
            <defs>
              <linearGradient id="navGrad" x1="13" y1="13" x2="27" y2="27">
                <stop stopColor="#4fa3e3" /><stop offset="1" stopColor="#f2a65a" />
              </linearGradient>
            </defs>
          </svg>
          <div className="font-display font-bold text-[17px] leading-tight">
            Netra Rakshak
            <span className="block font-mono text-[9px] tracking-widest text-ink-slateDim font-normal">EYE GUARDIAN SYSTEM</span>
          </div>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-5">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) =>
                `font-display text-sm font-medium transition-colors ${isActive ? "text-accent-amber" : "text-ink-slate hover:text-ink"}`
              }>
              {l.label}
            </NavLink>
          ))}
          <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full border border-line hover:border-ink-slateDim">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line px-6 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={({ isActive }) => `font-display text-sm ${isActive ? "text-accent-amber" : "text-ink-slate"}`}>
              {l.label}
            </NavLink>
          ))}
          <button onClick={toggleTheme} className="flex items-center gap-2 text-sm text-ink-slate mt-2">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />} Toggle theme
          </button>
        </div>
      )}
    </header>
  );
}
