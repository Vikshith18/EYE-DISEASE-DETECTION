import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, X } from "lucide-react";
import EmergencyBanner from "../components/EmergencyBanner";
import { questions } from "../data/causeEngine";
import { analyzeImage, checkEmergency } from "../utils/api";

const EMERGENCY_ITEMS = [
  { key: "sudden_vision_loss", label: "Sudden loss of vision, even partial or temporary" },
  { key: "severe_pain", label: "Severe or sudden eye pain" },
  { key: "flashes", label: "Flashes of light or new floaters" },
  { key: "curtain_shadow", label: "A curtain-like shadow or dark area across your vision" },
];

export default function EyeScan() {
  const navigate = useNavigate();
  const [stage, setStage] = useState("emergency"); // emergency -> quiz -> photo -> analyzing
  const [emergencySelections, setEmergencySelections] = useState({});
  const [emergencyMsg, setEmergencyMsg] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(new Array(questions.length).fill(null));
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  async function submitEmergencyCheck() {
    const result = await checkEmergency(emergencySelections);
    if (result.emergency) {
      setEmergencyMsg(result.message);
      return;
    }
    setStage("quiz");
  }

  function selectOption(value) {
    const next = [...answers];
    next[current] = value;
    setAnswers(next);
    setTimeout(() => {
      if (current < questions.length - 1) setCurrent(current + 1);
      else setStage("photo");
    }, 180);
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function startWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setWebcamActive(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 50);
    } catch {
      alert("Camera permission was denied or unavailable. You can upload a photo instead.");
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      stopWebcam();
    }, "image/jpeg", 0.92);
  }

  function stopWebcam() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setWebcamActive(false);
  }

  async function finishAndAnalyze() {
    setStage("analyzing");
    let imageResult = null;
    if (imageFile) {
      try {
        imageResult = await analyzeImage(imageFile);
      } catch {
        imageResult = { ok: false, reason: "Could not reach the analysis server." };
      }
    }
    navigate("/results", { state: { answers, imageResult } });
  }

  const progress = stage === "quiz" ? (current / questions.length) * 100 : stage === "emergency" ? 0 : 100;

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <div className="font-mono text-xs uppercase tracking-widest text-ink-slateDim mb-2">Step-by-step</div>
      <h1 className="font-display font-bold text-3xl mb-8">Eye Check</h1>

      {stage === "emergency" && (
        <div className="bg-bg-card border border-line rounded-2xl p-8">
          <EmergencyBanner message={emergencyMsg} />
          {!emergencyMsg && (
            <>
              <h2 className="font-display font-semibold text-lg mb-1">Before we start -- are you experiencing any of these right now?</h2>
              <p className="text-ink-slate text-sm mb-5">This tool isn't for urgent symptoms. Check anything that applies.</p>
              <div className="flex flex-col gap-3 mb-6">
                {EMERGENCY_ITEMS.map((item) => (
                  <label key={item.key} className="flex items-center gap-3 p-3.5 border border-line rounded-lg cursor-pointer hover:border-accent-blueDim">
                    <input type="checkbox"
                      onChange={(e) => setEmergencySelections({ ...emergencySelections, [item.key]: e.target.checked })}
                      className="w-4 h-4 accent-accent-amber" />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
              <button onClick={submitEmergencyCheck}
                className="font-display font-semibold px-6 py-3 rounded-lg text-bg" style={{ background: "linear-gradient(90deg, #4fa3e3, #3a7bab)" }}>
                None of these -- continue
              </button>
            </>
          )}
        </div>
      )}

      {stage === "quiz" && (
        <div className="bg-bg-card border border-line rounded-2xl p-8">
          <div className="h-1 rounded-full bg-line overflow-hidden mb-6">
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #4fa3e3, #f2a65a)" }} />
          </div>
          <div className="flex justify-between font-mono text-xs text-ink-slate mb-4">
            <span>Question {current + 1} of {questions.length}</span>
            <span className="text-accent-amberSoft">{questions[current].tag}</span>
          </div>
          <h2 className="font-display font-semibold text-xl mb-6 min-h-[3.4rem]">{questions[current].text}</h2>
          <div className="flex flex-col gap-2.5">
            {questions[current].options.map((opt) => (
              <button key={opt.label} onClick={() => selectOption(opt.value)}
                className={`flex items-center gap-3 px-4 py-3.5 border rounded-lg text-left transition-colors ${
                  answers[current] === opt.value ? "border-accent-amber bg-accent-amber/10" : "border-line hover:border-accent-blueDim"
                }`}>
                <span className={`w-4 h-4 rounded-full border flex-shrink-0 ${answers[current] === opt.value ? "border-accent-amber bg-accent-amber" : "border-ink-slateDim"}`} />
                {opt.label}
              </button>
            ))}
          </div>
          {current > 0 && (
            <button onClick={() => setCurrent(current - 1)} className="mt-6 text-sm text-ink-slate border border-line rounded-lg px-4 py-2">← Back</button>
          )}
        </div>
      )}

      {stage === "photo" && (
        <div className="bg-bg-card border border-line rounded-2xl p-8">
          <h2 className="font-display font-semibold text-lg mb-1">Optional: add a photo</h2>
          <p className="text-ink-slate text-sm mb-6">
            A clear, front-facing, well-lit photo lets us add basic redness and openness measurements to your result.
            This step is optional -- you can skip it and get results from your answers alone.
          </p>

          {imagePreview ? (
            <div className="mb-5">
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="rounded-xl max-h-64 border border-line" />
                <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute -top-2 -right-2 bg-bg-card border border-line rounded-full p-1.5"><X size={14} /></button>
              </div>
            </div>
          ) : webcamActive ? (
            <div className="mb-5">
              <video ref={videoRef} autoPlay playsInline className="rounded-xl w-full max-h-72 bg-black" />
              <div className="flex gap-3 mt-3">
                <button onClick={capturePhoto} className="font-display font-semibold px-5 py-2.5 rounded-lg text-bg" style={{ background: "linear-gradient(90deg, #4fa3e3, #3a7bab)" }}>Capture</button>
                <button onClick={stopWebcam} className="text-sm text-ink-slate border border-line rounded-lg px-4 py-2">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 mb-6 flex-wrap">
              <button onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 border border-line rounded-lg px-5 py-3 text-sm hover:border-accent-blueDim">
                <Upload size={16} /> Upload photo
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleFile} />
              <button onClick={startWebcam}
                className="flex items-center gap-2 border border-line rounded-lg px-5 py-3 text-sm hover:border-accent-blueDim">
                <Camera size={16} /> Use webcam
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={finishAndAnalyze} className="font-display font-semibold px-6 py-3 rounded-lg text-bg" style={{ background: "linear-gradient(90deg, #4fa3e3, #3a7bab)" }}>
              {imageFile ? "Analyze and see results" : "Skip photo -- see results"}
            </button>
          </div>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="bg-bg-card border border-line rounded-2xl p-12 text-center">
          <p className="font-display text-ink-slate">Working through your answers…</p>
        </div>
      )}
    </div>
  );
}
