const KEY = "ui_ai_session_v1";
const DBKEY = "ui_ai_db_v1";

export function getSession() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
export function setSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}
export function clearSession() {
  localStorage.removeItem(KEY);
}

export function loadDb(fallback) {
  try {
    const raw = localStorage.getItem(DBKEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
export function saveDb(db) {
  localStorage.setItem(DBKEY, JSON.stringify(db));
}
