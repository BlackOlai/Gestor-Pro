import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    service: 'ConsultIA API',
    version: '1.0.0',
    status: 'online',
    features: {
      chat: !!process.env.GROQ_API_KEY,
      rateLimit: false,
      cors: true
    }
  });
}
