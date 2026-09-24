import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../lib/api";
import EventCard from "../components/EventCard";
import { dayLabel } from "../lib/eventMeta";

const FILTERS = [
  { id: "", label: "All" },
  { id: "appointment", label: "Appointments" },
  { id: "medication", label: "Medication" },
  { id: "observation", label: "Observations" },
  { id: "task", label: "Follow-ups" },
];

export default function ActivityTab() {
  const { recipient, reload } = useOutletContext();
  const [events, setEvents] = useState(null);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { load(); }, [filter]);

  async function load() {
    try {
      const qs = filter ? `?type=${filter}` : "";
      const data = await api.get(`/care-recipients/${recipient.id}/events${qs}`);
      setEvents(data.events);
    } catch (err) {
      setError(err.message);
    }
  }

  async function confirmEvent(event) {
    await api.patch(`/events/${event.id}`, { confirm: true });
    load();
    reload();
  }

  const groups = groupByDay(events || []);

  return (
    <div>
      <h2 style={{ marginBottom: "var(--space-4)" }}>The care story</h2>

      <div style={{ display: "flex", gap: "var(--space-2)", overflowX: "auto", marginBottom: "var(--space-5)", paddingBottom: 4 }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className="btn btn-sm"
            onClick={() => setFilter(f.id)}
            style={{
              background: filter === f.id ? "var(--primary)" : "var(--surface-elevated)",
              color: filter === f.id ? "var(--on-primary)" : "var(--text-muted)",
              border: "1px solid " + (filter === f.id ? "var(--primary)" : "var(--border)"),
              whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <div className="banner banner-error">{error}</div>}

      {events === null && !error && <div className="loading-row"><span className="spinner" /> Loading the care story…</div>}

      {events?.length === 0 && (
        <div className="empty-state card">
          <h3>Nothing here yet</h3>
          <p>Captured appointments, medication changes, observations and more will build the care story automatically.</p>
        </div>
      )}

      {groups.map(([day, dayEvents]) => (
        <div className="timeline-group" key={day}>
          <div className="timeline-day">{day}</div>
          <div className="timeline">
            {dayEvents.map((e) => (
              <div key={e.id} className="timeline-item">
                <div className="timeline-dot" />
                <EventCard event={e} onConfirm={confirmEvent} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupByDay(events) {
  const map = new Map();
  for (const e of events) {
    const label = dayLabel(e.occurredAt);
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(e);
  }
  return Array.from(map.entries());
}
