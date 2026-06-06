import { useState, useRef, useEffect, useCallback } from 'react';

// ── Icons ─────────────────────────────────────────────────────────────────────

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>
);

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const SpeakerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ── Avatar ────────────────────────────────────────────────────────────────────

function TwinAvatar({ size = 34 }) {
  const iR = size * 0.38;
  return (
    <div className="msg-avatar" style={{ width: size, height: size }}>
      <svg width={iR * 2} height={iR * 2} viewBox={`0 0 ${iR * 2} ${iR * 2}`}>
        {[0,1,2,3,4,5].map(i => {
          const a = (i * Math.PI) / 3;
          return (
            <line
              key={i}
              x1={iR} y1={iR}
              x2={iR + Math.cos(a) * iR * 0.85}
              y2={iR + Math.sin(a) * iR * 0.85}
              stroke="white" strokeWidth="2" strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
}

// ── Quick prompts ─────────────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  { icon: '🌐', label: 'Explore Hong Kong' },
  { icon: '⚡', label: 'Startup Programs' },
  { icon: '✨', label: 'Scholarships' },
];

// ── Message bubble ────────────────────────────────────────────────────────────

function Message({ msg, onPlayAudio, playingMessageId }) {
  const isPlaying = playingMessageId === msg.id;

  if (msg.role === 'assistant') {
    if (msg.voiceOnly && !msg.isIntro) {
      return (
        <div className="message assistant">
          <div className="msg-ai-row">
            <TwinAvatar />
            <div className="voice-response-indicator">
              <div className="voice-wave">
                {[0,1,2,3,4].map(i => <div key={i} className="wave-bar" />)}
              </div>
              <span className="voice-status-text">
                {msg.streaming ? 'Thinking…' : isPlaying ? 'Speaking…' : '✓ Voice response'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="message assistant">
        <div className="msg-ai-row">
          <TwinAvatar />
          <div className="message-bubble">
            {msg.content}
            {msg.streaming && msg.content !== '' && <span className="streaming-cursor" />}
            {!msg.isIntro && msg.content && !msg.voiceOnly && (
              <div>
                <button
                  className={`play-audio-btn ${isPlaying ? 'playing' : ''}`}
                  onClick={() => onPlayAudio(msg)}
                  title={isPlaying ? 'Stop' : 'Listen'}
                >
                  {isPlaying ? <StopIcon /> : <SpeakerIcon />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message user">
      <div className="message-bubble">{msg.content}</div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="message assistant">
      <div className="msg-ai-row">
        <TwinAvatar />
        <div className="typing-indicator">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

// ── Chat Panel ────────────────────────────────────────────────────────────────

export default function ChatPanel({ messages, onSend, isLoading, onClose, initialPrompt }) {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [usedVoiceInput, setUsedVoiceInput] = useState(false);
  const [localMessages, setLocalMessages] = useState(messages);

  const selectedVoice = 'EXAVITQu4vr4xnSDxMaL'; // Sarah
  const listRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const textareaRef = useRef(null);
  const audioRef = useRef(null);
  const prevLenRef = useRef(messages.length);

  // Sync messages from parent
  useEffect(() => { setLocalMessages(messages); }, [messages]);

  // Pre-fill from constellation node tap
  useEffect(() => { if (initialPrompt) setText(initialPrompt); }, [initialPrompt]);

  // Auto-scroll
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [localMessages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 110) + 'px';
  }, [text]);

  // Auto-play AI response when voice was used
  useEffect(() => {
    if (messages.length <= prevLenRef.current) { prevLenRef.current = messages.length; return; }
    const last = messages[messages.length - 1];
    if (last?.role === 'assistant' && !last.streaming && !last.isIntro && usedVoiceInput && last.content) {
      setLocalMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, voiceOnly: true } : m));
      const t = setTimeout(() => playAudioResponse(last), 500);
      prevLenRef.current = messages.length;
      return () => clearTimeout(t);
    }
    prevLenRef.current = messages.length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, usedVoiceInput]);

  const submit = useCallback((fromVoice = false) => {
    const val = text.trim();
    if (!val || isLoading) return;
    setUsedVoiceInput(fromVoice);
    onSend(val);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [text, isLoading, onSend]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  // ── Voice input (Groq Whisper) ────────────────────────────────────────────

  const startListening = useCallback(async () => {
    if (listening) { mediaRecorderRef.current?.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setListening(true);
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setListening(false);
        if (!chunksRef.current.length) return;
        setTranscribing(true);
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const fd = new FormData();
          fd.append('audio', blob, 'recording.webm');
          const res = await fetch('/api/transcribe', { method: 'POST', body: fd });
          const data = await res.json();
          if (data.text?.trim()) { setUsedVoiceInput(true); onSend(data.text.trim()); }
        } catch (err) { console.error('Transcription error:', err); }
        finally { setTranscribing(false); }
      };
      mr.start();
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Could not access microphone. Please allow microphone permissions.');
      setListening(false);
    }
  }, [listening, onSend]);

  // ── TTS via ElevenLabs ───────────────────────────────────────────────────

  const playAudioResponse = useCallback(async (message) => {
    if (playingMessageId === message.id) {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlayingMessageId(null);
      return;
    }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

    try {
      setPlayingMessageId(message.id);
      const KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (!KEY || KEY === 'demo' || KEY === 'your_elevenlabs_api_key_here') throw new Error('No API key');

      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
        method: 'POST',
        headers: { 'Accept': 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': KEY },
        body: JSON.stringify({ text: message.content, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
      });
      if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);

      const url = URL.createObjectURL(await res.blob());
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setPlayingMessageId(null); URL.revokeObjectURL(url); audioRef.current = null; };
      audio.onerror = () => { setPlayingMessageId(null); URL.revokeObjectURL(url); audioRef.current = null; };
      await audio.play();
    } catch {
      setPlayingMessageId(null);
      if ('speechSynthesis' in window) {
        const utt = new SpeechSynthesisUtterance(message.content);
        utt.lang = 'en-US'; utt.rate = 0.9;
        utt.onend = () => setPlayingMessageId(null);
        speechSynthesis.speak(utt);
      }
    }
  }, [playingMessageId]);

  const onlyIntro = localMessages.length === 1 && localMessages[0]?.isIntro;
  const showTyping = isLoading && (!localMessages.length || !localMessages[localMessages.length - 1]?.streaming);

  return (
    <section className="chat-panel">

      {/* Your Digital Twin card */}
      <div className="twin-card">
        <div className="twin-avatar">
          <svg width="22" height="22" viewBox="0 0 24 24">
            {[0,1,2,3,4,5].map(i => {
              const a = (i * Math.PI) / 3;
              return <line key={i} x1="12" y1="12" x2={12 + Math.cos(a) * 9} y2={12 + Math.sin(a) * 9} stroke="white" strokeWidth="2.2" strokeLinecap="round"/>;
            })}
          </svg>
        </div>
        <div className="twin-text">
          <span className="twin-title">Your Digital Twin</span>
          <span className="twin-sub">AI-Powered Explorer</span>
        </div>
        <button className="twin-close" onClick={onClose} aria-label="Close chat">
          <ChevronDownIcon />
        </button>
      </div>

      {/* Quick prompts — only shown on fresh chat */}
      {onlyIntro && (
        <div className="quick-prompts">
          <p className="quick-prompts-label">Try these quick prompts</p>
          <div className="quick-chips">
            {QUICK_PROMPTS.map(p => (
              <button key={p.label} className="quick-chip" onClick={() => onSend(p.label)}>
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message list */}
      <div className="messages-list" ref={listRef}>
        {localMessages.map((msg, i) => (
          <Message
            key={msg.id || i}
            msg={msg}
            onPlayAudio={playAudioResponse}
            playingMessageId={playingMessageId}
          />
        ))}
        {showTyping && <TypingIndicator />}
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        {usedVoiceInput && !listening && (
          <div className="voice-mode-indicator">
            <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="#ce93d8"/></svg>
            <span>Voice mode — tap mic to continue</span>
          </div>
        )}
        <div className="input-row">
          <button
            className={`voice-btn-inline ${listening ? 'listening' : ''}`}
            onClick={startListening}
            disabled={(isLoading || transcribing) && !listening}
            title={listening ? 'Stop recording' : 'Voice input'}
          >
            <MicIcon />
          </button>
          <div className="input-field-wrap">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder={listening ? 'Recording… tap mic to stop' : transcribing ? 'Transcribing…' : 'Ask me anything…'}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKey}
              disabled={isLoading || listening || transcribing}
              rows={1}
            />
            <button className="send-btn" onClick={() => submit(false)} disabled={!text.trim() || isLoading}>
              <SendIcon />
            </button>
          </div>
        </div>
        {listening && (
          <div className="listening-indicator">
            <div className="pulse-ring" />
            <span>Recording… tap mic to stop</span>
          </div>
        )}
        {transcribing && (
          <div className="listening-indicator">
            <span>Transcribing your voice…</span>
          </div>
        )}
      </div>
    </section>
  );
}
