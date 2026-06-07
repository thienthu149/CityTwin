import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import type { Category } from '../data/mockData';

interface CategoryPanelProps {
  category: Category;
  count: number;
  onBack: () => void;
}

// Sidebar panel shown while a category is zoomed in (before an opportunity is picked).
export function CategoryPanel({ category, count, onBack }: CategoryPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="glass-strong rounded-2xl p-5"
      style={{ boxShadow: `0 16px 60px rgba(0,0,0,0.5), 0 0 30px ${category.color}22` }}
    >
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: category.color, boxShadow: `0 0 10px ${category.color}` }} />
        <span className="font-mono-label text-[9px]" style={{ color: category.color }}>Category</span>
        <span className="ml-auto font-mono-label text-[9px] text-white/40">{count} opportunities</span>
      </div>
      <h3 className="font-display mt-2 text-xl font-bold leading-tight text-white">{category.label}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-white/70">{category.explanation}</p>
      <p className="mt-3 text-[11px] text-white/45">Tap a node on the map to open an opportunity.</p>

      <button
        onClick={onBack}
        className="mt-4 flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/85 transition hover:bg-white/10"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to categories
      </button>
    </motion.div>
  );
}
