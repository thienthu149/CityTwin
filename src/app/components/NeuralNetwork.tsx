import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import database from '../../../database.json';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  isCenter?: boolean;
}

interface OpportunityNode {
  id: string;
  name: string;
  category: string;
  reason: string;
}

interface DynamicNodeData {
  id: string;
  label: string;
  parentPetalId: string;
  angle: number;
  radius: number;
  color: string;
  detail: string;
  link: string;
  month: string;
  globalIndex: number;
}

interface NeuralNetworkProps {
  nodes: OpportunityNode[];
}

const centerX = 50;
const centerY = 50;
const petalRadius = 25;

const createPetalPosition = (index: number, total: number) => {
  const angle = (index * (360 / total) - 90) * (Math.PI / 180);
  return {
    x: centerX + Math.cos(angle) * petalRadius,
    y: centerY + Math.sin(angle) * petalRadius,
  };
};

const petals = [
  { id: 'funding',   label: 'Funding',   color: '#f59e0b' },
  { id: 'education', label: 'Education', color: '#3b82f6' },
  { id: 'expats',    label: 'Expats',    color: '#06b6d4' },
  { id: 'founders',  label: 'Founders',  color: '#ec4899' },
  { id: 'study',     label: 'Study',     color: '#10b981' },
  { id: 'social',    label: 'Social',    color: '#8b5cf6' },
];

const mainNodes: Node[] = [
  {
    id: 'center',
    label: 'You',
    x: centerX,
    y: centerY,
    color: '#ffffff',
    isCenter: true,
  },
  ...petals.map((petal, index) => {
    const pos = createPetalPosition(index, petals.length);
    return {
      ...petal,
      x: pos.x,
      y: pos.y,
    };
  }),
];

const categoryToPetalId: Record<string, string> = {
  funding: 'funding',
  education: 'education',
  expats: 'expats',
  founders: 'founders',
  study: 'study',
  social: 'social',
};

// Flat lookup: lowercased name → database entry (for enriching AI-returned nodes)
const _allDbItems = [
  ...database.hong_kong_ecosystem.funding,
  ...database.hong_kong_ecosystem.education,
  ...database.hong_kong_ecosystem.expats,
  ...database.hong_kong_ecosystem.founders,
  ...database.hong_kong_ecosystem.study,
  ...database.hong_kong_ecosystem.social,
];
const dbByName: Record<string, { id: string; details: string; link: string; month: string }> = {};
for (const item of _allDbItems) {
  dbByName[item.name.toLowerCase()] = { id: item.id, details: item.details, link: item.link, month: item.month };
}

export function NeuralNetwork({ nodes }: NeuralNetworkProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedDynamicNode, setSelectedDynamicNode] = useState<DynamicNodeData | null>(null);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [nodePositions, setNodePositions] = useState(mainNodes);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dynamicNodeData, setDynamicNodeData] = useState<DynamicNodeData[]>([]);
  const [isGesturing, setIsGesturing] = useState(false);

  // Gesture tracking — refs avoid stale closures in event handlers
  const svgRef = useRef<SVGSVGElement>(null);
  const gesture = useRef({
    dragging: false,
    moved: false,           // true if pointer moved past threshold
    startClientX: 0,
    startClientY: 0,
    startPanX: 0,
    startPanY: 0,
    pinchActive: false,
    pinchStartDist: 0,
    pinchStartZoom: 1,
  });

  const svgUnitPerPixel = () => {
    const w = svgRef.current?.getBoundingClientRect().width ?? 400;
    return 100 / w;
  };

  const touchDist = (a: React.Touch, b: React.Touch) => {
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // ── Touch handlers ──────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      gesture.current = {
        ...gesture.current,
        dragging: true,
        moved: false,
        startClientX: e.touches[0].clientX,
        startClientY: e.touches[0].clientY,
        startPanX: pan.x,
        startPanY: pan.y,
        pinchActive: false,
      };
    } else if (e.touches.length === 2) {
      gesture.current.dragging = false;
      gesture.current.pinchActive = true;
      gesture.current.pinchStartDist = touchDist(e.touches[0], e.touches[1]);
      gesture.current.pinchStartZoom = zoom;
    }
  };

  const onTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1 && gesture.current.dragging) {
      const scale = svgUnitPerPixel();
      const dx = (e.touches[0].clientX - gesture.current.startClientX) * scale;
      const dy = (e.touches[0].clientY - gesture.current.startClientY) * scale;
      if (!gesture.current.moved && (Math.abs(dx) > 0.8 || Math.abs(dy) > 0.8)) {
        gesture.current.moved = true;
        setIsGesturing(true);
      }
      if (gesture.current.moved) {
        setPan({ x: gesture.current.startPanX + dx, y: gesture.current.startPanY + dy });
      }
    } else if (e.touches.length === 2 && gesture.current.pinchActive) {
      const dist = touchDist(e.touches[0], e.touches[1]);
      const newZoom = Math.max(0.4, Math.min(6,
        gesture.current.pinchStartZoom * dist / gesture.current.pinchStartDist
      ));
      setZoom(newZoom);
    }
  };

  const onTouchEnd = () => {
    gesture.current.dragging = false;
    gesture.current.pinchActive = false;
    setIsGesturing(false);
  };

  // ── Mouse handlers (desktop) ────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    gesture.current = {
      ...gesture.current,
      dragging: true,
      moved: false,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!gesture.current.dragging) return;
    const scale = svgUnitPerPixel();
    const dx = (e.clientX - gesture.current.startClientX) * scale;
    const dy = (e.clientY - gesture.current.startClientY) * scale;
    if (!gesture.current.moved && (Math.abs(dx) > 0.8 || Math.abs(dy) > 0.8)) {
      gesture.current.moved = true;
      setIsGesturing(true);
    }
    if (gesture.current.moved) {
      setPan({ x: gesture.current.startPanX + dx, y: gesture.current.startPanY + dy });
    }
  };

  const onMouseUp = () => {
    gesture.current.dragging = false;
    setIsGesturing(false);
  };

  // ── Scroll-wheel zoom ───────────────────────────────────────────────────────
  const onWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    const factor = e.deltaY > 0 ? 0.92 : 1.09;
    setZoom(prev => Math.max(0.4, Math.min(6, prev * factor)));
  };

  // Build child nodes from AI-returned recommendations, enriched with database details
  useEffect(() => {
    if (nodes.length === 0) {
      setDynamicNodeData([]);
      return;
    }

    const grouped: Record<string, OpportunityNode[]> = {};
    for (const oppNode of nodes) {
      const petalId = categoryToPetalId[oppNode.category.toLowerCase()] ?? 'founders';
      if (!grouped[petalId]) grouped[petalId] = [];
      grouped[petalId].push(oppNode);
    }

    const newData: DynamicNodeData[] = [];
    let globalIndex = 0;

    for (const [petalId, groupNodes] of Object.entries(grouped)) {
      const petalNode = mainNodes.find(n => n.id === petalId);
      if (!petalNode) continue;

      const petalAngle = Math.atan2(petalNode.y - centerY, petalNode.x - centerX);
      const childRadius = 26;
      const arcSpread = Math.PI / 2;

      groupNodes.forEach((oppNode, i) => {
        const total = groupNodes.length;
        const startAngle = petalAngle - arcSpread / 2;
        const angleStep = total > 1 ? arcSpread / (total - 1) : 0;
        const childAngle = total > 1 ? startAngle + angleStep * i : petalAngle;

        const dbEntry = dbByName[oppNode.name.toLowerCase()];

        newData.push({
          id: dbEntry?.id ?? oppNode.id,
          label: oppNode.name,
          parentPetalId: petalId,
          angle: childAngle,
          radius: childRadius,
          color: petalNode.color,
          detail: dbEntry?.details ?? oppNode.reason,
          link: dbEntry?.link ?? '',
          month: dbEntry?.month ?? '',
          globalIndex: globalIndex++,
        });
      });
    }

    setDynamicNodeData(newData);
  }, [nodes]);

  // Gentle wobble animation for petal nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setNodePositions(prev =>
        prev.map(node => {
          if (node.isCenter) return node;
          const wobble = 1.5;
          return {
            ...node,
            x: node.x + (Math.random() - 0.5) * wobble,
            y: node.y + (Math.random() - 0.5) * wobble,
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const centerNode = nodePositions.find(n => n.isCenter)!;

  // Resolve dynamic node positions live based on current (wobbled) petal positions
  const resolvedDynamicNodes = dynamicNodeData
    .map(data => {
      const parent = nodePositions.find(n => n.id === data.parentPetalId);
      if (!parent) return null;
      return {
        ...data,
        x: parent.x + Math.cos(data.angle) * data.radius,
        y: parent.y + Math.sin(data.angle) * data.radius,
        parentX: parent.x,
        parentY: parent.y,
      };
    })
    .filter((n): n is NonNullable<typeof n> => n !== null);

  const handleNodeClick = (nodeId: string) => {
    if (gesture.current.moved) return;
    const clickedNode = nodePositions.find(n => n.id === nodeId);
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
        if (newSet.size === 0) {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }
      } else {
        newSet.add(nodeId);
        if (clickedNode) {
          setZoom(1.8);
          setPan({ x: (50 - clickedNode.x) * 0.3, y: (50 - clickedNode.y) * 0.3 });
        }
      }
      return newSet;
    });
  };

  const handleDynamicNodeClick = (data: DynamicNodeData) => {
    if (gesture.current.moved) return;
    setSelectedDynamicNode(data);
    setShowFullDetails(false);
  };

  const handleCloseDetails = () => {
    setShowFullDetails(false);
    setSelectedDynamicNode(null);
  };

  const activeColor = selectedDynamicNode?.color;
  const activeParentLabel = selectedDynamicNode
    ? nodePositions.find(n => n.id === selectedDynamicNode.parentPetalId)?.label
    : undefined;
  const activeChildLabel = selectedDynamicNode?.label;
  const activeChildDescription = selectedDynamicNode?.detail;
  const activeChildLink = selectedDynamicNode?.link;
  const activeChildMonth = selectedDynamicNode?.month;

  return (
    <div className="h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1535] to-[#0f1729]">
        {/* Starfield background */}
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              opacity: [Math.random() * 0.7 + 0.3, Math.random() * 0.3, Math.random() * 0.7 + 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 p-4">
        <div className="mb-3">
          <h2 className="text-white">Opportunity Constellation</h2>
          <p className="text-gray-400" style={{ fontSize: '0.875rem' }}>
            Tap a star to explore opportunities
          </p>
        </div>

        <svg
          ref={svgRef}
          className="w-full h-[calc(100%-4rem)] touch-none select-none"
          viewBox="0 0 100 100"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
          style={{ cursor: isGesturing ? 'grabbing' : 'grab' }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="starGlow">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g transform={`translate(${50 + pan.x} ${50 + pan.y}) scale(${zoom}) translate(-50 -50)`}>
            {/* Lines: center → petal nodes */}
            {nodePositions.map(node => {
              if (node.isCenter) return null;
              return (
                <motion.line
                  key={`line-${node.id}`}
                  x1={centerNode.x}
                  y1={centerNode.y}
                  x2={node.x}
                  y2={node.y}
                  stroke={node.color}
                  strokeWidth="0.2"
                  opacity="0.3"
                  strokeDasharray="0.5,1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              );
            })}

            {/* Lines: petal node → dynamic child nodes */}
            <AnimatePresence>
              {resolvedDynamicNodes.map(node => (
                <motion.line
                  key={`dyn-line-${node.id}`}
                  x1={node.parentX}
                  y1={node.parentY}
                  x2={node.x}
                  y2={node.y}
                  stroke={node.color}
                  strokeWidth="0.25"
                  strokeDasharray="0.8,0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.8, delay: node.globalIndex * 0.12, ease: 'easeOut' }}
                />
              ))}
            </AnimatePresence>

            {/* Static petal nodes */}
            {nodePositions.map(node => (
              <motion.g
                key={node.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1, x: node.x, y: node.y }}
                transition={{ type: 'spring', stiffness: 100, damping: 15, duration: 0.5 }}
                style={{ cursor: node.isCenter ? 'default' : 'pointer' }}
                onClick={() => !node.isCenter && handleNodeClick(node.id)}
              >
                {node.isCenter ? (
                  <>
                    <motion.circle cx="0" cy="0" r="8" fill="url(#starGlow)" opacity="0.3" filter="url(#glow)" />
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="5"
                      fill="#de1e3d"
                      filter="url(#glow)"
                      animate={{ scale: [1, 1.05, 1], opacity: [0.95, 1, 0.95] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {Array.from({ length: 5 }).map((_, i) => {
                      const angle = (i * 72 - 90) * (Math.PI / 180);
                      const petalLength = 2.2;
                      const petalWidth = 1.2;
                      const x1 = Math.cos(angle) * 0.3;
                      const y1 = Math.sin(angle) * 0.3;
                      const x2 = Math.cos(angle) * petalLength;
                      const y2 = Math.sin(angle) * petalLength;
                      const perpAngle = angle + Math.PI / 2;
                      const wx = Math.cos(perpAngle) * petalWidth;
                      const wy = Math.sin(perpAngle) * petalWidth;
                      return (
                        <g key={i}>
                          <motion.path
                            d={`M ${x1} ${y1} Q ${x2 + wx} ${y2 + wy} ${x2} ${y2} Q ${x2 - wx} ${y2 - wy} ${x1} ${y1}`}
                            fill="white"
                            opacity="0.95"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                          />
                          <motion.circle
                            cx={Math.cos(angle) * 1.5}
                            cy={Math.sin(angle) * 1.5}
                            r="0.25"
                            fill="#de1e3d"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 + 0.3, duration: 0.3 }}
                          />
                        </g>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="6"
                      fill="url(#starGlow)"
                      opacity="0.4"
                      filter="url(#glow)"
                      animate={{ scale: expandedNodes.has(node.id) ? [1, 1.3, 1] : 1 }}
                      transition={{ duration: 2, repeat: expandedNodes.has(node.id) ? Infinity : 0 }}
                    />
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="3"
                      fill={node.color}
                      filter="url(#glow)"
                      whileHover={{ scale: 1.3 }}
                      animate={{
                        scale: expandedNodes.has(node.id) ? [1, 1.15, 1] : 1,
                        opacity: [0.9, 1, 0.9],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {Array.from({ length: 4 }).map((_, i) => {
                      const angle = (i * 90) * (Math.PI / 180);
                      return (
                        <motion.line
                          key={i}
                          x1="0"
                          y1="0"
                          x2={Math.cos(angle) * 3}
                          y2={Math.sin(angle) * 3}
                          stroke={node.color}
                          strokeWidth="0.3"
                          opacity="0.5"
                          filter="url(#glow)"
                        />
                      );
                    })}
                    {(() => {
                      // Place label 90° clockwise from the outward direction so it
                      // is never in the same direction as dynamic children
                      const outward = Math.atan2(node.y - centerNode.y, node.x - centerNode.x);
                      const perpAngle = outward + Math.PI / 2;
                      const d = 5;
                      const lx = Math.cos(perpAngle) * d;
                      const ly = Math.sin(perpAngle) * d;
                      const anchor = lx > 0.5 ? 'start' : lx < -0.5 ? 'end' : 'middle';
                      return (
                        <text
                          x={lx}
                          y={ly}
                          textAnchor={anchor}
                          dominantBaseline="middle"
                          className="fill-white pointer-events-none"
                          style={{ fontSize: '2.5px', fontWeight: '500' }}
                        >
                          {node.label}
                        </text>
                      );
                    })()}
                  </>
                )}
              </motion.g>
            ))}

            {/* Dynamic child nodes — radiate from their parent petal */}
            <AnimatePresence>
              {resolvedDynamicNodes.map(node => (
                <motion.g
                  key={`dyn-${node.id}`}
                  initial={{ scale: 0, opacity: 0, x: node.x, y: node.y }}
                  animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 15,
                    delay: node.globalIndex * 0.12,
                  }}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDynamicNodeClick(node)}
                >
                  {/* Outer glow ring */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="5"
                    fill="url(#starGlow)"
                    opacity="0.4"
                    filter="url(#glow)"
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* Node body */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="2.2"
                    fill={node.color}
                    filter="url(#glow)"
                    whileHover={{ scale: 1.4 }}
                    animate={{ opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* Sparkle rays — short so they don't reach the connection line */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const angle = (i * 90) * (Math.PI / 180);
                    return (
                      <motion.line
                        key={i}
                        x1="0"
                        y1="0"
                        x2={Math.cos(angle) * 2.5}
                        y2={Math.sin(angle) * 2.5}
                        stroke={node.color}
                        strokeWidth="0.25"
                        opacity="0.5"
                        filter="url(#glow)"
                      />
                    );
                  })}
                  {/* Name label — perpendicular to radial direction to stay in-bounds */}
                  {(() => {
                    const perpAngle = node.angle + Math.PI / 2;
                    const d = 5.5;
                    const lx = Math.cos(perpAngle) * d;
                    const ly = Math.sin(perpAngle) * d;
                    const anchor = lx > 0.5 ? 'start' : lx < -0.5 ? 'end' : 'middle';
                    return (
                      <text
                        x={lx}
                        y={ly}
                        textAnchor={anchor}
                        dominantBaseline="middle"
                        className="fill-white pointer-events-none"
                        style={{ fontSize: '1.8px', fontWeight: '500', opacity: 0.9 }}
                      >
                        {node.label}
                      </text>
                    );
                  })()}
                </motion.g>
              ))}
            </AnimatePresence>

          </g>
        </svg>
      </div>

      {/* Detail panels */}
      <AnimatePresence>
        {selectedDynamicNode && !showFullDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-[#1a1f3a]/95 backdrop-blur-lg border-2 rounded-3xl p-5 shadow-2xl"
            style={{
              borderColor: activeColor,
              boxShadow: `0 0 40px ${activeColor}40`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{
                    backgroundColor: activeColor,
                    boxShadow: `0 0 15px ${activeColor}`,
                  }}
                />
                <div>
                  <h3 className="text-white" style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                    {activeChildLabel}
                  </h3>
                  <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>
                    {activeParentLabel}
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseDetails}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20"
              >
                ✕
              </motion.button>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-white/90 leading-relaxed" style={{ fontSize: '0.9375rem' }}>
                {activeChildDescription}
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFullDetails(true)}
                className="w-full mt-4 py-3 rounded-xl text-white font-medium"
                style={{
                  backgroundColor: activeColor,
                  boxShadow: `0 0 20px ${activeColor}50`,
                }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        )}

        {selectedDynamicNode && showFullDetails && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              style={{ zIndex: 50 }}
              onClick={handleCloseDetails}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bg-[#1a1f3a] rounded-3xl shadow-2xl overflow-hidden"
              style={{
                top: '10vh',
                left: '5%',
                width: '90%',
                height: '80vh',
                zIndex: 51,
                borderWidth: 2,
                borderColor: activeColor,
                boxShadow: `0 0 60px ${activeColor}60`,
              }}
            >
              <div className="overflow-y-auto h-full">
                <div
                  className="p-5 relative"
                  style={{ background: `linear-gradient(135deg, ${activeColor}40, transparent)` }}
                >
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCloseDetails}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20"
                  >
                    ✕
                  </motion.button>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${activeColor}40`,
                        boxShadow: `0 0 20px ${activeColor}50`,
                      }}
                    >
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: activeColor }} />
                    </div>
                    <div>
                      <h2 className="text-white" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                        {activeChildLabel}
                      </h2>
                      <p className="text-gray-400" style={{ fontSize: '0.875rem' }}>
                        {activeParentLabel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  <div>
                    <h3 className="text-white mb-2" style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                      Overview
                    </h3>
                    <p className="text-gray-300 leading-relaxed" style={{ fontSize: '0.9375rem' }}>
                      {activeChildDescription}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-white mb-3" style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                      Details
                    </h3>
                    <div className="space-y-3 text-gray-300" style={{ fontSize: '0.9375rem' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 shrink-0" />
                        <p><strong className="text-white">Category:</strong> {activeParentLabel}</p>
                      </div>
                      {activeChildMonth && (
                        <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 shrink-0" />
                          <p><strong className="text-white">Active Month:</strong> {activeChildMonth}</p>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 shrink-0" />
                        <p><strong className="text-white">Location:</strong> Hong Kong</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-2xl text-white font-semibold"
                      style={{
                        background: `linear-gradient(135deg, ${activeColor}, ${activeColor}dd)`,
                        boxShadow: `0 0 30px ${activeColor}60`,
                      }}
                      onClick={() => activeChildLink && window.open(activeChildLink, '_blank')}
                    >
                      Visit Website
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
