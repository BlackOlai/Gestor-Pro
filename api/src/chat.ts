import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { getSupabase } from './_supabase.js';
import { Database } from './types/database.types';

type Tables = Database['public']['Tables'];
type UserApp = Tables['users_app']['Insert'];
type Chat = Tables['chats']['Insert'];
type ChatMessage = Tables['chat_messages']['Insert'];

// Using native fetch API available in Node.js 18+

interface GroqChatCompletionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GroqChatCompletionChoice {
  index: number;
  message: GroqChatCompletionMessage;
  finish_reason: string;
}

interface GroqUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface GroqChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: GroqChatCompletionChoice[];
  usage: GroqUsage;
}

// Using the Database types for type safety

interface ExpertContext {
  name: string;
  specialty: string;
  category?: string;
}

// Chat handler function
export default async function chatHandler(req: ExpressRequest, res: ExpressResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Carregar e validar API key
  const groqApiKey = (process.env.GROQ_API_KEY || '').trim();
  const groqModel = (process.env.GROQ_MODEL || 'llama-3.1-8b-instant').trim();
  
  if (!groqApiKey) {
    console.error('❌ GROQ_API_KEY não configurada ou vazia');
    return res.status(500).json({ error: 'Serviço temporariamente indisponível. Contate o suporte.' });
  }

  // Log request details (without sensitive data)
  console.log('🔥 /api/chat called');
  console.log('Request headers:', JSON.stringify({
    'content-type': req.headers['content-type'],
    'user-agent': req.headers['user-agent'],
    'origin': req.headers['origin']
  }));

  try {
    const { messages, expertContext, chatId, authUser } = req.body || {};
    
    // Log request body (without sensitive data)
    console.log('Request body:', JSON.stringify({
      hasMessages: !!messages,
      messageCount: messages?.length || 0,
      hasExpertContext: !!expertContext,
      chatId: chatId || 'none',
      authUser: authUser ? 'provided' : 'none'
    }));
    
    console.log('Received chat request with body:', JSON.stringify({
      hasMessages: !!messages,
      messageCount: messages?.length || 0,
      hasExpertContext: !!expertContext,
      chatId: chatId || 'none',
      authUser: authUser ? 'provided' : 'none'
    }));

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Mensagens inválidas' });
    }

    if (!expertContext || !expertContext.name || !expertContext.specialty) {
      return res.status(400).json({ error: 'Contexto do especialista inválido' });
    }

    const groqPayload = {
      model: groqModel,
      messages: [
        {
          role: 'system',
          content: `Você é ${expertContext.name}, ${expertContext.specialty}.
                   Responda como um consultor especializado, de forma prática e objetiva.
                   Foque em soluções aplicáveis para micro e pequenas empresas brasileiras.`
        },
        ...messages as ChatMessage[]
      ],
      max_tokens: 1000,
      temperature: 0.7
    };

    // Chamada à Groq com timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify(groqPayload),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        let providerError: any;
        try { 
          providerError = JSON.parse(errorText); 
        } catch { 
          providerError = errorText; 
        }
        return res.status(502).json({
          error: 'Falha ao consultar o provedor de IA',
          providerStatus: response.status,
          providerError
        });
      }

      const data = (await response.json()) as GroqChatCompletionResponse;
      const assistantContent = data.choices?.[0]?.message?.content || '';

      // Persistência no Supabase (se configurado)
      try {
        const supabase = getSupabase();
        if (supabase) {
          let currentChatId = chatId || null;

          // Upsert de usuário
          let userId: string | null = null;
          if (authUser?.id || authUser?.email) {
            try {
              const userData = {
                email: authUser.email || undefined,
                name: authUser.name || undefined,
                ...(authUser.id && { id: authUser.id })
              };

              const { data: upUser, error: upErr } = await supabase
                .from('users_app')
                .upsert(userData, { 
                  onConflict: 'email',
                  ignoreDuplicates: true
                } as any) // Type assertion to handle Supabase type issues
                .select()
                .single<{ id: string }>(); // Explicitly type the response
                
              if (upErr) {
                console.warn('Supabase upsert user error:', upErr.message);
              } else if (upUser) {
                userId = (upUser as { id: string }).id;
              }
              
              if (!userId && authUser.id) {
                userId = authUser.id;
              }
            } catch (error) {
              console.error('Error in user upsert:', error);
            }
          }

          // Criar chat se necessário
          if (!currentChatId) {
            try {
              const chatData = {
                user_id: userId || null,
                expert_context: expertContext || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              
              const { data: newChat, error: chatErr } = await supabase
                .from('chats')
                .insert(chatData as any) // Type assertion to handle Supabase type issues
                .select()
                .single<{ id: string }>(); // Explicitly type the response
                
              if (chatErr) {
                console.warn('Supabase create chat error:', chatErr.message);
              } else if (newChat) {
                currentChatId = (newChat as { id: string }).id;
              }
            } catch (error) {
              console.error('Error creating chat:', error);
            }
          }

          // Inserir última mensagem do usuário (se existir)
          if (Array.isArray(messages) && messages.length && currentChatId) {
            try {
              const lastUserMsg = messages[messages.length - 1];
              if (lastUserMsg?.role === 'user') {
                const messageData = {
                  chat_id: currentChatId,
                  role: 'user' as const,
                  content: lastUserMsg.content,
                  created_at: new Date().toISOString()
                };
                
                const { error: msgErr } = await supabase
                  .from('chat_messages')
                  .insert(messageData as any); // Type assertion to handle Supabase type issues
                  
                if (msgErr) {
                  console.warn('Supabase insert user message error:', msgErr.message);
                }
              }
            } catch (error) {
              console.error('Error inserting user message:', error);
            }
          }

          // Inserir resposta do assistente
          if (assistantContent && currentChatId) {
            try {
              const messageData = {
                chat_id: currentChatId,
                role: 'assistant' as const,
                content: assistantContent,
                created_at: new Date().toISOString()
              };
              
              const { error: asstErr } = await supabase
                .from('chat_messages')
                .insert(messageData as any); // Type assertion to handle Supabase type issues
                
              if (asstErr) {
                console.warn('Supabase insert assistant message error:', asstErr.message);
              }
            } catch (error) {
              console.error('Error inserting assistant message:', error);
            }
          }

          return res.status(200).json({ message: assistantContent, usage: data.usage, chatId: currentChatId });
        }
      } catch (dbErr: any) {
        console.warn('Supabase persistence skipped/error:', dbErr?.message || dbErr);
      }

      // Sem Supabase, retorna a resposta normalmente
      return res.status(200).json({ message: assistantContent, usage: data.usage });
    } catch (error: any) {
      console.error('Erro no handler:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;
    
    console.error('❌ Error in chat handler:', {
      message: errorMessage,
      stack: stack,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage()
    });
    
    // More detailed error response in development
    const errorResponse: any = {
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    };
    
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.message = errorMessage;
      if (stack) {
        errorResponse.stack = stack.split('\n').map((line: string) => line.trim());
      }
    }
    
    return res.status(500).json(errorResponse);
  }
}
