import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Mic, ArrowUp } from 'lucide-react';

interface InputBarProps {
  onSubmit: (text: string) => void;
  value: string;
  onChange: (v: string) => void;
}

export function InputBar({ onSubmit, value, onChange }: InputBarProps) {
  const [listening, setListening] = useState(false);
  const [voiceMsg, setVoiceMsg] = useState<string | null>(null);
  const recRef = useRef<any>(null);

  const submit = () => {
    const t = value.trim();
    if (!t) return; // require input — keeps the empty state calm
    onSubmit(t);
  };

  // Voice and typing share ONE pipeline: transcription is fed into the same
  // input state and the same onSubmit(generateCityTwinResponse) call.
  const toggleVoice = () => {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setVoiceMsg('Voice input isn’t supported in this browser — please type instead.');
      window.setTimeout(() => setVoiceMsg(null), 3500);
      return;
    }
    try {
      const rec = new SR();
      recRef.current = rec;
      rec.lang = 'en-US';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e: any) => {
        const transcript = e.results?.[0]?.[0]?.transcript ?? '';
        if (transcript) {
          onChange(transcript);
          onSubmit(transcript); // same pipeline as typed text
        }
      };
      rec.onerror = () => {
        setListening(false);
        setVoiceMsg('Microphone unavailable — please type instead.');
        window.setTimeout(() => setVoiceMsg(null), 3500);
      };
      rec.onend = () => setListening(false);
      rec.start();
      setListening(true);
      setVoiceMsg(null);
    } catch {
      setListening(false);
      setVoiceMsg('Microphone unavailable — please type instead.');
      window.setTimeout(() => setVoiceMsg(null), 3500);
    }
  };

  return (
    <div>
      <div className="glass-strong flex items-center gap-2 rounded-full py-1.5 pl-2.5 pr-1.5 shadow-2xl">
        <button
          type="button"
          onClick={toggleVoice}
          title="Speak — uses the same pipeline as typing"
          aria-label="Voice input"
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${
            listening ? 'animate-pulse bg-[#FF6FA5] text-[#070a18]' : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <Mic className="h-4 w-4" />
        </button>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={listening ? 'Listening…' : 'Speak or type — in any language'}
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        />

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={submit}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#5BA8FF] to-[#B98CFF] text-[#070a18]"
          aria-label="Send"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
        </motion.button>
      </div>
      {voiceMsg && <p className="mt-2 text-center text-[11px] text-[#FF6FA5]">{voiceMsg}</p>}
    </div>
  );
}
