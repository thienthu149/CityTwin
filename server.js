import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';

config();

const app = express();
app.use(cors());
app.use(express.json());

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
- Only real Hong Kong organisations (Cyberport, HKSTP, HKU, Spanish Chamber HK, etc.)
- Categories must be one of: funding, scholarship, community, education, social, event
- Each reason must be specific to why it fits this person — never generic
- The JSON must be on a single line after NODES:

Example node: {"name":"Cyberport","category":"funding","reason":"Incubation up to HKD 500K + free office space, ideal for your AI startup idea"}`;

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
