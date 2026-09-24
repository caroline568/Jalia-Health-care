import { EVENT_META, SOURCE_LABEL, formatWhen } from "../lib/eventMeta";
import { CheckIcon } from "./Icons";

export default function EventCard({ event, onConfirm, compact = false }) {
  const meta = EVENT_META[event.type] || EVENT_META.observation;
  const Icon = meta.icon;
  const needsConfirmation = event.provenance === "needs_confirmation" && !event.confirmed;

  return (
    <div className="card" style={{ padding: compact ? "var(--space-4)" : "var(--space-5)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-3)" }}>
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12, flexShrink: 0,
            background: "var(--surface-sunken)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon width={18} height={18} style={{ color: "var(--text-muted)" }} />
          </div>
          <div>
            <span className={`chip ${meta.chip}`}>{meta.label}</span>
            <h3 style={{ marginTop: 6 }}>{event.title}</h3>
          </div>
        </div>
        <span className="text-faint text-sm" style={{ whiteSpace: "nowrap" }}>{formatWhen(event.occurredAt)}</span>
      </div>

      {event.summary && (
        <p className="text-muted" style={{ marginTop: "var(--space-3)", fontSize: "0.94rem", lineHeight: 1.55 }}>
          {event.summary}
        </p>
      )}

      {event.type === "appointment" && event.details?.location && (
        <p className="text-sm text-muted" style={{ marginTop: "var(--space-2)" }}>
          📍 {event.details.location}{event.details.escort ? ` · ${event.details.escort} is taking them` : ""}
        </p>
      )}

      <div className="provenance-row">
        <span>{event.createdBy ? `Added by ${event.createdBy.name}` : "Added by Jalia"}</span>
        <span className="dot">·</span>
        <span>{SOURCE_LABEL[event.source] || "Entered manually"}</span>
        {needsConfirmation && (
          <>
            <span className="dot">·</span>
            <span className="chip chip-warning">Needs confirmation</span>
          </>
        )}
      </div>

      {needsConfirmation && onConfirm && (
        <button className="btn btn-secondary btn-sm" style={{ marginTop: "var(--space-3)" }} onClick={() => onConfirm(event)}>
          <CheckIcon width={15} height={15} /> Confirm this happened
        </button>
      )}
    </div>
  );
}
