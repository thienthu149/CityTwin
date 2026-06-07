// A subtle, recognizable Hong Kong skyline silhouette anchored to the bottom.
// Outline-based (not a bulky block) with a soft city glow. Pure SVG — never
// fails to load, and scales cleanly on 16:9 laptop screens.

export function Skyline({ className = '' }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 select-none ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 260"
        preserveAspectRatio="xMidYMax slice"
        className="h-[150px] w-full md:h-[200px]"
      >
        <defs>
          <linearGradient id="sky-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(14,22,52,0.0)" />
            <stop offset="100%" stopColor="rgba(10,16,40,0.85)" />
          </linearGradient>
          <linearGradient id="city-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(91,168,255,0)" />
            <stop offset="100%" stopColor="rgba(91,168,255,0.22)" />
          </linearGradient>
        </defs>

        {/* soft ground glow */}
        <rect x="0" y="120" width="1440" height="140" fill="url(#city-glow)" />

        {/* back row — distant, dim, thin outline for depth */}
        <path
          d={BACK_ROW}
          fill="rgba(12,18,44,0.5)"
          stroke="rgba(120,160,230,0.18)"
          strokeWidth="1"
        />

        {/* front row — recognizable HK towers, tapered peaks + antennas */}
        <path d={FRONT_ROW} fill="url(#sky-fill)" stroke="rgba(140,180,255,0.45)" strokeWidth="1.2" />

        {/* antennas on the tallest towers (ICC / IFC-style) */}
        <g stroke="rgba(150,190,255,0.5)" strokeWidth="1.2">
          <line x1="430" y1="70" x2="430" y2="44" />
          <line x1="980" y1="58" x2="980" y2="30" />
        </g>

        {/* scattered window lights */}
        {LIGHTS.map(([x, y, c], i) => (
          <rect key={i} x={x} y={y} width="2.5" height="2.5" rx="0.5" fill={c} opacity="0.8" />
        ))}
      </svg>
    </div>
  );
}

// Front silhouette: low-rise on the flanks rising to two tapered super-towers
// (one left-of-centre, one right-of-centre) — reads as Victoria Harbour.
const FRONT_ROW =
  'M0 260 V210 H60 V190 H110 V206 H150 V150 H190 V200 H230 V172 H275 V120 H300 V200 H340 V160 H375 ' +
  'L410 90 L430 70 L450 90 L460 200 H505 V150 H540 V200 H585 V130 H615 V200 H655 V165 H695 V110 H720 V200 ' +
  'H760 V150 H800 V200 H845 V120 H875 V90 H895 V200 H940 L965 84 L980 58 L995 84 L1015 200 H1060 V150 H1095 V200 ' +
  'H1140 V128 H1168 V200 H1210 V160 H1250 V108 H1275 V200 H1315 V172 H1355 V200 H1395 V186 H1440 V260 Z';

// Back silhouette: shorter, offset towers behind the front row.
const BACK_ROW =
  'M0 260 V214 H80 V196 H140 V214 H210 V178 H250 V214 H320 V188 H380 V150 H410 V214 H500 V184 H560 V214 ' +
  'H640 V168 H690 V214 H780 V190 H840 V158 H880 V214 H980 V176 H1040 V214 H1130 V184 H1190 V214 H1280 V190 ' +
  'H1340 V214 H1440 V260 Z';

// Deterministic window-light positions [x, y, color].
const LIGHTS: [number, number, string][] = [
  [418, 110, '#FFC94D'], [422, 130, '#FFC94D'], [430, 96, '#56D9FF'], [438, 120, '#5BA8FF'],
  [968, 100, '#56D9FF'], [980, 84, '#FFC94D'], [990, 110, '#5BA8FF'], [285, 140, '#B98CFF'],
  [705, 130, '#2BD9A8'], [882, 110, '#FFC94D'], [1262, 128, '#FF6FA5'], [1155, 150, '#5BA8FF'],
  [615, 150, '#56D9FF'], [1095, 165, '#FFC94D'], [540, 165, '#B98CFF'], [150, 170, '#5BA8FF'],
];
