import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "../lib/api";
import { enqueueEvent } from "../lib/offlineQueue";
import { useOnlineStatus } from "../lib/useOnlineStatus";
import { EVENT_META } from "../lib/eventMeta";
import {
  MicIcon, CameraIcon, ScreenshotIcon, UploadIcon, TypeIcon, XIcon,
  CheckIcon, EditIcon, SparkleIcon,
} from "./Icons";

const METHODS = [
  { id: "voice", label: "Speak", desc: "Record a short voice note", icon: MicIcon, emoji: "🎙️" },
  { id: "photo", label: "Snap", desc: "Photo a prescription or result", icon: CameraIcon, emoji: "📸" },
  { id: "screenshot", label: "Screenshot", desc: "From WhatsApp, SMS, or an app", icon: ScreenshotIcon, emoji: "🖼️" },
  { id: "upload", label: "Upload", desc: "A file or document", icon: UploadIcon, emoji: "📄" },
  { id: "type", label: "Type", desc: "Write it yourself", icon: TypeIcon, emoji: "✍️" },
];

let recognition = null;
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function CaptureSheet({ careRecipientId, onClose, onSaved, initialMethod }) {
  // When opened from a shortcut (e.g. the Home screen's "What happened?"
  // buttons) we skip the method picker and jump straight into capture mode.
  const [step, setStep] = useState(initialMethod ? "capture" : "choose");
  const [method, setMethod] = useState(initialMethod || null);
  const [text, setText] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const fileInputRef = useRef(null);
  const online = useOnlineStatus();

  useEffect(() => {
    if (initialMethod === "photo" || initialMethod === "upload" || initialMethod === "screenshot") {
      setTimeout(() => fileInputRef.current?.click(), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function chooseMethod(m) {
    setMethod(m);
    setStep("capture");
    setError("");
    if (m === "photo" || m === "screenshot" || m === "upload") {
      setTimeout(() => fileInputRef.current?.click(), 50);
    }
  }

  function startVoice() {
    if (!SpeechRecognitionAPI) {
      setError("Voice-to-text isn't supported in this browser — you can type it below instead.");
      return;
    }
    recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    let finalText = text ? text + " " : "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += chunk + " ";
        else interim += chunk;
      }
      setText((finalText + interim).trim());
    };
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);
    recognition.start();
    setRecording(true);
  }

  function stopVoice() {
    recognition?.stop();
    setRecording(false);
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const info = await api.upload(file);
      setFileInfo(info);
    } catch (err) {
      setError(err.message || "Couldn't save that file. Try again when you have a connection.");
    } finally {
      setBusy(false);
    }
  }

  async function runExtraction() {
    setBusy(true);
    setError("");
    try {
      const data = await api.post(`/care-recipients/${careRecipientId}/capture`, {
        method,
        text,
        filename: fileInfo?.filename,
        mimeType: fileInfo?.mimeType,
      });
      setSuggestions(
        data.suggestions.map((s, i) => ({ ...s, _id: `s${i}`, _include: true }))
      );
      setStep("reviewing");
    } catch (err) {
      setError(err.message || "Couldn't process that just now.");
    } finally {
      setBusy(false);
    }
  }

  function updateSuggestion(id, patch) {
    setSuggestions((prev) => prev.map((s) => (s._id === id ? { ...s, ...patch } : s)));
  }

  async function confirmAll() {
    setBusy(true);
    setError("");
    const toSave = suggestions.filter((s) => s._include);
    try {
      for (const s of toSave) {
        const payload = {
          type: s.type,
          title: s.title,
          summary: s.summary,
          details: { ...(s.details || {}), ...(fileInfo ? { fileUrl: fileInfo.url, filename: fileInfo.filename } : {}) },
          source: s.source || method,
          provenance: s.confidence === "inferred" ? "needs_confirmation" : "ai_generated",
          occurredAt: s.details?.suggestedDate || new Date().toISOString(),
        };
        if (online) {
          await api.post(`/care-recipients/${careRecipientId}/events`, payload);
        } else {
          enqueueEvent(careRecipientId, payload);
        }
      }
      setStep("done");
      onSaved?.();
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        toSave.forEach((s) => enqueueEvent(careRecipientId, {
          type: s.type, title: s.title, summary: s.summary, details: s.details || {},
          source: s.source || method, provenance: "needs_confirmation",
          occurredAt: s.details?.suggestedDate || new Date().toISOString(),
        }));
        setStep("done");
        onSaved?.();
      } else {
        setError(err.message || "Couldn't save right now.");
      }
    } finally {
      setBusy(false);
    }
  }

  const captureLabel = METHODS.find((m) => m.id === method)?.label;

  return (
    <div className="sheet-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Capture care information">
        <div className="sheet-handle" />

        {step === "choose" && (
          <>
            <div className="sheet-header">
              <h2>How do you want to capture this?</h2>
              <button className="icon-btn" onClick={onClose} aria-label="Close"><XIcon width={18} height={18} /></button>
            </div>
            <p className="text-muted" style={{ marginBottom: "var(--space-5)" }}>
              Jalia will do the organizing — you don't need to fill out a form.
            </p>
            <div className="capture-grid">
              {METHODS.map((m) => (
                <button key={m.id} className="capture-option" onClick={() => chooseMethod(m.id)}>
                  <span className="emoji">{m.emoji}</span>
                  <strong>{m.label}</strong>
                  <span>{m.desc}</span>
                </button>
              ))}
            </div>
            {!online && (
              <p className="text-sm text-faint" style={{ marginTop: "var(--space-4)" }}>
                You're offline — captures will be saved on this device and synced automatically once you're back online.
              </p>
            )}
          </>
        )}

        {step === "capture" && (
          <>
            <div className="sheet-header">
              <button className="btn-ghost btn" onClick={() => setStep("choose")}>Back</button>
              <h3>{captureLabel}</h3>
              <button className="icon-btn" onClick={onClose} aria-label="Close"><XIcon width={18} height={18} /></button>
            </div>

            {method === "voice" && (
              <div style={{ textAlign: "center", padding: "var(--space-4) 0" }}>
                <button
                  className="icon-btn"
                  onClick={recording ? stopVoice : startVoice}
                  style={{
                    width: 84, height: 84, margin: "0 auto var(--space-4)",
                    background: recording ? "var(--error-tint)" : "var(--primary-tint)",
                    color: recording ? "var(--error)" : "var(--primary-strong)",
                    border: "none",
                  }}
                  aria-label={recording ? "Stop recording" : "Start recording"}
                >
                  <MicIcon width={30} height={30} />
                </button>
                <p className="text-muted text-sm">{recording ? "Listening… tap to stop" : "Tap to speak"}</p>
                <textarea
                  rows={5}
                  placeholder='e.g. "Mum went to the clinic today. The doctor changed one of her medications and asked us to come back next Tuesday."'
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{
                    width: "100%", marginTop: "var(--space-4)", padding: 14, borderRadius: "var(--radius-md)",
                    border: "1.5px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)",
                    fontFamily: "inherit", fontSize: "1rem",
                  }}
                />
              </div>
            )}

            {(method === "photo" || method === "screenshot" || method === "upload") && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={method === "upload" ? "image/*,.pdf" : "image/*"}
                  capture={method === "photo" ? "environment" : undefined}
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
                {!fileInfo && !busy && (
                  <button className="btn btn-secondary btn-block" onClick={() => fileInputRef.current?.click()}>
                    Choose {method === "photo" ? "a photo" : method === "screenshot" ? "a screenshot" : "a file"}
                  </button>
                )}
                {busy && <div className="loading-row"><span className="spinner" /> Saving file…</div>}
                {fileInfo && (
                  <div className="banner banner-success" style={{ marginTop: "var(--space-3)" }}>
                    <CheckIcon width={16} height={16} /> Saved: {fileInfo.filename}
                  </div>
                )}
                <textarea
                  rows={3}
                  placeholder="Add a quick note about what this is (optional)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{
                    width: "100%", marginTop: "var(--space-4)", padding: 14, borderRadius: "var(--radius-md)",
                    border: "1.5px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)",
                    fontFamily: "inherit", fontSize: "1rem",
                  }}
                />
              </div>
            )}

            {method === "type" && (
              <textarea
                rows={7}
                autoFocus
                placeholder="What happened?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{
                  width: "100%", padding: 14, borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)",
                  fontFamily: "inherit", fontSize: "1rem",
                }}
              />
            )}

            {error && <div className="banner banner-error" style={{ marginTop: "var(--space-4)" }}>{error}</div>}

            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: "var(--space-5)" }}
              disabled={busy || (!text.trim() && !fileInfo)}
              onClick={runExtraction}
            >
              {busy ? <span className="spinner" /> : <SparkleIcon width={17} height={17} />}
              {busy ? "Organizing…" : "Continue"}
            </button>
          </>
        )}

        {step === "reviewing" && (
          <>
            <div className="sheet-header">
              <h2>Jalia found</h2>
              <button className="icon-btn" onClick={onClose} aria-label="Close"><XIcon width={18} height={18} /></button>
            </div>
            <p className="text-muted text-sm" style={{ marginBottom: "var(--space-4)" }}>
              Review each item before it's added. Uncertain items are marked — edit or discard anything that's not right.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {suggestions.map((s) => {
                const meta = EVENT_META[s.type] || EVENT_META.observation;
                return (
                  <div key={s._id} className="card" style={{ opacity: s._include ? 1 : 0.5, padding: "var(--space-4)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-2)" }}>
                      <span className={`chip ${meta.chip}`}>{meta.label}</span>
                      <span className={`chip ${s.confidence === "inferred" ? "chip-warning" : "chip-neutral"}`}>
                        {s.confidence === "inferred" ? "Jalia's best guess" : "From what you said"}
                      </span>
                    </div>
                    {s._editing ? (
                      <textarea
                        rows={2}
                        value={s.summary}
                        onChange={(e) => updateSuggestion(s._id, { summary: e.target.value })}
                        style={{
                          width: "100%", marginTop: "var(--space-2)", padding: 10, borderRadius: "var(--radius-sm)",
                          border: "1.5px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)",
                          fontFamily: "inherit",
                        }}
                      />
                    ) : (
                      <p style={{ marginTop: "var(--space-2)", fontSize: "0.94rem" }}>{s.summary}</p>
                    )}
                    <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => updateSuggestion(s._id, { _editing: !s._editing })}
                      >
                        <EditIcon width={14} height={14} /> {s._editing ? "Done" : "Edit"}
                      </button>
                      <button
                        className={`btn btn-sm ${s._include ? "btn-danger" : "btn-secondary"}`}
                        onClick={() => updateSuggestion(s._id, { _include: !s._include })}
                      >
                        {s._include ? <><XIcon width={14} height={14} /> Discard</> : "Include again"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {error && <div className="banner banner-error" style={{ marginTop: "var(--space-4)" }}>{error}</div>}

            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: "var(--space-5)" }}
              disabled={busy || suggestions.every((s) => !s._include)}
              onClick={confirmAll}
            >
              {busy ? <span className="spinner" /> : <CheckIcon width={17} height={17} />}
              {busy ? "Saving…" : `Confirm and add${online ? "" : " (offline)"}`}
            </button>
          </>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "var(--space-6) 0" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", background: "var(--success-tint)", color: "var(--success)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-4)",
            }}>
              <CheckIcon width={26} height={26} />
            </div>
            <h2>Added to the care story</h2>
            <p className="text-muted" style={{ marginTop: "var(--space-2)" }}>
              {online ? "The family will see this in Coordinate." : "Saved on this device — it'll sync once you're back online."}
            </p>
            <button className="btn btn-primary" style={{ marginTop: "var(--space-5)" }} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}