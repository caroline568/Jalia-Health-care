import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, MoonIcon, SunIcon, CheckIcon } from "../components/Icons";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      navigate("/app");
    } catch (err) {
      setError(err.message || "Couldn't sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-nav">
        <Link to="/" className="auth-brand" aria-label="Back to Jalia home">
          <span className="topbar-mark">J</span>
          <span>Jalia</span>
        </Link>
        <div className="auth-nav-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
            {theme === "light" ? <MoonIcon width={17} height={17} /> : <SunIcon width={17} height={17} />}
          </button>
          <Link to="/register" className="auth-nav-link">Create account</Link>
        </div>
      </header>

      <main className="auth-layout">
        <section className="auth-story" aria-label="About Jalia">
          <div className="auth-story-glow" />
          <div className="auth-story-inner">
            <span className="auth-kicker">JALIA HEALTHCARE</span>
            <h1>Care is a team sport. <em>Jalia keeps the team connected.</em></h1>
            <p>Bring appointments, updates, documents and handoffs into one calm place — so your family can focus on the person, not the paperwork.</p>
            <div className="auth-proof-list">
              <div><span><CheckIcon width={14} height={14} /></span> One shared care story</div>
              <div><span><CheckIcon width={14} height={14} /></span> Capture-first, less typing</div>
              <div><span><CheckIcon width={14} height={14} /></span> Designed around real family handoffs</div>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-card-premium">
            <div className="auth-card-heading">
              <span className="auth-mini-label">WELCOME BACK</span>
              <h2>Good to see you.</h2>
              <p>Sign in to pick up where your family left off.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input id="email" type="email" required placeholder="you@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <div className="field">
                <div className="field-label-row">
                  <label htmlFor="password">Password</label>
                </div>
                <div className="password-wrap">
                  <input id="password" type={showPassword ? "text" : "password"} required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {error && <div className="banner banner-error" style={{ marginBottom: "var(--space-4)" }}>{error}</div>}
              <button className="btn btn-primary btn-block auth-submit" disabled={busy} type="submit">
                {busy ? <span className="spinner" /> : "Sign in to Jalia"}
              </button>
            </form>

            <div className="auth-divider"><span>or</span></div>
            <p className="auth-switch">New to Jalia? <Link to="/register">Create your account</Link></p>
            <Link to="/" className="auth-back"><ChevronLeft width={15} height={15} /> Back to Jalia</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
