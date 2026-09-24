import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { SunIcon, MoonIcon, LogoutIcon } from "../components/Icons";

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">Your account</div>
        <h1>Settings</h1>
      </div>

      <div className="card" style={{ marginBottom: "var(--space-4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div className="avatar" style={{ width: 52, height: 52, fontSize: "1.2rem", background: user?.avatarColor }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3>{user?.name}</h3>
            <p className="text-muted text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "var(--space-4)" }}>
        <h3 style={{ marginBottom: "var(--space-3)" }}>Appearance</h3>
        <div className="segmented">
          <button className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")}>
            <SunIcon width={15} height={15} style={{ verticalAlign: "-2px", marginRight: 5 }} /> Light
          </button>
          <button className={theme === "dark" ? "active" : ""} onClick={() => setTheme("dark")}>
            <MoonIcon width={15} height={15} style={{ verticalAlign: "-2px", marginRight: 5 }} /> Dark
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "var(--space-2)" }}>About Jalia</h3>
        <p className="text-muted text-sm">
          Healthcare is complicated enough. Caring for someone shouldn't be. Jalia helps your family
          navigate and coordinate a loved one's care in one place — installable as an app, and built
          to keep working even with a poor connection.
        </p>
      </div>

      <button className="btn btn-danger" style={{ marginTop: "var(--space-5)" }} onClick={handleLogout}>
        <LogoutIcon width={16} height={16} /> Sign out
      </button>
    </div>
  );
}
