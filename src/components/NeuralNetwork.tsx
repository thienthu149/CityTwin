import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NeuralNetworkProps {
  onOpenChat?: () => void;
  onCategorySelect?: (text: string) => void;
}

const CX = 50;
const CY = 50;
const PETAL_R = 26;

const PETALS = [
  {
    id: 'community', label: 'Community', color: '#ec4899',
    children: [
      { id: 'c1', label: 'Meetup Groups', description: 'Tech meetups and networking events' },
      { id: 'c2', label: 'Co-working Spaces', description: 'Collaborative work environments' },
      { id: 'c3', label: 'Local Forums', description: 'Online community discussions' },
    ],
  },
  {
    id: 'education', label: 'Education', color: '#3b82f6',
    children: [
      { id: 'ed1', label: 'Universities', description: 'Top-ranked universities and programs' },
      { id: 'ed2', label: 'Online Courses', description: 'Digital learning platforms and MOOCs' },
      { id: 'ed3', label: 'Workshops', description: 'Hands-on skill-building sessions' },
    ],
  },
  {
    id: 'scholarship', label: 'Scholarships', color: '#10b981',
    children: [
      { id: 's1', label: 'Research Grants', description: 'Academic research funding' },
      { id: 's2', label: 'Study Abroad', description: 'International education programs' },
      { id: 's3', label: 'Innovation Awards', description: 'Recognition for innovative work' },
    ],
  },
  {
    id: 'grants', label: 'Grants', color: '#f59e0b',
    children: [
      { id: 'g1', label: 'Startup Funding', description: 'Seed funding for new ventures' },
      { id: 'g2', label: 'Government Grants', description: 'Public sector support programs' },
      { id: 'g3', label: 'Innovation Grants', description: 'Funding for innovative projects' },
    ],
  },
  {
    id: 'entrepreneurship', label: 'Entrepreneurship', color: '#8b5cf6',
    children: [
      { id: 'e1', label: 'Incubators', description: 'Startup acceleration programs' },
      { id: 'e2', label: 'Pitch Events', description: 'Investor pitch competitions' },
      { id: 'e3', label: 'Mentor Network', description: 'Expert guidance and mentorship' },
    ],
  },
  {
    id: 'culture', label: 'Culture', color: '#06b6d4',
    children: [
      { id: 'cu1', label: 'Art Galleries', description: 'Contemporary art exhibitions' },
      { id: 'cu2', label: 'Festivals', description: 'Cultural celebrations and events' },
      { id: 'cu3', label: 'Museums', description: 'Historical and cultural museums' },
    ],
  },
];

// Pre-compute node positions once — no state drift
const NODES = PETALS.map((petal, i) => {
  const angle = (i * (360 / PETALS.length) - 90) * (Math.PI / 180);
  return { ...petal, nx: CX + Math.cos(angle) * PETAL_R, ny: CY + Math.sin(angle) * PETAL_R };
});

interface Vb { x: number; y: number; w: number; h: number }

export function NeuralNetwork({ onOpenChat, onCategorySelect }: NeuralNetworkProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<{
    parentId: string;
    child: { id: string; label: string; description: string };
  } | null>(null);

  // ── Zoom / pan state ─────────────────────────────────────────────────────────
  const [viewBox, setViewBox] = useState('0 0 100 100');
  const [isZoomed, setIsZoomed] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  // vbRef mirrors viewBox state so event handlers always have latest values
  const vbRef = useRef<Vb>({ x: 0, y: 0, w: 100, h: 100 });
  // Touch gesture refs (no state updates during gesture = no re-renders)
  const pinchRef = useRef<{ dist: number; midX: number; midY: number } | null>(null);
  const dragRef = useRef<{ startCX: number; startCY: number; startVb: Vb; moved: boolean } | null>(null);
  const mouseRef = useRef<{ startX: number; startY: number; startVb: Vb; moved: boolean } | null>(null);
  const lastTapRef = useRef<number>(0);
  // Tracks mouse drags so background-tap doesn't accidentally collapse nodes after a pan
  const panHappenedRef = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const applyVb = (v: Vb) => {
      const w = Math.max(20, Math.min(100, v.w));
      const h = Math.max(20, Math.min(100, v.h));
      const x = Math.max(-10, Math.min(110 - w, v.x));
      const y = Math.max(-10, Math.min(110 - h, v.y));
      const next = { x, y, w, h };
      vbRef.current = next;
      setViewBox(`${x} ${y} ${w} ${h}`);
      setIsZoomed(w < 95);
    };

    const clientToSvg = (cx: number, cy: number) => {
      const r = svg.getBoundingClientRect();
      const { x, y, w, h } = vbRef.current;
      return {
        x: x + (cx - r.left) / r.width * w,
        y: y + (cy - r.top) / r.height * h,
      };
    };

    const zoomAt = (svgX: number, svgY: number, factor: number) => {
      const { x, y, w, h } = vbRef.current;
      const nw = w * factor;
      const nh = h * factor;
      applyVb({
        x: svgX - (svgX - x) * (nw / w),
        y: svgY - (svgY - y) * (nh / h),
        w: nw, h: nh,
      });
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const pt = clientToSvg(e.clientX, e.clientY);
      zoomAt(pt.x, pt.y, e.deltaY > 0 ? 1.12 : 1 / 1.12);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        dragRef.current = null;
        const t0 = e.touches[0], t1 = e.touches[1];
        pinchRef.current = {
          dist: Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY),
          midX: (t0.clientX + t1.clientX) / 2,
          midY: (t0.clientY + t1.clientY) / 2,
        };
      } else if (e.touches.length === 1) {
        pinchRef.current = null;
        const t = e.touches[0];
        dragRef.current = { startCX: t.clientX, startCY: t.clientY, startVb: { ...vbRef.current }, moved: false };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2 && pinchRef.current) {
        const t0 = e.touches[0], t1 = e.touches[1];
        const newDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
        const newMidX = (t0.clientX + t1.clientX) / 2;
        const newMidY = (t0.clientY + t1.clientY) / 2;
        const midSvg = clientToSvg(newMidX, newMidY);
        const factor = pinchRef.current.dist / newDist;
        const { x, y, w, h } = vbRef.current;
        const nw = w * factor;
        const nh = h * factor;
        // Zoom centered on pinch midpoint, plus simultaneous pan
        const rect = svg.getBoundingClientRect();
        const panDx = (pinchRef.current.midX - newMidX) / rect.width * nw;
        const panDy = (pinchRef.current.midY - newMidY) / rect.height * nh;
        applyVb({
          x: midSvg.x - (midSvg.x - x) * (nw / w) + panDx,
          y: midSvg.y - (midSvg.y - y) * (nh / h) + panDy,
          w: nw, h: nh,
        });
        pinchRef.current = { dist: newDist, midX: newMidX, midY: newMidY };
      } else if (e.touches.length === 1 && dragRef.current) {
        const t = e.touches[0];
        const dx = t.clientX - dragRef.current.startCX;
        const dy = t.clientY - dragRef.current.startCY;
        if (!dragRef.current.moved && Math.hypot(dx, dy) < 6) return;
        dragRef.current.moved = true;
        const rect = svg.getBoundingClientRect();
        const { startVb } = dragRef.current;
        applyVb({
          x: startVb.x - dx / rect.width * startVb.w,
          y: startVb.y - dy / rect.height * startVb.h,
          w: startVb.w, h: startVb.h,
        });
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      // Double-tap to reset zoom
      if (e.changedTouches.length === 1 && !dragRef.current?.moved) {
        const now = Date.now();
        if (now - lastTapRef.current < 280) {
          applyVb({ x: 0, y: 0, w: 100, h: 100 });
        }
        lastTapRef.current = now;
      }
      // If still 1 finger after lifting second, restart single-finger drag
      if (e.touches.length === 1) {
        pinchRef.current = null;
        const t = e.touches[0];
        dragRef.current = { startCX: t.clientX, startCY: t.clientY, startVb: { ...vbRef.current }, moved: false };
      } else if (e.touches.length === 0) {
        pinchRef.current = null;
        dragRef.current = null;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      mouseRef.current = { startX: e.clientX, startY: e.clientY, startVb: { ...vbRef.current }, moved: false };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseRef.current) return;
      const dx = e.clientX - mouseRef.current.startX;
      const dy = e.clientY - mouseRef.current.startY;
      if (Math.hypot(dx, dy) < 3) return;
      if (!mouseRef.current.moved) {
        mouseRef.current.moved = true;
        panHappenedRef.current = true;
      }
      const rect = svg.getBoundingClientRect();
      const { startVb } = mouseRef.current;
      applyVb({
        x: startVb.x - dx / rect.width * startVb.w,
        y: startVb.y - dy / rect.height * startVb.h,
        w: startVb.w, h: startVb.h,
      });
    };

    const onMouseUp = () => { mouseRef.current = null; };

    const onDblClick = () => applyVb({ x: 0, y: 0, w: 100, h: 100 });

    svg.addEventListener('wheel', onWheel, { passive: false });
    svg.addEventListener('touchstart', onTouchStart, { passive: false });
    svg.addEventListener('touchmove', onTouchMove, { passive: false });
    svg.addEventListener('touchend', onTouchEnd);
    svg.addEventListener('mousedown', onMouseDown);
    svg.addEventListener('mousemove', onMouseMove);
    svg.addEventListener('mouseup', onMouseUp);
    svg.addEventListener('mouseleave', onMouseUp);
    svg.addEventListener('dblclick', onDblClick);

    return () => {
      svg.removeEventListener('wheel', onWheel);
      svg.removeEventListener('touchstart', onTouchStart);
      svg.removeEventListener('touchmove', onTouchMove);
      svg.removeEventListener('touchend', onTouchEnd);
      svg.removeEventListener('mousedown', onMouseDown);
      svg.removeEventListener('mousemove', onMouseMove);
      svg.removeEventListener('mouseup', onMouseUp);
      svg.removeEventListener('mouseleave', onMouseUp);
      svg.removeEventListener('dblclick', onDblClick);
    };
  }, []);

  const handleNodeClick = (id: string) => {
    // Always expand the tapped node — never toggle closed on re-tap.
    // Children collapse only via the background tap handler below.
    setExpandedId(id);
    setSelectedChild(null);
  };

  const handleAskAI = () => {
    if (!selectedChild) return;
    onCategorySelect?.(`Tell me about ${selectedChild.child.label} opportunities in Hong Kong`);
    onOpenChat?.();
    setSelectedChild(null);
  };

  const expandedNode = NODES.find(n => n.id === expandedId);

  // Build child positions for the currently expanded node
  const childItems = expandedNode
    ? expandedNode.children.map((child, idx) => {
        const nodeAngle = Math.atan2(expandedNode.ny - CY, expandedNode.nx - CX);
        const total = expandedNode.children.length;
        const spread = Math.PI / 3;
        const childAngle = nodeAngle - spread / 2 + (spread / (total - 1 || 1)) * idx;
        const dist = 18;
        return {
          child,
          idx,
          cx: expandedNode.nx + Math.cos(childAngle) * dist,
          cy: expandedNode.ny + Math.sin(childAngle) * dist,
          childAngle,
        };
      })
    : [];

  const parentColor = selectedChild
    ? NODES.find(n => n.id === selectedChild.parentId)?.color ?? '#fff'
    : '#fff';

  return (
    <div className="h-full relative overflow-hidden">

      {/* ── Starfield background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1535] to-[#0f1729]">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.15, 0.65, 0.15] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="absolute inset-0 flex flex-col px-4 pt-3 pb-2">
        <div className="mb-2 flex-shrink-0">
          <p className="text-white font-bold" style={{ fontSize: '1.6rem' }}>
            Opportunity Constellation
          </p>
          <p className="text-gray-400 mt-1" style={{ fontSize: '0.9rem' }}>
            {isZoomed
              ? 'Pinch to zoom · drag to pan · double-tap to reset'
              : 'Tap a star to explore opportunities'}
          </p>
        </div>

        {/* SVG takes the remaining height */}
        <div className="flex-1 min-h-0">
          <svg
            ref={svgRef}
            className="w-full h-full touch-none select-none"
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="ct-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* ── Background tap area — collapses children on empty-space click ── */}
            <rect
              x="-10" y="-10" width="120" height="120"
              fill="transparent"
              style={{ cursor: 'default' }}
              onClick={() => {
                if (panHappenedRef.current) { panHappenedRef.current = false; return; }
                setExpandedId(null);
                setSelectedChild(null);
              }}
            />

            {/* ── Spoke lines center → nodes ── */}
            {NODES.map((n, i) => (
              <motion.line
                key={`spoke-${n.id}`}
                x1={CX} y1={CY} x2={n.nx} y2={n.ny}
                stroke={n.color} strokeWidth="0.18" strokeDasharray="0.6,1.2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
              />
            ))}

            {/* ── Petal nodes ── */}
            {NODES.map((n, i) => {
              const isExp = expandedId === n.id;
              // Label pushed outward from center
              const ang = Math.atan2(n.ny - CY, n.nx - CX);
              const lx = n.nx + Math.cos(ang) * 11;
              const ly = n.ny + Math.sin(ang) * 11;

              return (
                <g
                  key={n.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNodeClick(n.id)}
                >
                  {/* Outer glow pulse */}
                  <motion.circle
                    cx={n.nx} cy={n.ny} r={isExp ? 7 : 5}
                    fill={n.color}
                    animate={{ opacity: isExp ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                    filter="url(#ct-glow)"
                  />
                  {/* Star body */}
                  <motion.circle
                    cx={n.nx} cy={n.ny}
                    initial={{ r: 0 }}
                    animate={{ r: isExp ? 3.4 : 2.8 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 22, delay: i * 0.07 }}
                    fill={n.color}
                    filter="url(#ct-glow)"
                  />
                  {/* 4-spike sparkles */}
                  {[0, 90, 180, 270].map(deg => {
                    const a = (deg * Math.PI) / 180;
                    return (
                      <motion.line
                        key={deg}
                        x1={n.nx} y1={n.ny}
                        x2={n.nx + Math.cos(a) * 4} y2={n.ny + Math.sin(a) * 4}
                        stroke={n.color} strokeWidth="0.25"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.55 }}
                        transition={{ delay: i * 0.07 + 0.25 }}
                        filter="url(#ct-glow)"
                      />
                    );
                  })}
                  {/* Label */}
                  <text
                    x={lx} y={ly + 0.9}
                    textAnchor="middle"
                    fill="white"
                    style={{ fontSize: '2.7px', fontWeight: 500, pointerEvents: 'none' }}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}

            {/* ── Center "You" node ── */}
            <g
              style={{ cursor: onOpenChat ? 'pointer' : 'default' }}
              onClick={() => onOpenChat?.()}
            >
              {/* Pulse halo */}
              <motion.circle
                cx={CX} cy={CY}
                animate={{ r: [7, 10, 7], opacity: [0.3, 0.15, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                fill="#de1e3d" filter="url(#ct-glow)"
              />
              {/* Red circle */}
              <motion.circle
                cx={CX} cy={CY}
                initial={{ r: 0 }}
                animate={{ r: 5 }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                fill="#de1e3d" filter="url(#ct-glow)"
              />
              {/* Bauhinia flower petals */}
              {Array.from({ length: 5 }).map((_, i) => {
                const a = (i * 72 - 90) * (Math.PI / 180);
                const pl = 2.1, pw = 1.1;
                const x1 = CX + Math.cos(a) * 0.3, y1 = CY + Math.sin(a) * 0.3;
                const x2 = CX + Math.cos(a) * pl, y2 = CY + Math.sin(a) * pl;
                const pa = a + Math.PI / 2;
                const wx = Math.cos(pa) * pw, wy = Math.sin(pa) * pw;
                return (
                  <motion.path
                    key={i}
                    d={`M ${x1} ${y1} Q ${x2+wx} ${y2+wy} ${x2} ${y2} Q ${x2-wx} ${y2-wy} ${x1} ${y1}`}
                    fill="white" opacity="0.95"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.95 }}
                    transition={{ delay: i * 0.06 + 0.3 }}
                  />
                );
              })}
              <text
                x={CX} y={CY + 9}
                textAnchor="middle" fill="white"
                style={{ fontSize: '2.7px', fontWeight: 600, pointerEvents: 'none' }}
              >
                You
              </text>
            </g>

            {/* ── Child nodes for expanded petal ── */}
            <AnimatePresence>
              {childItems.map(({ child, idx, cx, cy, childAngle }) => {
                const isSelected = selectedChild?.child.id === child.id;
                const col = expandedNode!.color;
                const lx = cx + Math.cos(childAngle) * 5.2;
                const ly = cy + Math.sin(childAngle) * 5.2;

                return (
                  <motion.g
                    key={`child-${expandedId}-${child.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.07 }}
                    style={{ cursor: 'pointer' }}
                    onClick={e => { e.stopPropagation(); setSelectedChild({ parentId: expandedId!, child }); }}
                  >
                    {/* Line from parent to child */}
                    <line
                      x1={expandedNode!.nx} y1={expandedNode!.ny}
                      x2={cx} y2={cy}
                      stroke={col} strokeWidth="0.2" strokeDasharray="0.5,0.5" opacity="0.5"
                    />
                    {/* Child glow */}
                    <circle cx={cx} cy={cy} r="3.2" fill={col} opacity="0.12" filter="url(#ct-glow)" />
                    {/* Child circle */}
                    <motion.circle
                      cx={cx} cy={cy}
                      initial={{ r: 0 }}
                      animate={{ r: isSelected ? 2.2 : 1.8 }}
                      exit={{ r: 0 }}
                      fill={col} opacity="0.92" filter="url(#ct-glow)"
                    />
                    {/* Label */}
                    <text
                      x={lx} y={ly + 0.8}
                      textAnchor="middle" fill="white" opacity="0.85"
                      style={{ fontSize: '2.1px', fontWeight: 400, pointerEvents: 'none' }}
                    >
                      {child.label}
                    </text>
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </svg>
        </div>
      </div>

      {/* ── Selected child popup ── */}
      <AnimatePresence>
        {selectedChild && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22 }}
            className="absolute bottom-4 left-4 right-4 rounded-3xl p-5 shadow-2xl"
            style={{
              background: 'rgba(26,31,58,0.97)',
              backdropFilter: 'blur(16px)',
              border: `2px solid ${parentColor}`,
              boxShadow: `0 0 40px ${parentColor}40`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: parentColor, boxShadow: `0 0 16px ${parentColor}` }}
                />
                <div>
                  <p className="text-white font-bold" style={{ fontSize: '1.2rem' }}>
                    {selectedChild.child.label}
                  </p>
                  <p className="text-gray-400" style={{ fontSize: '0.85rem' }}>
                    {NODES.find(n => n.id === selectedChild.parentId)?.label}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChild(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:bg-white/10 transition-colors flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-white/85 leading-relaxed mb-4" style={{ fontSize: '0.95rem' }}>
                {selectedChild.child.description}
              </p>
              <button
                onClick={handleAskAI}
                className="w-full py-4 rounded-full text-white font-semibold transition-opacity hover:opacity-90"
                style={{
                  fontSize: '1rem',
                  backgroundColor: parentColor,
                  boxShadow: `0 0 18px ${parentColor}55`,
                }}
              >
                Learn More
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
