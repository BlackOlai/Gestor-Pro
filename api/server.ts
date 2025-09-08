import express from 'express';
import chatHandler from './chat.js';
import healthHandler from './health.js';
import statusHandler from './status.js';
import testChatHandler from './test-chat.js';

const router = express.Router();

// API Routes
router.post('/chat', chatHandler);
router.get('/health', healthHandler);
router.get('/status', statusHandler);
router.get('/test-chat', testChatHandler);

// Error handling middleware
router.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default router;
