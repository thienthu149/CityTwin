// Minimal Earth-from-orbit horizon — pure SVG + CSS, lightweight and responsive.
// A huge-radius circle renders only its top arc as a gentle curved horizon, with
// a thin luminous edge, soft cyan atmosphere, faint city lights and a slow shimmer.
// Not a realistic globe — a calm, premium visual anchor: "global, starting with HK".

export function EarthHorizon({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 select-none ${className}`} aria-hidden>
      {/* atmospheric glow rising off the horizon */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 75% at 50% 100%, rgba(64,150,255,0.20), rgba(64,150,255,0.05) 45%, transparent 72%)',
        }}
      />

      <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="earth-body" x1="0" y1="240" x2="0" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#16264f" />
            <stop offset="35%" stopColor="#0a1330" />
            <stop offset="100%" stopColor="#04060e" />
          </linearGradient>
          <linearGradient id="earth-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(120,200,255,0.25)" />
            <stop offset="50%" stopColor="rgba(170,225,255,0.95)" />
            <stop offset="100%" stopColor="rgba(120,200,255,0.25)" />
          </linearGradient>
          <filter id="earth-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* Earth body */}
        <circle cx="720" cy="2000" r="1750" fill="url(#earth-body)" />

        {/* soft atmosphere halo (blurred edge) */}
        <circle cx="720" cy="2000" r="1750" fill="none" stroke="#5BB8FF" strokeWidth="8" filter="url(#earth-blur)" opacity="0.45">
          <animate attributeName="opacity" values="0.32;0.55;0.32" dur="6s" repeatCount="indefinite" />
        </circle>

        {/* thin luminous top edge */}
        <circle cx="720" cy="2000" r="1750" fill="none" stroke="url(#earth-edge)" strokeWidth="2" />

        {/* slow shimmer travelling across the horizon */}
        <circle
          cx="720"
          cy="2000"
          r="1750"
          fill="none"
          stroke="rgba(200,235,255,0.9)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="170 10826"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-10996" dur="11s" repeatCount="indefinite" />
        </circle>

        {/* faint warm/cyan city-light clusters near the edge */}
        {CITY_LIGHTS.map(([cx, cy, r, c, dur], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={c}>
            <animate attributeName="opacity" values="0.25;0.8;0.25" dur={`${dur}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}

// [cx, cy, r, color, shimmerDuration] — just inside the top arc.
const CITY_LIGHTS: [number, number, number, string, number][] = [
  [520, 271, 1.6, '#FFE0A3', 3.4],
  [620, 262, 1.4, '#9FD8FF', 4.2],
  [720, 258, 1.8, '#CFEBFF', 3.0],
  [820, 262, 1.4, '#FFE0A3', 4.8],
  [930, 272, 1.6, '#9FD8FF', 3.8],
  [1040, 286, 1.3, '#FFE0A3', 4.4],
  [400, 286, 1.3, '#9FD8FF', 3.6],
];
