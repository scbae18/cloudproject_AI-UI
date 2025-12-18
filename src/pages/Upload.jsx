import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import Card from "../components/Card.jsx";
import LoadingModal from "../components/LoadingModal.jsx";
import {
  createProject,
  createTemplate,
  getTemplates,
  getUploadDraft,
  runEvaluation,
  setUploadDraft,
} from "../lib/mockApi.js";

export default function Upload() {
  const [templates, setTemplates] = useState([]);
  const [draft, setDraft] = useState(null);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [projectTitle, setProjectTitle] = useState("");
  const [projectCreating, setProjectCreating] = useState(false);

  const [loading, setLoading] = useState(false);

  // 로딩 모달
  const [evalOpen, setEvalOpen] = useState(false);
  const [progressText, setProgressText] = useState("");

  // UX: 템플릿 검색
  const [tplQ, setTplQ] = useState("");

  // UX: drag & drop
  const [dragOn, setDragOn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getTemplates(), getUploadDraft()]).then(([ts, d]) => {
      setTemplates(ts);
      setDraft(d);
      setProjectTitle(d.projectTitle || "");
    });
  }, []);

  const selected = useMemo(
    () => templates.find((t) => t.id === draft?.selectedTemplateId),
    [templates, draft]
  );

  const filteredTemplates = useMemo(() => {
    const q = tplQ.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter((t) => `${t.name} ${t.desc}`.toLowerCase().includes(q));
  }, [templates, tplQ]);

  const refreshDraftAndTemplates = async () => {
    const [ts, d] = await Promise.all([getTemplates(), getUploadDraft()]);
    setTemplates(ts);
    setDraft(d);
    setProjectTitle(d.projectTitle || "");
  };

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const onPickFile = async (file) => {
    if (!file) return;
    const isOk = ["image/png", "image/jpeg"].includes(file.type);
    if (!isOk) return alert("PNG/JPG만 업로드할 수 있어요.");

    const url = URL.createObjectURL(file);
    await setUploadDraft({ uploadedImageUrl: url, uploadedFileName: file.name });
    setDraft((prev) => ({ ...prev, uploadedImageUrl: url, uploadedFileName: file.name }));
  };

  const onClearFile = async () => {
    await setUploadDraft({ uploadedImageUrl: "", uploadedFileName: "" });
    setDraft((prev) => ({ ...prev, uploadedImageUrl: "", uploadedFileName: "" }));
  };

  const onSelectTemplate = async (id) => {
    await setUploadDraft({ selectedTemplateId: id });
    setDraft((prev) => ({ ...prev, selectedTemplateId: id }));
  };

  const onCreateTemplate = async () => {
    if (!newName.trim()) return alert("템플릿 이름을 입력하세요.");
    await createTemplate({ name: newName.trim(), desc: newDesc.trim() });
    setNewName("");
    setNewDesc("");
    await refreshDraftAndTemplates();
  };

  const onCreateProject = async () => {
    if (!projectTitle.trim()) return alert("프로젝트 이름을 입력하세요.");
    setProjectCreating(true);
    try {
      await createProject({ title: projectTitle.trim() });
      await refreshDraftAndTemplates();
      alert("프로젝트가 생성되었습니다.");
    } catch (e) {
      alert(e?.message || "프로젝트 생성 중 오류가 발생했습니다.");
    } finally {
      setProjectCreating(false);
    }
  };

  // 평가 실행: 3초 로딩 모달 → 결과 페이지
  const onRun = async () => {
    if (!draft?.projectId) return alert("먼저 프로젝트를 생성해주세요.");
    if (!draft?.uploadedImageUrl) return alert("먼저 UI 이미지를 업로드해주세요.");
    if (!draft?.selectedTemplateId) return alert("평가 기준 템플릿을 선택해주세요.");

    setLoading(true);
    setEvalOpen(true);

    const start = Date.now();
    try {
      setProgressText("이미지 분석 준비 중…");
      await wait(650);

      setProgressText("히트맵 생성 중…");
      await wait(650);

      setProgressText("AI 피드백 생성 중…");
      await runEvaluation();

      // 최소 3초는 보여주기
      const elapsed = Date.now() - start;
      const remain = Math.max(0, 3000 - elapsed);
      if (remain > 0) await wait(remain);

      navigate("/result");
    } finally {
      setLoading(false);
      setEvalOpen(false);
      setProgressText("");
    }
  };

  const stepDone = {
    project: !!draft?.projectId,
    upload: !!draft?.uploadedImageUrl,
    template: !!draft?.selectedTemplateId,
  };

  return (
    <div>
      <TopNav />
      <main className="container">
        <section className="pageHead">
          <h1 className="h1 center">디자인 업로드 및 평가 설정</h1>
          <p className="muted center">프로젝트 → 이미지 → 기준 순으로 진행하세요.</p>

          <div className="stepper">
            <div className={`stepper__item ${stepDone.project ? "is-done" : ""}`}>
              <div className="stepper__dot" />
              <div className="stepper__label">프로젝트</div>
            </div>
            <div className={`stepper__item ${stepDone.upload ? "is-done" : ""}`}>
              <div className="stepper__dot" />
              <div className="stepper__label">업로드</div>
            </div>
            <div className={`stepper__item ${stepDone.template ? "is-done" : ""}`}>
              <div className="stepper__dot" />
              <div className="stepper__label">템플릿</div>
            </div>
          </div>
        </section>

        {/* 프로젝트 생성 */}
        <section className="section section--soft" style={{ marginTop: 0 }}>
          <div className="twoCol">
            <Card title="프로젝트 생성" subtitle="프로젝트 이름을 입력하고 새 프로젝트를 만드세요.">
              <label className="label">프로젝트 이름</label>
              <input
                className="input"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="예: 2025-12 랜딩페이지 개선"
                onKeyDown={(e) => e.key === "Enter" && onCreateProject()}
              />

              <div className="row" style={{ marginTop: 12 }}>
                <PrimaryButton variant="outline" onClick={onCreateProject} loading={projectCreating}>
                  새 프로젝트 생성
                </PrimaryButton>
              </div>

              <div className="muted" style={{ marginTop: 12 }}>
                현재 대상 프로젝트: <b>{draft?.projectTitle ? draft.projectTitle : "미선택"}</b>
              </div>
            </Card>

            <Card title="진행 상태" subtitle="아래 3개가 모두 준비되면 평가 실행이 가능합니다.">
              <div className="stack">
                <div className="row row--between">
                  <span>프로젝트</span>
                  <span className={`pill ${stepDone.project ? "pill--ok" : "pill--req"}`}>{stepDone.project ? "완료" : "필수"}</span>
                </div>
                <div className="row row--between">
                  <span>이미지 업로드</span>
                  <span className={`pill ${stepDone.upload ? "pill--ok" : "pill--req"}`}>{stepDone.upload ? "완료" : "필수"}</span>
                </div>
                <div className="row row--between">
                  <span>템플릿 선택</span>
                  <span className={`pill ${stepDone.template ? "pill--ok" : "pill--req"}`}>
                    {stepDone.template ? "완료" : "필수"}
                  </span>
                </div>

                <div className="divider" />

                <div className="muted">
                  💡 추천: 템플릿을 “가독성/정보구조 중심”, “전환(CTA) 중심”처럼 2~3개 만들어두면 실무 느낌이 더 납니다.
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 업로드 */}
        <section className="uploadGrid">
          <div>
            <h2 className="h2">디자인 업로드</h2>
            <p className="muted">드래그하거나 파일을 선택하여 업로드하세요.</p>
          </div>

          <div>
            <Card title="UI 이미지 업로드" subtitle="PNG, JPG만 지원합니다.">
              <div
                className={`dropZone ${dragOn ? "is-on" : ""}`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragOn(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOn(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragOn(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOn(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) onPickFile(f);
                }}
              >
                <div className="dropZone__title">Drag & Drop</div>
                <div className="dropZone__desc muted">파일을 여기로 끌어오거나 아래에서 선택하세요.</div>

                <div style={{ marginTop: 12 }}>
                  <input type="file" accept="image/png,image/jpeg" onChange={(e) => onPickFile(e.target.files?.[0])} />
                </div>
              </div>

              <div className="row row--between" style={{ marginTop: 14 }}>
                <div className="muted">
                  {draft?.uploadedFileName ? `선택됨: ${draft.uploadedFileName}` : "선택된 파일 없음"}
                </div>
                {draft?.uploadedImageUrl && (
                  <button className="btn btn--ghost" onClick={onClearFile}>
                    제거
                  </button>
                )}
              </div>

              {draft?.uploadedImageUrl && (
                <div style={{ marginTop: 14 }}>
                  <div className="preview preview--polish">
                    <img src={draft.uploadedImageUrl} alt="preview" />
                    <div className="previewShade" />
                  </div>
                </div>
              )}
            </Card>
          </div>
        </section>

        {/* 템플릿 */}
        <section className="section">
          <h2 className="h2 center">평가 기준</h2>
          <p className="muted center">기존 템플릿을 선택하거나 새 템플릿을 저장하세요.</p>

          <div className="center" style={{ marginTop: 16 }}>
            <div className="inputWrap" style={{ maxWidth: 520, margin: "0 auto" }}>
              <input className="input input--search" value={tplQ} onChange={(e) => setTplQ(e.target.value)} placeholder="템플릿 검색…" />
            </div>
          </div>

          <div className="row center" style={{ gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            {filteredTemplates.map((t) => {
              const isActive = draft?.selectedTemplateId === t.id;
              return (
                <button
                  key={t.id}
                  className={`templateChip ${isActive ? "is-active" : ""}`}
                  onClick={() => onSelectTemplate(t.id)}
                  title={t.desc}
                  type="button"
                >
                  <span className="templateChip__label">{t.name}</span>
                  {isActive && <span className="templateChip__check">✓</span>}
                </button>
              );
            })}
          </div>

          <div className="twoCol" style={{ marginTop: 18 }}>
            <Card title="새 템플릿으로 저장" subtitle="원하는 기준을 직접 입력해보세요.">
              <label className="label">템플릿 이름</label>
              <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="예: 가독성/정보 구조 중심" />

              <label className="label">간단 설명</label>
              <input className="input" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="예: 텍스트 대비/정렬/시각적 계층" />

              <div className="row" style={{ marginTop: 12 }}>
                <PrimaryButton variant="outline" onClick={onCreateTemplate}>
                  저장
                </PrimaryButton>
              </div>
            </Card>

            <Card title="현재 선택" subtitle="선택된 기준으로 평가가 실행됩니다.">
              <div className="muted">선택된 템플릿</div>
              <div className="h3" style={{ marginTop: 8 }}>
                {selected?.name || "-"}
              </div>
              <div className="muted" style={{ marginTop: 8 }}>
                {selected?.desc || ""}
              </div>

              <div className="divider" />

              <div className="muted">
                ✅ 권장: 템플릿을 2~3개로 분리(가독성/전환/정보구조)하면 결과 비교가 쉬워집니다.
              </div>
            </Card>
          </div>

          <div className="center" style={{ marginTop: 28 }}>
            <div className="muted" style={{ marginBottom: 12 }}>
              평가를 시작할 준비가 되셨나요?
            </div>
            <PrimaryButton disabled={loading} onClick={onRun} size="lg">
              {loading ? "AI 평가 중..." : "AI 평가 실행"}
            </PrimaryButton>
            <div className="muted" style={{ marginTop: 12 }}>
              * 프로젝트 생성 / 이미지 업로드 / 템플릿 선택이 모두 필요합니다.
            </div>
          </div>
        </section>
      </main>

      <LoadingModal open={evalOpen} progressText={progressText} />
    </div>
  );
}
