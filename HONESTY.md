# Honesty statement

City Twin is a **hackathon prototype** built for the EuroTech × Hong Kong Talent Engage
Hackathon. We want judges and partners to trust the demo, so here is a candid account of what
is real, what is simulated, and what would be needed for production.

---

## What existed before the hackathon

- A React + Vite + TypeScript project scaffold (originally exported via Lovable/Figma-to-code).
- A shadcn/ui component kit under `src/app/components/ui/`.
- An experimental Express backend (`server.js` + `api/`) wiring Claude (Anthropic) for chat and
  Groq Whisper for voice transcription, plus a Hong Kong ecosystem catalog in `database.json`.
- Early prototype components (`NeuralNetwork`, `ChatSheet`, `HeroPage`, …) — kept in the repo
  but **no longer used** by the demo app.

## What was built during the hackathon

The current demo MVP was rebuilt directly in this repo (no Lovable import/export), using the
Lovable mockups only as visual inspiration. New work includes:

- The full **client-side app**: an input-driven talent experience (empty calm screen → free-text
  input → personalized constellation) and a separate organizations dashboard with business-model
  and go-to-market sections (`src/app/views/`, `src/app/App.tsx`).
- A **two-level animated constellation**: free-text input produces a *YOU* node surrounded by the
  4–6 most relevant of eight categories; clicking a category zooms in to its opportunity nodes,
  with a *Back to categories* control (`src/app/components/Constellation.tsx`).
- The flow is **input-driven, not persona-driven** — the earlier Sofia/Lena/Priya buttons were
  removed; three secondary *example* prompts remain to seed the input for a quick demo.
- **Opportunity cards**, **Integration Score** panel, **Journey timeline**, multilingual input
  bar, top navigation, SVG Hong Kong skyline, and all modals.
- The local response engine `generateCityTwinResponse()` (`src/app/lib/generateResponse.ts`).
- All demo data: three talent profiles, six opportunity categories, curated opportunities, and
  the simulated pilot dashboard (`src/app/data/mockData.ts`).
- Build fixes: pinned `vite` to v7 (upstream pinned v8, which is incompatible with
  `@vitejs/plugin-react@4.7`), and switched `npm run dev` to a backend-free vite-only command.

## What is fully functional

- Every button and link in the demo works — no dead controls.
- Profile switching (Sofia / Lena / Priya) rebuilds the constellation and updates scores live.
- Clicking nodes opens opportunity cards; **Save to journey** persists into the journey timeline
  (in local state for the session).
- The multilingual input bar accepts text and routes keywords (`founder`, `student`,
  `researcher`/`AI`) to the matching profile, with user + City Twin chat bubbles.
- "Build my constellation" replays the animation; "View your journey" opens the timeline.
- The organizations dashboard, business-model and GTM sections render with animated charts.
- All modals (pilot access, partnership form, external link, pilot report) open and behave
  correctly. The partnership form simulates submission.
- `npm run dev` and `npm run build` both work with no backend and no API keys.

## What is mocked / simulated

- **Recommendations** are hand-curated demo data chosen to tell a coherent story. They are not
  produced by a live matching algorithm in the demo.
- **Role / language / needs detection** in `generateCityTwinResponse()` is a local keyword
  heuristic, not a real NLP/LLM model.
- **Integration Score** (before/after, risk) is a **prototype heuristic** with hand-set values
  per detected role — not a validated measurement model.
- **Organizations dashboard metrics** (100 users, 18 countries, 9 languages, 34→82 average,
  needs %, partner match counts, gaps, recommended action) are **simulated** for an illustrative
  100-user pilot scenario. No real analytics are collected.
- **Multi-city homepage** — only Hong Kong is functional. Dubai and London are roadmap
  placeholders that show a "coming soon" toast; the globe is a decorative SVG, not live geodata.
- **Voice input** (microphone button) is simulated in the demo — it toggles UI state only.
- **Opportunities and partners** are real Hong Kong organisations used illustratively; there is
  no live integration, endorsement, or application flow with them.

## What is explicitly NOT included

- No real HKTE / Cyberport / HKSTP / university integration or endorsement.
- No production backend, database, or persistence beyond in-session React state.
- No authentication or user accounts.
- No real analytics, tracking, or data collection.
- No secrets in the repo; `.env` is git-ignored and not required to run the demo.

## External tools used

- React, Vite, TypeScript, Tailwind CSS, `motion` (Framer Motion), `lucide-react`.
- Google Fonts (Space Grotesk, Inter, JetBrains Mono), loaded with system-font fallbacks.
- (Optional, not in the demo path) Anthropic Claude + Groq Whisper via `server.js`.
- Lovable / Figma mockups were used as **visual inspiration only** — no generated code was
  imported for the demo app.

## Next steps toward production

1. Replace `generateCityTwinResponse()` with a real Claude API call (drop-in point is documented
   in `src/app/lib/generateResponse.ts`; a streaming reference exists in `server.js`).
2. Connect a curated, regularly-updated Hong Kong opportunity catalog with real partner data and
   verified application links.
3. Define and validate a real Integration Score methodology with partner input.
4. Add anonymized, consent-based analytics to power the organizations dashboard from real usage.
5. Run the actual 100-user QR-code pilot and generate the first real pilot report.
