import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { formatWhen } from "../lib/eventMeta";
import { PlusIcon, ChevronRight, CalendarIcon, CheckIcon } from "../components/Icons";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState(null);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

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

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">{greeting()}, {firstName}</div>
        <h1>Who needs your attention</h1>
      </div>

      {error && <div className="banner banner-error">{error}</div>}

      {recipients === null && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {[0, 1].map((i) => <div key={i} className="skeleton" style={{ height: 88 }} />)}
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

      {recipients?.map((r) => (
        <Link key={r.id} to={`/app/care/${r.id}`} className="recipient-tile">
          <div className="recipient-photo">{r.name?.[0]?.toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3>{r.name}</h3>
            {r.needsAttention ? (
              <p className="text-sm" style={{ color: "var(--primary-strong)", marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>
                <CalendarIcon width={14} height={14} /> {r.needsAttention.title} · {formatWhen(r.needsAttention.occurredAt)}
              </p>
            ) : r.recent ? (
              <p className="text-sm text-muted" style={{ marginTop: 3 }}>Recent: {r.recent.title}</p>
            ) : (
              <p className="text-sm text-faint" style={{ marginTop: 3 }}>No recent activity</p>
            )}
            {r.next && (
              <p className="text-sm text-muted" style={{ marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>
                <CheckIcon width={13} height={13} /> Next: {r.next.title}
              </p>
            )}
            {r.network?.length > 0 && (
              <p className="text-faint text-sm" style={{ marginTop: 3 }}>
                {r.network.length} {r.network.length === 1 ? "person" : "people"} involved
              </p>
            )}
          </div>
          <ChevronRight width={20} height={20} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
        </Link>
      ))}

      {recipients?.length > 0 && (
        <button className="btn btn-secondary" onClick={() => setShowAdd(true)}>
          <PlusIcon width={16} height={16} /> Add a loved one
        </button>
      )}

      {showAdd && (
        <AddRecipientSheet
          onClose={() => setShowAdd(false)}
          onCreated={(r) => { setShowAdd(false); navigate(`/app/care/${r.id}`); }}
        />
      )}
    </div>
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
