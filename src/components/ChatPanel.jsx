import { useState, useRef, useEffect, useCallback } from 'react';
import VoiceSelector from './VoiceSelector.jsx';
// import VoiceModeDebug from './VoiceModeDebug.jsx';

// ── Icons ────────────────────────────────────────────────────────────────────
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>
);

const MicIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const SpeakerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>
);

const StopIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  </svg>
);

// ── Single message bubble ────────────────────────────────────────────────────
function Message({ msg, onPlayAudio, playingMessageId, isVoiceMode }) {
  const cls = [
    'message',
    msg.role,
    msg.isIntro ? 'intro' : '',
    msg.isError ? 'error' : '',
  ].filter(Boolean).join(' ');

  const isPlaying = playingMessageId === msg.id;

  // In voice mode, show speaking indicator instead of text for AI responses
  if (msg.role === 'assistant' && msg.voiceOnly && !msg.isIntro) {
    return (
      <div className={cls}>
        <div className="message-header">
          <span className="message-role">City Twin AI</span>
        </div>
        <div className="voice-response-indicator">
          <div className="voice-wave">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
          <span className="voice-status-text">
            {msg.streaming ? 'Thinking...' : isPlaying ? 'Speaking...' : '✓ Voice response'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cls}>
      <div className="message-header">
        <span className="message-role">{msg.role === 'user' ? 'You' : 'City Twin AI'}</span>
        {msg.role === 'assistant' && !msg.isIntro && msg.content && !msg.voiceOnly && (
          <button
            className={`play-audio-btn ${isPlaying ? 'playing' : ''}`}
            onClick={() => onPlayAudio(msg)}
            title={isPlaying ? 'Stop' : 'Listen to response'}
          >
            {isPlaying ? <StopIcon /> : <SpeakerIcon />}
          </button>
        )}
      </div>
      <div className="message-bubble">
        {msg.content}
        {msg.streaming && msg.content !== '' && <span className="streaming-cursor" />}
      </div>
    </div>
  );
}

// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="message assistant">
      <span className="message-role">City Twin AI</span>
      <div className="typing-indicator">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

// ── Chat Panel ───────────────────────────────────────────────────────────────
export default function ChatPanel({ messages, onSend, isLoading }) {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [usedVoiceInput, setUsedVoiceInput] = useState(false);
  const [localMessages, setMessages] = useState(messages);
  const [selectedVoice, setSelectedVoice] = useState('EXAVITQu4vr4xnSDxMaL'); // Sarah default
  const listRef = useRef(null);
  const recognRef = useRef(null);
  const textareaRef = useRef(null);
  const audioRef = useRef(null);
  const previousMessagesLength = useRef(messages.length);

  // Sync messages from props
  useEffect(() => {
    setMessages(messages);
  }, [messages]);

  // Debug: Log voice mode state changes
  useEffect(() => {
    console.log('🎤 Voice mode state:', usedVoiceInput ? 'ACTIVE' : 'INACTIVE');
  }, [usedVoiceInput]);

  // Auto-scroll on new messages
  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [localMessages, isLoading]);

  // Auto-play AI response if user used voice input
  useEffect(() => {
    if (messages.length > previousMessagesLength.current) {
      const lastMessage = messages[messages.length - 1];

      // If it's a new assistant message that's not streaming and user used voice
      if (
        lastMessage?.role === 'assistant' &&
        !lastMessage.streaming &&
        !lastMessage.isIntro &&
        usedVoiceInput &&
        lastMessage.content
      ) {
        console.log('🎤 Voice mode: Auto-playing AI response');

        // Mark message as voice-only and auto-play the response
        setMessages(prev =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, voiceOnly: true } : m
          )
        );

        // Auto-play after a short delay
        const timer = setTimeout(() => {
          console.log('🔊 Starting auto-play for message:', lastMessage.id);
          playAudioResponse(lastMessage);
          // Don't reset flag - keep voice mode active for next interaction
        }, 500);

        return () => clearTimeout(timer);
      }
    }
    previousMessagesLength.current = messages.length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, usedVoiceInput]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [text]);

  const submit = useCallback((fromVoice = false) => {
    const val = text.trim();
    if (!val || isLoading) return;
    if (fromVoice) {
      console.log('🎤 Submit via voice');
      setUsedVoiceInput(true);
    } else {
      // User typed instead of speaking - exit voice mode
      console.log('⌨️ Submit via text - exiting voice mode');
      setUsedVoiceInput(false);
    }
    onSend(val);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, isLoading, onSend]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  // ── Voice input (Web Speech API) ────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (listening) {
      recognRef.current?.stop();
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Voice input not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recog = new SR();
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = '';

    let finalText = '';

    recog.onstart = () => {
      setListening(true);
      setText('');
    };

    recog.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalText += e.results[i][0].transcript + ' ';
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      setText((finalText + interim).trim());
    };

    recog.onend = () => {
      setListening(false);
      const val = finalText.trim();
      if (val) {
        console.log('🎤 Voice input received:', val);
        setUsedVoiceInput(true); // Mark as voice input to trigger voice response
        console.log('🎤 usedVoiceInput set to TRUE');
        onSend(val);
        setText('');
      }
    };

    recog.onerror = (e) => {
      console.error('Speech error:', e.error);
      setListening(false);
      setText('');
    };

    recog.start();
    recognRef.current = recog;
  }, [listening, onSend]);

  // ── Text-to-Speech with ElevenLabs ──────────────────────────────────────────
  const playAudioResponse = useCallback(async (message) => {
    console.log('🎵 playAudioResponse called for message:', message.id);

    if (playingMessageId === message.id) {
      // Stop current playback
      console.log('⏹️ Stopping current playback');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingMessageId(null);
      return;
    }

    // Stop any existing audio
    if (audioRef.current) {
      console.log('⏹️ Stopping previous audio');
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      setPlayingMessageId(message.id);

      // Use ElevenLabs API directly via fetch (no SDK needed for simple TTS)
      const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
      const VOICE_ID = selectedVoice; // User-selected voice

      console.log('🔊 ElevenLabs config:', {
        hasApiKey: !!ELEVENLABS_API_KEY,
        apiKeyPrefix: ELEVENLABS_API_KEY?.substring(0, 8),
        voiceId: VOICE_ID,
        textLength: message.content.length
      });

      if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'demo' || ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
        console.warn('⚠️ No valid ElevenLabs API key found, using browser TTS fallback');
        throw new Error('No API key');
      }

      console.log('📡 Fetching audio from ElevenLabs...');
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: message.content,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ ElevenLabs API error:', response.status, errorText);

        // Check if it's an authentication issue
        if (response.status === 401) {
          console.error('❌ Invalid API key - check your VITE_ELEVENLABS_API_KEY in .env');
        } else if (response.status === 429) {
          console.error('❌ Rate limit exceeded - too many requests');
        } else if (response.status === 400) {
          console.error('❌ Bad request - check voice ID and request format');
        }

        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      console.log('✅ Audio received, creating blob...');
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      console.log('🔊 Playing audio...');
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        console.log('✅ Audio playback finished');
        setPlayingMessageId(null);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        // Keep voice mode active - user can click mic to continue
      };

      audio.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        setPlayingMessageId(null);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      await audio.play();
      console.log('▶️ Audio playing started');
    } catch (error) {
      console.error('❌ Audio playback error:', error);
      setPlayingMessageId(null);

      // Fallback to browser TTS
      console.log('🔄 Falling back to browser TTS...');
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message.content);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.onend = () => {
          console.log('✅ Browser TTS finished');
          setPlayingMessageId(null);
        };
        utterance.onerror = (e) => {
          console.error('❌ Browser TTS error:', e);
          setPlayingMessageId(null);
        };
        speechSynthesis.speak(utterance);
        console.log('▶️ Browser TTS started');
      } else {
        console.error('❌ No TTS available');
      }
    }
  }, [playingMessageId, selectedVoice]);

  const showTyping = isLoading && (localMessages.length === 0 || !localMessages[localMessages.length - 1]?.streaming);

  return (
    <section className="chat-panel">
      {/* Voice Selector */}
      <div className="chat-panel-header">
        <VoiceSelector
          currentVoice={selectedVoice}
          onVoiceChange={setSelectedVoice}
        />
      </div>

      {/* Message list */}
      <div className="messages-list" ref={listRef}>
        {localMessages.map((msg, i) => (
          <Message
            key={msg.id || i}
            msg={msg}
            onPlayAudio={playAudioResponse}
            playingMessageId={playingMessageId}
            isVoiceMode={usedVoiceInput}
          />
        ))}
        {showTyping && <TypingIndicator />}
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        {usedVoiceInput && !listening && (
          <div className="voice-mode-indicator">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8"/>
            </svg>
            <span>Voice mode active - Click mic to continue conversation</span>
          </div>
        )}
        <div className="input-wrapper">
          <button
            className={`voice-btn-inline ${listening ? 'listening' : ''} ${usedVoiceInput ? 'voice-mode' : ''}`}
            onClick={startListening}
            disabled={isLoading && !listening}
            title={listening ? 'Stop listening' : usedVoiceInput ? 'Continue voice conversation' : 'Voice input'}
          >
            <MicIcon />
          </button>
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder={listening ? 'Listening...' : usedVoiceInput ? 'Or type to exit voice mode...' : 'Ask about Hong Kong opportunities...'}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            disabled={isLoading || listening}
            rows={1}
          />
          <button
            className="send-btn"
            onClick={submit}
            disabled={!text.trim() || isLoading}
            title="Send message"
          >
            <SendIcon />
          </button>
        </div>
        {listening && (
          <div className="listening-indicator">
            <div className="pulse-ring" />
            <span>Listening...</span>
          </div>
        )}
      </div>

      {/* Debug component - only shows in development */}
      {/* <VoiceModeDebug
        usedVoiceInput={usedVoiceInput}
        playingMessageId={playingMessageId}
        listening={listening}
      /> */}
    </section>
  );
}
