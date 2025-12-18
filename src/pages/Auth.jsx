import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import { login, signup } from "../lib/mockApi.js";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("1234");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = useMemo(() => location.state?.from || "/my-projects", [location.state]);

  const submit = async () => {
    setErr("");
    setLoading(true);
    try {
      if (mode === "login") await login({ email, password });
      else await signup({ email, password });
      navigate(from);
    } catch (e) {
      setErr(e.message || "에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopNav variant="landing" />
      <main className="container">
        <section className="authHero">
          <h1 className="h1 center">UI&amp;AI에 오신것을<br/>환영합니다.</h1>
          <p className="muted center">AI가 디자인을 평가하는 가장 스마트한 방법.</p>

          <div className="seg">
            <button className={`seg__btn ${mode==="signup" ? "is-on" : ""}`} onClick={() => setMode("signup")}>회원가입</button>
            <button className={`seg__btn ${mode==="login" ? "is-on" : ""}`} onClick={() => setMode("login")}>로그인</button>
          </div>

          <div className="authGrid">
            <div>
              <h2 className="h3">로그인 / 회원가입</h2>
              <p className="muted">계정 정보를 입력해주세요.</p>
            </div>

            <div className="form">
              <label className="label">이메일</label>
              <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="이메일을 입력하세요" />

              <label className="label">비밀번호</label>
              <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" />

              <div className="row">
                <button className={`chip ${mode==="login" ? "is-on":""}`} onClick={()=>setMode("login")}>로그인</button>
                <button className={`chip ${mode==="signup" ? "is-on":""}`} onClick={()=>setMode("signup")}>회원가입</button>
              </div>

              {err && <div className="error">{err}</div>}
              <div>
              <h2 className="h3">  </h2>
              <p className="muted">  </p>
            </div>
              <PrimaryButton disabled={loading} onClick={submit}>
                {loading ? "처리 중..." : "계속하기"}
              </PrimaryButton>

              
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
