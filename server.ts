import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { publicApi, agentApi } from './server/api';
import { rateLimiter } from './server/security';

// Load environment variables early
dotenv.config();

const app = express();
const PORT = 3000;

// Security & Parsing Middlewares
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Custom Security Headers & CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CORS headers
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Toolverse-Secret');
  }

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// Apply global rate limiting to all API routes
app.use('/api', rateLimiter(180, 60 * 1000));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'TOOLVERSE',
    timestamp: new Date().toISOString()
  });
});

// Mount Public API (For visitor site)
app.use('/api/public', publicApi);

// Mount Protected Agent / Admin API
app.use('/api/agent/v1', agentApi);

// Explicit 404 for unmatched /api routes (prevent falling through to HTML SPA handler)
app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'API endpoint does not exist'
  });
});

// Generic safe error handler that never leaks secrets or stack traces
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected server error occurred.'
  });
});

async function startServer() {
  // Integrate Vite for SPA development or serve compiled static in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TOOLVERSE Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
