import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { formatWhen } from "../lib/eventMeta";
import { ChevronLeft, LocationIcon, CheckIcon, DocumentIcon, FlaskIcon } from "../components/Icons";
import CaptureSheet from "../components/CaptureSheet";

export default function NavigateDetail() {
  const { id, eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [showCapture, setShowCapture] = useState(false);
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => { load(); }, [eventId]);

  async function load() {
    try {
      const evData = await api.get(`/events/${eventId}`);
      setEvent(evData.event);
      setRecipient(evData.careRecipient);

      const [changes, docs] = await Promise.all([
        api.get(`/care-recipients/${id}/events?type=medication&limit=5`),
        api.get(`/care-recipients/${id}/events?type=document&limit=5`),
      ]);
      setRecentEvents(changes.events);
      setDocuments(docs.events);
    } catch (err) {
      setError(err.message);
    }
  }

  function addQuestion(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setQuestions((q) => [...q, question.trim()]);
    setQuestion("");
  }

  function openDirections() {
    const q = encodeURIComponent(event.details?.location || recipient?.name || "");
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank", "noopener");
  }

  if (error) return <div className="banner banner-error">{error}</div>;
  if (!event) return <div className="loading-row"><span className="spinner" /> Loading…</div>;

  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: "var(--space-3)", marginLeft: -10 }} onClick={() => navigate(`/app/care/${id}`)}>
        <ChevronLeft width={16} height={16} /> {recipient?.name}
      </button>

      <div className="page-header">
        <div className="eyebrow">{recipient?.name} — Navigate</div>
        <h1>{event.title}</h1>
        <p className="text-muted" style={{ marginTop: 6 }}>{formatWhen(event.occurredAt)}</p>
        {event.details?.location && <p className="text-sm" style={{ marginTop: 4 }}>📍 {event.details.location}</p>}
        {event.details?.escort && <p className="text-sm text-muted">{event.details.escort} is taking {recipient?.name}</p>}
      </div>

      <section className="card" style={{ marginBottom: "var(--space-4)" }}>
        <h2 style={{ marginBottom: "var(--space-4)" }}>Prepare</h2>

        <h3 className="text-sm" style={{ color: "var(--text-muted)", marginBottom: "var(--space-2)", fontFamily: "var(--font-body)" }}>Recent changes</h3>
        {recentEvents.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "var(--space-4)" }}>
            {recentEvents.map((e) => (
              <div key={e.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <FlaskIcon width={15} height={15} style={{ color: "var(--accent)", marginTop: 2, flexShrink: 0 }} />
                <span className="text-sm">{e.summary || e.title}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-faint" style={{ marginBottom: "var(--space-4)" }}>No recent medication changes.</p>}

        <h3 className="text-sm" style={{ color: "var(--text-muted)", marginBottom: "var(--space-2)", fontFamily: "var(--font-body)" }}>Questions to ask</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "var(--space-2)" }}>
          {questions.map((q, i) => (
            <div key={i} className="text-sm" style={{ display: "flex", gap: 8 }}>
              <CheckIcon width={14} height={14} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} /> {q}
            </div>
          ))}
        </div>
        <form onSubmit={addQuestion} style={{ display: "flex", gap: 8, marginBottom: "var(--space-4)" }}>
          <input placeholder="Add a question to ask" value={question} onChange={(e) => setQuestion(e.target.value)} style={{ flex: 1, padding: "9px 12px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)" }} />
          <button className="btn btn-secondary btn-sm" type="submit">Add</button>
        </form>

        <h3 className="text-sm" style={{ color: "var(--text-muted)", marginBottom: "var(--space-2)", fontFamily: "var(--font-body)" }}>Documents</h3>
        {documents.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {documents.map((d) => (
              <div key={d.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <DocumentIcon width={15} height={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <span className="text-sm">{d.title}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-faint">Nothing relevant uploaded yet.</p>}
      </section>

      <section className="card" style={{ marginBottom: "var(--space-4)" }}>
        <h2 style={{ marginBottom: "var(--space-3)" }}>Go</h2>
        <p className="text-muted text-sm" style={{ marginBottom: "var(--space-3)" }}>
          {event.details?.location || "Location not set for this appointment."}
        </p>
        <button className="btn btn-primary" onClick={openDirections} disabled={!event.details?.location && !recipient?.name}>
          <LocationIcon width={16} height={16} /> Open directions
        </button>
      </section>

      <section className="card">
        <h2 style={{ marginBottom: "var(--space-3)" }}>After</h2>
        <p className="text-muted text-sm" style={{ marginBottom: "var(--space-3)" }}>
          Once this is done, record what changed — speak, snap a document, or type a quick note.
        </p>
        <button className="btn btn-secondary" onClick={() => setShowCapture(true)}>Record what changed</button>
      </section>

      {showCapture && (
        <CaptureSheet careRecipientId={id} onClose={() => setShowCapture(false)} onSaved={load} />
      )}
    </div>
  );
}
