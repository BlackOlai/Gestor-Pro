import { Request, Response } from 'express';
import { getSupabase, type Tables } from './src/_supabase.js';

// Definir tipos para as tabelas do Supabase
type UserApp = Tables['users_app']['Insert'] & {
  created_at?: string;
  updated_at?: string;
};

type Chat = Tables['chats']['Insert'] & {
  created_at?: string;
  updated_at?: string;
};

type DBChatMessage = Tables['chat_messages']['Insert'] & {
  created_at?: string;
};

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

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ExpertContext {
  name: string;
  specialty: string;
  category?: string;
}

// Chat handler function
export default async function chatHandler(req: Request, res: Response) {
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

  // Log básico (não inclua segredos)
  console.log('🔥 /api/chat called');

  try {
    const { messages, expertContext, chatId, authUser } = req.body || {};

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
            const userData: UserApp = {
              id: authUser.id,
              email: authUser.email,
              name: authUser.name,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            const { data: upUser, error: upErr } = await (supabase as any)
              .from('users_app')
              .upsert([userData], {
                onConflict: 'email',
                ignoreDuplicates: true
              })
              .select()
              .single() as { data: { id: string } | null, error: any };

            if (upErr) console.warn('Supabase upsert user error:', upErr.message);
            userId = upUser?.id || authUser?.id || null;
          }

          // Criar chat se necessário
          if (!currentChatId) {
            const chatData: Chat = {
              user_id: userId || null,
              expert_context: expertContext ? JSON.stringify(expertContext) : null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            const { data: newChat, error: chatErr } = await (supabase as any)
              .from('chats')
              .insert(chatData)
              .select()
              .single() as { data: { id: string } | null, error: any };

            if (chatErr) console.warn('Supabase create chat error:', chatErr.message);
            currentChatId = newChat?.id || null;
          }

          // Inserir última mensagem do usuário (se existir)
          if (Array.isArray(messages) && messages.length) {
            const lastUserMsg = messages[messages.length - 1];
            if (lastUserMsg?.role === 'user') {
              const messageData: DBChatMessage = {
                chat_id: currentChatId!,
                role: 'user',
                content: lastUserMsg.content,
                created_at: new Date().toISOString()
              };

              const { error: msgErr } = await (supabase as any)
                .from('chat_messages')
                .insert(messageData);

              if (msgErr) console.warn('Supabase insert user message error:', msgErr.message);
            }
          }

          // Inserir resposta do assistente
          if (assistantContent) {
            const messageData: DBChatMessage = {
              chat_id: currentChatId!,
              role: 'assistant',
              content: assistantContent,
              created_at: new Date().toISOString()
            };

            const { error: asstErr } = await (supabase as any)
              .from('chat_messages')
              .insert(messageData);

            if (asstErr) console.warn('Supabase insert assistant message error:', asstErr.message);
          }

          return res.status(200).json({ message: assistantContent, usage: data.usage, chatId: currentChatId });
        }
      } catch (dbErr: any) {
        console.warn('Supabase persistence skipped/error:', dbErr?.message || dbErr);
      }

      // Sem Supabase, retorna a resposta normalmente
      return res.status(200).json({ message: assistantContent, usage: data.usage });

    } catch (error) {
      console.error('Erro no handler:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
      clearTimeout(timeout);
    }

  } catch (error) {
    console.error('Erro no handler externo:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
