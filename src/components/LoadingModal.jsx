import { useEffect, useMemo, useState } from "react";

export default function LoadingModal({
  open,
  title = "AI 평가를 진행 중입니다",
  desc = "UI를 분석하고 히트맵/피드백을 생성하고 있어요.",
  progressText,
}) {
  const tips = useMemo(
    () => [
      "Tip: CTA는 대비(contrast)만 바꿔도 전환율이 확 달라져요.",
      "Tip: 정보 구조는 ‘섹션 제목 → 핵심 메시지 → CTA’ 순서가 안전해요.",
      "Tip: 텍스트 크기보다 ‘행간/여백’이 가독성에 더 큰 영향이 있어요.",
      "Tip: 상단 네비는 항목 수를 4~6개로 유지하면 좋아요.",
    ],
    []
  );

  const [tipIdx, setTipIdx] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!open) return;

    setPct(0);
    const start = Date.now();

    const t = setInterval(() => {
      const elapsed = Date.now() - start;
      // 0~92%까지 부드럽게, 마지막은 페이지 전환이 끝내줌
      const next = Math.min(92, Math.round((elapsed / 3000) * 92));
      setPct(next);
    }, 60);

    const tipTimer = setInterval(() => {
      setTipIdx((p) => (p + 1) % tips.length);
    }, 1100);

    return () => {
      clearInterval(t);
      clearInterval(tipTimer);
    };
  }, [open, tips.length]);

  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modalCard">
        <div className="modalSpinner" />
        <div className="modalTitle">{title}</div>
        <div className="modalDesc">{desc}</div>

        <div className="modalBar" aria-label="progress">
          <div className="modalBar__fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="modalProgress">{progressText || `처리 중… (${pct}%)`}</div>
        <div className="modalTip">{tips[tipIdx]}</div>
      </div>
    </div>
  );
}
