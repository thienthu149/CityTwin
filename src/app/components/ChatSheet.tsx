import { useState, useRef } from 'react';
import { Send, Mic, MicOff, ChevronDown, Sparkles, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface OpportunityNode {
  id: string;
  name: string;
  category: string;
  reason: string;
}

interface ChatSheetProps {
  onClose: () => void;
  onNodesUpdate: (nodes: OpportunityNode[]) => void;
}

const quickPrompts = [
  { icon: Globe, text: 'Explore Hong Kong', prompt: 'Tell me about opportunities in Hong Kong' },
  { icon: Zap, text: 'Startup Programs', prompt: 'Show me startup and entrepreneurship programs' },
  { icon: Sparkles, text: 'Scholarships', prompt: 'What scholarships are available?' },
];

export function ChatSheet({ onClose, onNodesUpdate }: ChatSheetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to City Twin. ◉\n\nI'm your personal guide to Hong Kong — connecting you to the opportunities, communities, and people that will help you thrive here.\n\nTell me about yourself. Where are you from? What brought you to Hong Kong — or what's making you consider it? Speak in any language.",
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const history = messages
        .filter(m => m.sender !== 'ai' || m.id !== '1')
        .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, history }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      const assistantId = `assistant-${Date.now()}`;
      setMessages(prev => [...prev, { id: assistantId, text: '', sender: 'ai' }]);
      setIsTyping(false);

      if (reader) {
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
                  prev.map(m => (m.id === assistantId ? { ...m, text: display } : m))
                );
              }
            } catch (e) {
              // Ignore JSON parse errors
            }
          }
        }
      }

      // Extract nodes
      const match = fullText.match(/NODES:\s*(\[[\s\S]*?\])\s*$/);
      if (match) {
        try {
          const extracted = JSON.parse(match[1]);
          const nodesWithIds = extracted.map((node: any, i: number) => ({
            ...node,
            id: `${Date.now()}-${i}`,
          }));
          onNodesUpdate(nodesWithIds);
        } catch {
          // Ignore malformed JSON
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          text: '⚠ Connection error. Please try again.',
          sender: 'ai',
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  // Voice input using Groq Whisper API
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [transcribing, setTranscribing] = useState(false);

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      return;
    }

    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setIsRecording(false);

        if (!chunksRef.current.length) return;

        setTranscribing(true);
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', blob, 'recording.webm');

          const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
          const data = await res.json();

          if (data.text?.trim()) {
            handleSend(data.text.trim());
          }
        } catch (err) {
          console.error('Transcription error:', err);
        } finally {
          setTranscribing(false);
        }
      };

      mediaRecorder.start();
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Could not access microphone. Please allow microphone permissions.');
      setIsRecording(false);
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="absolute inset-x-0 bottom-0 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
      style={{
        height: '75vh',
        zIndex: 50,
        background: 'linear-gradient(180deg, #1a1f3a 0%, #0f1729 100%)'
      }}
    >
      {/* Header */}
      <div className="relative p-4 border-b border-white/10" style={{
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)'
      }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#de1e3d] flex items-center justify-center relative overflow-hidden"
            style={{ boxShadow: '0 0 20px rgba(222, 30, 61, 0.6)' }}
          >
            {/* Hong Kong Bauhinia flower */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {Array.from({ length: 5 }).map((_, i) => {
                const angle = (i * 72 - 90) * (Math.PI / 180);
                const petalLength = 8;
                const petalWidth = 4;

                const x1 = 12 + Math.cos(angle) * 1.5;
                const y1 = 12 + Math.sin(angle) * 1.5;
                const x2 = 12 + Math.cos(angle) * petalLength;
                const y2 = 12 + Math.sin(angle) * petalLength;

                const perpAngle = angle + Math.PI / 2;
                const wx = Math.cos(perpAngle) * petalWidth;
                const wy = Math.sin(perpAngle) * petalWidth;

                return (
                  <g key={i}>
                    <path
                      d={`M ${x1} ${y1}
                          Q ${x2 + wx} ${y2 + wy} ${x2} ${y2}
                          Q ${x2 - wx} ${y2 - wy} ${x1} ${y1}`}
                      fill="white"
                      opacity="0.95"
                    />
                    <circle
                      cx={12 + Math.cos(angle) * 5.5}
                      cy={12 + Math.sin(angle) * 5.5}
                      r="0.8"
                      fill="#de1e3d"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          <div>
            <h2 className="text-white" style={{ fontSize: '1.125rem', fontWeight: '600' }}>
              Your Digital Twin
            </h2>
            <p className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text" style={{ fontSize: '0.75rem', fontWeight: '500' }}>
              AI-Powered Explorer
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <p className="text-gray-400 text-center mb-3" style={{ fontSize: '0.8125rem' }}>
              Try these quick prompts
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickPrompts.map((item, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickPrompt(item.prompt)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                  style={{ fontSize: '0.875rem' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-[#de1e3d] flex items-center justify-center mr-2 flex-shrink-0 mt-1 relative overflow-hidden"
                style={{ boxShadow: '0 0 15px rgba(222, 30, 61, 0.5)' }}
              >
                {/* Mini Hong Kong Bauhinia flower */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const angle = (i * 72 - 90) * (Math.PI / 180);
                    const petalLength = 8;
                    const petalWidth = 4;

                    const x1 = 12 + Math.cos(angle) * 1.5;
                    const y1 = 12 + Math.sin(angle) * 1.5;
                    const x2 = 12 + Math.cos(angle) * petalLength;
                    const y2 = 12 + Math.sin(angle) * petalLength;

                    const perpAngle = angle + Math.PI / 2;
                    const wx = Math.cos(perpAngle) * petalWidth;
                    const wy = Math.sin(perpAngle) * petalWidth;

                    return (
                      <g key={i}>
                        <path
                          d={`M ${x1} ${y1}
                              Q ${x2 + wx} ${y2 + wy} ${x2} ${y2}
                              Q ${x2 - wx} ${y2 - wy} ${x1} ${y1}`}
                          fill="white"
                          opacity="0.95"
                        />
                        <circle
                          cx={12 + Math.cos(angle) * 5.5}
                          cy={12 + Math.sin(angle) * 5.5}
                          r="0.8"
                          fill="#de1e3d"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md'
                  : 'bg-white/5 text-white border border-white/10 backdrop-blur-sm rounded-bl-md'
              }`}
              style={{
                fontSize: '0.9375rem',
                lineHeight: '1.5',
                boxShadow: message.sender === 'user' ? '0 0 20px rgba(168, 85, 247, 0.3)' : 'none'
              }}
            >
              {message.text}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-[#de1e3d] flex items-center justify-center mr-2 flex-shrink-0 relative overflow-hidden"
                style={{ boxShadow: '0 0 15px rgba(222, 30, 61, 0.5)' }}
              >
                {/* Mini Hong Kong Bauhinia flower */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const angle = (i * 72 - 90) * (Math.PI / 180);
                    const petalLength = 8;
                    const petalWidth = 4;

                    const x1 = 12 + Math.cos(angle) * 1.5;
                    const y1 = 12 + Math.sin(angle) * 1.5;
                    const x2 = 12 + Math.cos(angle) * petalLength;
                    const y2 = 12 + Math.sin(angle) * petalLength;

                    const perpAngle = angle + Math.PI / 2;
                    const wx = Math.cos(perpAngle) * petalWidth;
                    const wy = Math.sin(perpAngle) * petalWidth;

                    return (
                      <g key={i}>
                        <path
                          d={`M ${x1} ${y1}
                              Q ${x2 + wx} ${y2 + wy} ${x2} ${y2}
                              Q ${x2 - wx} ${y2 - wy} ${x1} ${y1}`}
                          fill="white"
                          opacity="0.95"
                        />
                        <circle
                          cx={12 + Math.cos(angle) * 5.5}
                          cy={12 + Math.sin(angle) * 5.5}
                          r="0.8"
                          fill="#de1e3d"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="bg-white/5 border border-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-white/10 bg-[#1a1f3a]/80 backdrop-blur-lg safe-bottom space-y-3">
        <div className="flex gap-2">
          <motion.button
            onClick={toggleRecording}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
              isRecording
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            style={{
              boxShadow: isRecording
                ? '0 0 25px rgba(220, 38, 38, 0.6)'
                : 'none'
            }}
          >
            {isRecording ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <MicOff className="w-5 h-5" />
              </motion.div>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </motion.button>

          <div className="flex-1 relative">
            {/* Stardust particles */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${(i * 8.33) % 100}%`,
                    top: `${i % 2 === 0 ? 0 : '100%'}`,
                  }}
                  animate={{
                    y: i % 2 === 0 ? [0, 48, 0] : [0, -48, 0],
                    opacity: [0, 1, 0.5, 1, 0],
                    scale: [0, 1, 0.5, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            {/* Animated gradient border */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(90deg, #a855f7, #ec4899, #fbbf24, #a855f7)',
                backgroundSize: '300% 100%',
                padding: '2px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="relative w-full h-12 px-4 pr-12 rounded-2xl bg-[#0f1729]/80 text-white placeholder-gray-500 focus:outline-none focus:bg-[#0f1729]/90 transition-all backdrop-blur-sm z-10"
              style={{ fontSize: '0.9375rem' }}
            />
            <motion.button
              onClick={() => handleSend()}
              whileTap={{ scale: 0.95 }}
              disabled={!input.trim()}
              className={`absolute right-1 top-1 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                input.trim()
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/5 text-gray-500'
              }`}
              style={{
                boxShadow: input.trim() ? '0 0 15px rgba(168, 85, 247, 0.5)' : 'none'
              }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-red-400"
            style={{ fontSize: '0.875rem' }}
          >
            <motion.div
              className="w-2 h-2 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Listening...
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
