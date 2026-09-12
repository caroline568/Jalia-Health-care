# Jalia Healthcare

> Healthcare is complicated enough. Caring for someone shouldn't be.

A family care-coordination app built around four experiences: **Navigate, Carry, Coordinate, Handoff.**
React + Vite frontend, Flask backend, installable as a PWA, works offline, light/dark mode.

The UI is being brought in line with a high-fidelity Figma prototype, screen by screen — see
[Design status](#design-status) for what's matched so far.

---

## Quick start

### 1. Backend (Flask)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py                    # optional: creates a demo caregiver + "Mum" care space
python seed_new.py                # optional: adds a fuller household (see below)
python app.py                     # runs on http://127.0.0.1:5001
```

`seed_new.py` is additive and safe to re-run — it checks for each care space by name before
creating it, so running it more than once (or after `seed.py`) won't duplicate anything.

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev                       # runs on http://localhost:5173, proxies /api to :5001
```

Open **http://localhost:5173**. If you ran the seed scripts, sign in with:

```
caroline.demo@gmail.com / password123
brian.demo@gmail.com    / password123   (second family member, shares Mum's and Dad's care spaces)
```

Registration is Gmail-only (enforced server-side), matching the product spec.

### 3. Production build

```bash
cd frontend
npm run build      # outputs frontend/dist — serve as static files, or have Flask serve it
```

For a real deployment, point `DATABASE_URL` at Postgres and set `JALIA_COOKIE_SECURE=true` behind HTTPS.

---

## Demo data

Two seed scripts, meant to be run together:

- **`seed.py`** — the original single-recipient demo: Caroline caring for **Mum**, with Brian as
  weekend support. Good for a quick, uncluttered look at the app.
- **`seed_new.py`** — layers on a fuller household, closer to how someone who's actually been using
  Jalia for a few weeks would have it:
  - **Dad** — advanced illness, hospice care at home. Network: Caroline (primary), **Brian**
    (drives him to appointments), **Wanjiku** (big sister, leads decisions with the hospice team),
    and **Aunt Njeri** (administers medication morning and evening — tracked in the app but without
    her own login, the way a relative who coordinates by phone would be). About three weeks of
    history plus one past "Catch Me Up" handoff, so it reads like an established case, not day one.
  - **David** — Caroline's husband, a short-term flu: GP visit, antivirals, recovering. Nothing
    urgent, deliberately lower-stakes than Dad's care space.
  - **Amani** — Caroline's daughter: a mild cold plus a routine polio booster dose coming up,
    covering everyday child health rather than an active illness.

Together they give the app cases at different levels of severity and network complexity to build
and test against, instead of just one clean example.

---

## What's implemented

- **Auth** — Gmail-only registration, hashed passwords, secure server-side session cookies, protected routes (`/api/auth/register|login|me|logout`)
- **Home** — greets the caregiver and answers "who needs my attention": each care space as a card
  (upcoming item or recent activity), a quick-capture block (Speak / Snap / Upload) that jumps
  straight into Carry for whoever most needs attention, and shortcuts into that person's Navigate,
  Carry, Coordinate and Handoff
- **Navigate** — appointment detail with Prepare (recent changes, questions, documents) / Go (opens Google Maps) / After (record what changed)
- **Carry** — capture-first flow: Speak (Web Speech API where supported, with a text fallback), Snap, Screenshot, Upload, Type — all routed through one shared extraction step; can also be jumped into directly on a method (skipping the picker) from Home
- **Coordinate** — a single day-grouped care-story timeline built from typed `CareEvent`s (appointments, medication, observations, communications, tasks, results, documents), filterable, with visible provenance ("Added by Caroline · captured from voice note · needs confirmation")
- **Handoff** — "Catch Me Up": generates a structured recent/changed/outstanding/upcoming summary from the last N days, editable before sharing; past handoffs are kept so a caregiver can see what's already been shared
- **Care Space** — one per loved one, supports a network of people beyond the primary caregiver, including network members who don't have their own Jalia login
- **PWA** — installable manifest, service worker (app-shell caching + network-first API caching), offline capture queue in `localStorage` that syncs automatically when connectivity returns
- **Light/dark mode** — CSS custom properties, respects saved preference, no flash-of-wrong-theme
- **States** — loading skeletons, empty states, error banners, offline banner, pending-sync indicators

## What's intentionally simplified (see caveats in chat)

- Extraction (`backend/extraction.py`) uses transparent keyword heuristics, not a real speech/vision model — the extraction boundary is isolated in one module so a real LLM/OCR call is a drop-in replacement.
- SQLite by default (the schema is Postgres-ready via `DATABASE_URL`); uploaded files are stored on local disk, not object storage.
- No email verification, password reset, or push notifications yet.

## Design status

The UI is being reconciled against a Figma high-fidelity prototype, one screen at a time:

| Screen | Status |
| --- | --- |
| Home / Care Space | Matched — recipient cards, quick-capture block, pillar shortcuts |
| Navigate / Appointment | Not yet started (card order + a static vs. interactive Prepare checklist to decide) |
| Carry / Capture | Close already — mostly a styling pass, not a rebuild |
| Coordinate / Activity | Not yet started (drop filter chips? add a "Next action" highlight card) |
| Handoff / Catch Me Up | Not yet started (read-only summary layout + a "Your responsibility" personalized card) |

Global design tokens (background warmth, exact primary teal) haven't been reconciled with the
Figma palette yet — that's a separate pass, deferred until the screen-by-screen work is done.

## Project structure

```
backend/
  app.py            Flask app factory
  models.py          User, CareRecipient, CareNetworkMember, CareEvent, Handoff
  auth.py             /api/auth/*, session auth, Gmail enforcement
  api.py               care spaces, network, events, capture, handoff
  uploads_api.py        file upload endpoint
  extraction.py          capture → structured-suggestion extraction (swap-in point for a real model)
  seed.py                 optional demo data — Caroline + Mum
  seed_new.py              optional demo data — adds Dad, David, Amani (see Demo data)

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
