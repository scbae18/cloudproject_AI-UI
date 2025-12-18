export const initialDb = {
  users: [
    {
      id: "u1",
      name: "John Doe",
      email: "john@example.com",
      joinedAt: "2022-01-15",
      password: "1234", // 더미
    },
  ],

  templates: [
    { id: "t1", name: "Focus Heatmap", desc: "사용자 집중도(시선/클릭) 중심 평가", createdAt: "2023-02-01" },
    { id: "t2", name: "Readability", desc: "정보 구조/가독성 중심", createdAt: "2023-05-10" },
    { id: "t3", name: "Conversion", desc: "CTA/전환 중심", createdAt: "2023-08-22" },
    { id: "t4", name: "Design System", desc: "컴포넌트 일관성/토큰/여백 규칙", createdAt: "2024-01-19" },
    { id: "t5", name: "Mobile UX", desc: "모바일 터치 타겟/스크롤/계층 구조", createdAt: "2024-03-04" },
    { id: "t6", name: "Accessibility", desc: "대비/폰트/키보드 접근성/레이블", createdAt: "2024-06-21" },
    { id: "t7", name: "Onboarding", desc: "첫 화면 메시지/신뢰 요소/가이드", createdAt: "2024-09-12" },
    { id: "t8", name: "B2B Dashboard", desc: "테이블/차트/정보 밀도 최적화", createdAt: "2025-02-11" },
  ],

  projects: [
    {
      id: "p1",
      title: "Project Alpha",
      desc: "디자인 시스템 개선",
      owner: "User123",
      createdAt: "2023-01-15",
      thumbnail: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=70",
      lastResultId: "r1",
    },
    {
      id: "p2",
      title: "Project Beta",
      desc: "사용자 리서치 기반 랜딩 개편",
      owner: "User456",
      createdAt: "2023-03-20",
      thumbnail: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1200&q=70",
      lastResultId: "r2",
    },
    {
      id: "p3",
      title: "Project Gamma",
      desc: "UX/UI 디자인 리뉴얼",
      owner: "User789",
      createdAt: "2023-05-10",
      thumbnail: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1200&q=70",
      lastResultId: "r3",
    },

    // ✅ 풍성해 보이도록 프로젝트 추가
    {
      id: "p4",
      title: "Checkout Flow v2",
      desc: "결제 흐름 단축 + 전환률 개선 실험",
      owner: "John Doe",
      createdAt: "2024-02-08",
      thumbnail: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=70",
      lastResultId: "r4",
    },
    {
      id: "p5",
      title: "Mobile Home Revamp",
      desc: "모바일 홈 화면 정보 구조 재정비",
      owner: "John Doe",
      createdAt: "2024-05-17",
      thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=70",
      lastResultId: "r5",
    },
    {
      id: "p6",
      title: "SaaS Pricing Page",
      desc: "가격표/플랜 비교 섹션 재설계",
      owner: "John Doe",
      createdAt: "2024-08-02",
      thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=70",
      lastResultId: "r6",
    },
    {
      id: "p7",
      title: "Admin Dashboard",
      desc: "테이블 밀도/필터/상태 배지 개선",
      owner: "John Doe",
      createdAt: "2025-01-09",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=70",
      lastResultId: "r7",
    },
    {
      id: "p8",
      title: "Onboarding A/B",
      desc: "첫 진입 가이드 + 신뢰 요소 강화",
      owner: "John Doe",
      createdAt: "2025-03-22",
      thumbnail: "https://images.unsplash.com/photo-1553028826-ccdfc006d078?auto=format&fit=crop&w=1200&q=70",
      lastResultId: "r8",
    },
    {
      id: "p9",
      title: "Design Tokens Audit",
      desc: "컬러/타이포/스페이싱 토큰 정리",
      owner: "John Doe",
      createdAt: "2025-06-13",
      thumbnail: "https://images.unsplash.com/photo-1557682268-e3956e2a3d88?auto=format&fit=crop&w=1200&q=70",
      lastResultId: null,
    },
  ],

  results: [
    {
      id: "r1",
      projectId: "p1",
      createdAt: "2023-10-23",
      templateId: "t1",
      summaryCards: [
        { title: "히트맵 분석", body: "CTA 주변에 주목도가 집중되어 있지만, 보조 링크로 시선이 분산됩니다." },
        { title: "개선 제안", body: "상단 내비를 단순화하고 CTA 대비/여백을 강화하세요." },
        { title: "가독성", body: "본문 텍스트의 줄 간격이 촘촘합니다. line-height를 조금 늘려보세요." },
      ],
      nextSteps: [
        "히어로 섹션의 메시지를 1문장으로 축약해보세요.",
        "CTA 버튼을 1개만 ‘주’ 버튼으로 지정하세요.",
        "보조 링크는 하단으로 이동해 시선 분산을 줄이세요.",
      ],
      imageUrl: null,
    },
    { id: "r2", projectId: "p2", createdAt: "2023-09-30", templateId: "t2", summaryCards: [], nextSteps: [], imageUrl: null },
    { id: "r3", projectId: "p3", createdAt: "2023-07-25", templateId: "t3", summaryCards: [], nextSteps: [], imageUrl: null },

    // ✅ 추가 results
    {
      id: "r4",
      projectId: "p4",
      createdAt: "2024-02-09",
      templateId: "t3",
      summaryCards: [
        { title: "전환 흐름", body: "결제 단계가 4단 → 3단으로 축약 가능해 보입니다." },
        { title: "시각적 계층", body: "가격/합계 정보가 버튼보다 먼저 보여야 합니다." },
        { title: "마이크로카피", body: "CTA 문구를 ‘결제하기’ 대신 ‘주문 확정’처럼 명확하게." },
      ],
      nextSteps: ["주요 CTA를 스크롤 하단 고정으로 테스트", "필수/선택 입력 분리", "에러 메시지 위치 통일"],
      imageUrl: null,
    },
    {
      id: "r5",
      projectId: "p5",
      createdAt: "2024-05-19",
      templateId: "t5",
      summaryCards: [
        { title: "모바일 터치 타겟", body: "상단 아이콘 간격이 좁아 오탭 가능성이 있습니다." },
        { title: "스크롤 리듬", body: "섹션 간 간격이 일정하지 않아 피로도가 생깁니다." },
      ],
      nextSteps: ["터치 타겟 44px 기준 확보", "섹션 패딩을 토큰화", "카드 목록에 skeleton 적용"],
      imageUrl: null,
    },
    {
      id: "r6",
      projectId: "p6",
      createdAt: "2024-08-03",
      templateId: "t2",
      summaryCards: [
        { title: "플랜 비교", body: "추천 플랜 강조는 좋지만, 비교 기준이 위로 치우쳐 있습니다." },
        { title: "신뢰 요소", body: "FAQ/리뷰/보안 뱃지 섹션을 CTA 근처에 배치하면 설득력이 증가합니다." },
      ],
      nextSteps: ["플랜 카드 높이 정렬", "비교표에 ‘누구에게 적합한지’ 라벨 추가", "FAQ 5개로 압축"],
      imageUrl: null,
    },
    {
      id: "r7",
      projectId: "p7",
      createdAt: "2025-01-11",
      templateId: "t8",
      summaryCards: [
        { title: "정보 밀도", body: "표의 열이 많아 스캔이 어렵습니다. 고정 열 + 나머지 접기 추천." },
        { title: "상태 표현", body: "상태 배지 컬러 규칙(성공/경고/실패)을 통일하세요." },
      ],
      nextSteps: ["필터 영역을 상단 sticky로", "표 행 hover/선택 상태 강화", "빈 상태(empty state) 추가"],
      imageUrl: null,
    },
    {
      id: "r8",
      projectId: "p8",
      createdAt: "2025-03-24",
      templateId: "t7",
      summaryCards: [
        { title: "첫 화면 메시지", body: "가치 제안은 좋지만, ‘누구를 위한 서비스인지’가 더 명확하면 좋습니다." },
        { title: "온보딩 단계", body: "2~3단계로 짧게 끊으면 이탈이 줄어듭니다." },
      ],
      nextSteps: ["‘대상 사용자’ 문장 추가", "온보딩에서 예시 화면 1장 제공", "가입 전 샘플 결과 보기 제공"],
      imageUrl: null,
    },
  ],

  savedFeedback: [
    { id: "f1", title: "Feedback on Project A", date: "2023-04-10", tag: "사용자 경험", body: "CTA 대비와 정보 구조 개선이 핵심입니다." },
    { id: "f2", title: "Feedback on Project B", date: "2023-03-15", tag: "개선 제안", body: "문구를 구체화하고 불필요 요소를 줄이세요." },
    { id: "f3", title: "Feedback on Project C", date: "2023-02-20", tag: "인터페이스", body: "탭/필터 영역의 규칙을 통일하면 스캔성이 좋아집니다." },

    // ✅ 더미 피드백 추가
    { id: "f4", title: "Mobile Home Revamp", date: "2024-05-19", tag: "Mobile UX", body: "터치 타겟과 섹션 패딩 토큰화를 먼저 잡는 게 좋습니다." },
    { id: "f5", title: "SaaS Pricing Page", date: "2024-08-03", tag: "Readability", body: "추천 플랜 강조는 유지하되 비교 기준을 더 앞쪽에 배치하세요." },
    { id: "f6", title: "Admin Dashboard", date: "2025-01-11", tag: "Dashboard", body: "테이블 열 정리 + 상태 배지 컬러 규칙을 우선 적용하세요." },
    { id: "f7", title: "Onboarding A/B", date: "2025-03-24", tag: "Onboarding", body: "‘누구에게’가 더 명확해야 첫 화면 설득력이 올라갑니다." },
  ],

  uploadDraft: {
    selectedTemplateId: "t1",
    uploadedImageUrl: null,
    uploadedFileName: null,
    projectTitle: "",
    projectId: null,
  },

  lastResultId: "r1",
};
