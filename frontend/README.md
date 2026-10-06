# Jalia Healthcare

Jalia Healthcare — Endometriosis Care & Understanding.

## Experience
- Landing page before entering the app
- Image-led onboarding
- Bilingual, data-driven learning library with articles, illustrations, infographics, video, audio, interactive education, FAQs, resources and clearly fictional learning stories
- Topic and journey-stage search, local saved resources, and learning progress
- Interactive body-area explorer with a text alternative and non-diagnostic language
- External video loads only on request; audio is optional and uses device speech with a written version
- Pain, period and symptom tracking with local-first storage
- Appointment preparation and print/share summary
- Low-data messaging and offline-friendly local persistence
- Learning, personal tracking and appointment preparation work without an account
- Optional sign-in for manual, browser-encrypted health backup and deliberate sharing of personal appointment summaries

## Important
The included medical copy is prototype content and is not a substitute for clinical review. Sources shown in the app include NHS and ESHRE patient guidance. All medical content should be clinically reviewed before production publication.

Education content and saved-resource/progress identifiers are bundled locally and stored in browser storage. The initial materials are marked as drafts requiring clinical review; the interface does not claim that they have been medically reviewed. External video is not available offline.

The API stores password hashes and encrypted backup envelopes only; health-record content is encrypted in the browser before upload. Backups are manual and use the account passphrase for encryption. Losing that passphrase makes a cloud backup unrecoverable. Set `VITE_API_BASE_URL` when the production API is hosted separately; the local Vite server proxies `/api` to Flask on port 5001.

## Run
```bash
npm install
npm run dev
```
