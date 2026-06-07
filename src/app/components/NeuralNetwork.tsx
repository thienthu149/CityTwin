import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
  { id: 'community',      label: 'Community',      color: '#ec4899' },
  { id: 'education',      label: 'Education',      color: '#3b82f6' },
  { id: 'scholarship',    label: 'Scholarships',   color: '#10b981' },
  { id: 'grants',         label: 'Grants',         color: '#f59e0b' },
  { id: 'entrepreneurship', label: 'Entrepreneurship', color: '#8b5cf6' },
  { id: 'culture',        label: 'Culture',        color: '#06b6d4' },
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

// Maps AI-returned category strings to our petal node IDs
const categoryToPetalId: Record<string, string> = {
  funding: 'grants',
  scholarship: 'scholarship',
  community: 'community',
  education: 'education',
  social: 'culture',
  event: 'entrepreneurship',
};

export function NeuralNetwork({ nodes }: NeuralNetworkProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedDynamicNode, setSelectedDynamicNode] = useState<DynamicNodeData | null>(null);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [nodePositions, setNodePositions] = useState(mainNodes);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dynamicNodeData, setDynamicNodeData] = useState<DynamicNodeData[]>([]);

  // Convert opportunity nodes into child positions radiating from their parent petal
  useEffect(() => {
    if (nodes.length === 0) {
      setDynamicNodeData([]);
      return;
    }

    // Group by parent petal
    const grouped: Record<string, OpportunityNode[]> = {};
    for (const oppNode of nodes) {
      const petalId = categoryToPetalId[oppNode.category] || 'entrepreneurship';
      if (!grouped[petalId]) grouped[petalId] = [];
      grouped[petalId].push(oppNode);
    }

    const newData: DynamicNodeData[] = [];
    let globalIndex = 0;

    for (const [petalId, groupNodes] of Object.entries(grouped)) {
      const petalNode = mainNodes.find(n => n.id === petalId);
      if (!petalNode) continue;

      // Outward angle from center through the parent petal
      const petalAngle = Math.atan2(petalNode.y - centerY, petalNode.x - centerX);
      const childRadius = 15;
      const arcSpread = Math.PI / 2.2; // ~82° arc

      groupNodes.forEach((oppNode, i) => {
        const total = groupNodes.length;
        const startAngle = petalAngle - arcSpread / 2;
        const angleStep = total > 1 ? arcSpread / (total - 1) : 0;
        const childAngle = total > 1 ? startAngle + angleStep * i : petalAngle;

        newData.push({
          id: oppNode.id,
          label: oppNode.name,
          parentPetalId: petalId,
          angle: childAngle,
          radius: childRadius,
          color: petalNode.color,
          detail: oppNode.reason,
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

        <svg className="w-full h-[calc(100%-4rem)] touch-none" viewBox="0 0 100 100">
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

          <motion.g
            animate={{
              transform: `translate(${50 + pan.x}, ${50 + pan.y}) scale(${zoom}) translate(-50, -50)`,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
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
                    <text
                      x="0"
                      y="10"
                      textAnchor="middle"
                      className="fill-white pointer-events-none"
                      style={{ fontSize: '3px', fontWeight: '600' }}
                    >
                      {node.label}
                    </text>
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
                          x2={Math.cos(angle) * 4.5}
                          y2={Math.sin(angle) * 4.5}
                          stroke={node.color}
                          strokeWidth="0.3"
                          opacity="0.6"
                          filter="url(#glow)"
                        />
                      );
                    })}
                    {(() => {
                      const angleFromCenter = Math.atan2(node.y - centerNode.y, node.x - centerNode.x);
                      const textDistance = 12;
                      return (
                        <text
                          x={Math.cos(angleFromCenter) * textDistance}
                          y={Math.sin(angleFromCenter) * textDistance}
                          textAnchor="middle"
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
                  {/* Sparkle rays */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const angle = (i * 90) * (Math.PI / 180);
                    return (
                      <motion.line
                        key={i}
                        x1="0"
                        y1="0"
                        x2={Math.cos(angle) * 3.5}
                        y2={Math.sin(angle) * 3.5}
                        stroke={node.color}
                        strokeWidth="0.3"
                        opacity="0.6"
                        filter="url(#glow)"
                      />
                    );
                  })}
                  {/* Label radiating outward */}
                  {(() => {
                    const textDist = 7;
                    return (
                      <text
                        x={Math.cos(node.angle) * textDist}
                        y={Math.sin(node.angle) * textDist}
                        textAnchor="middle"
                        className="fill-white pointer-events-none"
                        style={{ fontSize: '2px', fontWeight: '500' }}
                      >
                        {node.label.length > 22 ? node.label.substring(0, 20) + '…' : node.label}
                      </text>
                    );
                  })()}
                </motion.g>
              ))}
            </AnimatePresence>

          </motion.g>
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
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={handleCloseDetails}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-h-[80vh] bg-[#1a1f3a] rounded-3xl shadow-2xl overflow-hidden"
              style={{
                borderWidth: 2,
                borderColor: activeColor,
                boxShadow: `0 0 60px ${activeColor}60`,
              }}
            >
              <div className="overflow-y-auto max-h-[80vh]">
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
                      Program Details
                    </h3>
                    <div className="space-y-3 text-gray-300" style={{ fontSize: '0.9375rem' }}>
                      {[
                        ['Duration', '12 weeks intensive program'],
                        ['Location', 'Hong Kong — Hybrid (Online & In-person)'],
                        ['Next Cohort', 'Starting September 2026'],
                        ['Benefits', 'Mentorship, networking, resources, and potential funding'],
                      ].map(([key, value]) => (
                        <div key={key} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 shrink-0" />
                          <p>
                            <strong className="text-white">{key}:</strong> {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-white mb-3" style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                      What You'll Get
                    </h3>
                    <div className="space-y-2 text-gray-300" style={{ fontSize: '0.9375rem' }}>
                      {[
                        'Access to industry experts and mentors',
                        'Networking opportunities with peers and investors',
                        'Hands-on workshops and skill development sessions',
                        'Certificate of completion and portfolio projects',
                      ].map(item => (
                        <div key={item} className="flex items-center gap-2">
                          <span>✨</span>
                          <span>{item}</span>
                        </div>
                      ))}
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
                      onClick={() => alert('Redirecting to sign-up page...')}
                    >
                      Sign Up Now
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-2xl text-white font-medium bg-white/10 border border-white/20"
                      onClick={() => alert('Opening program website...')}
                    >
                      Visit Program Website
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
