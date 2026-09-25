import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useOnlineStatus } from "../lib/useOnlineStatus";
import { HomeIcon, PeopleIcon, SettingsIcon, SunIcon, MoonIcon, CloudOffIcon } from "./Icons";

const NAV_ITEMS = [
  { to: "/app", label: "Home", icon: HomeIcon, end: true },
  { to: "/app/people", label: "People", icon: PeopleIcon },
  { to: "/app/settings", label: "Settings", icon: SettingsIcon },
];

export default function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const online = useOnlineStatus();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      {!online && <div className="offline-banner">You're offline — Jalia will keep working and sync when you're back.</div>}

      <header className="topbar">
        <button className="topbar-brand" style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => navigate("/app")}>
          <span className="topbar-mark">J</span>
          Jalia
        </button>
        <div className="topbar-actions">
          {!online && <CloudOffIcon width={18} height={18} style={{ color: "var(--warning)" }} />}
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
            {theme === "light" ? <MoonIcon width={18} height={18} /> : <SunIcon width={18} height={18} />}
          </button>
          {user && (
            <div className="avatar" style={{ background: user.avatarColor }} title={user.name}>
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </header>

      <div className="with-rail">
        <nav className="desktop-rail" aria-label="Primary">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `rail-item${isActive ? " active" : ""}`}>
              <Icon width={19} height={19} /> {label}
            </NavLink>
          ))}
        </nav>

        <main className="app-main">
          <Outlet />
        </main>
      </div>

      <nav className="tabbar" aria-label="Primary">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `tabbar-item${isActive ? " active" : ""}`}>
            <Icon width={22} height={22} /> {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
