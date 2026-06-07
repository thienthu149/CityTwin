import { useMemo } from 'react';
import { motion } from 'motion/react';

export interface MapNode {
  id: string;
  label: string; // short label under the node
  color: string;
  value?: number; // optional number shown inside (e.g. match %)
  tip?: string; // optional hover tooltip text
}

interface ConstellationProps {
  centerLabel: string;
  centerSub?: string;
  centerColor?: string; // undefined → white "YOU" node
  nodes: MapNode[];
  selectedId: string | null;
  highlightedIds: string[];
  onNodeClick: (id: string) => void;
  variant: 'category' | 'opportunity';
  /** Change this value to replay the build animation (remounts the scene). */
  replayToken: number;
}

const CENTER = { x: 50, y: 46 };

// Balanced radial layout with an empty wedge at the bottom (so nodes never
// crowd the input bar) and a radius that grows with the node count to keep
// circles and labels from ever overlapping. Symmetric about the vertical axis.
function layout(n: number) {
  const gap = n <= 4 ? 96 : n <= 6 ? 72 : 56; // degrees of clear space at the bottom
  const arc = 360 - gap;
  const startA = 90 + gap / 2; // just clockwise of straight-down
  const rx = n <= 4 ? 32 : n <= 6 ? 36 : 39;
  const ry = n <= 4 ? 27 : n <= 6 ? 30 : 32;

  return Array.from({ length: n }, (_, i) => {
    const deg = startA + (arc * (i + 0.5)) / n; // segment centres → even spacing
    const a = (deg * Math.PI) / 180;
    const x = CENTER.x + rx * Math.cos(a);
    const y = CENTER.y + ry * Math.sin(a);
    // gentle curved connector, bowed perpendicular to the YOU→node line
    const mx = (CENTER.x + x) / 2;
    const my = (CENTER.y + y) / 2;
    const dx = x - CENTER.x;
    const dy = y - CENTER.y;
    const path = `M ${CENTER.x} ${CENTER.y} Q ${mx - dy * 0.14} ${my + dx * 0.14} ${x} ${y}`;
    return { x, y, path };
  });
}

// Deterministic faint background star points (percent coordinates).
const STARS: { x: number; y: number; s: number; o: number; tw: boolean }[] = [
  { x: 12, y: 18, s: 2, o: 0.5, tw: true }, { x: 24, y: 62, s: 1.5, o: 0.4, tw: false },
  { x: 33, y: 30, s: 1.5, o: 0.35, tw: false }, { x: 44, y: 12, s: 2, o: 0.5, tw: true },
  { x: 58, y: 22, s: 1.5, o: 0.4, tw: false }, { x: 67, y: 58, s: 2, o: 0.45, tw: true },
  { x: 78, y: 28, s: 1.5, o: 0.4, tw: false }, { x: 86, y: 16, s: 2, o: 0.5, tw: false },
  { x: 90, y: 50, s: 1.5, o: 0.35, tw: true }, { x: 16, y: 44, s: 1.5, o: 0.35, tw: false },
  { x: 52, y: 40, s: 1.5, o: 0.3, tw: false }, { x: 72, y: 40, s: 1.5, o: 0.35, tw: true },
  { x: 38, y: 52, s: 1.5, o: 0.3, tw: false }, { x: 62, y: 14, s: 1.5, o: 0.4, tw: false },
];

export function Constellation({
  centerLabel,
  centerSub,
  centerColor,
  nodes,
  selectedId,
  highlightedIds,
  onNodeClick,
  variant,
  replayToken,
}: ConstellationProps) {
  const placed = useMemo(() => layout(nodes.length), [nodes.length]);
  const size = variant === 'category' ? 54 : 46;

  return (
    <div key={replayToken} className="absolute inset-0">
      {/* faint anchor stars */}
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            opacity: s.o,
            animation: s.tw ? `ct-pulse ${3 + (i % 3)}s ease-in-out infinite` : undefined,
          }}
        />
      ))}

      {/* Connecting lines — soft glow under a crisp thin line, drawn in progressively */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {placed.map((p, i) => {
          const node = nodes[i];
          const active = selectedId === node.id || highlightedIds.includes(node.id);
          const dim = selectedId && !active;
          return (
            <g key={node.id}>
              <path
                d={p.path}
                fill="none"
                pathLength={1}
                stroke={node.color}
                strokeWidth={active ? 4 : 3}
                strokeOpacity={dim ? 0.04 : active ? 0.22 : 0.12}
                vectorEffect="non-scaling-stroke"
                className="ct-line"
                style={{ animationDelay: `${0.35 + i * 0.1}s` }}
              />
              <path
                d={p.path}
                fill="none"
                pathLength={1}
                stroke={node.color}
                strokeWidth={active ? 1.4 : 1}
                strokeOpacity={dim ? 0.15 : active ? 0.9 : 0.5}
                vectorEffect="non-scaling-stroke"
                className="ct-line"
                style={{ animationDelay: `${0.35 + i * 0.1}s` }}
              />
            </g>
          );
        })}
      </svg>

      {/* Center node */}
      <motion.div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
      >
        <div
          className="grid place-items-center rounded-full"
          style={{
            width: 100,
            height: 100,
            background: centerColor
              ? `radial-gradient(circle at 42% 34%, #fff 0%, ${centerColor} 36%, ${centerColor}22 100%)`
              : 'radial-gradient(circle at 42% 34%, #ffffff 0%, #cfe2ff 48%, rgba(150,190,255,0.45) 100%)',
            border: centerColor ? `1.5px solid ${centerColor}` : '1px solid rgba(255,255,255,0.6)',
            boxShadow: centerColor
              ? `0 0 50px 12px ${centerColor}66, inset 0 2px 8px rgba(255,255,255,0.5)`
              : '0 0 55px 14px rgba(120,180,255,0.45), inset 0 2px 10px rgba(255,255,255,0.7)',
            animation: 'ct-you-pulse 3.6s ease-in-out infinite',
          }}
        >
          <div className="px-2 text-center">
            <div className="font-display text-sm font-bold leading-tight text-[#070a18]">{centerLabel}</div>
            {centerSub && <div className="font-mono-label mt-0.5 text-[8px] text-[#1a2348]">{centerSub}</div>}
          </div>
        </div>
      </motion.div>

      {/* Orbit nodes */}
      {placed.map((p, i) => {
        const node = nodes[i];
        const isSelected = selectedId === node.id;
        const isHi = highlightedIds.includes(node.id);
        const dimmed = selectedId !== null && !isSelected && !isHi;
        const dim = size + (isSelected ? 10 : 0);
        return (
          <motion.button
            key={node.id}
            type="button"
            onClick={() => onNodeClick(node.id)}
            className="group absolute z-10 flex flex-col items-center gap-2 focus:outline-none"
            style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isSelected ? 1.12 : 1, opacity: dimmed ? 0.32 : 1 }}
            transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 180, damping: 15 }}
            whileHover={{ scale: isSelected ? 1.15 : 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            {node.tip && (
              <span className="pointer-events-none absolute bottom-full mb-1 hidden whitespace-nowrap rounded-lg border border-white/10 bg-[#0b1126] px-2 py-1 text-[10px] text-white/80 opacity-0 shadow-lg transition group-hover:block group-hover:opacity-100">
                {node.tip}
              </span>
            )}
            {/* subtle per-node parallax float (varied speed for depth) */}
            <span
              className="relative grid place-items-center"
              style={{ animation: `ct-float ${5 + (i % 3) * 1.3}s ease-in-out infinite`, animationDelay: `${i * 0.45}s` }}
            >
              <span
                className="grid place-items-center rounded-full"
                style={{
                  width: dim,
                  height: dim,
                  background: `radial-gradient(circle at 40% 32%, #ffffff55 0%, ${node.color} 34%, ${node.color}18 100%)`,
                  boxShadow: `0 0 ${isSelected ? 34 : 20}px ${isSelected ? 10 : 6}px ${node.color}${isSelected ? '99' : '4d'}, inset 0 1px 4px rgba(255,255,255,0.4)`,
                  border: `1.5px solid ${node.color}`,
                }}
              >
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: node.color, opacity: 0.18, animation: 'ct-pulse 3s ease-in-out infinite', animationDelay: `${i * 0.3}s` }}
                />
                {node.value !== undefined && (
                  <span className="relative font-display text-xs font-bold text-[#070a18]">{node.value}</span>
                )}
              </span>
            </span>
            <span
              className="max-w-[100px] text-center font-mono-label text-[10px] leading-tight"
              style={{ color: dimmed ? 'rgba(233,237,255,0.4)' : node.color, textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
            >
              {node.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
