# Smart Crisis Counselor

AI-powered crisis counselor with real-time voice support using ElevenLabs Conversational AI and Gemini 3.0 Flash.

## Features

- **Voice-First Interaction**: Real-time conversation with sub-800ms response time
- **Emergency Alerts**: Auto-call 911 with GPS location sharing
- **Medical Triage**: AI-guided first-aid protocols
- **Emotional Grounding**: 4-7-8 breathing and 5-4-3-2-1 techniques
- **Real-time Transcript**: Accessible text transcript of conversations
- **Privacy Controls**: Incognito mode for anonymous sessions
- **Session Analytics**: Track usage patterns and tool triggers

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Voice SDK**: @elevenlabs/react (WebRTC)
- **LLM**: Gemini 3.0 Flash (via ElevenLabs)
- **Database**: Vercel Postgres
- **Deployment**: Vercel

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. ElevenLabs account with active subscription
3. Vercel account (for deployment and Postgres)

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.local` and add your ElevenLabs Agent ID:
   ```bash
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your-actual-agent-id
   ```

3. **Set up ElevenLabs Agent**:
   - Follow the guide in `ELEVENLABS_SETUP_GUIDE.md`
   - Create agent with the system prompt from `system_prompt.md`
   - Configure client tools: `alertEmergencyServices` and `provide_local_resource`
   - Copy Agent ID to `.env.local`

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
smart-crisis-counselor/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page
│   ├── session/page.tsx     # Active session
│   ├── summary/page.tsx      # Post-session summary
│   └── api/                # API routes
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── AudioVisualizer.tsx  # Canvas waveform
│   ├── Transcript.tsx       # Real-time transcript
│   └── ...
├── hooks/                  # Custom React hooks
│   ├── useConversation.ts   # ElevenLabs WebRTC
│   ├── useLocation.ts       # Geolocation
│   ├── useSession.ts        # Session management
│   └── useTranscript.ts    # Transcript parsing
├── lib/                    # Utilities
│   ├── constants.ts        # App constants & resources
│   ├── tools.ts           # Tool handlers
│   └── db.ts             # Database functions
└── contexts/              # React contexts
    └── SessionContext.tsx  # Global session state
```

## Database Setup

### Vercel Postgres

1. Go to Vercel Dashboard → Your Project → Storage
2. Create a new Postgres database
3. Copy connection strings to `.env.local`:
   ```bash
   POSTGRES_URL=your-vercel-postgres-url
   POSTGRES_PRISMA_URL=your-vercel-postgres-url
   POSTGRES_URL_NON_POOLING=your-vercel-postgres-url-non-pooling
   ```

4. Run database migration (in Vercel SQL Editor):
   ```sql
   CREATE TABLE sessions (
     id TEXT PRIMARY KEY,
     user_id TEXT,
     start_time TIMESTAMP,
     end_time TIMESTAMP,
     duration INTEGER,
     incognito_mode BOOLEAN DEFAULT FALSE,
     connection_quality TEXT,
     device_type TEXT,
     browser TEXT,
     reconnection_attempts INTEGER DEFAULT 0,
     audio_quality_score INTEGER,
     total_speaker_changes INTEGER DEFAULT 0,
     longest_pause_seconds INTEGER DEFAULT 0,
     interruption_count INTEGER DEFAULT 0,
     tools_triggered TEXT[] DEFAULT '{}',
     emergency_alerts INTEGER DEFAULT 0,
     total_user_words INTEGER DEFAULT 0,
     total_ai_words INTEGER DEFAULT 0,
     transcript_entries INTEGER DEFAULT 0
   );

   CREATE TABLE transcript_entries (
     id TEXT PRIMARY KEY,
     session_id TEXT REFERENCES sessions(id),
     speaker TEXT,
     text TEXT,
     timestamp TIMESTAMP
   );

   CREATE TABLE tool_logs (
     id TEXT PRIMARY KEY,
     session_id TEXT REFERENCES sessions(id),
     tool_name TEXT,
     payload JSONB,
     timestamp TIMESTAMP DEFAULT NOW()
   );
   ```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Import repository to Vercel
   - Configure environment variables in Vercel Dashboard
   - Set up Vercel Postgres
   - Deploy!

### Environment Variables on Vercel

Add these in Project Settings → Environment Variables:
- `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `NEXT_PUBLIC_VERCEL_ENV=production`

## User Flows

### 1. Start Session
- User clicks "Start Voice Help" on landing page
- Permission modal requests microphone and location access
- Auto-call 911 consent displayed
- Session initiates with WebRTC connection to ElevenLabs agent

### 2. Active Session
- Real-time voice conversation with AI
- Audio visualizer shows activity
- Transcript updates in real-time
- Tool indicators activate when AI triggers emergency or resource tools
- Manual 911 button always available

### 3. Emergency Scenario
- User mentions life-threatening symptoms
- AI triggers `alertEmergencyServices` tool
- App fetches GPS location
- Auto-calls 911 (if enabled) or shows manual call button
- Location shared with emergency services

### 4. End Session
- User clicks "End Call" button
- Session logged to database (unless incognito)
- Redirected to summary page
- Session stats, transcript, and resources displayed
- Option to start new session

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

### Type Check
```bash
npm run typecheck
```

### Lint
```bash
npm run lint
```

## Security

- **API Keys**: Never exposed to browser (server-side only)
- **Audio**: Processed in memory, no persistent storage
- **Privacy**: Incognito mode skips database logging
- **TLS**: All WebRTC traffic over HTTPS/WSS
- **HIPAA**: Configure DPA with ElevenLabs and Vercel for PHI

## Performance Targets

- **Latency**: <800ms end-to-end response
- **TTFT**: <500ms time to first token
- **Uptime**: 99.9% availability
- **Audio Quality**: Opus codec at 48kHz

## Support

For issues or questions:
- Check `ELEVENLABS_SETUP_GUIDE.md` for agent configuration
- Review `IMPLEMENTATION_PLAN.md` for architecture details
- Consult `CONSTANTS.md` for emergency resources and settings

## Disclaimer

This service provides AI-powered support but does not replace professional medical or emergency services. If in immediate danger, call 911 directly.

## License

ISC
