# AI Interview Prep Coach

I built this because I was tired of Googling "common interview questions" and getting the same generic list every time. Every role is different — your prep should be too.

Paste a job description, and this tool generates tailored interview questions with structured STAR answers using AI.

## What it does

- Paste any job description (tech, design, marketing, anything)
- AI generates 12-15 interview questions specific to that role
- Each question comes with a structured STAR answer (Situation, Task, Action, Result)
- Mock interview mode where you practice answering and get scored
- Copy answers with one click for quick revision
- Streaming responses — answers appear in real time

## How I built it

- **Next.js 16** with App Router and TypeScript
- **Tailwind CSS** for styling
- **Claude API** (Anthropic) for AI — streaming responses via Server-Sent Events
- **Vercel** for deployment

Honestly, the hardest part was getting streaming to work properly. The rest was straightforward.

## Running it locally

```bash
git clone https://github.com/encode-abdullah/AI-Interview-Coach.git
cd ai-interview-coach
npm install
```

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=your_key_here
```

Get your API key at [console.anthropic.com](https://console.anthropic.com) (free tier available).

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What I'd do differently

- Add user accounts so you can save your prep history
- Voice-based mock interviews (speech-to-text)
- Resume parsing to auto-fill job details
- Support for multiple AI models (GPT, Gemini)

## Screenshots

*Landing page — clean, simple, gets to the point*

*Prep page — paste a JD, get questions streaming in real time*

*Mock interview — practice answering with AI feedback*

## Tech decisions

| Choice | Why |
|--------|-----|
| Next.js over plain React | File routing, API routes, easy Vercel deploy |
| Claude over GPT | Better at structured STAR answers, cleaner output |
| Streaming over regular fetch | Way better UX — users see answers appearing |
| Tailwind over CSS modules | Faster to build, consistent design |

## License

MIT
