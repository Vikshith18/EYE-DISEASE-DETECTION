from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class ScanEntry(db.Model):
    """
    One saved check-in: questionnaire cause scores, optional image
    indicators, and a timestamp. Used to power the Progress Tracker.
    """
    __tablename__ = "scan_entries"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(64), index=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Cause-engine scores (0-100), from the questionnaire
    strain_score = db.Column(db.Float, default=0)
    dry_score = db.Column(db.Float, default=0)
    light_score = db.Column(db.Float, default=0)
    sleep_score = db.Column(db.Float, default=0)
    vision_score = db.Column(db.Float, default=0)
    primary_cause = db.Column(db.String(64))

    # Optional image-derived indicators (nullable -- image scan is optional)
    redness_index = db.Column(db.Float, nullable=True)
    openness_index = db.Column(db.Float, nullable=True)
    puffiness_proxy = db.Column(db.Float, nullable=True)

    notes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "session_id": self.session_id,
            "created_at": self.created_at.isoformat() + "Z",
            "cause_scores": {
                "strain": self.strain_score,
                "dry": self.dry_score,
                "light": self.light_score,
                "sleep": self.sleep_score,
                "vision": self.vision_score,
            },
            "primary_cause": self.primary_cause,
            "image_indicators": {
                "redness_index": self.redness_index,
                "openness_index": self.openness_index,
                "puffiness_proxy": self.puffiness_proxy,
            } if self.redness_index is not None else None,
            "notes": self.notes,
        }
