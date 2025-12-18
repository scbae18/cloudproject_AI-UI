import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { logout } from "../lib/mockApi.js";

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" };
  switch (name) {
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path
            d="M21 14.5A7.5 7.5 0 0 1 9.5 3a6.5 6.5 0 1 0 11.5 11.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

function getInitialTheme() {
  const saved = localStorage.getItem("ui_ai_theme");
  if (saved === "light" || saved === "dark") return saved;
  // 시스템 테마 따라가기 (기본)
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("ui_ai_theme", theme);
}

export default function TopNav({ variant = "full" }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const items = useMemo(
    () => [
      { to: "/my-projects", label: "My Projects" },
      { to: "/projects", label: "All Projects" },
      { to: "/upload", label: "Upload" },
      { to: "/my-page", label: "My Page" },
      { to: "/settings", label: "Settings" },
    ],
    []
  );

  useEffect(() => {
    const t = getInitialTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  const onLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const onBrandClick = () => {
    setOpen(false);
  };

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Link to="/" className="brand" onClick={onBrandClick} aria-label="UI&AI Home">
          <span className="brand__mark">UI&amp;AI</span>
          <span className="badge badge--soft">Beta</span>
        </Link>

        {variant === "full" ? (
          <>
            <nav className="nav" aria-label="Primary">
              {items.map((it) => (
                <NavLink key={it.to} to={it.to} className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}>
                  {it.label}
                </NavLink>
              ))}
            </nav>

            <div className="topbar__actions">
              <button className="iconBtn" onClick={toggleTheme} title={theme === "dark" ? "라이트 모드" : "다크 모드"}>
                <Icon name={theme === "dark" ? "sun" : "moon"} />
              </button>

              <button className="btn btn--ghost" onClick={onLogout}>
                Logout
              </button>

              <button className="iconBtn iconBtn--mobile" onClick={() => setOpen(true)} aria-label="Open menu">
                <Icon name="menu" />
              </button>
            </div>
          </>
        ) : (
          <>
            <nav className="nav nav--landing" aria-label="Landing">
              <a className="nav__link" href="#features">
                Features
              </a>
              <a className="nav__link" href="#how">
                How it works
              </a>
              <a className="nav__link" href="#pricing">
                Pricing
              </a>
            </nav>

            <div className="topbar__actions">
              <button className="iconBtn" onClick={toggleTheme} title={theme === "dark" ? "라이트 모드" : "다크 모드"}>
                <Icon name={theme === "dark" ? "sun" : "moon"} />
              </button>
              <button className="iconBtn iconBtn--mobile" onClick={() => setOpen(true)} aria-label="Open menu">
                <Icon name="menu" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="drawerOverlay" role="dialog" aria-modal="true" onMouseDown={() => setOpen(false)}>
          <div className="drawer" onMouseDown={(e) => e.stopPropagation()}>
            <div className="drawer__head">
              <div className="drawer__title">Menu</div>
              <button className="iconBtn" onClick={() => setOpen(false)} aria-label="Close menu">
                <Icon name="close" />
              </button>
            </div>

            <div className="drawer__body">
              {variant === "full" ? (
                <div className="drawer__links">
                  {items.map((it) => (
                    <NavLink
                      key={it.to}
                      to={it.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => `drawerLink ${isActive ? "is-active" : ""}`}
                    >
                      {it.label}
                    </NavLink>
                  ))}
                </div>
              ) : (
                <div className="drawer__links">
                  <a className="drawerLink" href="#features" onClick={() => setOpen(false)}>
                    Features
                  </a>
                  <a className="drawerLink" href="#how" onClick={() => setOpen(false)}>
                    How it works
                  </a>
                  <a className="drawerLink" href="#pricing" onClick={() => setOpen(false)}>
                    Pricing
                  </a>
                  <Link className="drawerLink" to="/auth" onClick={() => setOpen(false)}>
                    Get started
                  </Link>
                </div>
              )}
            </div>

            {variant === "full" && (
              <div className="drawer__foot">
                <button className="btn btn--outline" onClick={toggleTheme}>
                  {theme === "dark" ? "라이트 모드" : "다크 모드"}
                </button>
                <button className="btn btn--primary" onClick={onLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
