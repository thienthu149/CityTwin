# HONESTY.md

> Mandatory disclosure for the hackathon. This file lives at the root of your repository. Judges cross-check it against your code and your technical video.
>
> **The deal:** disclosed shortcuts are **not** penalized — that is the entire point of this file. Hidden ones are. Undisclosed pre-built code is heavily penalized, each undisclosed mock carries a small penalty, and a faked demo is heavily penalized. Telling the truth here costs you nothing.

---

## 1. Team — who did what
Judges compare this against `git shortlog -sn`, so keep it honest.

| Member | GitHub handle | Main contributions |
|---|---|---|
| Thien-Thu Truong | thienthu149 | Express backend, Claude AI integration, Groq voice transcription, chat streaming, constellation data pipeline, app routing, UI|
| Tiffany | Tiffany259 | Figma design export, database schema & content, OpportunityTimeline, NeuralNetwork visual adjustments, B2BForm UI, initial shadcn scaffolding, hero page, UI |
| Lucia Romero Mateos | luciawalwin | Strategy, Brainstorming ideas, UI, hero page, B2BForm UI |
| Maria Herrera Mateos | Mariaherreramateos | Business-side of project, Marketing, Strategy, Pitch, Videos |

---

## 2. What is fully working
Features that run end-to-end on the live app, with real data and real logic.

- **AI Chat (streaming)** — User types a message describing themselves → Express server calls Claude claude-opus-4-6 via SSE streaming → response streams back in real-time → `NODES:` JSON block is stripped and parsed from the response to populate the constellation. Fully multilingual: Claude detects and responds in the user's language.
- **Voice Input (Groq Whisper)** — User taps mic → browser `MediaRecorder` captures WebM audio → POST to `/api/transcribe` → Groq `whisper-large-v3-turbo` transcribes it → text is injected into the chat and sent to Claude automatically.
- **Opportunity Constellation** — SVG/canvas neural-network visualization that dynamically adds nodes as the AI names Hong Kong resources. Nodes are color-coded by category (funding, scholarship, community, education, social) and deduplicated across turns.
- **Opportunity Timeline** — Fetches `database.json` at runtime, combines all categories, and renders a scrollable animated timeline of upcoming HK opportunities with external links that open the real organization pages.
- **Hero page city selector** — Landing screen with animated globe. Clicking Hong Kong proceeds into the app; other cities display as coming soon.
- **HK Ecosystem database** — 60+ real Hong Kong organizations, programs, and communities curated manually across 6 categories (funding, education, expats, founders, student communities, social), each with description, month, and real URL.

---

## 3. What is mocked, stubbed, or hardcoded

| What is faked | Where (file:line or folder) | Why we mocked it | What the real version would do |
|---|---|---|---|
| B2B portal form submission | `src/app/components/B2BForm.tsx:26–27` | No backend persistence layer in scope for hackathon | POST to a real API endpoint, write new organization entry to a database (e.g. Supabase/Postgres), and trigger a review workflow |
| Opportunity "month" deadlines | `database.json` — all entries have a hardcoded month string (e.g. `"April"`) | Deadline data is not available via a public API | Scrape or integrate each organization's official deadline calendar; use a live scheduler |
| City selection — only Hong Kong active | `src/app/App.tsx:39–42` | Only HK ecosystem data was curated for the hackathon | Add per-city databases and route to the correct catalog; replicate the model for Dubai, Singapore, Berlin, etc. |
| No TTS / voice output | Entire current `src/` — ElevenLabs was removed before final build | ElevenLabs API latency and cost added friction in the demo flow | Integrate ElevenLabs streaming TTS on AI messages with a speaker-icon play button per message |
| Constellation node positions | `src/app/components/NeuralNetwork.tsx` — positions are computed with a simple radial layout algorithm | A real knowledge graph would need a force-directed layout based on semantic similarity | Use D3-force or a graph DB (Neo4j) with embeddings to place related nodes closer together |

---

## 4. External APIs, services & data sources

| Service / API / dataset | Used for | Real call or mocked? | Auth |
|---|---|---|---|
| Anthropic Claude API (`claude-opus-4-6`) | Conversational AI guide — generates personalized HK resource recommendations and embeds structured node data | **Real** — SSE streaming via `@anthropic-ai/sdk` | Live API key via `ANTHROPIC_API_KEY` env var |
| Groq API (`whisper-large-v3-turbo`) | Voice-to-text transcription of user microphone recordings | **Real** — via `groq-sdk` | Live API key via `GROQ_API_KEY` env var |
| OpenStreetMap / CARTO tile server | Map tiles in earlier prototype (Leaflet-based version in `src-old-backup/`) | **Real** (used in backup; current build uses SVG constellation instead) | No auth required (public tile server) |
| HK organization URLs (60+ links) | "Learn More" links in the timeline; `reason` fields in constellation nodes | **Real** — all links point to the actual organizations' websites | None |

---

## 5. Pre-existing code

| Item | Source (URL or description) | Roughly how much | License |
|---|---|---|---|
| shadcn/ui component library (`src/app/components/ui/`) | [shadcn/ui](https://ui.shadcn.com/) — auto-scaffolded via CLI. Includes ~40 primitive components: accordion, alert, avatar, badge, button, calendar, card, dialog, dropdown, input, label, popover, select, sheet, tabs, tooltip, etc. | ~40 files, ~3,000 lines — **none of the app logic lives here; these are unstyled primitives we wired up** | MIT |
| `CityTwin AI Platform Webapp (Copy)/` | Figma Make export used as a design reference and initial structural scaffold at project start | ~8 files — used as reference only; final code was rewritten | MIT (shadcn/ui), Unsplash license (photos) |
| `default_shadcn_theme.css` | Default shadcn/ui CSS variable theme | ~50 lines | MIT |

All business logic, AI integration, voice pipeline, database, constellation visualization, and UI composition were written during the hackathon window.

---

## 6. Known limitations & next steps

- **Only Hong Kong** — The AI system prompt and database are HK-only. The hero page implies multi-city support which isn't implemented yet.
- **No user accounts or session persistence** — Each page refresh starts a fresh conversation; nodes are lost on reload.
- **B2B portal is UI-only** — Organizations cannot actually submit themselves to the database yet; the form logs to console.
- **Static deadline months** — The timeline shows months from a curated list, not live deadlines from organizations' websites.
- **No TTS in production build** — ElevenLabs voice output was prototyped (see `src-old-backup/components/ElevenLabsTest.jsx`) but removed before the final build due to latency and scope.
- **Build artifacts committed** — `dist/` and `.vite/` are tracked in git despite being in `.gitignore`; they were committed before the ignore rules were applied. Clean-up needed.
- **No rate limiting** — The `/api/chat` and `/api/transcribe` endpoints have no rate limiting; a production deployment would need this before going public.
- **Next steps:** persist nodes to localStorage → add user auth → expand to Singapore/Dubai → live deadline sync → force-directed constellation layout → ElevenLabs TTS re-integration.
