import express from 'express';
import path from 'path';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers.js';
import { createContext } from './railway-trpc.js';

const app = express();

// ✅ Use Railway/Docker port and ensure it's a number
const PORT = Number(process.env.PORT) || 8080;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS (open; fine for dev, consider restricting in prod)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// tRPC endpoint
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// ✅ Serve static files from the repo root /app/dist (robust regardless of __dirname)
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling
app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

// ✅ Bind to 0.0.0.0 so Railway can route traffic into the container
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Cloud Cars server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
});
