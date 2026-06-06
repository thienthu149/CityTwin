import { useState, useCallback } from 'react';
import ChatPanel from './components/ChatPanel.jsx';
import MapView from './components/MapView.jsx';
import DemoProfiles from './components/DemoProfiles.jsx';
import ElevenLabsTest from './components/ElevenLabsTest.jsx';

// ── Demo data (hardcoded for stage backup) ──────────────────────────────────

const DEMO_DATA = {
  sofia: {
    label: '🎓 Sofia',
    lang: 'ES',
    message:
      'Soy estudiante en Madrid y estoy pensando en ir a Hong Kong. ¿Qué becas hay para estudiantes europeos? También me gustaría encontrar comunidad hispanohablante y hacer voluntariado.',
    response:
      `¡Bienvenida, Sofia! Hong Kong has exactly what you're looking for — and your community is already here waiting. Your constellation is building on the right →`,
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
    lang: 'DE',
    message:
      'Ich bin seit einem Monat in Hongkong. Ich habe eine Idee im Bereich KI und suche nach Finanzierung. Ich kenne kaum jemanden hier und möchte andere internationale Gründer treffen, besonders in der AI-Szene.',
    response:
      `Herzlich willkommen, Lena! One month in and already building in AI — you're exactly what this city rewards. Watch your map light up →`,
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
    lang: 'EN',
    message:
      `I am an AI researcher, just graduated from India. I want to start a company in Hong Kong but I don\'t know where to begin. I don\'t know anyone here and I\'m not sure if my research background is relevant for building a startup.`,
    response:
      `Welcome, Priya! Your research background is a genuine advantage here — HK's ecosystem is built for exactly your profile. Your constellation is on the right →`,
    nodes: [
      { name: 'HKSTP AI Lab', category: 'education', reason: 'Research-to-market programme built for academics going commercial — perfect for you' },
      { name: 'InnoHK Research Clusters', category: 'education', reason: '28 R&D centres bridging research and commercialisation across HK' },
      { name: 'Cyberport Incubation Programme', category: 'funding', reason: 'Early-stage incubation up to HKD 500K for tech founders with research background' },
      { name: 'Zeroth', category: 'funding', reason: 'Pre-seed AI accelerator that loves first-time founders with deep technical skills' },
      { name: 'InvestHK Advisory Services', category: 'funding', reason: 'Free government advisory to help you structure your startup correctly from day one' },
      { name: 'AI Community HK', category: 'community', reason: 'Co-founder matching and weekly meetups — find your team here' },
      { name: 'Indian Founders HK', category: 'community', reason: 'Growing community of Indian entrepreneurs — shared experience, real support' },
      { name: 'HKTE Top Talent Pass Scheme', category: 'education', reason: 'Fast-tracked 2-year work visa for high earners and top university graduates' },
      { name: 'HKTE Free Cantonese Basics Course', category: 'social', reason: 'Free HKTE course — learning \'M\'goi\' opens every door in Hong Kong' },
    ],
  },
};

const INTRO_MESSAGE = {
  role: 'assistant',
  content: `Welcome to City Twin. ◉

I'm your personal guide to Hong Kong — connecting you to the opportunities, communities, and people that will help you thrive here.

Tell me about yourself. Where are you from? What brought you to Hong Kong — or what's making you consider it? Speak in any language.`,
  isIntro: true,
  id: 'intro-message',
};

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [messages, setMessages] = useState([INTRO_MESSAGE]);
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Add nodes without duplicates, assigning unique IDs
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

  // Send a message to Claude (real API)
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { role: 'user', content: text, id: `user-${Date.now()}` };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Placeholder streaming message
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
      let buffer = '';
      let fullText = '';

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
              setMessages(prev =>
                prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: display } : m))
              );
            }
          } catch (e) {
            if (e.message && e.message !== 'Unexpected end of JSON input') throw e;
          }
        }
      }

      // Extract and animate nodes
      const match = fullText.match(/NODES:\s*(\[[\s\S]*?\])\s*$/);
      if (match) {
        try {
          const extracted = JSON.parse(match[1]);
          addNodes(extracted, 300);
        } catch {
          // ignore malformed JSON
        }
      }

      setMessages(prev =>
        prev.map((m, i) => (i === prev.length - 1 ? { ...m, streaming: false } : m))
      );
    } catch (err) {
      console.error(err);
      setMessages(prev =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? {
                ...m,
                content: `⚠ ${err.message}\n\nNo API key? Use a demo profile above, or add your key with the key icon.`,
                streaming: false,
                isError: true,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, apiKey, addNodes]);

  // Run a hardcoded demo profile
  const runDemo = useCallback((profileKey) => {
    const demo = DEMO_DATA[profileKey];
    if (!demo) return;

    setNodes([]);
    setMessages([INTRO_MESSAGE]);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'user', content: demo.message }]);
      setIsLoading(true);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: demo.response, streaming: false },
        ]);
        setIsLoading(false);
        addNodes(demo.nodes, 500);
      }, 1400);
    }, 300);
  }, [addNodes]);

  const clearAll = useCallback(() => {
    setMessages([INTRO_MESSAGE]);
    setNodes([]);
  }, []);

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="logo">
          <span className="logo-mark">◉</span>
          <div className="logo-text-group">
            <span className="logo-name">CITY TWIN</span>
            <span className="logo-tagline">Hong Kong Intelligence Layer</span>
          </div>
        </div>

        <DemoProfiles demos={DEMO_DATA} onSelect={runDemo} onClear={clearAll} />

        <div className="header-actions">
          <button
            className="icon-btn"
            title="API Key"
            onClick={() => setShowKeyInput(v => !v)}
          >
            🔑
          </button>
          {showKeyInput && (
            <input
              className="api-key-field"
              type="password"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setShowKeyInput(false)}
              autoFocus
            />
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="main">
        <ChatPanel
          messages={messages}
          onSend={sendMessage}
          isLoading={isLoading}
        />
        <MapView nodes={nodes} />
      </main>

      {/* Temporary debug component */}
      <ElevenLabsTest />
    </div>
  );
}
