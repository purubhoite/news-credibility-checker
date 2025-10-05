import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import claimRouter from './routes/claim.js';
import historyRouter from './routes/history.js';

const app = express();

// Security headers
app.use(helmet());

// CORS - allow frontend origin in production via env, otherwise allow localhost dev
const allowedOrigin = process.env.FRONTEND_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin === '*' ? true : allowedOrigin,
  })
);

// JSON parsing
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api', claimRouter);
app.use('/api', historyRouter);

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Avoid leaking internals in production
  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  res.status(status).json({ error: message });
});

const PORT = Number(process.env.PORT || 8080);

app.listen(PORT, () => {
  // Basic startup log (avoid printing secrets)
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;

