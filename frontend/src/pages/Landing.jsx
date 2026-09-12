import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useReveal } from "../lib/useReveal";
import "../styles/landing.css";
import {
  CompassIcon, PouchIcon, PulseIcon, HandoffIcon, MicIcon, CameraIcon, ScreenshotIcon,
  UploadIcon, TypeIcon, ChevronRight, ChevronLeft, SunIcon, MoonIcon, CheckIcon, CalendarIcon,
} from "../components/Icons";

const EXPERIENCES = [
  { n: "01", icon: CompassIcon, title: "Navigate", tag: "Get through the care journey.",
    body: "Where to go, when, why, and who's taking them — with prep, directions, and a place to record what happened after." },
  { n: "02", icon: PouchIcon, title: "Carry", tag: "Keep what matters with you.",
    body: "Prescriptions, results, referrals and instructions, always at hand — captured, not typed from scratch." },
  { n: "03", icon: PulseIcon, title: "Coordinate", tag: "Keep everyone on the same page.",
    body: "One care story the whole family can see — what happened, what changed, what's next, who's handling it." },
  { n: "04", icon: HandoffIcon, title: "Handoff", tag: "Make taking over effortless.",
    body: "A concise catch-up for whoever's stepping in next — no more calling to ask 'so what happened?'" },
];

// The hero rotates through these — different angles, same underlying promise:
// families shouldn't have to reconstruct a loved one's care from memory.
const HERO_SLIDES = [
  {
    eyebrow: "NAVIGATE",
    title: <>Know where to go<br />before you <em>walk out the door.</em></>,
    sub: "Appointments, directions, and what to ask — ready before you leave, not figured out in the waiting room.",
    icon: CompassIcon,
    accent: { blob1: "var(--primary-tint)", blob2: "var(--info-tint)" },
  },
  {
    eyebrow: "CARRY",
    title: <>Capture what happened<br /><em>in seconds, not forms.</em></>,
    sub: "A voice note or a photo is enough. Jalia does the organizing — you just confirm it.",
    icon: PouchIcon,
    accent: { blob1: "var(--accent-tint)", blob2: "var(--primary-tint)" },
  },
  {
    eyebrow: "COORDINATE",
    title: <>One story,<br /><em>not five WhatsApp threads.</em></>,
    sub: "Everyone in the family sees what changed, what's next, and who's handling it — automatically.",
    icon: PulseIcon,
    accent: { blob1: "var(--info-tint)", blob2: "var(--accent-tint)" },
  },
  {
    eyebrow: "HANDOFF",
    title: <>Taking over?<br /><em>Never start from zero.</em></>,
    sub: "A clear catch-up for whoever steps in next — no more calling to ask 'so what happened?'",
    icon: HandoffIcon,
    accent: { blob1: "var(--success-tint)", blob2: "var(--primary-tint)" },
  },
];

const CAPTURE_STEPS = [
  { icon: MicIcon, label: "Speak" },
  { icon: CameraIcon, label: "Snap" },
  { icon: ScreenshotIcon, label: "Screenshot" },
  { icon: UploadIcon, label: "Upload" },
  { icon: TypeIcon, label: "Type" },
];

export default function Landing() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearTimeout(timer);
  }, [slide]);

  const active = HERO_SLIDES[slide];
  const goTo = (i) => setSlide((i + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="landing">
      <nav className={`landing-nav${scrolled ? " scrolled" : ""}`}>
        <div className="landing-nav-inner">
          <Link to="/" className="landing-brand" aria-label="Jalia home">
            <span className="topbar-mark">J</span>
            <span>Jalia</span>
          </Link>
          <div className="landing-nav-links">
            <a href="#experiences">How it works</a>
            <a href="#capture">Capture care</a>
            <a href="#family">For families</a>
          </div>
          <div className="landing-nav-actions">
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
              {theme === "light" ? <MoonIcon width={17} height={17} /> : <SunIcon width={17} height={17} />}
            </button>
            {user ? (
              <Link to="/app" className="btn btn-primary btn-sm">Go to care spaces</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm landing-signin">Sign in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-blob b1" style={{ background: active.accent.blob1 }} />
        <div className="hero-blob b2" style={{ background: active.accent.blob2 }} />
        <div className="hero-decor-icon" key={`icon-${slide}`}>
          <active.icon width="100%" height="100%" style={{ color: "var(--primary-strong)" }} />
        </div>

        <div className="hero-copy">
          <div key={slide} className="hero-slide hero-slide-enter">
            <div className="hero-eyebrow">{active.eyebrow}</div>
            <h1 className="hero-title">{active.title}</h1>
            <p className="hero-sub">{active.sub}</p>
          </div>

          <div className="hero-ctas">
            <Link to={user ? "/app" : "/register"} className="btn btn-primary">
              {user ? "Go to your care spaces" : "Get started free"} <ChevronRight width={16} height={16} />
            </Link>
            <a href="#experiences" className="btn btn-secondary">See how it works</a>
          </div>

          <div className="hero-controls">
            <span className="hero-counter">{String(slide + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}</span>
            <div className="hero-dots">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`hero-dot${i === slide ? " active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Show ${HERO_SLIDES[i].eyebrow.toLowerCase()} slide`}
                  aria-current={i === slide}
                />
              ))}
            </div>
            <div className="hero-arrows">
              <button className="hero-arrow-btn" onClick={() => goTo(slide - 1)} aria-label="Previous">
                <ChevronLeft width={16} height={16} />
              </button>
              <button className="hero-arrow-btn" onClick={() => goTo(slide + 1)} aria-label="Next">
                <ChevronRight width={16} height={16} />
              </button>
            </div>
          </div>

          <div className="hero-microtrust">
            <div><strong>4</strong>focused experiences</div>
            <div><strong>0</strong>forms to fill by default</div>
            <div><strong>Works</strong>offline, syncs later</div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="mock-card main">
            <div className="mock-row"><div className="mock-dot">M</div>
              <div style={{ flex: 1 }}>
                <div className="mock-bar" style={{ width: "58%", marginBottom: 6 }} />
                <div className="mock-bar" style={{ width: "38%", opacity: 0.6 }} />
              </div>
            </div>
            <div className="chip chip-primary mock-pulse" style={{ marginTop: 10 }}>
              <CalendarIcon width={11} height={11} /> Appointment tomorrow
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="mock-bar" style={{ width: "92%" }} />
              <div className="mock-bar" style={{ width: "80%" }} />
              <div className="mock-bar" style={{ width: "64%" }} />
            </div>
          </div>
          <div className="mock-card capture">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div className="mock-dot" style={{ background: "var(--accent-tint)", color: "var(--accent)" }}>
                <MicIcon width={16} height={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>Jalia found</span>
            </div>
            <div className="chip chip-success" style={{ marginBottom: 6 }}><CheckIcon width={10} height={10} /> Medication changed</div>
            <div className="chip chip-warning"><CheckIcon width={10} height={10} /> Follow-up Tuesday</div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="experiences">
        <RevealTitle
          eyebrow="The whole product"
          title="Four experiences. Nothing to get lost in."
          sub="No dashboards, no feature sprawl — just what a family actually needs to get through care together."
        />
        <div className="experience-grid">
          {EXPERIENCES.map((e, i) => (
            <RevealCard key={e.title} delay={(i % 4) + 1}>
              <div className="experience-card">
                <div className="experience-num">{e.n}</div>
                <div className="experience-icon"><e.icon width={22} height={22} /></div>
                <h3>{e.title}</h3>
                <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>{e.tag}</p>
                <p>{e.body}</p>
              </div>
            </RevealCard>
          ))}
        </div>
      </section>

      <section className="landing-section" id="capture">
        <RevealTitle
          eyebrow="Capture-first"
          title="Don't type your care. Capture it."
          sub="Speak, snap, screenshot or upload — Jalia does the organizing, and you confirm before anything's added."
        />
        <RevealCard delay={2}>
          <div className="capture-flow">
            {CAPTURE_STEPS.map((s, i) => (
              <span key={s.label} style={{ display: "contents" }}>
                <div className="capture-flow-step">
                  <div className="capture-flow-icon"><s.icon width={22} height={22} /></div>
                  <span>{s.label}</span>
                </div>
                {i < CAPTURE_STEPS.length - 1 && (
                  <span className="capture-flow-arrow"><ChevronRight width={20} height={20} /></span>
                )}
              </span>
            ))}
          </div>
        </RevealCard>
      </section>

      <section className="landing-section" id="family">
        <RevealTitle
          eyebrow="See it in action"
          title="One place the whole family understands"
          sub="A single care story — who did what, what changed, and what's next — instead of five WhatsApp threads."
        />
        <RevealCard delay={1}>
          <div className="showcase">
            <div className="showcase-frame">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div className="recipient-photo" style={{ width: 44, height: 44, fontSize: "1.1rem" }}>M</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Mum</div>
                  <div className="text-faint text-sm">Care space</div>
                </div>
              </div>
              <div className="chip chip-primary" style={{ marginBottom: 10 }}><CalendarIcon width={11} height={11} /> Cardiology · Tomorrow, 10:30 AM</div>
              <div className="text-sm text-muted" style={{ marginBottom: 14 }}>Caroline is taking Mum · Nairobi Hospital</div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                <TimelineRow chip="chip-accent" label="Medication changed" meta="Added by Caroline · voice note" />
                <TimelineRow chip="chip-warning" label="Dizziness reported" meta="Needs confirmation" />
                <TimelineRow chip="chip-success" label="Lab result uploaded" meta="Added by Caroline · document" />
              </div>
            </div>
          </div>
        </RevealCard>
      </section>

      <section className="landing-section">
        <RevealCard delay={1}>
          <div className="cta-band">
            <h2>Start coordinating care today</h2>
            <p>Free to start. Add the first person you're caring for in under a minute.</p>
            <Link to={user ? "/app" : "/register"} className="btn btn-primary" style={{ marginTop: "var(--space-5)" }}>
              {user ? "Go to your care spaces" : "Get started free"}
            </Link>
          </div>
        </RevealCard>
      </section>

      <footer className="landing-footer">
        Jalia Healthcare — a simpler way for families to navigate and coordinate a loved one's care.
      </footer>
    </div>
  );
}

function RevealTitle({ eyebrow, title, sub }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal${visible ? " visible" : ""}`}>
      <div className="section-eyebrow">{eyebrow}</div>
      <div className="section-title">
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
    </div>
  );
}

function RevealCard({ children, delay = 1 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal delay-${delay}${visible ? " visible" : ""}`}>
      {children}
    </div>
  );
}

function TimelineRow({ chip, label, meta }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
      <span className={`chip ${chip}`}>{label}</span>
      <span className="text-faint text-sm">{meta}</span>
    </div>
  );
}
