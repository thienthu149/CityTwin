import { useState } from 'react';

const VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', gender: 'Female', accent: 'American', style: 'Calm, clear' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'Female', accent: 'American', style: 'Energetic, friendly' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', gender: 'Female', accent: 'American', style: 'Professional' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', gender: 'Female', accent: 'American', style: 'Warm, conversational' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', gender: 'Male', accent: 'American', style: 'Casual, friendly' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', gender: 'Male', accent: 'American', style: 'Energetic, youthful' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', gender: 'Male', accent: 'American', style: 'Deep, authoritative' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', gender: 'Male', accent: 'British', style: 'Narrator' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', gender: 'Female', accent: 'British', style: 'Sophisticated' },
];

export default function VoiceSelector({ currentVoice, onVoiceChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedVoice = VOICES.find(v => v.id === currentVoice) || VOICES[0];

  const handleSelect = (voiceId) => {
    onVoiceChange(voiceId);
    setIsOpen(false);
  };

  return (
    <div className="voice-selector">
      <button
        className="voice-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Change voice"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        </svg>
        <span className="voice-name">{selectedVoice.name}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="voice-selector-overlay" onClick={() => setIsOpen(false)} />
          <div className="voice-selector-menu">
            <div className="voice-selector-header">
              <span>Select Voice</span>
            </div>
            <div className="voice-selector-list">
              {VOICES.map(voice => (
                <button
                  key={voice.id}
                  className={`voice-option ${voice.id === currentVoice ? 'active' : ''}`}
                  onClick={() => handleSelect(voice.id)}
                >
                  <div className="voice-option-main">
                    <span className="voice-option-name">
                      {voice.id === currentVoice && '✓ '}
                      {voice.name}
                    </span>
                    <span className="voice-option-gender">{voice.gender}</span>
                  </div>
                  <div className="voice-option-details">
                    <span className="voice-option-accent">{voice.accent}</span>
                    <span className="voice-option-style">{voice.style}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
