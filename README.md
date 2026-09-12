# Jalia Healthcare

> Healthcare is complicated enough. Caring for someone shouldn't be.

A family care-coordination app built around four experiences: **Navigate, Carry, Coordinate, Handoff.**
React + Vite frontend, Flask backend, installable as a PWA, works offline, light/dark mode.

---

## Quick start

### 1. Backend (Flask)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py                    # optional: creates demo data
python app.py                     # runs on http://127.0.0.1:5001
```

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev                       # runs on http://localhost:5173, proxies /api to :5001
```

Open **http://localhost:5173**. If you ran `seed.py`, sign in with:

```
caroline.demo@gmail.com / password123
brian.demo@gmail.com    / password123   (second family member on the same care space)
```

Registration is Gmail-only (enforced server-side), matching the product spec.

### 3. Production build

```bash
cd frontend
npm run build      # outputs frontend/dist — serve as static files, or have Flask serve it
```

For a real deployment, point `DATABASE_URL` at Postgres and set `JALIA_COOKIE_SECURE=true` behind HTTPS.

---

## What's implemented

- **Auth** — Gmail-only registration, hashed passwords, secure server-side session cookies, protected routes (`/api/auth/register|login|me|logout`)
- **Navigate** — appointment detail with Prepare (recent changes, questions, documents) / Go (opens Google Maps) / After (record what changed)
- **Carry** — capture-first flow: Speak (Web Speech API where supported, with a text fallback), Snap, Screenshot, Upload, Type — all routed through one shared extraction step
- **Coordinate** — a single day-grouped care-story timeline built from typed `CareEvent`s (appointments, medication, observations, communications, tasks, results, documents), filterable, with visible provenance ("Added by Caroline · captured from voice note · needs confirmation")
- **Handoff** — "Catch Me Up": generates a structured recent/changed/outstanding/upcoming summary from the last N days, editable before sharing
- **Home & Care Space** — "who needs my attention" entry point; one Care Space per loved one
- **PWA** — installable manifest, service worker (app-shell caching + network-first API caching), offline capture queue in `localStorage` that syncs automatically when connectivity returns
- **Light/dark mode** — CSS custom properties, respects saved preference, no flash-of-wrong-theme
- **States** — loading skeletons, empty states, error banners, offline banner, pending-sync indicators

## What's intentionally simplified (see caveats in chat)

- Extraction (`backend/extraction.py`) uses transparent keyword heuristics, not a real speech/vision model — the extraction boundary is isolated in one module so a real LLM/OCR call is a drop-in replacement.
- SQLite by default (the schema is Postgres-ready via `DATABASE_URL`); uploaded files are stored on local disk, not object storage.
- No email verification, password reset, or push notifications yet.

## Project structure

```
backend/
  app.py            Flask app factory
  models.py          User, CareRecipient, CareNetworkMember, CareEvent, Handoff
  auth.py             /api/auth/*, session auth, Gmail enforcement
  api.py               care spaces, network, events, capture, handoff
  uploads_api.py        file upload endpoint
  extraction.py          capture → structured-suggestion extraction (swap-in point for a real model)
  seed.py                 optional demo data

frontend/
  src/
    pages/           Home, People, Settings, CareSpaceLayout + Overview/Activity/Handoff tabs, NavigateDetail
    components/      AppShell (nav), CaptureSheet (Carry), EventCard, Icons
    context/          Auth, Theme
    lib/               api client, offline queue, event metadata/formatting
    styles/             design tokens (light/dark) + global styles
  public/
    manifest.json, sw.js, icons/
```
