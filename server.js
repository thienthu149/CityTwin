import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import Groq, { toFile } from 'groq-sdk';
import multer from 'multer';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = JSON.parse(readFileSync(join(__dirname, 'database.json'), 'utf-8'));

function buildCatalog(db) {
  const eco = db.hong_kong_ecosystem;
  const sections = [
    { key: 'funding', label: 'FUNDING (use category: "funding")' },
    { key: 'education', label: 'SCHOLARSHIPS & EDUCATION (use category: "scholarship")' },
    { key: 'expats', label: 'NATIONALITY COMMUNITIES (use category: "community")' },
    { key: 'founders', label: 'ENTREPRENEURSHIP COMMUNITIES (use category: "community")' },
    { key: 'study', label: 'STUDENT COMMUNITIES (use category: "education")' },
    { key: 'social', label: 'SOCIAL INTEGRATION (use category: "social")' },
  ];
  const lines = ['HONG KONG ECOSYSTEM CATALOG\nUse ONLY resources from this list. Copy their names exactly.\n'];
  for (const { key, label } of sections) {
    lines.push(label + ':');
    for (const item of eco[key]) {
      lines.push(`• ${item.name} — ${item.details}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

const CATALOG = buildCatalog(db);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are City Twin — a warm, human guide to Hong Kong.

Always respond ENTIRELY in the user's language. Never switch languages mid-response.

IF this is the first message (no prior conversation):
- Open with one warm greeting word in their language (e.g. "¡Bienvenida!" / "Herzlich willkommen!" / "Bienvenue!").
- Write 1–2 short friendly sentences acknowledging who they are and what they need.
- Add one brief line pointing to the map (e.g. "Tu constelación se está construyendo →" / "Deine Karte leuchtet auf →").

IF this is a follow-up message (conversation already started):
- No greeting. Jump straight into the response like a natural conversation.
- Answer what they actually asked. Be helpful, warm, concise.
- Only reference the map if new nodes are being added (e.g. "I've added a few more spots to your map →").

Both cases — always end with this exact block on its own line:

NODES:
[{"name":"...","category":"...","reason":"..."},{"name":"...","category":"...","reason":"..."}]

Rules:
- 3 sentences maximum in the visible response. Short is always better.
- Do NOT mention organisation names in the text — they appear on the map.
- You MUST use exact names from the CATALOG below in NODES — do not invent names.
- The "reason" field in each node should be in the user's language.
- Categories must be one of: funding, scholarship, community, education, social, event
- Each reason must be specific to this person — never generic.
- Generate 5–8 nodes. JSON must be on a single line after NODES:

${CATALOG}`;

app.post('/api/chat', async (req, res) => {
  const { message, history = [], apiKey } = req.body;

  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(400).json({ error: 'No API key. Add ANTHROPIC_API_KEY to .env or enter it in the app.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const client = new Anthropic({ apiKey: key });

    const stream = await client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        ...history,
        { role: 'user', content: message },
      ],
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Claude API error:', error.message);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio received.' });
  try {
    const file = await toFile(req.file.buffer, 'audio.webm', { type: 'audio/webm' });
    const result = await groq.audio.transcriptions.create({
      file,
      model: 'whisper-large-v3-turbo',
      response_format: 'json',
    });
    res.json({ text: result.text });
  } catch (error) {
    console.error('Groq transcription error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🌟 City Twin API → http://localhost:${PORT}`);
  console.log(`📡 Streaming Claude API requests...\n`);
});
