import { useEffect, useState } from 'react';

/**
 * Debug component to show voice mode state
 * Remove this in production
 */
export default function VoiceModeDebug({ usedVoiceInput, playingMessageId, listening }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const newLog = {
      time: new Date().toLocaleTimeString(),
      usedVoiceInput,
      playingMessageId,
      listening
    };
    setLogs(prev => [...prev.slice(-5), newLog]);
  }, [usedVoiceInput, playingMessageId, listening]);

  // Only show in development
  if (import.meta.env.PROD) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: '#0f0',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '11px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '300px',
      border: '1px solid #0f0'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🎤 Voice Mode Debug</div>

      <div style={{ marginBottom: '5px' }}>
        <span style={{ color: '#888' }}>Voice Mode:</span>{' '}
        <span style={{ color: usedVoiceInput ? '#0f0' : '#f00' }}>
          {usedVoiceInput ? 'ACTIVE ✓' : 'INACTIVE ✗'}
        </span>
      </div>

      <div style={{ marginBottom: '5px' }}>
        <span style={{ color: '#888' }}>Listening:</span>{' '}
        <span style={{ color: listening ? '#ff0' : '#666' }}>
          {listening ? 'YES 🔴' : 'NO'}
        </span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#888' }}>Playing:</span>{' '}
        <span style={{ color: playingMessageId ? '#0ff' : '#666' }}>
          {playingMessageId ? `YES (${playingMessageId})` : 'NO'}
        </span>
      </div>

      <div style={{ borderTop: '1px solid #333', paddingTop: '5px' }}>
        <div style={{ color: '#888', fontSize: '10px', marginBottom: '3px' }}>State History:</div>
        {logs.slice(-3).map((log, i) => (
          <div key={i} style={{ fontSize: '9px', color: '#666', marginBottom: '2px' }}>
            {log.time}: V={log.usedVoiceInput ? '✓' : '✗'} L={log.listening ? '✓' : '✗'} P={log.playingMessageId ? '✓' : '✗'}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '8px', fontSize: '9px', color: '#888' }}>
        Check browser console for detailed logs
      </div>
    </div>
  );
}
