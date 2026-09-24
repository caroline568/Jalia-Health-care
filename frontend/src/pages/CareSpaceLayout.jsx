import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import CaptureSheet from "../components/CaptureSheet";
import { ChevronLeft, PlusIcon } from "../components/Icons";

export default function CareSpaceLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showCapture, setShowCapture] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/care-recipients/${id}`);
      setData(res);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => { load(); }, [load, refreshKey]);

  const reload = () => setRefreshKey((k) => k + 1);

  if (error) return <div className="banner banner-error">{error}</div>;
  if (!data) return <div className="loading-row"><span className="spinner" /> Loading care space…</div>;

  const recipient = data.careRecipient;

  return (
    <div>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: "var(--space-3)", marginLeft: -10 }} onClick={() => navigate("/app")}>
        <ChevronLeft width={16} height={16} /> Home
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
        <div className="recipient-photo" style={{ width: 64, height: 64, fontSize: "1.5rem" }}>
          {recipient.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <div className="eyebrow">Care space</div>
          <h1>{recipient.name}</h1>
        </div>
      </div>

      <div className="segmented" style={{ marginBottom: "var(--space-5)" }}>
        <TabLink to={`/app/care/${id}`} end>Overview</TabLink>
        <TabLink to={`/app/care/${id}/activity`}>Activity</TabLink>
        <TabLink to={`/app/care/${id}/handoff`}>Handoff</TabLink>
      </div>

      <Outlet context={{ recipient, data, reload }} />

      <button className="fab" onClick={() => setShowCapture(true)} aria-label="Capture something new">
        <PlusIcon width={26} height={26} />
      </button>

      {showCapture && (
        <CaptureSheet
          careRecipientId={id}
          onClose={() => setShowCapture(false)}
          onSaved={reload}
        />
      )}
    </div>
  );
}

function TabLink({ to, end, children }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
      {children}
    </NavLink>
  );
}
