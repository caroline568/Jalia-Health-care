import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppShell from "./components/AppShell";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import People from "./pages/People";
import Settings from "./pages/Settings";
import CareSpaceLayout from "./pages/CareSpaceLayout";
import OverviewTab from "./pages/OverviewTab";
import ActivityTab from "./pages/ActivityTab";
import HandoffTab from "./pages/HandoffTab";
import NavigateDetail from "./pages/NavigateDetail";
import PublicHandoff from "./pages/PublicHandoff";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="spinner" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/handoff/:token" element={<PublicHandoff />} />

      <Route path="/app/care/:id/appointments/:eventId" element={<ProtectedRoute><NavigateAppointmentWrap /></ProtectedRoute>} />

      <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="people" element={<People />} />
        <Route path="settings" element={<Settings />} />
        <Route path="care/:id" element={<CareSpaceLayout />}>
          <Route index element={<OverviewTab />} />
          <Route path="activity" element={<ActivityTab />} />
          <Route path="handoff" element={<HandoffTab />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Navigate detail renders full-screen within the same app shell styling but
// as its own route (outside the tabbed Care Space layout), reflecting that
// Navigate is a contextual experience, not a nav destination.
function NavigateAppointmentWrap() {
  return (
    <div className="app-shell">
      <div className="app-main" style={{ maxWidth: 720, margin: "0 auto" }}>
        <NavigateDetail />
      </div>
    </div>
  );
}