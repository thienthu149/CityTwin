import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface IntegrationScoreProps {
  before: number;
  after: number;
  riskBefore: string;
  riskAfter: string;
}

// Compact Integration Score card for the sidebar — never overlaps the map.
export function IntegrationScorePanel({ before, after, riskBefore, riskAfter }: IntegrationScoreProps) {
  const [display, setDisplay] = useState(before);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(before + (after - before) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [before, after]);

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-[#2BD9A8]" />
        <h3 className="font-display text-sm font-bold text-white">Integration Score</h3>
      </div>

      <div className="mt-3 flex items-end gap-3">
        <div>
          <div className="font-mono-label text-[8px] text-white/40">Before</div>
          <div className="font-display text-lg font-bold text-white/45">{before}<span className="text-xs text-white/30">/100</span></div>
        </div>
        <div className="mb-1 text-white/30">→</div>
        <div>
          <div className="font-mono-label text-[8px] text-[#2BD9A8]">After</div>
          <div className="font-display text-3xl font-bold text-[#2BD9A8] leading-none">{display}<span className="text-sm text-white/40">/100</span></div>
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-2 text-[11px]">
        <span className="font-mono-label text-white/40">Risk</span>
        <span className="rounded-full bg-[#FF6FA5]/15 px-2 py-0.5 font-medium text-[#FF6FA5]">{riskBefore}</span>
        <span className="text-white/30">→</span>
        <span className="rounded-full bg-[#2BD9A8]/15 px-2 py-0.5 font-medium text-[#2BD9A8]">{riskAfter}</span>
      </div>

      <p className="mt-3 text-[10px] leading-snug text-white/40">
        Prototype heuristic based on opportunity fit, community access and next-step clarity.
      </p>
    </div>
  );
}
