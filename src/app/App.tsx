import { useState, useCallback } from 'react';
import { ChatSheet } from './components/ChatSheet';
import { NeuralNetwork } from './components/NeuralNetwork';
import { OpportunityTimeline } from './components/OpportunityTimeline';
import { CityTwinLogo } from './components/CityTwinLogo';
import { MessageCircle, Network, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OpportunityNode {
  id: string;
  name: string;
  category: string;
  reason: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'network' | 'timeline'>('network');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [nodes, setNodes] = useState<OpportunityNode[]>([]);

  const handleNodesUpdate = useCallback((newNodes: OpportunityNode[]) => {
    setNodes(prev => {
      // Add new nodes without duplicates
      const existingNames = new Set(prev.map(n => n.name));
      const uniqueNewNodes = newNodes.filter(n => !existingNames.has(n.name));
      return [...prev, ...uniqueNewNodes];
    });
  }, []);

  return (
    <div className="size-full flex flex-col bg-[#0a0e27]">
      <header className="bg-gradient-to-r from-[#0f1729] via-[#1a1f3a] to-[#0f1729] text-white px-4 py-3 shadow-lg border-b border-white/10">
        <CityTwinLogo />
      </header>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'network' && <NeuralNetwork nodes={nodes} />}
        {activeTab === 'timeline' && <OpportunityTimeline />}

        <AnimatePresence>
          {isChatOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={() => setIsChatOpen(false)}
              />
              <ChatSheet onClose={() => setIsChatOpen(false)} onNodesUpdate={handleNodesUpdate} />
            </>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(true)}
          className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl flex items-center justify-center"
          style={{ zIndex: 40, boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
        >
          <MessageCircle className="w-7 h-7" />
        </motion.button>
      </div>

      <nav className="bg-[#0f1729] border-t border-white/10 flex items-center justify-around p-2 safe-bottom">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('network')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors ${
            activeTab === 'network' ? 'bg-purple-600/20 text-purple-300' : 'text-gray-400'
          }`}
        >
          <Network className="w-6 h-6" />
          <span style={{ fontSize: '0.75rem' }}>Constellation</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('timeline')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors ${
            activeTab === 'timeline' ? 'bg-purple-600/20 text-purple-300' : 'text-gray-400'
          }`}
        >
          <Calendar className="w-6 h-6" />
          <span style={{ fontSize: '0.75rem' }}>Schedule</span>
        </motion.button>
      </nav>
    </div>
  );
}