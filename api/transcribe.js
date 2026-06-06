// Vercel serverless function for Groq Whisper transcription
import Groq from 'groq-sdk';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Parse multipart form data
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Extract audio file from multipart data
    const boundary = req.headers['content-type']?.split('boundary=')[1];
    if (!boundary) {
      return res.status(400).json({ error: 'No boundary found' });
    }

    const parts = buffer.toString('binary').split(`--${boundary}`);
    let audioBuffer = null;

    for (const part of parts) {
      if (part.includes('filename=')) {
        const dataStart = part.indexOf('\r\n\r\n') + 4;
        const dataEnd = part.lastIndexOf('\r\n');
        audioBuffer = Buffer.from(part.substring(dataStart, dataEnd), 'binary');
        break;
      }
    }

    if (!audioBuffer) {
      return res.status(400).json({ error: 'No audio file found' });
    }

    // Create a readable stream from the buffer
    const stream = Readable.from(audioBuffer);
    stream.path = 'recording.webm';

    // Transcribe with Groq Whisper
    const transcription = await groq.audio.transcriptions.create({
      file: stream,
      model: 'whisper-large-v3',
      language: 'en', // Auto-detect or specify
      response_format: 'json',
    });

    res.status(200).json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: error.message || 'Transcription failed' });
  }
}
