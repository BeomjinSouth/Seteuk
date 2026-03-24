## Overview

`web` is the Next.js application for the Seteuk service.

## Local Development

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Set these in local `.env.local` and in the Vercel project settings.

- `OPENAI_API_KEY`

Notes:

- The app now avoids instantiating the OpenAI client during build, so Vercel builds do not fail just because the key is missing at build time.
- AI-powered routes still need `OPENAI_API_KEY` at runtime.
- Some routes fall back to demo/default responses without the key, while others return `503`.

## Verification

```bash
npx tsc --noEmit
npm run build
```

## Deploy on Vercel

Create the Vercel project from the `web` directory and add the runtime environment variables before testing AI features.
