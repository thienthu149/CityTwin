import { motion } from 'motion/react';
import { X, Bookmark, Share2, Check } from 'lucide-react';
import { CATEGORIES, type Opportunity } from '../data/mockData';

interface OpportunityCardProps {
  opportunity: Opportunity;
  saved: boolean;
  onSave: () => void;
  onShowRelated: () => void;
  onClose: () => void;
}

// Sidebar / bottom-sheet card — intentionally does not cover the map.
export function OpportunityCard({ opportunity, saved, onSave, onShowRelated, onClose }: OpportunityCardProps) {
  const cat = CATEGORIES[opportunity.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="glass-strong relative rounded-2xl p-5"
      style={{ boxShadow: `0 16px 60px rgba(0,0,0,0.5), 0 0 30px ${cat.color}22` }}
    >
      <button
        onClick={onClose}
        className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2 pr-6">
        <span className="h-2 w-2 rounded-full" style={{ background: cat.color, boxShadow: `0 0 8px ${cat.color}` }} />
        <span className="font-mono-label text-[9px]" style={{ color: cat.color }}>{cat.label}</span>
        <span className="ml-auto rounded-full px-2 py-0.5 font-mono-label text-[9px] text-[#070a18]" style={{ background: cat.color }}>
          {opportunity.match}%
        </span>
      </div>

      <h3 className="font-display mt-2 text-xl font-bold leading-tight text-white">{opportunity.title}</h3>
      <p className="mt-0.5 text-xs text-white/55">{opportunity.partner}</p>

      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="font-mono-label text-[8px] text-white/40">Why it matches</div>
        <p className="mt-1 text-[13px] leading-relaxed text-white/85">{opportunity.why}</p>
      </div>

      <div className="mt-2.5 flex items-start gap-2">
        <div className="font-mono-label mt-0.5 text-[8px] text-white/40">Next&nbsp;step</div>
        <p className="text-[13px] leading-relaxed text-white/85">{opportunity.nextStep}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onSave}
          disabled={saved}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#070a18] transition disabled:opacity-90"
          style={{ background: saved ? '#2BD9A8' : cat.color }}
        >
          {saved ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
          {saved ? 'Saved' : 'Save to journey'}
        </button>
        <button
          onClick={onShowRelated}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/85 transition hover:bg-white/10"
        >
          <Share2 className="h-3.5 w-3.5" />
          Related
        </button>
      </div>
    </motion.div>
  );
}
