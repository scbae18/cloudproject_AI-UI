import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav.jsx";
import Card from "../components/Card.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";

function getTheme() {
  const saved = localStorage.getItem("ui_ai_theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("ui_ai_theme", theme);
}

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const t = getTheme();
    setTheme(t);
    applyTheme(t);

    const rm = localStorage.getItem("ui_ai_reduced_motion") === "1";
    setReducedMotion(rm);
    document.documentElement.dataset.reduceMotion = rm ? "1" : "0";
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  const toggleRM = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    localStorage.setItem("ui_ai_reduced_motion", next ? "1" : "0");
    document.documentElement.dataset.reduceMotion = next ? "1" : "0";
  };

  const exportLocal = () => {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.includes("ui") || k.includes("mock") || k.includes("db") || k.includes("session"));
      const obj = {};
      keys.forEach((k) => (obj[k] = localStorage.getItem(k)));
      const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ui-ai-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export에 실패했습니다.");
    }
  };

  const resetLocal = () => {
    const ok = window.confirm("정말 초기화할까요? (로컬 데이터가 삭제됩니다)");
    if (!ok) return;
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div>
      <TopNav />
      <main className="container">
        <section className="pageHead">
          <h1 className="h1 center">Settings</h1>
          <p className="muted center">테마/모션/데이터 내보내기 등 데모 서비스 설정을 제공합니다.</p>
        </section>

        <section className="section section--soft" style={{ marginTop: 0 }}>
          <div className="twoCol">
            <Card title="Appearance" subtitle="테마와 시각 설정">
              <div className="row row--between">
                <div>
                  <div className="h3">Theme</div>
                  <div className="muted">라이트/다크 테마를 전환합니다.</div>
                </div>
                <PrimaryButton variant="outline" onClick={toggleTheme}>
                  {theme === "dark" ? "라이트 모드" : "다크 모드"}
                </PrimaryButton>
              </div>

              <div className="divider" />

              <div className="row row--between">
                <div>
                  <div className="h3">Reduce Motion</div>
                  <div className="muted">애니메이션을 최소화합니다.</div>
                </div>
                <button className={`toggle ${reducedMotion ? "is-on" : ""}`} onClick={toggleRM} aria-label="toggle reduced motion">
                  <span className="toggle__knob" />
                </button>
              </div>
            </Card>

            <Card title="Workspace" subtitle="데이터 관리">
              <div className="muted">
                
              </div>

              <div className="row" style={{ marginTop: 14, flexWrap: "wrap" }}>
                <PrimaryButton variant="outline" onClick={exportLocal}>
                  Export (JSON)
                </PrimaryButton>
                <button className="btn btn--ghost" onClick={() => navigate("/projects")}>
                  All Projects →
                </button>
              </div>

              <div className="divider" />

              <div className="dangerBox">
                <div className="dangerBox__title">Danger Zone</div>
                <div className="muted">로컬 데이터를 초기화합니다. (되돌릴 수 없음)</div>
                <div className="row" style={{ marginTop: 12 }}>
                  <PrimaryButton variant="danger" onClick={resetLocal}>
                    Reset Local Data
                  </PrimaryButton>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
