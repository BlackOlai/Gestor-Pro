import { Request, Response } from 'express';

export default async function testChatHandler(req: Request, res: Response) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verificar se as variáveis de ambiente estão configuradas
  const groqApiKey = (process.env.GROQ_API_KEY || '').trim();
  const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
  const supabaseKey = (process.env.SUPABASE_ANON_KEY || '').trim();

  return res.status(200).json({
    message: 'Endpoint de teste do chat',
    timestamp: new Date().toISOString(),
    environment: {
      groqConfigured: !!groqApiKey,
      supabaseConfigured: !!supabaseUrl && !!supabaseKey,
      nodeVersion: process.version
    },
    instructions: {
      chatEndpoint: '/api/chat',
      method: 'POST',
      requiredFields: ['messages', 'expertContext'],
      example: {
        messages: [
          {
            role: 'user',
            content: 'Preciso de ajuda com vendas'
          }
        ],
        expertContext: {
          name: 'Consultor de Vendas',
          specialty: 'Estratégias de vendas para MPE'
        }
      }
    }
  });
}
