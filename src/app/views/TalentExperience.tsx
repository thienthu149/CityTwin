import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Route, ArrowLeft } from 'lucide-react';
import { Constellation, type MapNode } from '../components/Constellation';
import { Skyline } from '../components/Skyline';
import { OpportunityCard } from '../components/OpportunityCard';
import { CategoryPanel } from '../components/CategoryPanel';
import { IntegrationScorePanel } from '../components/IntegrationScorePanel';
import { JourneyTimeline } from '../components/JourneyTimeline';
import { InputBar } from '../components/InputBar';
import { generateCityTwinResponse, EXAMPLES, type CityTwinResponse } from '../lib/generateResponse';
import {
  CATEGORIES,
  OPPORTUNITIES,
  OPPORTUNITY_MAP,
  HONESTY_NOTE,
  type CategoryId,
} from '../data/mockData';

export function TalentExperience() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<CityTwinResponse | null>(null);
  const [zoomed, setZoomed] = useState<CategoryId | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [replayToken, setReplayToken] = useState(0);
  const [showJourney, setShowJourney] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lastUserText, setLastUserText] = useState('');
  const [showChat, setShowChat] = useState(false);

  const mapped = response !== null;

  const runQuery = (text: string) => {
    const res = generateCityTwinResponse(text);
    setResponse(res);
    setZoomed(null);
    setSelectedOpp(null);
    setHighlighted([]);
    setInput('');
    setReplayToken((t) => t + 1);
    // Show the conversational exchange briefly, then fade to the clean map.
    setLastUserText(text);
    setShowChat(true);
    window.setTimeout(() => setShowChat(false), 5200);
  };

  const openCategory = (catId: string) => {
    setZoomed(catId as CategoryId);
    setSelectedOpp(null);
    setHighlighted([]);
    setReplayToken((t) => t + 1);
  };

  const backToCategories = () => {
    setZoomed(null);
    setSelectedOpp(null);
    setHighlighted([]);
    setReplayToken((t) => t + 1);
  };

  const handleSave = (id: string) => {
    setSaved((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setToast('Saved to your journey');
    window.setTimeout(() => setToast(null), 1800);
  };

  // Build the nodes for the current map level — STRICTLY from the response.
  const categoryNodes: MapNode[] = useMemo(
    () =>
      response
        ? response.categories.map((c) => ({ id: c.id, label: c.label, color: c.color, tip: c.fullLabel }))
        : [],
    [response],
  );
  const opportunityNodes: MapNode[] = useMemo(
    () =>
      zoomed
        ? OPPORTUNITIES[zoomed].map((o) => ({
            id: o.id,
            label: o.title,
            color: CATEGORIES[zoomed].color,
            value: o.match,
            tip: o.partner,
          }))
        : [],
    [zoomed],
  );

  const selectedOpportunity = selectedOpp ? OPPORTUNITY_MAP[selectedOpp] : null;

  // The sidebar / mobile panel content, in priority order.
  const panels = (
    <>
      <AnimatePresence mode="wait">
        {selectedOpportunity ? (
          <OpportunityCard
            key={selectedOpportunity.id}
            opportunity={selectedOpportunity}
            saved={saved.includes(selectedOpportunity.id)}
            onSave={() => handleSave(selectedOpportunity.id)}
            onShowRelated={() => setHighlighted(selectedOpportunity.related)}
            onClose={() => {
              setSelectedOpp(null);
              setHighlighted([]);
            }}
          />
        ) : zoomed ? (
          <CategoryPanel
            key={zoomed}
            category={CATEGORIES[zoomed]}
            count={OPPORTUNITIES[zoomed].length}
            onBack={backToCategories}
          />
        ) : null}
      </AnimatePresence>
      {response && (
        <IntegrationScorePanel
          before={response.scoreBefore}
          after={response.scoreAfter}
          riskBefore={response.riskBefore}
          riskAfter={response.riskAfter}
        />
      )}
    </>
  );

  return (
    <div className="ct-bg relative flex min-h-screen flex-col pt-16">
      <Skyline className="z-0 opacity-40" />

      {/* MIDDLE ZONE: map (+ desktop sidebar) */}
      <div className="relative z-10 flex flex-1">
        <div className="relative flex-1">
          {/* Empty calm state */}
          {!mapped && (
            <div className="absolute inset-0 grid place-items-center px-6 text-center">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
                <div className="font-mono-label mb-5 inline-block rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[10px] text-[#56D9FF]">
                  ◉ Human Integration Infrastructure
                </div>
                <h1 className="font-display text-6xl font-bold leading-none text-white md:text-7xl">City Twin</h1>
                <p className="font-display mt-4 text-lg text-white/80 md:text-xl">
                  Speak your language. Hong Kong understands your path.
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50">
                  The onboarding layer that turns a newcomer’s needs into a personalized map of
                  opportunities, communities and next steps.
                </p>
              </motion.div>
            </div>
          )}

          {/* Constellation */}
          {mapped && (
            <>
              {/* profile summary chip */}
              <div className="pointer-events-none absolute inset-x-0 top-3 z-30 flex justify-center px-4">
                <div className="glass rounded-full px-4 py-1.5 text-center">
                  <span className="font-mono-label text-[9px] text-white/40">Detected profile</span>
                  <span className="ml-2 text-xs text-white/85">{response!.summary}</span>
                </div>
              </div>

              {/* transient conversation bubbles (user + City Twin reply) */}
              <AnimatePresence>
                {showChat && !zoomed && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="pointer-events-none absolute inset-x-0 top-14 z-30 mx-auto flex w-full max-w-md flex-col gap-2 px-4"
                  >
                    {lastUserText && (
                      <div className="max-w-[80%] self-end rounded-2xl bg-white/90 px-3.5 py-2 text-sm leading-snug text-[#070a18]">
                        {lastUserText}
                      </div>
                    )}
                    <div className="glass max-w-[88%] self-start rounded-2xl px-3.5 py-2">
                      <div className="font-mono-label mb-0.5 text-[8px] text-[#56D9FF]">◉ City Twin</div>
                      <div className="text-sm leading-snug text-white/85">{response!.message}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* back button when zoomed */}
              {zoomed && (
                <button
                  onClick={backToCategories}
                  className="glass absolute left-3 top-14 z-30 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white/85 transition hover:bg-white/10"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to categories
                </button>
              )}

              {zoomed ? (
                <Constellation
                  centerLabel={CATEGORIES[zoomed].short}
                  centerColor={CATEGORIES[zoomed].color}
                  nodes={opportunityNodes}
                  selectedId={selectedOpp}
                  highlightedIds={highlighted}
                  onNodeClick={setSelectedOpp}
                  variant="opportunity"
                  replayToken={replayToken}
                />
              ) : (
                <Constellation
                  centerLabel="YOU"
                  centerSub={response!.role}
                  nodes={categoryNodes}
                  selectedId={null}
                  highlightedIds={[]}
                  onNodeClick={openCategory}
                  variant="category"
                  replayToken={replayToken}
                />
              )}
            </>
          )}
        </div>

        {/* DESKTOP SIDEBAR */}
        {mapped && (
          <aside className="hidden w-[360px] shrink-0 space-y-3 overflow-y-auto px-4 py-4 lg:block">
            {panels}
          </aside>
        )}
      </div>

      {/* MOBILE PANEL (inline, no overlap) */}
      {mapped && <div className="relative z-10 space-y-3 px-4 lg:hidden">{panels}</div>}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed left-1/2 top-20 z-[55] -translate-x-1/2 rounded-full bg-[#2BD9A8] px-4 py-2 text-xs font-semibold text-[#070a18]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM ZONE: input dock */}
      <div className="relative z-10 px-4 pb-5 pt-3">
        <div className="mx-auto w-full max-w-[560px]">
          {!mapped && (
            <p className="mb-3 text-center text-sm text-white/55">
              Tell City Twin who you are and what you need in Hong Kong.
            </p>
          )}

          <InputBar value={input} onChange={setInput} onSubmit={runQuery} />

          {/* secondary example prompts */}
          {!mapped && (
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-white/35">
              <span className="font-mono-label text-[9px]">Try an example:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.key}
                  onClick={() => {
                    setInput(ex.text);
                    runQuery(ex.text);
                  }}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-white/55 transition hover:border-white/25 hover:text-white"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          )}

          {mapped && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                onClick={() => setReplayToken((t) => t + 1)}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/85 transition hover:bg-white/10"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#B98CFF]" />
                Build my constellation
              </button>
              <button
                onClick={() => setShowJourney(true)}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/85 transition hover:bg-white/10"
              >
                <Route className="h-3.5 w-3.5 text-[#56D9FF]" />
                View your journey
                {saved.length > 0 && (
                  <span className="ml-1 rounded-full bg-[#56D9FF] px-1.5 py-0.5 font-mono-label text-[9px] text-[#070a18]">{saved.length}</span>
                )}
              </button>
            </div>
          )}

          <p className="mt-2.5 text-center text-[10px] leading-snug text-white/25">{HONESTY_NOTE}</p>
        </div>
      </div>

      {/* Journey drawer */}
      <AnimatePresence>
        {showJourney && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
              onClick={() => setShowJourney(false)}
            />
            <JourneyTimeline summary={response?.summary ?? ''} savedIds={saved} onClose={() => setShowJourney(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
