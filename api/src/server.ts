import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requestLogger } from './middleware/logger.js';
import chatHandler from './chat.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'PORT',
  'FRONTEND_URL',
  'GROQ_API_KEY',
  'GROQ_MODEL',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Frontend URL:', process.env.FRONTEND_URL);

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de origens permitidas
const allowedOrigins = [
  'http://localhost:5173',
  'https://gestor-pro-rovians-projects.vercel.app',
  'https://gestor-pro-seven.vercel.app'
];

// Middleware CORS
app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origem (como aplicativos móveis, curl, etc)
    if (!origin) return callback(null, true);
    
    // Verifica se a origem está na lista de permitidas
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Se não estiver na lista, rejeita a requisição
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(requestLogger);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat API endpoint
app.post('/api/chat', chatHandler);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Export the Express app
export default app;
