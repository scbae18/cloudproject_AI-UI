import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav.jsx";
import Card from "../components/Card.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import { getResultByLast, saveFeedbackFromLastResult } from "../lib/mockApi.js";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function scoreFromSeed(seed, min = 62, max = 94) {
  const s = Math.abs((seed || 1) * 9973) % 1000;
  const t = s / 1000;
  return Math.round(min + t * (max - min));
}

function formatDate(ts) {
  try {
    const d = new Date(ts || Date.now());
    return d.toLocaleString();
  } catch {
    return "";
  }
}

function Pill({ children, tone = "neutral" }) {
  return <span className={`pill pill--${tone}`}>{children}</span>;
}

function MiniBar({ value }) {
  const v = clamp(value, 0, 100);
  return (
    <div className="miniBar" aria-label={`score ${v}`}>
      <div className="miniBar__fill" style={{ width: `${v}%` }} />
    </div>
  );
}

function SectionTabs({ value, onChange }) {
  const tabs = [
    { key: "overview", label: "요약" },
    { key: "heatmap", label: "히트맵" },
    { key: "details", label: "상세 피드백" },
    { key: "checklist", label: "체크리스트" },
  ];

  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`tab ${value === t.key ? "tab--active" : ""}`}
          onClick={() => onChange(t.key)}
          type="button"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** ✅ 히트맵 버전 정의 */
const HEATMAPS = [
  { id: "focus", label: "Focus", desc: "시선/주목 집중 영역", className: "heat--focus" },
  { id: "click", label: "Click", desc: "클릭 가능성 분포", className: "heat--click" },
  { id: "scan", label: "Scan", desc: "스캔 흐름(상하/좌우 이동)", className: "heat--scan" },
  { id: "contrast", label: "Contrast", desc: "명도/대비 기반 주목도", className: "heat--contrast" },
];

function HeatmapControls({
  variant,
  setVariant,
  opacity,
  setOpacity,
  sharpness,
  setSharpness,
  blendMode,
  setBlendMode,
}) {
  const active = HEATMAPS.find((h) => h.id === variant) || HEATMAPS[0];

  return (
    <div className="heatControls">
      <div className="heatControls__top">
        <div>
          <div className="heatControls__title">히트맵 버전</div>
          <div className="muted">{active.desc}</div>
        </div>

        <div className="heatPills">
          <span className="pill pill--accent">{active.label}</span>
        </div>
      </div>

      <div className="heatControls__tabs">
        {HEATMAPS.map((h) => (
          <button
            key={h.id}
            type="button"
            className={`tab ${variant === h.id ? "tab--active" : ""}`}
            onClick={() => setVariant(h.id)}
            title={h.desc}
          >
            {h.label}
          </button>
        ))}
      </div>

      <div className="heatControls__grid">
        <div className="heatCtrl">
          <div className="heatCtrl__label">
            오버레이 강도 <span className="mono">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            className="range"
            type="range"
            min="0"
            max="100"
            value={Math.round(opacity * 100)}
            onChange={(e) => setOpacity(clamp(Number(e.target.value) / 100, 0, 1))}
          />
        </div>

        <div className="heatCtrl">
          <div className="heatCtrl__label">
            선명도 <span className="mono">{sharpness}</span>
          </div>
          <input
            className="range"
            type="range"
            min="0"
            max="100"
            value={sharpness}
            onChange={(e) => setSharpness(clamp(Number(e.target.value), 0, 100))}
          />
          <div className="muted" style={{ marginTop: 6 }}>
            (선명도는 blur/contrast/saturate를 조절해 “더 또렷”하게 보이게 합니다.)
          </div>
        </div>

        <div className="heatCtrl">
          <div className="heatCtrl__label">블렌딩</div>
          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            {["multiply", "screen", "overlay"].map((m) => (
              <button
                key={m}
                type="button"
                className={`btn btn--outline ${blendMode === m ? "is-on" : ""}`}
                onClick={() => setBlendMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Result() {
  const [r, setR] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("overview");
  const [openKey, setOpenKey] = useState("priority");

  // ✅ 히트맵: 여러 버전 + 선명도/강도
  const [heatVariant, setHeatVariant] = useState("focus");
  const [heatOpacity, setHeatOpacity] = useState(0.85);
  const [heatSharpness, setHeatSharpness] = useState(62); // 0~100
  const [heatBlendMode, setHeatBlendMode] = useState("multiply");

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await getResultByLast();
      setR(data);
    })();
  }, []);

  const kpis = useMemo(() => {
    // mockApi에서 내려준 kpis가 있으면 그걸 우선 사용
    if (Array.isArray(r?.kpis) && r.kpis.length) return r.kpis;

    // fallback (예전 로직)
    const seed = (r?.id || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return [
      { key: "clarity", label: "Clarity", value: scoreFromSeed(seed + 1) },
      { key: "hierarchy", label: "Hierarchy", value: scoreFromSeed(seed + 2) },
      { key: "readability", label: "Readability", value: scoreFromSeed(seed + 3) },
    ];
  }, [r]);

  const overall = useMemo(() => {
    if (!kpis.length) return 0;
    return Math.round(kpis.reduce((a, x) => a + x.value, 0) / kpis.length);
  }, [kpis]);

  const summaryCards =
    r?.summaryCards?.length
      ? r.summaryCards
      : [
          {
            title: "히트맵 분석",
            body: "주요 주목 영역이 상단 내비게이션/CTA 주변에 강하게 나타납니다. 핵심 행동 유도는 잘 되지만, 정보 밀집이 커 보일 수 있어요.",
          },
          {
            title: "개선 제안",
            body: "우선순위 정보만 1차로 노출하고(요약/핵심), 나머지는 펼침(accordion) 형태로 제공하면 가독성이 크게 개선됩니다.",
          },
        ];

  const nextSteps =
    r?.nextSteps?.length
      ? r.nextSteps
      : [
          "상단 영역(헤더/탭/CTA)을 1줄로 정리하고 버튼 대비를 강화",
          "히어로/핵심 콘텐츠를 3~5개 블록으로 묶어 정보 구조 단순화",
          "중요 액션 1개를 Primary로 고정하고 나머지는 Secondary로 분리",
        ];

  const details = useMemo(() => {
    const base = [
      {
        key: "priority",
        title: "우선순위 액션 (Top 3)",
        tone: "accent",
        items: [
          {
            title: "핵심 CTA 1개만 Primary로 고정",
            desc: "현재 상단 액션이 많아 선택 비용이 증가합니다. 가장 중요한 행동 하나만 강조하고 나머지는 보조 액션으로 정리하세요.",
            impact: "High",
          },
          {
            title: "요약 영역을 카드 2~3개로 압축",
            desc: "왼쪽에 텍스트가 길게 늘어지면서 시선이 분산됩니다. 핵심 한줄 + 세부는 펼침으로 전환하면 훨씬 깔끔해져요.",
            impact: "High",
          },
          {
            title: "히트맵 이미지에 주목 포인트 라벨 추가",
            desc: "히트맵만 있으면 ‘왜’가 부족합니다. 주목 영역(버튼/내비/검색)에 라벨을 붙이면 설득력이 올라갑니다.",
            impact: "Mid",
          },
        ],
      },
      {
        key: "strengths",
        title: "강점",
        tone: "good",
        items: [
          { title: "상단 정보의 탐색성", desc: "헤더에서 주요 기능 접근이 빠릅니다.", impact: "—" },
          { title: "행동 유도 흐름", desc: "CTA 위치가 자연스럽고 시선 흐름이 매끄럽습니다.", impact: "—" },
        ],
      },
      {
        key: "risks",
        title: "리스크 / 주의 포인트",
        tone: "warn",
        items: [
          {
            title: "텍스트 과밀로 인한 정보 피로",
            desc: "왼쪽 텍스트 블록이 커서 주요 시각 요소(히트맵/결과)가 상대적으로 약해 보입니다.",
            impact: "Mid",
          },
          {
            title: "액션 버튼이 많아 보이는 문제",
            desc: "다운로드/복사/저장 등 버튼이 한 곳에 모이면 ‘무엇부터?’가 생깁니다.",
            impact: "Mid",
          },
        ],
      },
    ];
    return base;
  }, []);

  const onSaveFeedback = async () => {
    if (!r) return;
    setSaving(true);
    try {
      await saveFeedbackFromLastResult();
      alert("피드백이 저장되었습니다. My Page에서 확인하세요.");
    } catch (e) {
      alert(e?.message || "피드백 저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const copySummary = async () => {
    const text = [
      `평가 결과 (${formatDate(r?.createdAt)})`,
      `Overall: ${overall}`,
      ...kpis.map((k) => `${k.label}: ${k.value}`),
      "",
      "핵심 인사이트:",
      ...summaryCards.map((c) => `- ${c.title}: ${c.body}`),
      "",
      "다음 단계:",
      ...nextSteps.map((s) => `- ${s}`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      alert("요약이 클립보드에 복사되었습니다.");
    } catch {
      alert("복사에 실패했습니다. (브라우저 권한을 확인해주세요)");
    }
  };

  if (!r) {
    return (
      <div>
        <TopNav />
        <main className="container">
          <div style={{ padding: "28px 0" }}>
            <Card title="결과 불러오는 중" subtitle="잠시만 기다려주세요.">
              <div className="skeleton" style={{ height: 140 }} />
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // ✅ 선명도 값(0~100)을 CSS filter로 변환
  // - sharpness 높을수록 blur↓, contrast/saturate↑
  const blurPx = clamp(10 - heatSharpness / 10, 0, 10);
  const contrast = 1 + heatSharpness / 120; // 1.0 ~ ~1.83
  const saturate = 1.1 + heatSharpness / 140; // 1.1 ~ ~1.81

  const activeHeat = HEATMAPS.find((h) => h.id === heatVariant) || HEATMAPS[0];

  return (
    <div>
      <TopNav />

      <main className="container">
        {/* 헤더 */}
        <section className="resultHead">
          <div className="resultHead__title">
            <div className="kicker">AI-powered UI Review</div>
            <h1 className="h1">평가 결과</h1>
            <div className="muted">
              업로드된 UI 및 템플릿 기준의 분석 결과입니다 · <span className="mono">{r?.id || "—"}</span>
            </div>
          </div>

          <div className="resultHead__actions">
            <button className="btn btn--outline" onClick={() => alert("더미: report 다운로드")} type="button">
              report 다운로드
            </button>
            <button className="btn btn--outline" onClick={copySummary} type="button">
              요약 복사
            </button>
            <PrimaryButton onClick={onSaveFeedback} disabled={saving} loading={saving}>
              피드백 저장
            </PrimaryButton>
          </div>
        </section>

        {/* 상단: Overall + KPI + Quick */}
        <section className="resultTop">
          <Card title="Overall" subtitle="세 항목 평균 점수" className="resultTop__overall" hoverable={false}>
            <div className="overallScore">
              <div className="overallScore__num">{overall}</div>
              <div className="overallScore__meta">
                <Pill tone={overall >= 85 ? "good" : overall >= 70 ? "accent" : "warn"}>
                  {overall >= 85 ? "Excellent" : overall >= 70 ? "Good" : "Needs work"}
                </Pill>
                <div className="muted" style={{ marginTop: 8 }}>
                  {overall >= 85
                    ? "구조/가독성이 안정적입니다. 세부 튜닝으로 완성도를 올려보세요."
                    : overall >= 70
                    ? "핵심 흐름은 좋습니다. 정보량을 ‘접기/펼치기’로 정리하면 더 좋아져요."
                    : "정보 구조를 단순화하고 대비/우선순위를 재정의하는 개선이 필요합니다."}
                </div>
              </div>
            </div>
          </Card>

          <Card title="KPI Breakdown" subtitle="항목별 점수" className="resultTop__kpis" hoverable={false}>
            <div className="kpiList">
              {kpis.map((k) => (
                <div key={k.key} className="kpiRowItem">
                  <div className="kpiRowItem__left">
                    <div className="kpiRowItem__label">{k.label}</div>
                    <div className="kpiRowItem__value">{k.value}</div>
                  </div>
                  <MiniBar value={k.value} />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Quick Actions" subtitle="다음 작업을 빠르게" className="resultTop__quick" hoverable={false}>
            <div className="quickGrid">
              <button className="quickBtn" onClick={() => setTab("heatmap")} type="button">
                <div className="quickBtn__title">히트맵 보기</div>
                <div className="quickBtn__sub muted">주목 영역 확인</div>
              </button>
              <button className="quickBtn" onClick={() => setTab("details")} type="button">
                <div className="quickBtn__title">상세 피드백</div>
                <div className="quickBtn__sub muted">이슈/개선점</div>
              </button>
              <button className="quickBtn" onClick={() => setTab("checklist")} type="button">
                <div className="quickBtn__title">체크리스트</div>
                <div className="quickBtn__sub muted">반복 개선용</div>
              </button>
            </div>
          </Card>
        </section>

        {/* 본문 레이아웃 */}
        <section className="resultLayout">
          <div className="resultMain">
            <SectionTabs value={tab} onChange={setTab} />

            {tab === "overview" && (
              <div className="stack">
                <Card title="AI 피드백 요약" subtitle="핵심 인사이트를 카드로 압축">
                  <div className="summaryGrid">
                    {summaryCards.map((c, idx) => (
                      <div key={idx} className="summaryCard">
                        <div className="summaryCard__title">{c.title}</div>
                        <div className="summaryCard__body muted">{c.body}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card
                  title="다음 단계 (Iteration Plan)"
                  subtitle="바로 적용 가능한 액션 리스트"
                  footer={
                    <div className="row" style={{ justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
                      <button className="btn btn--outline" onClick={() => navigate("/my-page")} type="button">
                        My Page로 이동
                      </button>
                      <PrimaryButton onClick={() => navigate("/upload")}>다시 평가 하기</PrimaryButton>
                    </div>
                  }
                >
                  <ol className="stepList">
                    {nextSteps.map((s, i) => (
                      <li key={i} className="stepItem">
                        <div className="stepItem__num">{i + 1}</div>
                        <div className="stepItem__text">{s}</div>
                      </li>
                    ))}
                  </ol>
                </Card>
              </div>
            )}

            {tab === "heatmap" && (
              <div className="stack">
                <Card
                  title="UI 평가 이미지"
                  subtitle="히트맵 오버레이 (버전 비교 + 선명도 조절)"
                  footer={
                    <div className="muted">
                      Tip: 히트맵은 정답이 아니라 <b>신호</b>입니다. Focus/Click/Scan을 번갈아 보면서 문제 지점을 좁혀보세요.
                    </div>
                  }
                >
                  {/* ✅ 컨트롤 */}
                  <HeatmapControls
                    variant={heatVariant}
                    setVariant={setHeatVariant}
                    opacity={heatOpacity}
                    setOpacity={setHeatOpacity}
                    sharpness={heatSharpness}
                    setSharpness={setHeatSharpness}
                    blendMode={heatBlendMode}
                    setBlendMode={setHeatBlendMode}
                  />

                  <div className="heatWrap heatWrap--polish" style={{ marginTop: 14 }}>
                    {r?.imageUrl ? (
                      <>
                        <img src={r.imageUrl} alt="result" className="heatImg" />

                        {/* ✅ 여러 버전 + 선명도 적용 */}
                        <div
                          className={`heatOverlay ${activeHeat.className}`}
                          style={{
                            opacity: heatOpacity,
                            mixBlendMode: heatBlendMode,
                            filter: `blur(${blurPx}px) contrast(${contrast}) saturate(${saturate})`,
                          }}
                        />

                        {/* ✅ hotspot 라벨 (mockApi에서 주면 표시) */}
                        <div className="heatLabels">
                          {(r?.heatmapHotspots || []).map((h, idx) => (
                            <div
                              key={idx}
                              className="heatLabel"
                              style={{ top: `${Math.round(h.y * 100)}%`, left: `${Math.round(h.x * 100)}%` }}
                            >
                              <span className="dot" /> {h.label || "Hotspot"}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="heatPlaceholder">업로드 이미지가 없습니다. (Upload에서 업로드 후 다시 실행)</div>
                    )}
                  </div>

                  <div className="grid2" style={{ marginTop: 14 }}>
                    <div className="miniInfo">
                      <div className="miniInfo__title">현재 버전 해석</div>
                      <div className="miniInfo__body muted">
                        <b>{activeHeat.label}</b> 기준으로 주목/행동 패턴을 보여줍니다. CTA가 많다면 Focus/Click에서 “과밀”이 잘 드러납니다.
                      </div>
                    </div>
                    <div className="miniInfo">
                      <div className="miniInfo__title">권장 조치</div>
                      <div className="miniInfo__body muted">
                        “요약 → 세부(펼침)” 구조로 정보량을 단계적으로 노출하면, 집중도/가독성을 동시에 잡을 수 있습니다.
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {tab === "details" && (
              <div className="stack">
                <Card
                  title="상세 피드백"
                  subtitle="많은 내용을 ‘섹션별 접기’로 정리"
                  actions={
                    <div className="row" style={{ gap: 8 }}>
                      <button type="button" className="btn btn--outline" onClick={() => setOpenKey("priority")}>
                        우선순위
                      </button>
                      <button type="button" className="btn btn--outline" onClick={() => setOpenKey("strengths")}>
                        강점
                      </button>
                      <button type="button" className="btn btn--outline" onClick={() => setOpenKey("risks")}>
                        리스크
                      </button>
                    </div>
                  }
                >
                  <div className="accordion">
                    {details.map((sec) => (
                      <div key={sec.key} className={`acc ${openKey === sec.key ? "acc--open" : ""}`}>
                        <button
                          type="button"
                          className="acc__head"
                          onClick={() => setOpenKey(openKey === sec.key ? "" : sec.key)}
                        >
                          <div className="row" style={{ gap: 10, alignItems: "center" }}>
                            <div className="acc__title">{sec.title}</div>
                            <Pill tone={sec.tone}>{sec.items.length} items</Pill>
                          </div>
                          <div className="acc__chev">{openKey === sec.key ? "−" : "+"}</div>
                        </button>

                        {openKey === sec.key && (
                          <div className="acc__body">
                            <div className="issueList">
                              {sec.items.map((it, i) => (
                                <div key={i} className="issue">
                                  <div className="issue__top">
                                    <div className="issue__title">{it.title}</div>
                                    {it.impact && it.impact !== "—" && (
                                      <Pill tone={it.impact === "High" ? "warn" : "accent"}>{it.impact}</Pill>
                                    )}
                                  </div>
                                  <div className="muted">{it.desc}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {tab === "checklist" && (
              <div className="stack">
                <Card title="추가 제안" subtitle="반복 개선(Iteration)을 위한 체크리스트">
                  <div className="checkGrid">
                    {[
                      { t: "정보 구조", d: "상위 3개 정보만 1차 노출 / 나머지는 접기" },
                      { t: "버튼 대비", d: "Primary 1개 + Secondary 분리" },
                      { t: "간격", d: "섹션 간 24~32px 패딩 유지" },
                      { t: "텍스트", d: "긴 문장 대신 1줄 요약 + 근거" },
                      { t: "시각 힌트", d: "라벨/배지로 우선순위 표시" },
                      { t: "일관성", d: "카드 제목/서브타이틀 톤 통일" },
                    ].map((x, i) => (
                      <div key={i} className="checkItem">
                        <div className="checkItem__title">{x.t}</div>
                        <div className="checkItem__desc muted">{x.d}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* 우측 사이드 */}
          <aside className="resultSide">
            <Card title="요약" subtitle="한 눈에 보기" hoverable={false}>
              <div className="sideScore">
                <div className="sideScore__num">{overall}</div>
                <div className="sideScore__right">
                  {kpis.map((k) => (
                    <div key={k.key} className="sideKpi">
                      <div className="sideKpi__label">{k.label}</div>
                      <div className="sideKpi__value">{k.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sideDivider" />

              <div className="sideList">
                <div className="sideList__title">핵심 액션</div>
                <ul>
                  {nextSteps.slice(0, 3).map((s, i) => (
                    <li key={i} className="muted">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <div style={{ height: 10 }} />

            <Card title="내비게이션" subtitle="섹션 이동" hoverable={false}>
              <div className="sideNav">
                <button type="button" className="sideNav__btn" onClick={() => setTab("overview")}>
                  요약
                </button>
                <button type="button" className="sideNav__btn" onClick={() => setTab("heatmap")}>
                  히트맵
                </button>
                <button type="button" className="sideNav__btn" onClick={() => setTab("details")}>
                  상세 피드백
                </button>
                <button type="button" className="sideNav__btn" onClick={() => setTab("checklist")}>
                  체크리스트
                </button>
              </div>
            </Card>
          </aside>
        </section>

        <div style={{ height: 70 }} />
      </main>
    </div>
  );
}
