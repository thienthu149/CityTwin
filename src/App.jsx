import { useState, useCallback } from 'react';
import { MessageCircle, Network, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ChatPanel from './components/ChatPanel.jsx';
import { NeuralNetwork } from './components/NeuralNetwork.tsx';
import { OpportunityTimeline } from './components/OpportunityTimeline.tsx';
import { CityTwinLogo } from './components/CityTwinLogo.tsx';

// ── Demo profiles ─────────────────────────────────────────────────────────────

const DEMO_DATA = {
  sofia: {
    label: '🎓 Sofia',
    message: 'Soy estudiante en Madrid y estoy pensando en ir a Hong Kong. ¿Qué becas hay para estudiantes europeos? También me gustaría encontrar comunidad hispanohablante y hacer voluntariado.',
    response: '¡Bienvenida, Sofia! Hong Kong tiene exactamente lo que buscas — y tu comunidad ya está aquí esperándote.',
    nodes: [
      { name: 'HKU Scholarships for European Students', category: 'scholarship', reason: 'European students eligible for merit awards up to HKD 120K/year' },
      { name: 'HKUST Global Scholarships', category: 'scholarship', reason: 'International merit scholarship for science & engineering students' },
      { name: 'CUHK International House', category: 'education', reason: 'International student community hub for campus life and connections' },
      { name: 'Spanish Chamber of Commerce HK', category: 'community', reason: '3,000+ Spanish-speaking professionals — your community is already here' },
      { name: 'Erasmus Alumni HK Network', category: 'social', reason: 'European alumni network already settled and thriving in Hong Kong' },
      { name: 'EuroExpats HK', category: 'social', reason: 'Active European expat community for social integration from day one' },
      { name: 'HKTE Volunteer Programme', category: 'social', reason: 'Official HKTE volunteering programme designed for new international arrivals' },
      { name: 'Foodlink HK', category: 'social', reason: 'Food bank volunteer network — great way to meet locals and fellow expats' },
    ],
  },
  lena: {
    label: '🚀 Lena',
    message: 'Ich bin seit einem Monat in Hongkong. Ich habe eine Idee im Bereich KI und suche nach Finanzierung. Ich kenne kaum jemanden hier und möchte andere internationale Gründer treffen, besonders in der AI-Szene.',
    response: 'Herzlich willkommen, Lena! Einen Monat hier und schon dabei, etwas im KI-Bereich aufzubauen — genau das belohnt diese Stadt.',
    nodes: [
      { name: 'Cyberport Incubation Programme', category: 'funding', reason: 'Incubation up to HKD 500K + free office space, built specifically for AI startups' },
      { name: 'HKSTP Incubation Programme', category: 'funding', reason: 'Deep tech incubation with R&D capabilities — ideal for serious AI projects' },
      { name: 'Zeroth', category: 'funding', reason: 'Pre-seed AI-focused accelerator based right in HK — exactly your stage' },
      { name: 'Brinc Accelerator', category: 'funding', reason: 'AI & IoT track with global network and strong HK presence' },
      { name: 'InvestHK Advisory Services', category: 'funding', reason: 'Free government advisory for international founders setting up in HK' },
      { name: 'AI Community HK', category: 'community', reason: 'Weekly events and co-founder matching — this is your scene' },
      { name: 'StartupHK', category: 'community', reason: '8,000+ founders community — your network starts here today' },
      { name: 'German Chamber of Commerce HK', category: 'community', reason: 'Your national business community with 500+ members already in HK' },
      { name: 'Women Founders HK', category: 'community', reason: 'Mentorship circles for female entrepreneurs in the startup ecosystem' },
    ],
  },
  priya: {
    label: '🔬 Priya',
    message: `I am an AI researcher, just graduated from India. I want to start a company in Hong Kong but I don't know where to begin. I don't know anyone here and I'm not sure if my research background is relevant for building a startup.`,
    response: `Welcome, Priya! Your research background is a genuine advantage here — HK's ecosystem is built for exactly your profile.`,
    nodes: [
      { name: 'HKSTP AI Lab', category: 'education', reason: 'Research-to-market programme built for academics going commercial — perfect for you' },
      { name: 'InnoHK Research Clusters', category: 'education', reason: '28 R&D centres bridging research and commercialisation across HK' },
      { name: 'Cyberport Incubation Programme', category: 'funding', reason: 'Early-stage incubation up to HKD 500K for tech founders with research background' },
      { name: 'Zeroth', category: 'funding', reason: 'Pre-seed AI accelerator that loves first-time founders with deep technical skills' },
      { name: 'InvestHK Advisory Services', category: 'funding', reason: 'Free government advisory to help you structure your startup correctly from day one' },
      { name: 'AI Community HK', category: 'community', reason: 'Co-founder matching and weekly meetups — find your team here' },
      { name: 'Indian Founders HK', category: 'community', reason: 'Growing community of Indian entrepreneurs — shared experience, real support' },
      { name: 'HKTE Top Talent Pass Scheme', category: 'education', reason: 'Fast-tracked 2-year work visa for high earners and top university graduates' },
      { name: 'HKTE Free Cantonese Basics Course', category: 'social', reason: `Free HKTE course — learning 'M'goi' opens every door in Hong Kong` },
    ],
  },
};

const INTRO_MESSAGE = {
  role: 'assistant',
  content: `Hello! I'm your Digital Twin — your AI companion for discovering opportunities worldwide. I can help you explore programs, events, and experiences tailored to your goals. Where would you like to begin?`,
  isIntro: true,
  id: 'intro-message',
};

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [messages, setMessages] = useState([INTRO_MESSAGE]);
  const [, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey] = useState('');
  const [activeTab, setActiveTab] = useState('constellation');
  const [showChat, setShowChat] = useState(false);
  const [chatPrompt, setChatPrompt] = useState('');
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const addNodes = useCallback((newNodes, delay = 0) => {
    newNodes.forEach((node, i) => {
      setTimeout(() => {
        setNodes(prev => {
          if (prev.find(n => n.name === node.name)) return prev;
          return [...prev, { ...node, id: `${Date.now()}-${i}` }];
        });
      }, delay + i * 380);
    });
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: text, id: `user-${Date.now()}` }]);
    setIsLoading(true);

    const assistantId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true, id: assistantId }]);

    try {
      const history = messages
        .filter(m => !m.isIntro && !m.streaming)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history, apiKey }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '', fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') break;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              fullText += parsed.text;
              const display = fullText.split('NODES:')[0].trimEnd();
              setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: display } : m));
            }
          } catch (e) {
            if (e.message !== 'Unexpected end of JSON input') throw e;
          }
        }
      }

      const match = fullText.match(/NODES:\s*(\[[\s\S]*?\])\s*$/);
      if (match) {
        try { addNodes(JSON.parse(match[1]), 300); } catch { /* ignore */ }
      }

      setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, streaming: false } : m));
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map((m, i) =>
        i === prev.length - 1 ? { ...m, content: `⚠ ${err.message}`, streaming: false, isError: true } : m
      ));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, apiKey, addNodes]);

  const runDemo = useCallback((key) => {
    const demo = DEMO_DATA[key];
    if (!demo) return;
    setNodes([]);
    setMessages([INTRO_MESSAGE]);
    setShowDemoMenu(false);
    setShowChat(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'user', content: demo.message }]);
      setIsLoading(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: demo.response, streaming: false }]);
        setIsLoading(false);
        addNodes(demo.nodes, 500);
      }, 1400);
    }, 300);
  }, [addNodes]);

  const openChat = useCallback((prompt = '') => {
    setChatPrompt(prompt);
    setShowChat(true);
  }, []);

  const closeChat = useCallback(() => {
    setShowChat(false);
    setChatPrompt('');
  }, []);

  return (
    <div
      className="flex flex-col w-full h-full bg-[#0d1b2e] relative overflow-hidden"
      style={{ maxWidth: 480, margin: '0 auto' }}
      onClick={() => showDemoMenu && setShowDemoMenu(false)}
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0f1729] via-[#1a1f3a] to-[#0f1729] text-white px-4 py-3 shadow-lg border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <CityTwinLogo />
        <div onClick={e => e.stopPropagation()} className="relative">
          <button
            className="px-3 py-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors text-xs font-semibold tracking-wider border border-white/10"
            onClick={() => setShowDemoMenu(v => !v)}
          >
            DEMO
          </button>
          <AnimatePresence>
            {showDemoMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 bg-[#1a1f3a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[160px]"
              >
                {Object.entries(DEMO_DATA).map(([key, d]) => (
                  <button
                    key={key}
                    className="w-full px-4 py-3 text-left text-white/90 hover:bg-white/10 transition-colors text-sm"
                    onClick={() => runDemo(key)}
                  >
                    {d.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Tab views — always rendered but hidden behind chat */}
        <div className={showChat ? 'hidden' : 'h-full'}>
          {activeTab === 'constellation' ? (
            <NeuralNetwork
              onOpenChat={openChat}
              onCategorySelect={sub => setChatPrompt(`Tell me about ${sub} opportunities in Hong Kong`)}
            />
          ) : (
            <OpportunityTimeline />
          )}
        </div>

        {/* Chat overlay (slide-up sheet) */}
        <AnimatePresence>
          {showChat && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={closeChat}
              />
              <motion.div
                key="sheet"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute inset-0 overflow-hidden"
                style={{ zIndex: 50 }}
              >
                <ChatPanel
                  messages={messages}
                  onSend={sendMessage}
                  isLoading={isLoading}
                  onClose={closeChat}
                  initialPrompt={chatPrompt}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating chat button */}
        {!showChat && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => openChat()}
            className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl flex items-center justify-center"
            style={{ zIndex: 40, boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
          >
            <MessageCircle className="w-7 h-7" />
          </motion.button>
        )}
      </div>

      {/* Bottom navigation */}
      <nav className="bg-[#0f1729] border-t border-white/10 flex items-center justify-around p-2 flex-shrink-0" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setActiveTab('constellation'); setShowChat(false); }}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors ${
            activeTab === 'constellation' && !showChat ? 'bg-purple-600/20 text-purple-300' : 'text-gray-400'
          }`}
        >
          <Network className="w-6 h-6" />
          <span style={{ fontSize: '0.75rem' }}>Constellation</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setActiveTab('schedule'); setShowChat(false); }}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors ${
            activeTab === 'schedule' && !showChat ? 'bg-purple-600/20 text-purple-300' : 'text-gray-400'
          }`}
        >
          <Calendar className="w-6 h-6" />
          <span style={{ fontSize: '0.75rem' }}>Schedule</span>
        </motion.button>
      </nav>
    </div>
  );
}
