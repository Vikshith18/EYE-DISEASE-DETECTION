const BASE = "/api";

export async function checkEmergency(symptoms) {
  const res = await fetch(`${BASE}/emergency-check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(symptoms),
  });
  return res.json();
}

export async function calcScreenTime(hours) {
  const res = await fetch(`${BASE}/screentime`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hours),
  });
  return res.json();
}

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${BASE}/analyze`, { method: "POST", body: formData });
  return res.json();
}

export async function saveHistory(payload) {
  const res = await fetch(`${BASE}/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getHistory(sessionId) {
  const res = await fetch(`${BASE}/history/${sessionId}`);
  return res.json();
}

export function reportUrl(entryId) {
  return `${BASE}/report/${entryId}`;
}

export function getSessionId() {
  let id = localStorage.getItem("netra_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("netra_session_id", id);
  }
  return id;
}
