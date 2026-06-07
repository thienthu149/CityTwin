# City Twin

**Human Integration Infrastructure for Hong Kong.**

City Twin is the onboarding layer that helps international talent navigate Hong Kong's
ecosystem — and helps Hong Kong understand talent integration through anonymized insights.

> Hong Kong already has the ecosystem. City Twin makes it **discoverable, actionable and measurable**.

Built for the **EuroTech × Hong Kong Talent Engage Hackathon**.

---

## The idea

City Twin has two sides:

1. **Talent side** — A newcomer scans a QR code or opens a link, speaks or types in their own
   language, and receives a personalized Hong Kong **opportunity constellation**: funding,
   scholarships, communities, founders and social integration mapped around a central *YOU* node.

2. **City / organization side** — HKTE, Cyberport, HKSTP, universities and accelerators see
   **anonymized insights**: what talent needs, where people get stuck, which ecosystem partners
   matter most, and how integration improves over time.

---

## Demo flow (≈2 minutes)

1. **Global homepage** — an animated wireframe globe and a *Choose your city* selector:
   **Hong Kong** (Live · founding constellation), **Dubai** (Coming soon), **London** (Coming 2026).
   Only Hong Kong is clickable. Click **Enter Hong Kong**.
2. The app transitions into the **Hong Kong night interface** — a calm, empty screen with an
   improved skyline silhouette and a single input bar. **Type** (or click the *Founder* example):
   *"I am an AI founder from Germany. I just arrived in Hong Kong and I need startup funding,
   AI founder community and visa guidance."*
3. Press the arrow. A **YOU** node appears with a detected-profile summary, and **relevant
   category nodes** build around it: Funding, Entrepreneurship, Research-to-Startup, Social,
   Visa & Relocation. The **Integration Score** (34 → 86) appears in the sidebar.
4. Click the **Funding** node — the map **zooms in** and opportunity nodes orbit it:
   Cyberport, HKSTP, InvestHK, ITF, Brinc.
5. Click **Cyberport** — a clean opportunity card opens in the sidebar (it never covers the map).
6. Click **For organizations** (top-right) and **scroll** through the dashboard: top needs,
   most-matched partners, integration gaps, recommended actions, business model and GTM.
7. End on the pitch: *"100-user pilot. No app download. No system integration. Just a QR code."*

The flow is **input-driven** — there are no preset personas. Try the secondary *Student /
Founder / Researcher* example buttons under the input, use **Back to categories** inside a
zoomed category, **Build my constellation** to replay, and **Save to journey** → **View your
journey**.

---

## Run it locally

Requires **Node 20+**.

```bash
npm install
npm run dev          # → http://localhost:5173
```

That's it — the demo is **fully client-side**. No backend, database, auth or API keys required.

### Optional: the live-AI backend

An experimental Express + Claude/Groq backend lives in `server.js` + `api/` and powers a
real streaming voice/chat experience. It is **not** used by the hackathon demo. To run it you
need API keys (`cp .env.example .env`, then fill in `ANTHROPIC_API_KEY` / `GROQ_API_KEY`):

```bash
npm run dev:full     # runs the API server + vite together (needs Node 22+ for concurrently)
```

---

## Tech stack

| | |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v3 + custom CSS (glassmorphism, glows, constellation animations) |
| Animation | `motion` (Framer Motion) |
| Icons | `lucide-react` |
| Fonts | Space Grotesk (display), Inter (sans), JetBrains Mono (labels/metrics) |
| State | Local React state only — no backend, no database |

### Project structure

```
src/
  main.tsx                  app entry
  app/
    App.tsx                 view router (landing / talent / organizations) + nav + modals
    citytwin.css            dark base, glass + constellation utilities, keyframes
    data/mockData.ts        8 categories, opportunities, dashboard data (all mock)
    lib/generateResponse.ts generateCityTwinResponse(input) — local logic (Claude API drop-in point)
    views/                  TalentExperience (home), Organizations
    components/             Constellation, CategoryPanel, OpportunityCard,
                            IntegrationScorePanel, JourneyTimeline, InputBar, TopNav,
                            Skyline, Modals
server.js, api/             optional live-AI backend (not used by the demo)
```

---

## Business model

- **Free for talent** — students, founders, researchers and professionals use City Twin for free.
- **Paid by institutions** — HKTE, Cyberport, HKSTP, universities, accelerators and innovation
  districts pay for deployment and insights.
- **B2B / B2G SaaS** — annual subscription for a branded onboarding portal, ecosystem
  visibility, anonymized insights and retention intelligence.

**Go-to-market:** 100-user Hong Kong pilot via QR code → university & startup ecosystem pilots
→ institutional SaaS with HKTE / Cyberport / HKSTP-style partners → expansion to other global
talent cities.

---

## Honesty

This is a **hackathon prototype**. Recommendations use curated demo data, dashboard metrics are
simulated for a 100-user pilot scenario, and the Integration Score is a prototype heuristic.
See [HONESTY.md](./HONESTY.md) for a full, candid breakdown of what's real vs. simulated.
