import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav.jsx";
import Card from "../components/Card.jsx";
import { getMyProjects } from "../lib/mockApi.js";

const FALLBACKS = [
  "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1200&q=70",
];

export default function MyProjects() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyProjects().then(setItems);
  }, []);

  const { ongoing, done } = useMemo(() => {
    const o = [];
    const d = [];
    items.forEach((p) => (p.lastResultId ? d : o).push(p));
    return { ongoing: o, done: d };
  }, [items]);

  return (
    <div>
      <TopNav />
      <main className="container">
        <section className="pageHead">
          <h1 className="h1 center">내 프로젝트</h1>
          <p className="muted center">최근 작업한 프로젝트를 빠르게 확인하세요.</p>
        </section>

        <section className="section section--soft" style={{ marginTop: 0 }}>
          <div className="twoCol">
            <Card title="진행 중" subtitle="아직 평가 결과가 없는 프로젝트">
              <div className="muted">
                {ongoing.length ? `${ongoing.length}개 프로젝트가 진행 중입니다.` : "현재 진행 중인 프로젝트가 없습니다."}
              </div>
              <div style={{ marginTop: 12 }}>
                <button className="btn btn--outline" onClick={() => navigate("/upload")}>
                  새 평가 시작하기
                </button>
              </div>
            </Card>

            <Card title="최근 평가 완료" subtitle="최근 완료된 결과를 빠르게 확인">
              <div className="muted">
                {done.length ? `최근 ${Math.min(done.length, 3)}개 결과를 확인해보세요.` : "아직 평가 완료된 프로젝트가 없습니다."}
              </div>
              <div style={{ marginTop: 12 }}>
                <button className="btn btn--outline" onClick={() => navigate("/projects")}>
                  전체 프로젝트 보기
                </button>
              </div>
            </Card>
          </div>

          <div className="grid3" style={{ marginTop: 18 }}>
            {items.map((p, idx) => (
              <div
                key={p.id}
                className="projectTile projectTile--clickable"
                role="button"
                tabIndex={0}
                onClick={() => navigate("/upload")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/upload")}
              >
                <div className="thumbWrap">
                  <img
                    className="tileImg"
                    src={p.thumbnail || FALLBACKS[idx % FALLBACKS.length]}
                    alt={p.title}
                    loading="lazy"
                  />
                  <div className="thumbShade" />
                </div>

                <div className="card__body card__body--spaced">
                  <div className="row row--between">
                    <strong className="textClamp1">{p.title}</strong>
                    <span className={`pill ${p.lastResultId ? "pill--ok" : "pill--req"}`}>
                      {p.lastResultId ? "평가완료" : "진행중"}
                    </span>
                  </div>
                  <div className="muted textClamp2" style={{ marginTop: 8 }}>
                    {p.desc}
                  </div>
                  <div className="muted" style={{ marginTop: 12, fontSize: 12 }}>
                    클릭하면 업로드/평가로 이동
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
