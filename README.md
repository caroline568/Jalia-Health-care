# Jalia Healthcare

Jalia Healthcare is an offline-first, mobile-first healthcare product focused on endometriosis education, symptom awareness, pain and period tracking, and appointment preparation for women in Kenya.

## Product promise
**Understand your pain. Learn about endometriosis. Prepare for care.**

Jalia does not diagnose, cure, prescribe, or replace professional medical care.

## Frontend
- React + Vite
- React Router
- Local-first health records using `localStorage`
- Responsive mobile-first UI
- Offline-friendly tracking and saved state
- Low-data mode
- Print/PDF appointment summary flow
- Guest access to learning, on-device health tracking, and appointment preparation
- Optional accounts for encrypted backup and sharing a personal appointment summary
- English and Kiswahili selection on the landing page, retained across app screens
- A bilingual life-stages and daily-life education guide, marked as draft pending clinical review

## Run
```bash
cd frontend
npm install
npm run dev
```

Build:
```bash
npm run build
```

## Backend
The Flask service provides account registration/sign-in and encrypted-backup endpoints, as well as `/api/health`. It stores password hashes and opaque encrypted backup payloads; health-record contents are encrypted in the browser before upload. Local learning, tracking, and appointment preparation do not require an account.

For local account features, run the frontend and backend in separate terminals:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Production must set `JALIA_ENV=production`, a strong random `JALIA_SECRET_KEY`, `JALIA_FRONTEND_URL`, and `JALIA_DATABASE_PATH` pointing to persistent storage. For a separately hosted HTTPS frontend/API, configure `JALIA_COOKIE_SECURE=true` and `JALIA_COOKIE_SAMESITE=None`. Set `VITE_API_BASE_URL` to the backend's `/api` URL before building the frontend.

Backups are manual and encrypted with a passphrase-derived key. Jalia cannot recover them if the passphrase is lost. Use HTTPS in production.

## Illustrative photography
The landing-page life-stage cards use locally stored, optimized Unsplash photographs. They are illustrative stock images, not patient testimonials or depictions of people diagnosed with endometriosis. The images load from the app itself and are included in the offline app shell.

- [Photo 1](https://images.unsplash.com/photo-1531123897727-8f129e1688ce) · [Photo 2](https://images.unsplash.com/photo-1544005313-94ddf0286df2) · [Photo 3](https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91) · [Photo 4](https://images.unsplash.com/photo-1524504388940-b1c1722653e1) · [Photo 5](https://images.unsplash.com/photo-1534528741775-53994a69daeb)
- [Unsplash license](https://unsplash.com/license)
