import { useState } from 'react';

export default function ElevenLabsTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testElevenLabs = async () => {
    setTesting(true);
    setResult(null);

    const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah

    console.log('🧪 Testing ElevenLabs API...');
    console.log('API Key prefix:', ELEVENLABS_API_KEY?.substring(0, 8));

    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'demo') {
      setResult({ success: false, message: 'No API key found in environment variables' });
      setTesting(false);
      return;
    }

    try {
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
            text: 'Hello! This is a test of the ElevenLabs voice synthesis. If you can hear this, your API integration is working correctly.',
            model_id: 'eleven_turbo_v2_5',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
      setResult({ success: true, message: 'ElevenLabs API working! Audio should be playing now.' });
    } catch (error) {
      console.error('❌ Test failed:', error);
      setResult({ success: false, message: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      zIndex: 10000,
      maxWidth: '300px',
      fontSize: '13px',
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        🎤 ElevenLabs Test
      </div>
      <div style={{ marginBottom: '10px', fontSize: '11px', opacity: 0.8 }}>
        API Key: {import.meta.env.VITE_ELEVENLABS_API_KEY ?
          `${import.meta.env.VITE_ELEVENLABS_API_KEY.substring(0, 8)}...` :
          '❌ Not found'}
      </div>
      <button
        onClick={testElevenLabs}
        disabled={testing}
        style={{
          width: '100%',
          padding: '8px',
          background: testing ? '#666' : '#4fc3f7',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          cursor: testing ? 'not-allowed' : 'pointer',
          marginBottom: '8px',
        }}
      >
        {testing ? 'Testing...' : 'Test Voice'}
      </button>
      {result && (
        <div style={{
          padding: '8px',
          background: result.success ? '#2e7d32' : '#c62828',
          borderRadius: '4px',
          fontSize: '11px',
        }}>
          {result.success ? '✅' : '❌'} {result.message}
        </div>
      )}
    </div>
  );
}
