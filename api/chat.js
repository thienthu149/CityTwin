// Vercel serverless function (ESM)
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = JSON.parse(readFileSync(join(__dirname, '../database.json'), 'utf-8'));

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

const SYSTEM_PROMPT = `You are City Twin — the human integration layer for Hong Kong.

Your mission: help international talent discover Hong Kong's opportunities, communities, and ecosystem — in their own language.

When a user writes to you:
1. Detect their language from their message
2. Acknowledge them warmly — write one short sentence in or about their language (e.g. "¡Bienvenida!" or "Welcome — I can hear you're coming from Spain")
3. Extract their profile: who they are, what they need, where they're from, how long they've been in HK (or if they haven't arrived yet)
4. Respond in English with warmth and specificity — 2-4 sentences addressing their exact situation
5. End your entire response with this exact format on its own line:

NODES:
[{"name":"...","category":"...","reason":"..."},{"name":"...","category":"...","reason":"..."}]

Rules for nodes:
- Generate exactly 5-8 nodes tailored to THIS specific person's profile
- You MUST use exact names from the CATALOG below — do not invent names
- Categories must be one of: funding, scholarship, community, education, social, event
- Each reason must be specific to why it fits this person — never generic
- The JSON must be on a single line after NODES:

${CATALOG}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [], apiKey } = req.body;
  const key = apiKey || process.env.ANTHROPIC_API_KEY;

  if (!key) {
    return res.status(400).json({ error: 'No API key configured.' });
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
      messages: [...history, { role: 'user', content: message }],
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
}
