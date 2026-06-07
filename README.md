# City Twin - AI-Powered Hong Kong Guide

> **Premium MVP**: Production-ready conversational AI with voice interface and interactive mapping

🚀 **Start your Hong Kong journey**: http://localhost:5173/

---

## ✨ Key Features

### 🎙️ Natural Voice Conversations
- **Speak to AI**: Click microphone, speak your question
- **AI Speaks Back**: Automatic voice response using ElevenLabs premium TTS
- **Hands-Free**: Perfect for on-the-go use
- **Multi-Language**: Auto-detects your language (EN, ES, DE, etc.)

### 🗺️ Interactive Map
- **Real Hong Kong Locations**: 20+ organizations with precise locations
- **Color-Coded Markers**: By category (funding, education, community, etc.)
- **Smart Clustering**: Nearby nodes group automatically
- **Rich Popups**: Click nodes to see details

### 💬 Premium Chat Interface
- **Real-Time Streaming**: Sub-second AI responses
- **Modern Design**: Stardursty design to recreate the nightsky
- **Audio Playback**: Listen to any AI response
- **Smart Input**: Pre-prompted Conversations to help with more easy usability

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy example and add your API keys
cp .env.example .env

# Edit .env and add:
ANTHROPIC_API_KEY=sk-ant-...           # Required
VITE_ELEVENLABS_API_KEY=sk_...        # Optional (premium voice)
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:5174/
```

---

## 🎯 Usage

### Voice Conversation
1. Click the **microphone icon** 🎤 in the input field
2. Speak your question (e.g., "What scholarships are available in Hong Kong?")
3. Wait for AI to process
4. **AI automatically speaks the response** 🔊 
5. See the results directly as a constallation formin in front of your eyes
6. Continue the conversation naturally

### Text Conversation
1. Type your message in the input field
2. Press **Enter** to send (Shift+Enter for new line)
3. AI streams response in real-time
4. Click **speaker icon** to hear any response

### Explore Map
1. Start a conversation
2. Watch markers appear on the map
3. Click markers to see organization details
4. Have direct links leading to the organization's website
4. Zoom and pan to explore Hong Kong

---

## 📁 Project Structure

```
CityTwin/
├── src/
│   ├── components/
│   │   ├── ChatPanel.jsx       # Premium chat UI with voice
│   │   ├── MapView.jsx          # Leaflet map integration
│   │   └── DemoProfiles.jsx     # Quick demo loader
│   ├── utils/
│   │   └── geocoding.js         # Hong Kong location data
│   ├── App.jsx                  # Root component
│   └── App.css                  # Premium design system
├── api/
│   └── chat.js                  # Claude API proxy
├── server.js                    # Express API server
├── .env                         # Environment variables
├── FEATURES.md                  # Complete feature list
├── VOICE_CONVERSATION.md        # Voice feature guide
└── README.md                    # This file
```

---

## 🎨 Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Leaflet** - Interactive maps
- **OpenStreetMap** - Map tiles

### Backend
- **Express** - API proxy server
- **Claude 4** (Anthropic) - AI conversation
- **ElevenLabs** - Premium voice synthesis

### APIs
- **Web Speech API** - Voice input (browser)
- **ElevenLabs TTS** - Voice output (cloud)
- **Claude Streaming** - Real-time AI responses

---

## 🔑 API Keys

### Required
- **Anthropic API Key**: Get at [console.anthropic.com](https://console.anthropic.com)
  - Free tier available
  - Pay-as-you-go pricing

### Optional
- **ElevenLabs API Key**: Get at [elevenlabs.io](https://elevenlabs.io)
  - Free: 10K chars/month
  - Starter: $5/mo - 30K chars
  - Falls back to browser TTS if not provided

---

## 💰 Pricing Estimate

### Development / MVP
- **Claude API**: Free tier → ~$10/mo
- **ElevenLabs**: Free tier (10K chars) → $5/mo (Starter)
- **Total**: $0-15/month

### Production (100 users/day)
- **Claude API**: ~$50/mo
- **ElevenLabs**: $22/mo (Creator tier)
- **Hosting**: $10/mo (Vercel/Railway)
- **Total**: ~$82/month

### Scale (1000 users/day)
- **Claude API**: ~$500/mo
- **ElevenLabs**: $99/mo (Pro tier)
- **Hosting**: $50/mo (dedicated)
- **Total**: ~$649/month

---

## 🎬 Demo Profiles

### 🎓 Sofia - Spanish Student
- Looking for scholarships and community
- 8 opportunities: HKU, HKUST, Spanish Chamber, etc.
- **Try**: "Soy estudiante de Madrid..."

### 🚀 Lena - German Founder
- AI startup looking for funding
- 9 opportunities: Cyberport, HKSTP, Zeroth.AI, etc.
- **Try**: "Ich bin eine KI-Gründerin..."

### 🔬 Priya - Indian Researcher
- Research to startup transition
- 9 opportunities: HKSTP AI Lab, InnoHK, etc.
- **Try**: "I'm an AI researcher from India..."

---

## 🧪 Testing

### Manual Testing
```bash
# Start dev server
npm run dev

# Open browser
open http://localhost:5173/

# Test voice
1. Click microphone
2. Say something
3. Listen to AI response
```

### Automated Testing (Optional)
```bash
# Install Playwright
npm install -D playwright

# Run UI tests
node test-chat-ui.mjs
node test-clustering.mjs
```

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
ANTHROPIC_API_KEY=...
VITE_ELEVENLABS_API_KEY=...
```

### Railway / Render
```bash
# Configure build command
npm run build

# Configure start command
npm start

# Add environment variables in dashboard
```

### Docker (Advanced)
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

---

## 🐛 Troubleshooting

### Voice Not Working
- **Browser**: Use Chrome or Edge (best Web Speech API support)
- **Permissions**: Allow microphone access when prompted
- **API Key**: Check VITE_ELEVENLABS_API_KEY in .env
- **Fallback**: Should use browser TTS if ElevenLabs fails

### Map Not Loading
- **Internet**: Check connection (needs to download tiles)
- **Console**: Look for CORS or network errors
- **Tiles**: Try refreshing page

### API Errors
- **429 Rate Limit**: Too many requests, wait a minute
- **401 Unauthorized**: Check ANTHROPIC_API_KEY in .env
- **500 Server Error**: Check server.js logs

---

## 📚 Documentation

- **[FEATURES.md](FEATURES.md)** - Complete feature list & design system
- **[VOICE_CONVERSATION.md](VOICE_CONVERSATION.md)** - Voice feature deep dive
- **[.env.example](.env.example)** - Environment configuration template

---

## 🎯 Roadmap

### MVP (Current)
- ✅ Voice conversations with auto-response
- ✅ Interactive map with clustering
- ✅ Premium chat interface
- ✅ Demo profiles for quick testing

### V1.0 (Next)
- [ ] User authentication
- [ ] Save conversation history
- [ ] Custom voice selection
- [ ] Mobile app (React Native)

### V2.0 (Future)
- [ ] Real-time collaboration
- [ ] Video calls with AI avatar
- [ ] AR map overlay
- [ ] Community marketplace

---

## 📄 License

**Proprietary** - Built for City Twin MVP funding round

---

## 🤝 Support

- **Issues**: Open a GitHub issue
- **Email**: support@citytwin.ai
- **Docs**: See /docs folder

---

## 🌟 Why City Twin?

Traditional city guides are static and generic. City Twin is:
- **Conversational**: Natural voice interaction
- **Personalized**: Tailored to your background
- **Visual**: See opportunities on a real map
- **Multilingual**: Speak your language
- **AI-Powered**: Smart recommendations

**Perfect for**: Expats, students, founders, researchers moving to Hong Kong
