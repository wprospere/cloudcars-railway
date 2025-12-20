import express from 'express';
import path from 'path';
import fs from 'fs';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers.js';
import { createContext } from './railway-trpc.js';

const app = express();

// Railway provides PORT; fall back for local dev
const PORT = Number(process.env.PORT) || 8080;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS (open; OK for dev. Consider locking down in prod.)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// tRPC
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// If someone hits an unknown /api route, don't serve the SPA; return 404
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Serve SPA static assets
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// SPA fallback (ONLY for non-API routes)
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');

  // Helpful error if dist isn't present in production
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Missing ${indexPath}. Did you build/commit dist?`);
    return res.status(500).send('Build output missing: dist/index.html not found');
  }

  res.sendFile(indexPath);
});

// Error handling
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Bind to 0.0.0.0 so Railway can route traffic into the container
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Cloud Cars server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
  console.log(`📦 Serving static from: ${distPath}`);
});
