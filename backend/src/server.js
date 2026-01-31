import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import streamsRouter from './routes/streams.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/streams', authMiddleware, streamsRouter);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/metrics', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CCTV Backend API',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'CCTV Backend API',
    endpoints: {
      health: '/health',
      metrics: '/metrics',
      auth: '/api/auth/*',
      streams: '/api/streams/*'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Users configured: admin, zaky, korlantas, operator`);
});