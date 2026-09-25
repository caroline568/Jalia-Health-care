import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatWhen } from "../lib/eventMeta";
import {
  PlusIcon, CheckIcon, MicIcon, CameraIcon, UploadIcon,
  CompassIcon, PouchIcon, PulseIcon, HandoffIcon,
} from "../components/Icons";
import CaptureSheet from "../components/CaptureSheet";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState(null);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [captureMethod, setCaptureMethod] = useState(null); // "voice" | "photo" | "upload" | null

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const data = await api.get("/care-recipients");
      setRecipients(data.careRecipients);
    } catch (err) {
      setError(err.message);
    }
  }

  const firstName = user?.name?.split(" ")[0];
  // The person who most needs attention right now anchors the quick-capture
  // block and the pillar shortcuts below — mirrors the single-care-space
  // focus of the design while still listing everyone above it.
  const featured = recipients?.find((r) => r.needsAttention) || recipients?.[0] || null;

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">Jalia</div>
        <h1>{greeting()}, {firstName}</h1>
        <p className="text-muted" style={{ marginTop: 4 }}>Who needs your attention?</p>
      </div>

      {error && <div className="banner banner-error">{error}</div>}

      {recipients === null && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {[0, 1].map((i) => <div key={i} className="skeleton" style={{ height: 120 }} />)}
        </div>
      )}

      {recipients?.length === 0 && (
        <div className="empty-state card">
          <h3>Add the first person you're caring for</h3>
          <p>Once you add a loved one, you can start capturing what's happening in seconds — no forms required.</p>
          <button className="btn btn-primary" style={{ marginTop: "var(--space-4)" }} onClick={() => setShowAdd(true)}>
            <PlusIcon width={16} height={16} /> Add a loved one
          </button>
        </div>
      )}

      {recipients?.map((r) => <RecipientCard key={r.id} recipient={r} />)}

      {recipients?.length > 0 && (
        <button className="btn btn-secondary" style={{ marginBottom: "var(--space-5)" }} onClick={() => setShowAdd(true)}>
          <PlusIcon width={16} height={16} /> Add a loved one
        </button>
      )}

      {featured && (
        <>
          <div className="capture-cta">
            <h2>What happened?</h2>
            <p>Capture it without filling a form.</p>
            <div className="capture-cta-actions">
              <button className="capture-cta-btn" onClick={() => setCaptureMethod("voice")}>
                <MicIcon width={16} height={16} /> Speak
              </button>
              <button className="capture-cta-btn" onClick={() => setCaptureMethod("photo")}>
                <CameraIcon width={16} height={16} /> Snap
              </button>
              <button className="capture-cta-btn" onClick={() => setCaptureMethod("upload")}>
                <UploadIcon width={16} height={16} /> Upload
              </button>
            </div>
          </div>

          <nav className="pillar-nav" aria-label={`${featured.name}'s care flow`}>
            {featured.needsAttention ? (
              <Link to={`/app/care/${featured.id}/appointments/${featured.needsAttention.id}`}>
                <CompassIcon width={16} height={16} /> Navigate
              </Link>
            ) : (
              <Link to={`/app/care/${featured.id}`}>
                <CompassIcon width={16} height={16} /> Navigate
              </Link>
            )}
            <button type="button" onClick={() => setCaptureMethod("choose")}>
              <PouchIcon width={16} height={16} /> Carry
            </button>
            <Link to={`/app/care/${featured.id}/activity`}>
              <PulseIcon width={16} height={16} /> Coordinate
            </Link>
            <Link to={`/app/care/${featured.id}/handoff`}>
              <HandoffIcon width={16} height={16} /> Handoff
            </Link>
          </nav>
        </>
      )}

      {showAdd && (
        <AddRecipientSheet
          onClose={() => setShowAdd(false)}
          onCreated={(r) => { setShowAdd(false); navigate(`/app/care/${r.id}`); }}
        />
      )}

      {captureMethod && featured && (
        <CaptureSheet
          careRecipientId={featured.id}
          initialMethod={captureMethod === "choose" ? undefined : captureMethod}
          onClose={() => setCaptureMethod(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}

function RecipientCard({ recipient: r }) {
  return (
    <>
      <Link to={`/app/care/${r.id}`} className="recipient-card">
        <div className="recipient-card-top">
          <h3>{r.name}</h3>
          <span className="text-sm text-faint">Care space</span>
        </div>

        {(r.needsAttention || (!r.needsAttention && r.recent)) && <div className="recipient-card-divider" />}

        {r.needsAttention ? (
          <div className="recipient-card-section attention">
            <div className="eyebrow">Needs attention</div>
            <h4>{r.needsAttention.title}</h4>
            <p className="text-sm text-muted">
              {formatWhen(r.needsAttention.occurredAt)}
              {r.needsAttention.details?.location && ` · ${r.needsAttention.details.location}`}
            </p>
            {r.needsAttention.details?.escort && (
              <p className="text-sm text-muted">{r.needsAttention.details.escort} is taking {r.name}</p>
            )}
          </div>
        ) : r.recent ? (
          <div className="recipient-card-section recent">
            <div className="eyebrow">Recent care</div>
            <h4>{r.recent.title}</h4>
            {r.recent.summary && <p className="text-sm text-muted">{r.recent.summary}</p>}
          </div>
        ) : (
          <p className="text-sm text-faint">No recent activity</p>
        )}

        {r.next && (
          <p className="text-sm text-muted" style={{ marginTop: "var(--space-3)", display: "flex", alignItems: "center", gap: 5 }}>
            <CheckIcon width={13} height={13} /> Next: {r.next.title}
          </p>
        )}
      </Link>

      {/* When there's both an upcoming appointment and separate recent care,
          show recent care as its own quieter card, same as the design. */}
      {r.needsAttention && r.recent && (
        <div className="recent-care-card">
          <div className="eyebrow">Recent care</div>
          <h4>{r.recent.title}</h4>
          {r.recent.summary && <p className="text-sm text-muted">{r.recent.summary}</p>}
        </div>
      )}
    </>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function AddRecipientSheet({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api.post("/care-recipients", { name, relationshipLabel: relationship });
      onCreated(data.careRecipient);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sheet-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <h2 style={{ marginBottom: "var(--space-4)" }}>Add a loved one</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="rname">Their name</label>
            <input id="rname" required autoFocus placeholder="e.g. Mum, Wanjiru, Dad" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="rrel">How you refer to them (optional)</label>
            <input id="rrel" placeholder="e.g. Mum" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
          </div>
          {error && <div className="banner banner-error" style={{ marginBottom: "var(--space-4)" }}>{error}</div>}
          <button className="btn btn-primary btn-block" disabled={busy} type="submit">
            {busy ? <span className="spinner" /> : "Create care space"}
          </button>
        </form>
      </div>
    </div>
  );
}
