import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import Card from "../components/Card.jsx";
import { bootstrapDb } from "../lib/mockApi.js";

function Stat({ label, value }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ fontWeight: 950, fontSize: 18, letterSpacing: "-0.3px" }}>{value}</div>
      <div className="muted" style={{ marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    bootstrapDb();
  }, []);

  return (
    <div>
      <TopNav variant="landing" />

      <main className="container">
        <section className="hero">
          <div className="hero__left">
            <div className="kicker">AI-powered UI Review</div>

            <h1 className="h1" style={{ marginTop: 14 }}>
              UI를 업로드하고,
              <br />
              <span className="gradText">히트맵 + 개선 피드백</span>을 바로 받아보세요.
            </h1>

            <p className="muted" style={{ marginTop: 14, maxWidth: 520 }}>
              최신 AI 기술로 UI를 분석하고, 명확도/구조/가독성 기준의 피드백을 카드로 정리해드립니다.
              “이상한 둥둥 느낌” 없이, 실제 서비스처럼 깔끔하게 보이도록 구성했어요.
            </p>

            <div className="row" style={{ marginTop: 18, flexWrap: "wrap" }}>
              <PrimaryButton onClick={() => navigate("/auth")}>시작하기</PrimaryButton>
              <button className="btn btn--outline" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                기능 보기
              </button>
            </div>

            <div className="grid3" style={{ marginTop: 18, gridTemplateColumns: "repeat(3, 1fr)" }}>
              <Stat label="Weekly uploads" value="3.8K+" />
              <Stat label="Avg. feedback cards" value="7.2" />
              <Stat label="Decision speedup" value="+18%" />
            </div>
          </div>

          <div className="hero__right">
            <div className="heroCard">
              <div className="heroCard__top">
                <div style={{ fontWeight: 950, letterSpacing: "-0.3px" }}>Sample Result</div>
                <div className="heroCard__badge">Heatmap</div>
              </div>

              <div className="heroCard__body">
                <div className="heroMock" />
                <div className="miniRow">
                  <span className="miniDot" />
                  <div className="miniLine" />
                </div>
                <div className="miniRow">
                  <span className="miniDot" style={{ background: "rgba(255,0,0,.45)" }} />
                  <div className="miniLine" />
                </div>
                <div className="miniRow">
                  <span className="miniDot" style={{ background: "rgba(255,165,0,.55)" }} />
                  <div className="miniLine" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="sectionPanel">
            <h2 className="h2 center">주요 기능</h2>
            <p className="muted center" style={{ marginTop: 8 }}>
              업로드 → 기준 선택 → 평가 실행까지, 흐름이 단순합니다.
            </p>

            <div className="grid3">
              <div className="feature">
                <div className="feature__thumb" />
                <div className="feature__title">Heatmap</div>
                <div className="feature__desc">
                  사용자 시선/클릭 흐름을 시각화하여 어디에 주목이 몰리는지 빠르게 파악합니다.
                </div>
              </div>
              <div className="feature">
                <div className="feature__thumb" />
                <div className="feature__title">AI 평가</div>
                <div className="feature__desc">
                  주관적인 감이 아니라, 명확도/구조/가독성/전환 기준으로 점검합니다.
                </div>
              </div>
              <div className="feature">
                <div className="feature__thumb" />
                <div className="feature__title">맞춤형 피드백</div>
                <div className="feature__desc">
                  “다음에 무엇을 바꿀지”가 바로 보이도록 실행 가능한 카드로 정리합니다.
                </div>
              </div>
            </div>

            <div className="banner">
              <div className="banner__inner">Join teams improving UI faster with consistent review.</div>
              <div className="dots">• • •</div>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 18 }}>
          <h2 className="h2">샘플 피드백 카드</h2>
          <p className="muted" style={{ marginTop: 8 }}>
            결과 화면에서 이런 식으로 “요약 + 액션”이 카드로 제공됩니다.
          </p>

          <div className="grid3" style={{ marginTop: 16 }}>
            <Card title="히트맵 분석" subtitle="Attention">
              <div className="muted">CTA 주변에 집중되지만 보조 링크로 시선이 분산됩니다.</div>
            </Card>
            <Card title="가독성" subtitle="Readability">
              <div className="muted">본문 줄 간격이 촘촘합니다. line-height를 조금 늘려보세요.</div>
            </Card>
            <Card title="다음 단계" subtitle="Next Steps">
              <div className="muted">CTA를 1개만 ‘주’ 버튼으로 지정하고 보조 링크를 하단으로 이동하세요.</div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
