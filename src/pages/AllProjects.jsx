import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import { getAllProjects } from "../lib/mockApi.js";

const FALLBACKS = [
  "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1200&q=70",
];

export default function AllProjects() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProjects().then(setItems);
  }, []);

  const stats = useMemo(() => {
    const done = items.filter((p) => p.lastResultId).length;
    return { total: items.length, done, ongoing: items.length - done };
  }, [items]);

  return (
    <div>
      <TopNav />
      <main className="container">
        <section className="pageHead">
          <h1 className="h1 center">전체 프로젝트</h1>
          <p className="muted center">프로젝트와 피드백을 한눈에 확인하세요.</p>
        </section>

        <section className="section section--soft" style={{ marginTop: 0 }}>
          <div className="twoCol">
            <div className="card" style={{ padding: 16 }}>
              <div className="row row--between">
                <div>
                  <div className="h3" style={{ fontWeight: 950 }}>프로젝트 현황</div>
                  <div className="muted" style={{ marginTop: 6 }}>
                    전체 {stats.total} · 완료 {stats.done} · 진행 {stats.ongoing}
                  </div>
                </div>
                <button className="btn btn--outline" onClick={() => navigate("/upload")}>
                  새 평가
                </button>
              </div>
            </div>

            <div className="card" style={{ padding: 16 }}>
              <div className="row row--between">
                <div>
                  <div className="h3" style={{ fontWeight: 950 }}>빠른 이동</div>
                  <div className="muted" style={{ marginTop: 6 }}>
                    결과 확인 / 설정 / 로그아웃
                  </div>
                </div>
                <PrimaryButton onClick={() => navigate("/settings")}>Settings</PrimaryButton>
              </div>
            </div>
          </div>

          <div className="grid3" style={{ marginTop: 18 }}>
            {items.map((p, idx) => (
              <div
                key={p.id}
                className="projectTile projectTile--clickable"
                onClick={() => navigate("/result")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/result")}
              >
                <div className="projectTile__img">
                  <img
                    src={p.thumbnail || FALLBACKS[idx % FALLBACKS.length]}
                    alt={p.title}
                    className="tileImg tileImg--fixed"
                    loading="lazy"
                  />
                  <div className="thumbShade" />
                </div>

                <div className="projectTile__meta">
                  <div>
                    <div className="projectTile__title textClamp1">{p.title}</div>
                    <div className="muted">{p.createdAt}</div>
                  </div>
                  <span className={`pill ${p.lastResultId ? "pill--ok" : "pill--req"}`}>
                    {p.lastResultId ? "평가완료" : "진행중"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="profileStrip">
            <div className="avatar" />
            <div>
              <div className="h3" style={{ margin: 0 }}>내 프로필</div>
              <div className="muted">Manage your projects and settings.</div>
            </div>

            <div className="row" style={{ marginLeft: "auto" }}>
              <button className="btn btn--ghost" onClick={() => navigate("/auth")}>
                로그아웃
              </button>
              <PrimaryButton onClick={() => navigate("/my-page")}>My Page</PrimaryButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
