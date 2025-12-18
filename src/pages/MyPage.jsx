import { useEffect, useMemo, useState } from "react";
import TopNav from "../components/TopNav.jsx";
import Card from "../components/Card.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import { getProfile, getSavedFeedback, getTemplates } from "../lib/mockApi.js";

export default function MyPage() {
  const [profile, setProfile] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    Promise.all([getProfile(), getSavedFeedback(), getTemplates()]).then(([p, f, t]) => {
      setProfile(p);
      setFeedback(f);
      setTemplates(t);
    });
  }, []);

  const latestFeedback = useMemo(() => feedback.slice(0, 5), [feedback]);
  const topTemplates = useMemo(() => templates.slice(0, 4), [templates]);

  return (
    <div>
      <TopNav />
      <main className="container">
        <section className="profileHead">
          <div className="avatar big" />
          <div>
            <div className="h3" style={{ fontWeight: 950 }}>{profile?.name || "User"}</div>
            <div className="muted">Joined on {profile?.joinedAt || "-"}</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <PrimaryButton onClick={() => alert("더미: 프로필 편집")}>Edit Profile</PrimaryButton>
          </div>
        </section>

        <section className="section">
          <h2 className="h2 center">내 작업 요약</h2>

          <div className="twoCol" style={{ marginTop: 18 }}>
            <Card title="최근 활동" subtitle="Saved feedback">
              <div className="stack" style={{ marginTop: 6 }}>
                {latestFeedback.map((f) => (
                  <div key={f.id} className="card" style={{ padding: 12 }}>
                    <div className="row row--between">
                      <div style={{ fontWeight: 950 }} className="textClamp1">{f.title}</div>
                      <span className="pill">{f.tag}</span>
                    </div>
                    <div className="muted" style={{ marginTop: 6 }}>{f.body}</div>
                    <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>{f.date}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="나의 평가 기준" subtitle="Templates">
              <div className="stack" style={{ marginTop: 6 }}>
                {topTemplates.map((t) => (
                  <div key={t.id} className="card" style={{ padding: 12 }}>
                    <div style={{ fontWeight: 950 }} className="textClamp1">{t.name}</div>
                    <div className="muted textClamp2" style={{ marginTop: 6 }}>{t.desc}</div>
                    <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>Created: {t.createdAt}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div style={{ marginTop: 26 }}>
            <h2 className="h2 center">계정 설정</h2>
            <div className="twoCol" style={{ marginTop: 18 }}>
              <Card title="이메일" subtitle={profile?.email || "-"} />
              <Card title="비밀번호 변경" subtitle="계정 비밀번호를 변경합니다." />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
