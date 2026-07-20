# Netra Rakshak — Eye Guardian System

A self-screening web app for digital eye strain: a questionnaire-driven cause
engine (Digital Eye Strain, Dry Eye, Lighting & Ergonomics, Sleep-Related
Fatigue, Possible Uncorrected Vision Issue), an optional photo check using
real OpenCV image analysis, eye exercises, healthy-habit guides, a screen
time calculator, blue light info, and a progress tracker with PDF reports.

## Important: what the "AI Detection" actually does

This project deliberately does **not** output fabricated disease labels or
confidence scores like "Dry Eyes — 91%" from a single photo. No responsibly
built system, trained or not, can diagnose eye disease from one image taken
on a phone or laptop camera.

Instead, `backend/ml/analysis.py` uses OpenCV's Haar cascades (real,
well-established face/eye detection) plus transparent pixel-level color and
brightness math to compute:

- **Redness index** — relative red-channel dominance in the detected eye region
- **Openness index** — a rough eye bounding-box ratio proxy
- **Puffiness proxy** — a brightness-based heuristic

These are clearly labeled in the UI as measured, camera-and-lighting-dependent
indicators — not a diagnosis — and they feed into the same cause engine as
the questionnaire, rather than pretending to be an independent AI verdict.

If you later train and validate a real classifier on a proper clinical
dataset, keep the same bar: report calibrated, honestly-described confidence,
reviewed by an eye care professional, and say clearly what the model was
and wasn't trained to detect.

## Project structure

```
netra-rakshak-app/
├── backend/
│   ├── app.py              # Flask app + all API routes
│   ├── models.py           # SQLAlchemy models (SQLite)
│   ├── ml/
│   │   └── analysis.py     # Honest OpenCV image analysis
│   ├── uploads/             # (unused at rest -- images analyzed in-memory)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, EmergencyBanner, SeverityMeter
│   │   ├── pages/          # Home, Diseases, EyeScan, Results, Exercises,
│   │   │                   # HealthyHabits, ScreenTimeCalculator, BlueLight,
│   │   │                   # Progress, Contact
│   │   ├── data/           # diseases.js, exercises.js, habits.js, causeEngine.js
│   │   ├── utils/api.js    # fetch helpers for the Flask API
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Running locally

### 1. Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Runs on `http://localhost:5000`. A SQLite file `netra_rakshak.db` is created
automatically on first run.

### 2. Frontend (React + Vite)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. The Vite dev server proxies `/api/*`
requests to the Flask backend (see `vite.config.js`), so both must be
running together.

### 3. Build for production

```bash
cd frontend
npm run build
```

Outputs static files to `frontend/dist/`, which you can serve from any
static host, or wire Flask to serve directly.

## Notes for extending this

- **Multi-language / SEO / accessibility**: the current build has semantic
  HTML, alt text, keyboard-navigable controls, and `prefers-reduced-motion`
  support, but full i18n and an SEO pass weren't built out — flag if you want
  those added.
- **Uploaded images** are analyzed in memory and not written to disk by
  default; `uploads/` is present for you to wire up persistence if you want
  to keep original photos (consider privacy implications before doing so).
- **Emergency symptom check** runs before anything else on the Eye Check
  page and blocks further analysis if a red-flag symptom is selected,
  matching the safety behavior in the original spec.
