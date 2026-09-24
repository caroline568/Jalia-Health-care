import { useOutletContext, useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import { CalendarIcon, ChevronRight, CheckIcon } from "../components/Icons";
import { formatWhen } from "../lib/eventMeta";

export default function OverviewTab() {
  const { recipient, data } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div>
      <section style={{ marginBottom: "var(--space-6)" }}>
        <h2 style={{ marginBottom: "var(--space-3)" }}>What's happening now</h2>
        {data.whatsHappeningNow ? (
          <div
            className="card"
            style={{ borderColor: "var(--primary)", cursor: "pointer" }}
            onClick={() => navigate(`/app/care/${recipient.id}/appointments/${data.whatsHappeningNow.id}`)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span className="chip chip-primary"><CalendarIcon width={12} height={12} /> Upcoming appointment</span>
                <h3 style={{ marginTop: 8 }}>{data.whatsHappeningNow.title}</h3>
                <p className="text-muted text-sm" style={{ marginTop: 4 }}>{formatWhen(data.whatsHappeningNow.occurredAt)}</p>
                {data.whatsHappeningNow.details?.location && (
                  <p className="text-sm" style={{ marginTop: 6 }}>📍 {data.whatsHappeningNow.details.location}</p>
                )}
                {data.whatsHappeningNow.details?.escort && (
                  <p className="text-sm text-muted" style={{ marginTop: 2 }}>{data.whatsHappeningNow.details.escort} is taking {recipient.name}</p>
                )}
              </div>
              <ChevronRight width={20} height={20} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
            </div>
          </div>
        ) : (
          <div className="card empty-state" style={{ padding: "var(--space-5)" }}>
            <p>Nothing scheduled right now. Use the + button to capture an upcoming appointment.</p>
          </div>
        )}
      </section>

      <section style={{ marginBottom: "var(--space-6)" }}>
        <h2 style={{ marginBottom: "var(--space-3)" }}>Recent care</h2>
        {data.recentCare?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {data.recentCare.map((e) => <EventCard key={e.id} event={e} compact />)}
          </div>
        ) : (
          <p className="text-muted">Nothing captured yet — voice, photo and screenshot capture all show up here.</p>
        )}
      </section>

      <section style={{ marginBottom: "var(--space-6)" }}>
        <h2 style={{ marginBottom: "var(--space-3)" }}>What's next</h2>
        {data.whatsNext?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {data.whatsNext.map((t) => (
              <div key={t.id} className="card" style={{ padding: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <CheckIcon width={18} height={18} style={{ color: "var(--primary)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{t.title}</div>
                  {t.assignee && <div className="text-sm text-muted">{t.assignee.name} is handling it</div>}
                </div>
                {t.dueAt && <span className="text-sm text-faint">{formatWhen(t.dueAt)}</span>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">Nothing outstanding.</p>
        )}
      </section>

      <section>
        <h2 style={{ marginBottom: "var(--space-3)" }}>Who's involved</h2>
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          {data.network?.map((m) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-pill)", padding: "6px 14px 6px 6px" }}>
              <div className="avatar" style={{ width: 28, height: 28, fontSize: "0.72rem", background: "var(--primary)" }}>{m.name?.[0]?.toUpperCase()}</div>
              <span className="text-sm" style={{ fontWeight: 600 }}>{m.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
