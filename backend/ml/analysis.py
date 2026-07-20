"""
ml/analysis.py

IMPORTANT HONESTY NOTE FOR MAINTAINERS:
This module intentionally does NOT output disease labels or confidence
percentages (e.g. "Dry Eyes - 91%"). No single photo, and no placeholder
pipeline, can responsibly claim to diagnose eye disease. Doing so would
be a fabricated number dressed up as AI output.

Instead, this module computes real, transparent, measurable indicators
from the image using classic OpenCV techniques (Haar cascade eye
detection + pixel-level color/brightness analysis). These indicators are
combined with the user's questionnaire answers (see app's cause-engine)
to produce a cause-oriented result, not a fake diagnosis.

If you later train and plug in a real classifier, keep the same honesty
bar: report calibrated confidence from a validated model, on a
clinically validated dataset, reviewed by an eye care professional
before shipping. Until then, this stays heuristic and is labeled as such
everywhere it surfaces in the UI.
"""

import cv2
import numpy as np

_face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
_eye_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_eye.xml"
)


def _bucket(value, low_max, mid_max):
    if value <= low_max:
        return "low"
    if value <= mid_max:
        return "moderate"
    return "high"


def analyze_image(image_bytes: bytes) -> dict:
    """
    Decode an image and compute honest, measured indicators.
    Returns a dict describing what was actually measured -- never a
    disease name or a fabricated confidence score.
    """
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        return {"ok": False, "reason": "Could not read the image file."}

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = _face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80))

    search_region = gray
    color_region_offset = (0, 0)
    if len(faces) > 0:
        # Use the largest detected face as the search region for eyes
        x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
        search_region = gray[y:y + h, x:x + w]
        color_region_offset = (x, y)

    eyes = _eye_cascade.detectMultiScale(search_region, scaleFactor=1.05, minNeighbors=6, minSize=(24, 24))

    if len(eyes) == 0:
        return {
            "ok": False,
            "eyes_detected": False,
            "reason": "No eyes could be clearly detected. Try a well-lit, front-facing photo with eyes open."
        }

    ox, oy = color_region_offset
    redness_scores = []
    openness_scores = []
    brightness_scores = []

    for (ex, ey, ew, eh) in eyes[:2]:  # at most two eyes
        gx, gy = ex + ox, ey + oy
        eye_color = img[gy:gy + eh, gx:gx + ew]
        if eye_color.size == 0:
            continue

        b, g, r = cv2.split(eye_color.astype(np.float32))
        # Redness relative to green/blue -- a simple, transparent color heuristic
        redness = np.mean(r - (g + b) / 2.0)
        redness_scores.append(redness)

        # Openness proxy: eye bounding box height/width ratio.
        # Rough heuristic only -- not a clinical eyelid measurement.
        openness_scores.append(eh / float(ew))

        eye_gray = cv2.cvtColor(eye_color.astype(np.uint8), cv2.COLOR_BGR2GRAY)
        brightness_scores.append(np.mean(eye_gray))

    if not redness_scores:
        return {"ok": False, "eyes_detected": False, "reason": "Eye region detected but could not be analyzed."}

    # Normalize to friendly 0-100 scales with conservative, documented assumptions
    avg_redness_raw = float(np.mean(redness_scores))
    redness_index = float(np.clip((avg_redness_raw + 10) * 4, 0, 100))  # empirical scaling

    avg_openness_raw = float(np.mean(openness_scores))
    # Typical relaxed open-eye bbox ratio ~0.5-0.65; lower ratio suggests more closed/droopy framing
    openness_index = float(np.clip((avg_openness_raw / 0.65) * 100, 0, 100))

    avg_brightness = float(np.mean(brightness_scores))
    # Darker under-eye/eye region relative to a mid brightness baseline (~120) used as a rough puffiness/fatigue proxy
    puffiness_proxy = float(np.clip((120 - avg_brightness) / 120 * 100, 0, 100))

    return {
        "ok": True,
        "eyes_detected": True,
        "eyes_found": len(eyes),
        "redness_index": round(redness_index, 1),
        "redness_bucket": _bucket(redness_index, 30, 60),
        "openness_index": round(openness_index, 1),
        "openness_bucket": _bucket(100 - openness_index, 30, 60),  # lower openness = higher concern
        "puffiness_proxy": round(puffiness_proxy, 1),
        "puffiness_bucket": _bucket(puffiness_proxy, 30, 60),
        "disclaimer": (
            "These are rough, camera-and-lighting-dependent measurements from basic "
            "image analysis, not a medical diagnosis or a trained disease classifier."
        )
    }
