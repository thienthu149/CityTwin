import { motion } from 'motion/react';
import { X, Check, Bookmark } from 'lucide-react';
import { JOURNEY_STEPS, CATEGORIES, OPPORTUNITY_MAP } from '../data/mockData';

interface JourneyTimelineProps {
  summary: string;
  savedIds: string[];
  onClose: () => void;
}

export function JourneyTimeline({ summary, savedIds, onClose }: JourneyTimelineProps) {
  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="glass-strong fixed right-0 top-0 z-[60] flex h-full w-[420px] max-w-[92vw] flex-col rounded-l-3xl"
    >
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <div className="font-mono-label text-[10px] text-[#56D9FF]">Your journey</div>
          <h2 className="font-display mt-1 text-2xl font-bold text-white">Your Hong Kong onboarding path</h2>
          {summary && <p className="mt-1 text-xs text-white/55">{summary}</p>}
        </div>
        <button
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8">
        <ol className="relative ml-3 border-l border-white/15">
          {JOURNEY_STEPS.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative mb-7 pl-6"
            >
              <span className="absolute -left-[11px] grid h-5 w-5 place-items-center rounded-full bg-[#2BD9A8] text-[#070a18]">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono-label text-[9px] text-[#56D9FF]">{step.timestamp}</span>
                <span className="font-mono-label text-[9px] text-[#2BD9A8]">Completed</span>
              </div>
              <h3 className="font-display mt-1 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-0.5 text-sm leading-snug text-white/65">{step.description}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-[#FFC94D]" />
            <h3 className="font-display text-sm font-bold text-white">Saved opportunities</h3>
            <span className="ml-auto font-mono-label text-[10px] text-white/40">{savedIds.length} saved</span>
          </div>

          {savedIds.length === 0 ? (
            <p className="mt-3 text-sm text-white/45">Open a node and tap “Save to journey” to add opportunities here.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {savedIds.map((id) => {
                const o = OPPORTUNITY_MAP[id];
                if (!o) return null;
                const cat = CATEGORIES[o.category];
                return (
                  <li key={id} className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-2.5">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: cat.color, boxShadow: `0 0 8px ${cat.color}` }} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-white">{o.title}</div>
                      <div className="truncate text-xs text-white/50">{o.partner}</div>
                    </div>
                    <span className="ml-auto font-mono-label text-[10px]" style={{ color: cat.color }}>{o.match}%</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
