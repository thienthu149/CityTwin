import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  isCenter?: boolean;
  children?: Array<{ id: string; label: string; description: string }>;
}

interface OpportunityNode {
  id: string;
  name: string;
  category: string;
  reason: string;
}

interface NeuralNetworkProps {
  nodes: OpportunityNode[];
}

// Arrange nodes in a Bauhinia flower pattern (Hong Kong flag)
// 5 petals arranged in a circle, like the flower on HK flag
const centerX = 50;
const centerY = 50;
const petalRadius = 25;

const createPetalPosition = (index: number, total: number) => {
  // Start from top and go clockwise, offset by -90 degrees to start at top
  const angle = (index * (360 / total) - 90) * (Math.PI / 180);
  return {
    x: centerX + Math.cos(angle) * petalRadius,
    y: centerY + Math.sin(angle) * petalRadius,
  };
};

const petals = [
  {
    id: 'community',
    label: 'Community',
    color: '#ec4899',
    children: [
      { id: 'c1', label: 'Meetup Groups', description: 'Tech meetups and networking events' },
      { id: 'c2', label: 'Co-working Spaces', description: 'Collaborative work environments' },
      { id: 'c3', label: 'Local Forums', description: 'Online community discussions' },
    ],
  },
  {
    id: 'education',
    label: 'Education',
    color: '#3b82f6',
    children: [
      { id: 'ed1', label: 'Universities', description: 'Top-ranked universities and programs' },
      { id: 'ed2', label: 'Online Courses', description: 'Digital learning platforms and MOOCs' },
      { id: 'ed3', label: 'Workshops', description: 'Hands-on skill-building sessions' },
    ],
  },
  {
    id: 'scholarship',
    label: 'Scholarships',
    color: '#10b981',
    children: [
      { id: 's1', label: 'Research Grants', description: 'Academic research funding' },
      { id: 's2', label: 'Study Abroad', description: 'International education programs' },
      { id: 's3', label: 'Innovation Awards', description: 'Recognition for innovative work' },
    ],
  },
  {
    id: 'grants',
    label: 'Grants',
    color: '#f59e0b',
    children: [
      { id: 'g1', label: 'Startup Funding', description: 'Seed funding for new ventures' },
      { id: 'g2', label: 'Government Grants', description: 'Public sector support programs' },
      { id: 'g3', label: 'Innovation Grants', description: 'Funding for innovative projects' },
    ],
  },
  {
    id: 'entrepreneurship',
    label: 'Entrepreneurship',
    color: '#8b5cf6',
    children: [
      { id: 'e1', label: 'Incubators', description: 'Startup acceleration programs' },
      { id: 'e2', label: 'Pitch Events', description: 'Investor pitch competitions' },
      { id: 'e3', label: 'Mentor Network', description: 'Expert guidance and mentorship' },
    ],
  },
  {
    id: 'culture',
    label: 'Culture',
    color: '#06b6d4',
    children: [
      { id: 'cu1', label: 'Art Galleries', description: 'Contemporary art exhibitions' },
      { id: 'cu2', label: 'Festivals', description: 'Cultural celebrations and events' },
      { id: 'cu3', label: 'Museums', description: 'Historical and cultural museums' },
    ],
  },
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

const categoryColors: Record<string, string> = {
  funding: '#f59e0b',
  scholarship: '#10b981',
  community: '#ec4899',
  education: '#3b82f6',
  social: '#06b6d4',
  event: '#8b5cf6',
};

export function NeuralNetwork({ nodes }: NeuralNetworkProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedChild, setSelectedChild] = useState<{ parentId: string; child: { id: string; label: string; description: string } } | null>(null);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [nodePositions, setNodePositions] = useState(mainNodes);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dynamicNodes, setDynamicNodes] = useState<Node[]>([]);

  // Convert opportunity nodes to visual nodes
  useEffect(() => {
    if (nodes.length === 0) return;

    const newDynamicNodes: Node[] = nodes.map((oppNode, index) => {
      const angle = (index * (360 / Math.max(nodes.length, 6)) - 90) * (Math.PI / 180);
      const radius = 30 + (index % 2) * 5; // Vary radius slightly
      return {
        id: oppNode.id,
        label: oppNode.name,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        color: categoryColors[oppNode.category] || '#8b5cf6',
        children: [{
          id: `${oppNode.id}-detail`,
          label: oppNode.name,
          description: oppNode.reason,
        }],
      };
    });

    setDynamicNodes(newDynamicNodes);
  }, [nodes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodePositions((prev) =>
        prev.map((node) => {
          if (node.isCenter) return node;
          const wobble = 2;
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

  const centerNode = nodePositions.find((n) => n.isCenter)!;

  const handleNodeClick = (nodeId: string) => {
    const clickedNode = nodePositions.find(n => n.id === nodeId);

    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        // If clicking the same node, collapse it and zoom out
        newSet.delete(nodeId);

        // If no more expanded nodes, reset zoom
        if (newSet.size === 0) {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }
      } else {
        // Expand the node and zoom in
        newSet.add(nodeId);

        // Zoom in and pan to the clicked node
        if (clickedNode) {
          setZoom(1.8);
          // Pan so the clicked node is centered
          const panX = (50 - clickedNode.x) * 0.3;
          const panY = (50 - clickedNode.y) * 0.3;
          setPan({ x: panX, y: panY });
        }
      }
      return newSet;
    });
  };

  const handleChildClick = (parentId: string, child: { id: string; label: string; description: string }) => {
    setSelectedChild({ parentId, child });
    setShowFullDetails(false);
  };

  const handleLearnMore = () => {
    setShowFullDetails(true);
  };

  const handleCloseDetails = () => {
    setShowFullDetails(false);
    setSelectedChild(null);
  };

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
              transform: `translate(${50 + pan.x}, ${50 + pan.y}) scale(${zoom}) translate(-50, -50)`
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >

          {/* Lines from center to static nodes */}
          {nodePositions.map((node) => {
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

          {/* Lines from center to dynamic nodes */}
          {dynamicNodes.map((node, index) => (
            <motion.line
              key={`dyn-line-${node.id}`}
              x1={centerNode.x}
              y1={centerNode.y}
              x2={node.x}
              y2={node.y}
              stroke={node.color}
              strokeWidth="0.3"
              opacity="0.5"
              strokeDasharray="1,1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 1, delay: index * 0.15, ease: 'easeOut' }}
            />
          ))}

          {/* Static nodes */}
          {nodePositions.map((node) => (
            <motion.g
              key={node.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1, x: node.x, y: node.y }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                duration: 0.5,
              }}
              style={{ cursor: node.isCenter ? 'default' : 'pointer' }}
              onClick={() => !node.isCenter && handleNodeClick(node.id)}
            >
              {node.isCenter ? (
                <>
                  {/* Hong Kong Flag in center node */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="8"
                    fill="url(#starGlow)"
                    opacity="0.3"
                    filter="url(#glow)"
                  />
                  {/* Red background */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="5"
                    fill="#de1e3d"
                    filter="url(#glow)"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.95, 1, 0.95],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  {/* White Bauhinia flower (5 petals) */}
                  {Array.from({ length: 5 }).map((_, i) => {
                    const angle = (i * 72 - 90) * (Math.PI / 180);
                    const petalLength = 2.2;
                    const petalWidth = 1.2;

                    // Calculate petal points for ellipse-like shape
                    const x1 = Math.cos(angle) * 0.3;
                    const y1 = Math.sin(angle) * 0.3;
                    const x2 = Math.cos(angle) * petalLength;
                    const y2 = Math.sin(angle) * petalLength;

                    // Perpendicular for width
                    const perpAngle = angle + Math.PI / 2;
                    const wx = Math.cos(perpAngle) * petalWidth;
                    const wy = Math.sin(perpAngle) * petalWidth;

                    return (
                      <g key={i}>
                        {/* Petal shape */}
                        <motion.path
                          d={`M ${x1} ${y1}
                              Q ${x2 + wx} ${y2 + wy} ${x2} ${y2}
                              Q ${x2 - wx} ${y2 - wy} ${x1} ${y1}`}
                          fill="white"
                          opacity="0.95"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                        />
                        {/* Small red star on each petal */}
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
                  {/* Outer glow */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="6"
                    fill="url(#starGlow)"
                    opacity="0.4"
                    filter="url(#glow)"
                    animate={{
                      scale: expandedNodes.has(node.id) ? [1, 1.3, 1] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: expandedNodes.has(node.id) ? Infinity : 0,
                    }}
                  />
                  {/* Main star body */}
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
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  {/* Star sparkle points */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const angle = (i * 90) * (Math.PI / 180);
                    const x = Math.cos(angle) * 4.5;
                    const y = Math.sin(angle) * 4.5;
                    return (
                      <motion.line
                        key={i}
                        x1="0"
                        y1="0"
                        x2={x}
                        y2={y}
                        stroke={node.color}
                        strokeWidth="0.3"
                        opacity="0.6"
                        filter="url(#glow)"
                      />
                    );
                  })}
                  {/* Position text away from center to avoid line overlap */}
                  {(() => {
                    const angleFromCenter = Math.atan2(node.y - centerNode.y, node.x - centerNode.x);
                    const textDistance = 12;
                    const textX = Math.cos(angleFromCenter) * textDistance;
                    const textY = Math.sin(angleFromCenter) * textDistance;
                    return (
                      <text
                        x={textX}
                        y={textY}
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

          {/* Dynamic nodes from Claude */}
          <AnimatePresence>
            {dynamicNodes.map((node, index) => (
              <motion.g
                key={`dyn-${node.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 15,
                  delay: index * 0.1,
                }}
                style={{ cursor: 'pointer' }}
                onClick={() => handleNodeClick(node.id)}
              >
                {/* Outer glow */}
                <motion.circle
                  cx="0"
                  cy="0"
                  r="7"
                  fill="url(#starGlow)"
                  opacity="0.5"
                  filter="url(#glow)"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                {/* Main star body - larger for dynamic nodes */}
                <motion.circle
                  cx="0"
                  cy="0"
                  r="3.5"
                  fill={node.color}
                  filter="url(#glow)"
                  whileHover={{ scale: 1.3 }}
                  animate={{
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                {/* Star sparkle points */}
                {Array.from({ length: 4 }).map((_, i) => {
                  const angle = (i * 90) * (Math.PI / 180);
                  const x = Math.cos(angle) * 5;
                  const y = Math.sin(angle) * 5;
                  return (
                    <motion.line
                      key={i}
                      x1="0"
                      y1="0"
                      x2={x}
                      y2={y}
                      stroke={node.color}
                      strokeWidth="0.4"
                      opacity="0.7"
                      filter="url(#glow)"
                    />
                  );
                })}
                {/* Label */}
                {(() => {
                  const angleFromCenter = Math.atan2(node.y - centerNode.y, node.x - centerNode.x);
                  const textDistance = 10;
                  const textX = Math.cos(angleFromCenter) * textDistance;
                  const textY = Math.sin(angleFromCenter) * textDistance;
                  return (
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      className="fill-white pointer-events-none"
                      style={{ fontSize: '2px', fontWeight: '600' }}
                    >
                      {node.label.length > 25 ? node.label.substring(0, 22) + '...' : node.label}
                    </text>
                  );
                })()}
              </motion.g>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {nodePositions.map((node) => {
              if (node.isCenter || !expandedNodes.has(node.id) || !node.children) return null;

              // Calculate the angle from center to this node
              const nodeAngleFromCenter = Math.atan2(node.y - centerNode.y, node.x - centerNode.x);

              return node.children.map((child, index) => {
                // Spread children in an arc facing outward from the center
                const totalChildren = node.children!.length;
                const arcSpread = Math.PI / 3; // 60 degrees arc
                const startAngle = nodeAngleFromCenter - arcSpread / 2;
                const angleStep = arcSpread / (totalChildren - 1 || 1);
                const childAngle = startAngle + angleStep * index;

                const radius = 18;
                const childX = node.x + Math.cos(childAngle) * radius;
                const childY = node.y + Math.sin(childAngle) * radius;

                return (
                  <motion.g
                    key={`${node.id}-${child.id}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChildClick(node.id, child);
                    }}
                  >
                      <line
                        x1={node.x}
                        y1={node.y}
                        x2={childX}
                        y2={childY}
                        stroke={node.color}
                        strokeWidth="0.2"
                        opacity="0.5"
                        strokeDasharray="0.5,0.5"
                      />
                      {/* Small star for child node */}
                      <motion.circle
                        cx={childX}
                        cy={childY}
                        r="4"
                        fill="url(#starGlow)"
                        opacity="0.3"
                        filter="url(#glow)"
                        whileHover={{ scale: 1.5 }}
                      />
                      <motion.circle
                        cx={childX}
                        cy={childY}
                        r="1.8"
                        fill={node.color}
                        opacity="0.9"
                        filter="url(#glow)"
                        whileHover={{ scale: 1.3 }}
                        animate={{
                          opacity: selectedChild?.child.id === child.id ? [0.9, 1, 0.9] : 0.9,
                          scale: selectedChild?.child.id === child.id ? [1, 1.2, 1] : 1,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: selectedChild?.child.id === child.id ? Infinity : 0,
                        }}
                      />
                      {/* Star sparkle */}
                      {Array.from({ length: 4 }).map((_, i) => {
                        const sparkleAngle = (i * 90) * (Math.PI / 180);
                        const sparkleX = childX + Math.cos(sparkleAngle) * 2.5;
                        const sparkleY = childY + Math.sin(sparkleAngle) * 2.5;
                        return (
                          <motion.line
                            key={i}
                            x1={childX}
                            y1={childY}
                            x2={sparkleX}
                            y2={sparkleY}
                            stroke={node.color}
                            strokeWidth="0.2"
                            opacity="0.5"
                            filter="url(#glow)"
                          />
                        );
                      })}
                      {/* Position child text away from parent to avoid line overlap */}
                      {(() => {
                        const textAngle = childAngle;
                        const textDistance = 6;
                        const textX = childX + Math.cos(textAngle) * textDistance;
                        const textY = childY + Math.sin(textAngle) * textDistance;
                        return (
                          <text
                            x={textX}
                            y={textY}
                            textAnchor="middle"
                            className="fill-white pointer-events-none"
                            style={{ fontSize: '2px', fontWeight: '400' }}
                          >
                            {child.label}
                          </text>
                        );
                      })()}
                  </motion.g>
                );
              });
            })}
          </AnimatePresence>
          </motion.g>
        </svg>
      </div>

      <AnimatePresence>
        {selectedChild && !showFullDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-[#1a1f3a]/95 backdrop-blur-lg border-2 rounded-3xl p-5 shadow-2xl"
            style={{
              borderColor: nodePositions.find(n => n.id === selectedChild.parentId)?.color,
              boxShadow: `0 0 40px ${nodePositions.find(n => n.id === selectedChild.parentId)?.color}40`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{
                    backgroundColor: nodePositions.find(n => n.id === selectedChild.parentId)?.color,
                    boxShadow: `0 0 15px ${nodePositions.find(n => n.id === selectedChild.parentId)?.color}`
                  }}
                />
                <div>
                  <h3 className="text-white" style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                    {selectedChild.child.label}
                  </h3>
                  <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>
                    {nodePositions.find(n => n.id === selectedChild.parentId)?.label}
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedChild(null)}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20"
              >
                ✕
              </motion.button>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-white/90 leading-relaxed" style={{ fontSize: '0.9375rem' }}>
                {selectedChild.child.description}
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleLearnMore}
                className="w-full mt-4 py-3 rounded-xl text-white font-medium"
                style={{
                  backgroundColor: nodePositions.find(n => n.id === selectedChild.parentId)?.color,
                  boxShadow: `0 0 20px ${nodePositions.find(n => n.id === selectedChild.parentId)?.color}50`
                }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        )}

        {selectedChild && showFullDetails && (
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
                borderColor: nodePositions.find(n => n.id === selectedChild.parentId)?.color,
                boxShadow: `0 0 60px ${nodePositions.find(n => n.id === selectedChild.parentId)?.color}60`
              }}
            >
              <div className="overflow-y-auto max-h-[80vh]">
                {/* Header */}
                <div
                  className="p-5 relative"
                  style={{
                    background: `linear-gradient(135deg, ${nodePositions.find(n => n.id === selectedChild.parentId)?.color}40, transparent)`
                  }}
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
                        backgroundColor: `${nodePositions.find(n => n.id === selectedChild.parentId)?.color}40`,
                        boxShadow: `0 0 20px ${nodePositions.find(n => n.id === selectedChild.parentId)?.color}50`
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{
                          backgroundColor: nodePositions.find(n => n.id === selectedChild.parentId)?.color,
                        }}
                      />
                    </div>
                    <div>
                      <h2 className="text-white" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                        {selectedChild.child.label}
                      </h2>
                      <p className="text-gray-400" style={{ fontSize: '0.875rem' }}>
                        {nodePositions.find(n => n.id === selectedChild.parentId)?.label}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">
                  <div>
                    <h3 className="text-white mb-2" style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                      Overview
                    </h3>
                    <p className="text-gray-300 leading-relaxed" style={{ fontSize: '0.9375rem' }}>
                      {selectedChild.child.description}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-white mb-3" style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                      Program Details
                    </h3>
                    <div className="space-y-3 text-gray-300" style={{ fontSize: '0.9375rem' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-current mt-2" />
                        <p><strong className="text-white">Duration:</strong> 12 weeks intensive program</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-current mt-2" />
                        <p><strong className="text-white">Location:</strong> Hong Kong - Hybrid (Online & In-person)</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-current mt-2" />
                        <p><strong className="text-white">Next Cohort:</strong> Starting September 2026</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-current mt-2" />
                        <p><strong className="text-white">Benefits:</strong> Mentorship, networking, resources, and potential funding</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h3 className="text-white mb-3" style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                      What You'll Get
                    </h3>
                    <div className="space-y-2 text-gray-300" style={{ fontSize: '0.9375rem' }}>
                      <div className="flex items-center gap-2">
                        <span>✨</span>
                        <span>Access to industry experts and mentors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✨</span>
                        <span>Networking opportunities with peers and investors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✨</span>
                        <span>Hands-on workshops and skill development sessions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✨</span>
                        <span>Certificate of completion and portfolio projects</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-2xl text-white font-semibold"
                      style={{
                        background: `linear-gradient(135deg, ${nodePositions.find(n => n.id === selectedChild.parentId)?.color}, ${nodePositions.find(n => n.id === selectedChild.parentId)?.color}dd)`,
                        boxShadow: `0 0 30px ${nodePositions.find(n => n.id === selectedChild.parentId)?.color}60`
                      }}
                      onClick={() => {
                        // Simulate opening a sign-up link
                        alert('Redirecting to sign-up page...\n\nIn a real app, this would open the registration form!');
                      }}
                    >
                      Sign Up Now
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-2xl text-white font-medium bg-white/10 border border-white/20"
                      onClick={() => {
                        alert('Opening program website...');
                      }}
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
