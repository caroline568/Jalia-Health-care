import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, MoonIcon, SunIcon, CheckIcon } from "../components/Icons";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
      await register(name, email, password);
      navigate("/app");
    } catch (err) {
      setError(err.message || "Couldn't create your account.");
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
          <Link to="/login" className="auth-nav-link">Sign in</Link>
        </div>
      </header>

      <main className="auth-layout auth-layout-register">
        <section className="auth-story" aria-label="About Jalia">
          <div className="auth-story-glow" />
          <div className="auth-story-inner">
            <span className="auth-kicker">A CALMER WAY TO CARE</span>
            <h1>Everything your family needs to <em>stay in sync.</em></h1>
            <p>Create one shared place for the person you're caring for — from the next appointment to the latest update and the handoff to the next caregiver.</p>
            <div className="auth-proof-list">
              <div><span><CheckIcon width={14} height={14} /></span> Navigate care without the guesswork</div>
              <div><span><CheckIcon width={14} height={14} /></span> Keep important information together</div>
              <div><span><CheckIcon width={14} height={14} /></span> Make family coordination easier</div>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-card-premium">
            <div className="auth-card-heading">
              <span className="auth-mini-label">GET STARTED</span>
              <h2>Create your care space.</h2>
              <p>Set up your account, then add the first person you're caring for.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input id="name" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input id="email" type="email" required placeholder="you@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                <span className="field-hint">Jalia currently supports Gmail addresses only.</span>
              </div>
              <div className="field">
                <label htmlFor="password">Create a password</label>
                <div className="password-wrap">
                  <input id="password" type={showPassword ? "text" : "password"} required minLength={8} placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {error && <div className="banner banner-error" style={{ marginBottom: "var(--space-4)" }}>{error}</div>}
              <button className="btn btn-primary btn-block auth-submit" disabled={busy} type="submit">
                {busy ? <span className="spinner" /> : "Create my Jalia account"}
              </button>
            </form>

            <p className="auth-legal">By creating an account, you agree to use Jalia responsibly for coordinating care and keeping your family's information secure.</p>
            <div className="auth-divider"><span>already with Jalia?</span></div>
            <p className="auth-switch">Have an account? <Link to="/login">Sign in instead</Link></p>
            <Link to="/" className="auth-back"><ChevronLeft width={15} height={15} /> Back to Jalia</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
