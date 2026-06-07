import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Lock } from 'lucide-react';
import { EarthHorizon } from '../components/EarthHorizon';

interface HomeProps {
  onEnterHongKong: () => void;
}

interface CityOption {
  id: string;
  name: string;
  status: string;
  live: boolean;
}

const CITIES: CityOption[] = [
  { id: 'hk', name: 'Hong Kong', status: 'Live · founding constellation', live: true },
  { id: 'dubai', name: 'Dubai', status: 'Coming soon', live: false },
  { id: 'london', name: 'London', status: 'Coming 2026', live: false },
];

export function Home({ onEnterHongKong }: HomeProps) {
  const [toast, setToast] = useState<string | null>(null);

  const comingSoon = () => {
    setToast('Coming soon — Hong Kong is the founding constellation.');
    window.setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="ct-bg relative min-h-screen overflow-hidden">
      {/* Earth horizon anchored to the bottom third */}
      <EarthHorizon className="z-0 h-[48%] md:h-[52%]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 pb-12 pt-28 text-center">
        {/* TOP: branding */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
          <h1 className="font-display text-6xl font-bold leading-none text-white md:text-7xl">City Twin</h1>
          <p className="font-display mt-4 text-lg text-white/85 md:text-xl">
            Human Integration Infrastructure for Hong Kong
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/55">
            The onboarding layer that helps global talent navigate a new city — and helps cities
            understand talent integration.
          </p>
        </motion.div>

        {/* MIDDLE: city selector */}
        <div className="mt-10 w-full max-w-2xl">
          <div className="font-mono-label mb-3 text-[10px] text-white/45">Choose your city</div>
          <div className="grid gap-3 sm:grid-cols-3">
            {CITIES.map((city, i) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.1 }}
                className={`glass flex flex-col rounded-2xl p-4 text-left ${city.live ? 'border-[#56D9FF]/40' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold text-white">{city.name}</span>
                  {city.live ? (
                    <span className="flex items-center gap-1 rounded-full bg-[#2BD9A8] px-2 py-0.5 font-mono-label text-[8px] text-[#070a18]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#070a18]" /> Live
                    </span>
                  ) : (
                    <span className="font-mono-label rounded-full border border-white/15 px-2 py-0.5 text-[8px] text-white/45">Soon</span>
                  )}
                </div>
                <span className="font-mono-label mt-1 text-[9px] text-white/45">{city.status}</span>

                {city.live ? (
                  <button
                    onClick={onEnterHongKong}
                    className="group mt-3 flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-[#070a18] transition hover:bg-white/90"
                  >
                    Enter Hong Kong
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <button
                    onClick={comingSoon}
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-sm font-medium text-white/40 transition hover:bg-white/[0.06]"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Coming soon
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* BOTTOM: tagline above the horizon */}
        <div className="flex-1" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-display text-sm text-white/60"
        >
          Start in Hong Kong. Scale to cities competing for global talent.
        </motion.p>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="glass-strong fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm text-white/85"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
