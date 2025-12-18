import { Link } from "react-router-dom";
import TopNav from "../components/TopNav.jsx";

export default function NotFound() {
  return (
    <div>
      <TopNav variant="landing" />
      <div className="container" style={{ paddingTop: 70, paddingBottom: 80 }}>
        <div className="notFound">
          <div className="notFound__art" />
          <div>
            <h1 className="h1">404</h1>
            <p className="muted" style={{ marginTop: 8 }}>
              페이지를 찾을 수 없습니다. 링크가 잘못되었거나, 이동된 페이지일 수 있어요.
            </p>
            <div className="row" style={{ marginTop: 16, flexWrap: "wrap" }}>
              <Link to="/" className="btn btn--primary" style={{ display: "inline-flex" }}>
                홈으로
              </Link>
              <Link to="/my-projects" className="btn btn--outline" style={{ display: "inline-flex" }}>
                내 프로젝트
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
