# Deploy `frontend` to Vercel

Quick steps to deploy the frontend as a static site on Vercel.

1. Install Vercel CLI (optional):

```bash
npm i -g vercel
```

2. Login (one-time):

```bash
vercel login
```

3. From the `frontend` directory, run (interactive):

```bash
cd frontend
vercel
```

Or create a production deployment non-interactively (will read `vercel.json`):

```bash
cd frontend
vercel --prod --confirm
```

4. Set environment variable `VITE_API_URL` in the Vercel dashboard or via CLI:

```bash
vercel env add VITE_API_URL production https://ai-photobooth-backend.onrender.com
```

Notes:
- `frontend/vercel.json` sets the output directory to `dist` and rewrites all routes to `/index.html` for SPA routing.
- The backend uses FastAPI + Uvicorn and is better hosted on Render, Railway, Fly, or another provider that supports persistent processes.
