import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../lib/api";
import EventCard from "../components/EventCard";
import { SparkleIcon, CheckIcon, HandoffIcon } from "../components/Icons";
import { formatWhen } from "../lib/eventMeta";

export default function HandoffTab() {
  const { recipient } = useOutletContext();
  const [step, setStep] = useState("idle"); // idle | loading | review | shared
  const [preview, setPreview] = useState(null);
  const [recipientName, setRecipientName] = useState("");
  const [excluded, setExcluded] = useState(new Set());
  const [past, setPast] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { loadPast(); }, []);

  async function loadPast() {
    try {
      const data = await api.get(`/care-recipients/${recipient.id}/handoffs`);
      setPast(data.handoffs);
    } catch { /* ignore */ }
  }

  async function generate() {
    setStep("loading");
    setError("");
    try {
      const data = await api.get(`/care-recipients/${recipient.id}/handoff/preview?days=7`);
      setPreview(data.preview);
      setExcluded(new Set());
      setStep("review");
    } catch (err) {
      setError(err.message);
      setStep("idle");
    }
  }

  function toggle(id) {
    setExcluded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function share() {
    setError("");
    try {
      const filteredContent = {
        ...preview,
        recent: preview.recent.filter((e) => !excluded.has(e.id)),
      };
      await api.post(`/care-recipients/${recipient.id}/handoffs`, {
        recipientName,
        content: filteredContent,
        edited: excluded.size > 0,
        shared: true,
      });
      setStep("shared");
      loadPast();
    } catch (err) {
      setError(err.message);
    }
  }

  if (step === "idle") {
    return (
      <div>
        <h2 style={{ marginBottom: "var(--space-3)" }}>Help someone take over</h2>
        <p className="text-muted" style={{ marginBottom: "var(--space-5)", maxWidth: 480 }}>
          Jalia can put together a concise catch-up — what happened recently, what changed,
          what's outstanding and what's coming up — so the next caregiver doesn't have to
          read the whole history or call and ask "so what happened?"
        </p>
        <button className="btn btn-primary" onClick={generate}>
          <SparkleIcon width={17} height={17} /> Create Catch Me Up
        </button>

        {error && <div className="banner banner-error" style={{ marginTop: "var(--space-4)" }}>{error}</div>}

        {past?.length > 0 && (
          <div style={{ marginTop: "var(--space-7)" }}>
            <h3 style={{ marginBottom: "var(--space-3)" }}>Past handoffs</h3>
            {past.map((h) => (
              <div key={h.id} className="card" style={{ marginBottom: "var(--space-3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{h.recipientName ? `To ${h.recipientName}` : "Catch Me Up"}</strong>
                  <span className="text-faint text-sm">{formatWhen(h.createdAt)}</span>
                </div>
                <p className="text-muted text-sm" style={{ marginTop: 4 }}>
                  {h.content?.recent?.length || 0} updates · {h.content?.outstanding?.length || 0} outstanding
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step === "loading") {
    return <div className="loading-row"><span className="spinner" /> Putting together the catch-up…</div>;
  }

  if (step === "review" && preview) {
    return (
      <div>
        <h2 style={{ marginBottom: "var(--space-2)" }}>Catch Me Up</h2>
        <p className="text-muted text-sm" style={{ marginBottom: "var(--space-5)" }}>
          AI-generated from the last {preview.windowDays} days. Review before sharing — remove anything
          that shouldn't be included.
        </p>

        <div className="field" style={{ maxWidth: 360 }}>
          <label>Who's taking over? (optional)</label>
          <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="e.g. Brian" />
        </div>

        {preview.needsAttention?.length > 0 && (
          <div className="banner banner-info" style={{ marginBottom: "var(--space-5)" }}>
            {preview.needsAttention.length} item(s) in this window still need confirming before they're treated as fact.
          </div>
        )}

        <Section title="Upcoming care" items={preview.upcoming} excluded={excluded} onToggle={toggle} />
        <Section title="What changed" items={preview.changed} excluded={excluded} onToggle={toggle} />
        <Section title="Outstanding" items={preview.outstanding} excluded={excluded} onToggle={toggle} />
        <Section title="Recent activity" items={preview.recent} excluded={excluded} onToggle={toggle} />

        {error && <div className="banner banner-error" style={{ marginBottom: "var(--space-4)" }}>{error}</div>}

        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-5)" }}>
          <button className="btn btn-secondary" onClick={() => setStep("idle")}>Cancel</button>
          <button className="btn btn-primary" onClick={share}>
            <HandoffIcon width={16} height={16} /> Share this handoff
          </button>
        </div>
      </div>
    );
  }

  if (step === "shared") {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-7) 0" }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%", background: "var(--success-tint)", color: "var(--success)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-4)",
        }}>
          <CheckIcon width={28} height={28} />
        </div>
        <h2>Handoff ready</h2>
        <p className="text-muted" style={{ marginTop: "var(--space-2)" }}>
          {recipientName ? `${recipientName} can` : "The next caregiver can"} open Jalia and see exactly
          what they need to take over — no need to reconstruct it from memory.
        </p>
        <button className="btn btn-primary" style={{ marginTop: "var(--space-5)" }} onClick={() => setStep("idle")}>Done</button>
      </div>
    );
  }

  return null;
}

function Section({ title, items, excluded, onToggle }) {
  if (!items || items.length === 0) return null;
  return (
    <section style={{ marginBottom: "var(--space-5)" }}>
      <h3 style={{ marginBottom: "var(--space-3)" }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {items.map((e) => (
          <div key={e.id} style={{ opacity: excluded.has(e.id) ? 0.45 : 1 }}>
            <EventCard event={e} compact />
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 4 }} onClick={() => onToggle(e.id)}>
              {excluded.has(e.id) ? "Include again" : "Leave out"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
