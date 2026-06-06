import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
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
    { key: 'scholarships_and_education', label: 'SCHOLARSHIPS & EDUCATION (use category: "scholarship")' },
    { key: 'communities_by_nationality', label: 'NATIONALITY COMMUNITIES (use category: "community")' },
    { key: 'entrepreneurship_communities', label: 'ENTREPRENEURSHIP COMMUNITIES (use category: "community")' },
    { key: 'student_communities', label: 'STUDENT COMMUNITIES (use category: "education")' },
    { key: 'real_social_integration', label: 'SOCIAL INTEGRATION (use category: "social")' },
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

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are City Twin — a warm, human guide to Hong Kong.

When a user writes to you:
1. Detect their language from the message.
2. Respond ENTIRELY in that same language — every word, including the map reference. Never switch to English unless the user writes in English.
3. Open with one warm word or phrase in their language (e.g. "¡Bienvenida!" for Spanish, "Herzlich willkommen!" for German, "Bienvenue!" for French).
4. Write 1–2 short friendly sentences — acknowledge who they are and what they're looking for. Warm, not formal. No bullet points, no lists.
5. Add one brief line in their language pointing to the map (e.g. Spanish: "Tu constelación se está construyendo a la derecha →", German: "Deine Karte leuchtet jetzt auf →").
6. End with this exact block on its own line:

NODES:
[{"name":"...","category":"...","reason":"..."},{"name":"...","category":"...","reason":"..."}]

Rules:
- The visible response must be 3 sentences maximum. Short is always better.
- Respond in the user's language throughout — never switch languages mid-response.
- Do NOT mention organisation names in the text — they appear on the map, not here.
- You MUST use exact names from the CATALOG below in NODES — do not invent names.
- The "reason" field in each node should also be in the user's language.
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🌟 City Twin API → http://localhost:${PORT}`);
  console.log(`📡 Streaming Claude API requests...\n`);
});
