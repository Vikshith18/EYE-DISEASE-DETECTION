import io
import os
import uuid

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from models import db, ScanEntry
from ml.analysis import analyze_image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app)  # allow the Vite dev server / frontend origin
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'netra_rakshak.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["MAX_CONTENT_LENGTH"] = 8 * 1024 * 1024  # 8MB upload cap

db.init_app(app)

with app.app_context():
    db.create_all()

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------------------------------------------------------------------
# Emergency symptom check -- handled first, no analysis attempted if flagged
# ---------------------------------------------------------------------------
EMERGENCY_SYMPTOMS = {
    "sudden_vision_loss": "Sudden loss of vision, even partial or temporary",
    "severe_pain": "Severe or sudden eye pain",
    "flashes": "Flashes of light or new floaters",
    "curtain_shadow": "A curtain-like shadow or dark area across your vision",
}


@app.route("/api/emergency-check", methods=["POST"])
def emergency_check():
    data = request.get_json(force=True) or {}
    flagged = [label for key, label in EMERGENCY_SYMPTOMS.items() if data.get(key)]
    return jsonify({
        "emergency": len(flagged) > 0,
        "flagged_symptoms": flagged,
        "message": (
            "This tool is not a medical diagnosis. Based on what you've reported, "
            "seek immediate evaluation by an eye care professional or emergency "
            "medical service."
        ) if flagged else None
    })


# ---------------------------------------------------------------------------
# Screen time calculator
# ---------------------------------------------------------------------------
@app.route("/api/screentime", methods=["POST"])
def screentime():
    data = request.get_json(force=True) or {}
    phone = float(data.get("phone", 0))
    laptop = float(data.get("laptop", 0))
    tv = float(data.get("tv", 0))
    tablet = float(data.get("tablet", 0))

    total = phone + laptop + tv + tablet
    # Risk percentage: simple, documented scaling against an 16-hour waking day
    risk_pct = min(100, round((total / 16) * 100))
    health_score = max(0, 100 - risk_pct)

    if total <= 4:
        recs = ["Your total screen time is on the lower end -- keep up good break habits."]
    elif total <= 8:
        recs = [
            "Apply the 20-20-20 rule during your longest screen block.",
            "Add one screen-free walk or outdoor break daily."
        ]
    else:
        recs = [
            "Your total screen time is high. Look for at least one activity you can move off-screen.",
            "Break up long stretches -- more, shorter sessions beat one long one.",
            "Prioritize a screen-free hour before bed."
        ]

    return jsonify({
        "total_hours": round(total, 1),
        "risk_percent": risk_pct,
        "health_score": health_score,
        "recommendations": recs
    })


# ---------------------------------------------------------------------------
# Image analysis -- real OpenCV heuristics, no fabricated disease labels
# ---------------------------------------------------------------------------
@app.route("/api/analyze", methods=["POST"])
def analyze():
    if "image" not in request.files:
        return jsonify({"ok": False, "reason": "No image file provided."}), 400

    file = request.files["image"]
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"ok": False, "reason": "Please upload a JPG or PNG image."}), 400

    image_bytes = file.read()
    result = analyze_image(image_bytes)
    return jsonify(result)


# ---------------------------------------------------------------------------
# Progress tracker -- save / list scan entries
# ---------------------------------------------------------------------------
@app.route("/api/history", methods=["POST"])
def save_history():
    data = request.get_json(force=True) or {}
    session_id = data.get("session_id") or str(uuid.uuid4())

    scores = data.get("cause_scores", {})
    image = data.get("image_indicators")

    entry = ScanEntry(
        session_id=session_id,
        strain_score=scores.get("strain", 0),
        dry_score=scores.get("dry", 0),
        light_score=scores.get("light", 0),
        sleep_score=scores.get("sleep", 0),
        vision_score=scores.get("vision", 0),
        primary_cause=data.get("primary_cause"),
        redness_index=(image or {}).get("redness_index"),
        openness_index=(image or {}).get("openness_index"),
        puffiness_proxy=(image or {}).get("puffiness_proxy"),
        notes=data.get("notes"),
    )
    db.session.add(entry)
    db.session.commit()

    return jsonify({"session_id": session_id, "entry": entry.to_dict()})


@app.route("/api/history/<session_id>", methods=["GET"])
def get_history(session_id):
    entries = (
        ScanEntry.query.filter_by(session_id=session_id)
        .order_by(ScanEntry.created_at.asc())
        .all()
    )
    return jsonify([e.to_dict() for e in entries])


# ---------------------------------------------------------------------------
# PDF report for a single entry
# ---------------------------------------------------------------------------
@app.route("/api/report/<int:entry_id>", methods=["GET"])
def report(entry_id):
    entry = ScanEntry.query.get_or_404(entry_id)

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 60, "Netra Rakshak -- Eye Check Report")

    c.setFont("Helvetica", 10)
    c.drawString(50, height - 80, f"Generated: {entry.created_at.isoformat()}Z")
    c.drawString(50, height - 95, f"Session: {entry.session_id}")

    y = height - 140
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, y, "Cause scores")
    y -= 20
    c.setFont("Helvetica", 11)
    for label, val in [
        ("Digital Eye Strain", entry.strain_score),
        ("Dry Eye", entry.dry_score),
        ("Lighting & Ergonomics", entry.light_score),
        ("Sleep-Related Fatigue", entry.sleep_score),
        ("Possible Uncorrected Vision Issue", entry.vision_score),
    ]:
        c.drawString(60, y, f"{label}: {val:.0f}%")
        y -= 16

    y -= 10
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, y, f"Primary cause: {entry.primary_cause or 'None dominant'}")
    y -= 30

    if entry.redness_index is not None:
        c.setFont("Helvetica-Bold", 13)
        c.drawString(50, y, "Image-based indicators (heuristic, not diagnostic)")
        y -= 20
        c.setFont("Helvetica", 11)
        c.drawString(60, y, f"Redness index: {entry.redness_index}")
        y -= 16
        c.drawString(60, y, f"Openness index: {entry.openness_index}")
        y -= 16
        c.drawString(60, y, f"Puffiness proxy: {entry.puffiness_proxy}")
        y -= 30

    c.setFont("Helvetica-Oblique", 8)
    c.drawString(
        50, 60,
        "This report is generated by a self-screening tool and is not a medical"
    )
    c.drawString(
        50, 48,
        "diagnosis. Consult an eye care professional for a comprehensive exam."
    )

    c.showPage()
    c.save()
    buf.seek(0)

    return send_file(
        buf,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"netra-rakshak-report-{entry_id}.pdf"
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
