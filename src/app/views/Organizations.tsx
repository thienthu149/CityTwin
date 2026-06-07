import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Handshake,
  Download,
  Users,
  Globe,
  Languages,
  TrendingUp,
  Target,
  Lightbulb,
} from 'lucide-react';
import { Skyline } from '../components/Skyline';
import {
  DASHBOARD,
  BUSINESS_MODEL,
  GTM_PHASES,
  HONESTY_NOTE,
} from '../data/mockData';

interface OrganizationsProps {
  onRequestPartnership: () => void;
  onDownloadReport: () => void;
  onBackToTalent: () => void;
}

function BarChart({
  data,
  unit,
  color,
}: {
  data: { label: string; value: number }[];
  unit: string;
  color: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-white/70">{d.label}</span>
            <span className="font-mono-label text-white/45">
              {d.value}
              {unit}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/8">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(d.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="h-full rounded-full"
              style={{ background: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${accent}1f`, color: accent }}>
          {icon}
        </span>
        <span className="font-mono-label text-[9px] text-white/45">{label}</span>
      </div>
      <div className="font-display mt-2 text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

export function Organizations({
  onRequestPartnership,
  onDownloadReport,
  onBackToTalent,
}: OrganizationsProps) {
  const s = DASHBOARD.stats;
  return (
    <div className="ct-bg min-h-screen w-full">
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-28 pt-24">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono-label text-[10px] text-[#5BA8FF]">City Twin for Organizations</div>
          <h1 className="font-display mt-2 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
            The right talent. Ready to stay.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
            From individual onboarding to city-level talent intelligence. City Twin does not only
            match people to opportunities — it helps Hong Kong understand what international talent
            needs, where people get stuck, and which ecosystem partners matter most.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard icon={<Users className="h-4 w-4" />} label="Pilot users" value={`${s.pilotUsers}`} accent="#5BA8FF" />
          <StatCard icon={<Globe className="h-4 w-4" />} label="Countries" value={`${s.countries}`} accent="#2BD9A8" />
          <StatCard icon={<Languages className="h-4 w-4" />} label="Languages used" value={`${s.languages}`} accent="#B98CFF" />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Avg Integration Score"
            value={`${s.avgScoreBefore} → ${s.avgScoreAfter}`}
            accent="#FFC94D"
          />
        </div>

        {/* Charts */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="glass rounded-3xl p-6">
            <h3 className="font-display text-lg font-bold text-white">Top talent needs</h3>
            <p className="font-mono-label mt-0.5 text-[9px] text-white/40">Share of pilot users reporting</p>
            <div className="mt-4">
              <BarChart data={DASHBOARD.needsChart} unit="%" color="#5BA8FF" />
            </div>
          </div>
          <div className="glass rounded-3xl p-6">
            <h3 className="font-display text-lg font-bold text-white">Most matched partners</h3>
            <p className="font-mono-label mt-0.5 text-[9px] text-white/40">Matches across the pilot</p>
            <div className="mt-4">
              <BarChart data={DASHBOARD.partnerChart} unit=" matches" color="#FF6FA5" />
            </div>
          </div>
        </div>

        {/* Insight cards */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="glass rounded-3xl border-l-2 border-[#FF6FA5]/60 p-6">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[#FF6FA5]" />
              <h3 className="font-mono-label text-[10px] text-[#FF6FA5]">Key integration gap</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{DASHBOARD.integrationGap}</p>
          </div>
          <div className="glass rounded-3xl border-l-2 border-[#2BD9A8]/60 p-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[#2BD9A8]" />
              <h3 className="font-mono-label text-[10px] text-[#2BD9A8]">Recommended action</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{DASHBOARD.recommendedAction}</p>
          </div>
        </div>

        {/* Banner line */}
        <p className="font-display mt-10 text-center text-xl text-white/80">
          Hong Kong already has the opportunities. City Twin makes them{' '}
          <span className="text-[#56D9FF]">discoverable</span>,{' '}
          <span className="text-[#FFC94D]">actionable</span> and{' '}
          <span className="text-[#2BD9A8]">measurable</span>.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRequestPartnership}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5BA8FF] to-[#B98CFF] px-6 py-3 text-sm font-semibold text-[#070a18] transition hover:opacity-95"
          >
            <Handshake className="h-4 w-4" />
            Request partnership
          </button>
          <button
            onClick={onDownloadReport}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            Download pilot report
          </button>
          <button
            onClick={onBackToTalent}
            className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to talent demo
          </button>
        </div>

        {/* Business model */}
        <section className="mt-20">
          <h2 className="font-display text-3xl font-bold text-white">Business Model</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {BUSINESS_MODEL.map((b, i) => (
              <div key={b.title} className="glass rounded-3xl p-6">
                <div className="font-display text-3xl font-bold text-white/15">0{i + 1}</div>
                <h3 className="font-display mt-1 text-lg font-bold text-white">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* GTM */}
        <section className="mt-16">
          <h2 className="font-display text-3xl font-bold text-white">Go-to-market</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {GTM_PHASES.map((p, i) => (
              <div key={p.phase} className="glass relative rounded-3xl p-5">
                <div className="font-mono-label text-[10px] text-[#56D9FF]">{p.phase}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{p.body}</p>
                {i < GTM_PHASES.length - 1 && (
                  <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-white/20 md:block" />
                )}
              </div>
            ))}
          </div>
          <p className="font-display mt-8 text-center text-lg text-white/80">
            Start in Hong Kong. Scale to cities competing for global talent.
          </p>
        </section>

        <p className="mt-16 text-center text-[11px] text-white/35">{HONESTY_NOTE}</p>

        <Skyline className="opacity-40" />
      </div>
    </div>
  );
}
