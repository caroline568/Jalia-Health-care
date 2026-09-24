import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { PlusIcon } from "../components/Icons";
import { AddRecipientSheet } from "./Home";

export default function People() {
  const [recipients, setRecipients] = useState(null);
  const [addingTo, setAddingTo] = useState(null);
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await api.get("/care-recipients");
    setRecipients(data.careRecipients);
  }

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">Your care network</div>
        <h1>People</h1>
      </div>

      {recipients === null && <div className="loading-row"><span className="spinner" /> Loading…</div>}

      {recipients?.map((r) => (
        <div key={r.id} className="recipient-card" style={{ marginBottom: "var(--space-4)" }}>
          <div className="recipient-card-top">
            <h3 style={{ cursor: "pointer" }} onClick={() => navigate(`/app/care/${r.id}`)}>{r.name}</h3>
            <span className="text-sm text-faint">{r.network?.length || 0} {r.network?.length === 1 ? "person" : "people"}</span>
          </div>

          <div className="recipient-card-divider" />

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {r.network?.map((m) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <div className="avatar" style={{ background: "var(--primary)" }}>{m.name?.[0]?.toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {m.name}
                    {m.isOwner && <span className="chip chip-primary">Owner</span>}
                    {!m.userId && <span className="chip chip-neutral">Not on Jalia</span>}
                  </div>
                  <div className="text-muted text-sm">{m.role}</div>
                </div>
              </div>
            ))}
          </div>

          {addingTo === r.id ? (
            <AddMemberForm recipientId={r.id} onDone={() => { setAddingTo(null); load(); }} />
          ) : (
            <button className="btn btn-ghost btn-sm" style={{ marginTop: "var(--space-4)" }} onClick={() => setAddingTo(r.id)}>
              <PlusIcon width={14} height={14} /> Add person
            </button>
          )}
        </div>
      ))}

      <button className="btn btn-secondary" onClick={() => setShowAddRecipient(true)}>
        <PlusIcon width={16} height={16} /> Add a loved one
      </button>

      {showAddRecipient && (
        <AddRecipientSheet onClose={() => setShowAddRecipient(false)} onCreated={(r) => { setShowAddRecipient(false); navigate(`/app/care/${r.id}`); }} />
      )}
    </div>
  );
}

function AddMemberForm({ recipientId, onDone }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post(`/care-recipients/${recipientId}/network`, { name, role, email });
      onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--border)" }}>
      <div className="field"><label>Name</label><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Brian" /></div>
      <div className="field"><label>Role</label><input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Weekend support" /></div>
      <div className="field"><label>Gmail (optional, links their account)</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="they@gmail.com" /></div>
      {error && <div className="banner banner-error" style={{ marginBottom: "var(--space-3)" }}>{error}</div>}
      <button className="btn btn-primary btn-sm" disabled={busy} type="submit">{busy ? <span className="spinner" /> : "Add to care team"}</button>
    </form>
  );
}