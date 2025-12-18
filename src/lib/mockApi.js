import { initialDb } from "../data/mockDb.js";
import { loadDb, saveDb, setSession, getSession, clearSession } from "./storage.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function db() { return loadDb(initialDb); }
function commit(next) { saveDb(next); return next; }
function uid(prefix="id") { return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`; }

/** ===== seeded random (결과마다 고정) ===== */
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}
function mulberry32(a) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeRng(seedStr) {
  const seed = xmur3(seedStr)();
  return mulberry32(seed);
}
function rInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}
function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}
function pickManyUnique(rng, arr, n) {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < n) {
    const idx = Math.floor(rng() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

/** ===== 더미 UI 이미지(SVG dataURL) + 히트맵 블롭 ===== */
function svgToDataUrl(svg) {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function genHeatBlobsSvg({ rng, width = 1200, height = 720, hotspots = [] }) {
  // radial gradient blobs를 SVG에 심어서 "히트맵처럼" 보이게
  const defs = hotspots.map((h, i) => {
    const a = clamp(h.alpha ?? 0.55, 0.2, 0.85);
    return `
      <radialGradient id="g${i}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(255,0,80,${a})"/>
        <stop offset="55%" stop-color="rgba(255,140,0,${a * 0.55})"/>
        <stop offset="100%" stop-color="rgba(255,255,0,0)"/>
      </radialGradient>
    `;
  }).join("");

  const circles = hotspots.map((h, i) => {
    const x = Math.round(width * h.x);
    const y = Math.round(height * h.y);
    const r = Math.round(width * (h.r ?? 0.10));
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#g${i})" />`;
  }).join("");

  return { defs, circles };
}

function genDummyUiSvg({ rng, title = "Demo UI", width = 1200, height = 720, hotspots = [] }) {
  const cards = rInt(rng, 6, 10);
  const accentX = rInt(rng, 120, 980);
  const accentY = rInt(rng, 140, 220);

  const { defs: heatDefs, circles: heatCircles } = genHeatBlobsSvg({ rng, width, height, hotspots });

  const cardBlocks = Array.from({ length: cards }).map((_, i) => {
    const x = 80 + (i % 3) * 360 + rInt(rng, -12, 12);
    const y = 260 + Math.floor(i / 3) * 150 + rInt(rng, -8, 8);
    const w = 320 + rInt(rng, -10, 10);
    const h = 110 + rInt(rng, -8, 8);
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="rgba(0,0,0,0.05)" stroke="rgba(0,0,0,0.08)"/>
      <rect x="${x + 18}" y="${y + 18}" width="${w - 90}" height="14" rx="7" fill="rgba(0,0,0,0.20)"/>
      <rect x="${x + 18}" y="${y + 44}" width="${w - 40}" height="10" rx="5" fill="rgba(0,0,0,0.12)"/>
      <rect x="${x + 18}" y="${y + 64}" width="${w - 120}" height="10" rx="5" fill="rgba(0,0,0,0.10)"/>
    `;
  }).join("");

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#f7f8ff"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgba(79,70,229,0.28)"/>
        <stop offset="100%" stop-color="rgba(99,102,241,0.18)"/>
      </linearGradient>

      ${heatDefs}
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="rgba(0,0,0,0.12)"/>
      </filter>
    </defs>

    <rect x="0" y="0" width="${width}" height="${height}" fill="url(#bg)"/>

    <!-- frame -->
    <rect x="60" y="48" width="${width - 120}" height="${height - 96}" rx="26" fill="#fff" stroke="rgba(0,0,0,0.10)" filter="url(#softShadow)"/>

    <!-- top bar -->
    <rect x="90" y="80" width="${width - 180}" height="62" rx="18" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.08)"/>
    <rect x="116" y="102" width="150" height="18" rx="9" fill="rgba(0,0,0,0.20)"/>
    <rect x="${width - 360}" y="100" width="240" height="22" rx="11" fill="rgba(0,0,0,0.10)"/>

    <!-- hero -->
    <rect x="90" y="160" width="${width - 180}" height="86" rx="22" fill="url(#accent)" />
    <rect x="${accentX}" y="${accentY}" width="180" height="36" rx="18" fill="rgba(79,70,229,0.65)"/>
    <rect x="120" y="182" width="520" height="20" rx="10" fill="rgba(0,0,0,0.20)"/>
    <rect x="120" y="212" width="380" height="14" rx="7" fill="rgba(0,0,0,0.12)"/>

    <!-- content cards -->
    ${cardBlocks}

    <!-- heatmap blobs (랜덤) -->
    <g style="mix-blend-mode:multiply; opacity:0.95">
      ${heatCircles}
    </g>

    <text x="92" y="${height - 26}" font-family="ui-sans-serif, system-ui" font-size="12" fill="rgba(0,0,0,0.45)">
      ${title} · dummy preview
    </text>
  </svg>
  `;
  return svgToDataUrl(svg);
}

function genHotspots(rng) {
  // 3~5개, 위치/반경 랜덤. (x,y 0~1)
  const count = rInt(rng, 3, 5);
  const base = [];
  for (let i = 0; i < count; i++) {
    base.push({
      x: clamp(rng() * 0.78 + 0.10, 0.08, 0.92),
      y: clamp(rng() * 0.65 + 0.12, 0.08, 0.92),
      r: clamp(rng() * 0.10 + 0.08, 0.07, 0.18),
      alpha: clamp(rng() * 0.35 + 0.45, 0.35, 0.85),
      label: pick(rng, ["CTA", "Nav", "Search", "Hero", "Card", "Filter"]),
    });
  }
  return base;
}

function genKpis(rng) {
  const overall = rInt(rng, 62, 92);
  // overall을 기준으로 항목별로 약간 흔들기 (현실감)
  const mk = (label) => clamp(overall + rInt(rng, -8, 8), 45, 98);
  return [
    { key: "clarity", label: "Clarity", value: mk("Clarity") },
    { key: "hierarchy", label: "Hierarchy", value: mk("Hierarchy") },
    { key: "readability", label: "Readability", value: mk("Readability") },
  ];
}

function genSummary(rng) {
  const insightPool = [
    "상단 내비/CTA에 주목이 강하게 몰립니다. 행동 유도는 좋지만 정보 피로를 줄이는 정리가 필요합니다.",
    "히어로 영역의 대비가 높아 첫 인지가 빠릅니다. 다만 텍스트 밀도를 줄이면 더 안정적으로 보입니다.",
    "카드 영역의 반복 패턴이 명확해 스캔이 빠릅니다. 버튼 스타일을 통일하면 완성도가 올라갑니다.",
    "시선 흐름이 좌→우로 자연스럽지만, 보조 정보가 과하게 노출되어 핵심이 묻힐 수 있습니다.",
  ];
  const fixPool = [
    "Primary CTA 1개만 강하게 두고 나머지는 secondary로 분리하세요.",
    "‘요약 → 펼침(상세)’ 구조로 정보를 단계 노출하면 가독성이 크게 개선됩니다.",
    "섹션 간 간격(24~32px)과 제목 계층을 고정해 전체 리듬을 통일하세요.",
    "표/리스트는 2열 이상으로 분산하고, 핵심 수치만 먼저 노출하세요.",
  ];

  return [
    { title: "히트맵 분석", body: pick(rng, insightPool) },
    { title: "개선 제안", body: pick(rng, fixPool) },
  ];
}

function genNextSteps(rng) {
  const pool = [
    "상단 영역(헤더/탭/CTA)을 1줄 레이아웃으로 정리",
    "Primary CTA 1개만 강조하고 보조 액션은 숨김/드롭다운으로 이동",
    "요약 카드 2~3개로 압축하고 상세는 아코디언으로 전환",
    "텍스트를 ‘1줄 결론 + 근거 2줄’ 패턴으로 통일",
    "색 대비(버튼/링크/헤더)를 일정 기준(AA 수준)으로 강화",
    "카드/버튼 radius, shadow, border 색을 공통 토큰으로 통일",
  ];
  return pickManyUnique(rng, pool, rInt(rng, 3, 5));
}

function genDetails(rng) {
  const priorityItems = [
    {
      title: "핵심 CTA를 1개로 고정",
      desc: "액션이 여러 개 보이면 사용자는 선택 비용을 느낍니다. 가장 중요한 행동만 Primary로, 나머지는 보조로 분리하세요.",
      impact: "High",
    },
    {
      title: "요약을 상단에 압축 배치",
      desc: "현재 텍스트가 길게 퍼지면 결과(히트맵/점수)가 약해 보입니다. 요약은 카드 2~3개로 압축하세요.",
      impact: "High",
    },
    {
      title: "히트맵 포인트에 라벨을 제공",
      desc: "히트맵만 보여주면 ‘왜 여기냐’가 부족합니다. Nav/CTA/Search 등 라벨을 붙이면 설득력이 올라갑니다.",
      impact: "Mid",
    },
  ];

  const strengths = [
    { title: "탐색성", desc: "정보가 블록 단위로 분리되어 스캔이 빠릅니다.", impact: "—" },
    { title: "행동 유도 흐름", desc: "CTA 위치가 자연스럽고 시선 흐름이 끊기지 않습니다.", impact: "—" },
  ];

  const risks = [
    { title: "텍스트 과밀", desc: "설명 텍스트가 길면 핵심이 묻힙니다. 1줄 요약 중심으로 줄이세요.", impact: "Mid" },
    { title: "버튼 군집", desc: "다운로드/복사/저장이 한 곳에 몰리면 우선순위가 흐려집니다.", impact: "Mid" },
  ];

  // 약간 랜덤 셔플
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  return [
    { key: "priority", title: "우선순위 액션 (Top 3)", tone: "accent", items: shuffle(priorityItems) },
    { key: "strengths", title: "강점", tone: "good", items: shuffle(strengths) },
    { key: "risks", title: "리스크 / 주의 포인트", tone: "warn", items: shuffle(risks) },
  ];
}

export async function bootstrapDb() {
  const cur = loadDb(null);
  if (!cur) saveDb(initialDb);
}

export async function login({ email, password }) {
  await sleep(400);
  const d = db();
  const user = d.users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  setSession({ user: { id: user.id, name: user.name, email: user.email, joinedAt: user.joinedAt } });
  return user;
}

export async function signup({ email, password }) {
  await sleep(500);
  const d = db();
  const exists = d.users.some((u) => u.email === email);
  if (exists) throw new Error("이미 존재하는 이메일입니다.");
  const newUser = { id: uid("u"), name: "New User", email, password, joinedAt: new Date().toISOString().slice(0,10) };
  commit({ ...d, users: [newUser, ...d.users] });
  setSession({ user: { id: newUser.id, name: newUser.name, email: newUser.email, joinedAt: newUser.joinedAt } });
  return newUser;
}

export async function logout() {
  await sleep(150);
  clearSession();
}

export function session() {
  return getSession();
}

export async function getMyProjects() {
  await sleep(250);
  const d = db();
  return d.projects.slice(0, 3);
}

export async function getAllProjects() {
  await sleep(250);
  const d = db();
  return d.projects;
}

export async function getTemplates() {
  await sleep(200);
  const d = db();
  return d.templates;
}

export async function createTemplate({ name, desc }) {
  await sleep(300);
  const d = db();
  const t = { id: uid("t"), name, desc: desc || "설명 없음", createdAt: new Date().toISOString().slice(0,10) };
  commit({ ...d, templates: [t, ...d.templates], uploadDraft: { ...d.uploadDraft, selectedTemplateId: t.id } });
  return t;
}

export async function setUploadDraft(patch) {
  await sleep(120);
  const d = db();
  commit({ ...d, uploadDraft: { ...d.uploadDraft, ...patch } });
  return true;
}

export async function getUploadDraft() {
  await sleep(120);
  return db().uploadDraft;
}

/** ✅ 평가 실행: 랜덤 KPI/피드백/히트맵 생성 */
export async function runEvaluation() {
  await sleep(900);
  const d = db();
  const draft = d.uploadDraft;

  const targetProjectId = draft.projectId || d.projects[0]?.id;
  if (!targetProjectId) throw new Error("프로젝트가 없습니다.");

  const resultId = uid("r");
  const rng = makeRng(resultId);

  const heatmapHotspots = genHotspots(rng);
  const kpis = genKpis(rng);
  const summaryCards = genSummary(rng);
  const nextSteps = genNextSteps(rng);
  const details = genDetails(rng);

  // 업로드 이미지가 없으면 더미 SVG 생성
  const imageUrl =
    draft.uploadedImageUrl ||
    genDummyUiSvg({
      rng,
      title: "Generated UI",
      hotspots: heatmapHotspots, // 더미 이미지 자체에도 히트맵 느낌 넣기
    });

  const result = {
    id: resultId,
    projectId: targetProjectId,
    createdAt: new Date().toISOString(),
    templateId: draft.selectedTemplateId,

    imageUrl,

    // ✅ Result.jsx가 직접 써먹을 수 있게 구조 제공
    kpis,
    summaryCards,
    nextSteps,
    details,
    heatmapHotspots,
  };

  const projects = d.projects.map((p) => {
    if (p.id !== targetProjectId) return p;
    return {
      ...p,
      lastResultId: resultId,
      thumbnail: imageUrl || p.thumbnail,
    };
  });

  commit({ ...d, results: [result, ...d.results], projects, lastResultId: resultId });
  return resultId;
}

export async function getResultByLast() {
  await sleep(150);
  const d = db();
  return d.results.find((r) => r.id === d.lastResultId) || d.results[0];
}

export async function getSavedFeedback() {
  await sleep(200);
  return db().savedFeedback;
}

export async function getProfile() {
  await sleep(120);
  const s = session();
  return s?.user || null;
}

export async function createProject({ title, desc }) {
  await sleep(250);
  const d = db();

  const p = {
    id: uid("p"),
    title,
    desc: desc || "UI 디자인 평가 프로젝트",
    owner: session()?.user?.name || "User",
    createdAt: new Date().toISOString().slice(0,10),
    thumbnail: null,
    lastResultId: null,
  };

  commit({
    ...d,
    projects: [p, ...d.projects],
    uploadDraft: { ...d.uploadDraft, projectId: p.id, projectTitle: title },
  });

  return p;
}

export async function saveFeedbackFromLastResult() {
  await sleep(200);
  const d = db();
  const r = d.results.find((x) => x.id === d.lastResultId) || d.results[0];
  if (!r) throw new Error("저장할 결과가 없습니다.");

  const p = d.projects.find((x) => x.id === r.projectId);
  const t = d.templates.find((x) => x.id === r.templateId);

  const item = {
    id: uid("f"),
    title: `Feedback on ${p?.title || "Project"}`,
    date: (r.createdAt || "").slice(0, 10),
    tag: t?.name || "Template",
    body: r.summaryCards?.[0]?.body || "저장된 피드백입니다.",
  };

  commit({ ...d, savedFeedback: [item, ...d.savedFeedback] });
  return item;
}
