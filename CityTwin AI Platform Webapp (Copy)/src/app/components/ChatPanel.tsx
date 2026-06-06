import { useState, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { motion } from 'motion/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your CityTwin AI assistant. Tell me where you'd like to explore opportunities!",
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Great! I'm analyzing opportunities in that area. Check out the network visualization and timeline for personalized recommendations!",
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        const voiceMessage: Message = {
          id: Date.now().toString(),
          text: "I'm planning to go to Hong Kong and want to explore entrepreneurship opportunities there.",
          sender: 'user',
        };
        setMessages((prev) => [...prev, voiceMessage]);
        setIsRecording(false);

        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: "Excellent choice! Hong Kong has a vibrant startup ecosystem. I've updated the network with opportunities in entrepreneurship, grants, and community events!",
            sender: 'ai',
          };
          setMessages((prev) => [...prev, aiResponse]);
        }, 1500);
      }, 2000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
              style={{ fontSize: '0.9375rem' }}
            >
              {message.text}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 space-y-3 border-t border-border bg-card safe-bottom">
        <motion.button
          onClick={toggleRecording}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${
            isRecording
              ? 'bg-destructive text-destructive-foreground shadow-lg'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
          }`}
        >
          {isRecording ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <MicOff className="w-6 h-6" />
              </motion.div>
              <span style={{ fontSize: '1rem', fontWeight: '500' }}>Recording...</span>
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              <span style={{ fontSize: '1rem', fontWeight: '500' }}>Tap to speak</span>
            </>
          )}
        </motion.button>

        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-2xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            style={{ fontSize: '1rem' }}
          />
          <motion.button
            onClick={handleSend}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
