import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import EventCard from "../components/EventCard";
import { HandoffIcon } from "../components/Icons";
import { formatWhen } from "../lib/eventMeta";

// Deliberately outside the authenticated app shell — anyone with the link
// can open this, no Jalia account required. Keep the page self-contained
// and simple: it has one job, showing the handoff content.
export default function PublicHandoff() {
  const { token } = useParams();
  const [state, setState] = useState({ loading: true, handoff: null, error: "" });

  useEffect(() => {
    let cancelled = false;
    api.get(`/public/handoffs/${token}`)
      .then((data) => { if (!cancelled) setState({ loading: false, handoff: data.handoff, error: "" }); })
      .catch((err) => { if (!cancelled) setState({ loading: false, handoff: null, error: err.message }); });
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "var(--space-6) var(--space-4)" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-5)" }}>
          <HandoffIcon width={20} height={20} style={{ color: "var(--primary-strong)" }} />
          <span style={{ fontWeight: 700, color: "var(--primary-strong)" }}>Jalia</span>
        </div>

        {state.loading && <div className="loading-row"><span className="spinner" /> Loading…</div>}

        {state.error && (
          <div className="banner banner-error">
            {state.error} If you think this is a mistake, ask whoever sent it to share a new link.
          </div>
        )}

        {state.handoff && (
          <>
            <h1 style={{ marginBottom: 4 }}>
              Catch me up{state.handoff.recipientDisplayName ? ` on ${state.handoff.recipientDisplayName}` : ""}
            </h1>
            <p className="text-muted text-sm" style={{ marginBottom: "var(--space-6)" }}>
              Shared {formatWhen(state.handoff.createdAt)}
              {state.handoff.recipientName ? ` with ${state.handoff.recipientName}` : ""} · view-only, no
              login needed
            </p>

            <HandoffSection title="Upcoming care" items={state.handoff.content?.upcoming} />
            <HandoffSection title="What changed" items={state.handoff.content?.changed} />
            <HandoffSection title="Outstanding" items={state.handoff.content?.outstanding} />
            <HandoffSection title="Recent activity" items={state.handoff.content?.recent} />

            <p className="text-faint text-sm" style={{ marginTop: "var(--space-6)", textAlign: "center" }}>
              This link expires 7 days after it was shared and can't be used to access anything else in Jalia.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function HandoffSection({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <section style={{ marginBottom: "var(--space-5)" }}>
      <h3 style={{ marginBottom: "var(--space-3)" }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {items.map((e) => <EventCard key={e.id} event={e} compact />)}
      </div>
    </section>
  );
}