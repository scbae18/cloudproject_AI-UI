import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Landing from "../pages/Landing.jsx";
import Auth from "../pages/Auth.jsx";
import MyProjects from "../pages/MyProjects.jsx";
import AllProjects from "../pages/AllProjects.jsx";
import Upload from "../pages/Upload.jsx";
import Result from "../pages/Result.jsx";
import MyPage from "../pages/MyPage.jsx";
import Settings from "../pages/Settings.jsx";
import NotFound from "../pages/NotFound.jsx";
import { getSession } from "../lib/storage.js";

function RequireAuth({ children }) {
  const location = useLocation();
  const session = getSession();
  if (!session?.user) return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  return children;
}

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />

      <Route
        path="/my-projects"
        element={
          <RequireAuth>
            <MyProjects />
          </RequireAuth>
        }
      />
      <Route
        path="/projects"
        element={
          <RequireAuth>
            <AllProjects />
          </RequireAuth>
        }
      />
      <Route
        path="/upload"
        element={
          <RequireAuth>
            <Upload />
          </RequireAuth>
        }
      />
      <Route
        path="/result"
        element={
          <RequireAuth>
            <Result />
          </RequireAuth>
        }
      />
      <Route
        path="/my-page"
        element={
          <RequireAuth>
            <MyPage />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
