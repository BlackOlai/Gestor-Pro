const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { supabase } = require('./supabase');

dotenv.config();

const app = express();

// Middleware de log para todas as requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Nova requisição: ${req.method} ${req.originalUrl}`);
  next();
});
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting para proteger a API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas solicitações, tente novamente em 15 minutos'
});
app.use('/api/', limiter);

// Middleware para validar se a API key está configurada
const validateApiKey = (req, res, next) => {
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ 
      error: 'Serviço temporariamente indisponível. Contate o suporte.' 
    });
  }
  next();
};

// Endpoint para chat com IA
app.post('/api/chat', validateApiKey, async (req, res) => {
  console.log('🔥 CHAT ENDPOINT CALLED');
  console.log('🔥 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('🔥 Body type:', typeof req.body);
  console.log('🔥 Body content:', JSON.stringify(req.body, null, 2));
  
  try {
    const { messages, expertContext, chatId, authUser } = req.body;

    console.log('🔍 Messages:', messages);
    console.log('🔍 ExpertContext:', expertContext);

    if (!messages || !Array.isArray(messages)) {
      console.log('❌ Invalid messages format - messages:', messages);
      return res.status(400).json({ error: 'Mensagens inválidas' });
    }

    if (!expertContext || !expertContext.name || !expertContext.specialty) {
      console.log('❌ Invalid expertContext format - expertContext:', expertContext);
      return res.status(400).json({ error: 'Contexto do especialista inválido' });
    }

    const groqPayload = {
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `Você é ${expertContext.name}, ${expertContext.specialty}. 
                   Responda como um consultor especializado, de forma prática e objetiva.
                   Foque em soluções aplicáveis para micro e pequenas empresas brasileiras.`
        },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.7
    };

    console.log('🚀 Sending to Groq API:', JSON.stringify(groqPayload, null, 2));

    // Fazer chamada para Groq API com timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    let response;
    try {
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groqPayload),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }

    console.log('📡 Groq API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Groq API error response:', errorText);
      // Tentar parsear JSON de erro sem quebrar
      let providerError;
      try { providerError = JSON.parse(errorText); } catch { providerError = errorText; }

      return res.status(502).json({
        error: 'Falha ao consultar o provedor de IA',
        providerStatus: response.status,
        providerError
      });
    }

    const data = await response.json();
    console.log('✅ Groq API success:', JSON.stringify(data, null, 2));

    // ================= Persistência no Supabase (opcional, se configurado) =================
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        let currentChatId = chatId || null;

        // Upsert do usuário, se informado
        let userId = null;
        if (authUser?.id || authUser?.email) {
          const { data: upUser, error: upErr } = await supabase
            .from('users_app')
            .upsert({
              id: authUser.id || null,
              email: authUser.email || null,
              name: authUser.name || null
            }, { onConflict: 'id' })
            .select()
            .single();
          if (upErr) console.warn('Supabase upsert user error:', upErr.message);
          userId = upUser?.id || authUser?.id || null;
        }

        // Criar chat se não vier chatId
        if (!currentChatId) {
          const { data: newChat, error: chatErr } = await supabase
            .from('chats')
            .insert({ user_id: userId, expert_context: expertContext ? JSON.stringify(expertContext) : null })
            .select()
            .single();
          if (chatErr) console.warn('Supabase create chat error:', chatErr.message);
          currentChatId = newChat?.id || null;
        }

        // Inserir mensagem do usuário
        if (messages?.length) {
          const lastUserMsg = messages[messages.length - 1];
          if (lastUserMsg?.role === 'user') {
            const { error: msgErr } = await supabase
              .from('chat_messages')
              .insert({ chat_id: currentChatId, role: 'user', content: lastUserMsg.content });
            if (msgErr) console.warn('Supabase insert user message error:', msgErr.message);
          }
        }

        // Inserir resposta do assistente
        const assistantContent = data.choices?.[0]?.message?.content || '';
        if (assistantContent) {
          const { error: asstErr } = await supabase
            .from('chat_messages')
            .insert({ chat_id: currentChatId, role: 'assistant', content: assistantContent });
          if (asstErr) console.warn('Supabase insert assistant message error:', asstErr.message);
        }

        // Retornar chatId para o frontend manter a sessão
        res.json({
          message: assistantContent,
          usage: data.usage,
          chatId: currentChatId
        });
        return;
      }
    } catch (dbErr) {
      console.warn('Supabase persistence skipped/error:', dbErr?.message || dbErr);
    }

    // Caso Supabase não esteja configurado, retorna a resposta normal
    res.json({ message: data.choices[0].message.content, usage: data.usage });

  } catch (error) {
    console.error('💥 Chat API Error:', error.message);
    console.error('💥 Full error:', error);
    console.error('💥 Error stack:', error.stack);

    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Tempo de resposta do provedor excedido' });
    }

    // Verificar se a resposta já foi enviada
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro interno do servidor. Tente novamente em alguns instantes.' 
      });
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    aiConfigured: !!process.env.GROQ_API_KEY
  });
});

// Endpoint para verificar status do serviço
app.get('/api/status', (req, res) => {
  res.json({
    service: 'ConsultIA API',
    version: '1.0.0',
    status: 'online',
    features: {
      chat: !!process.env.GROQ_API_KEY,
      rateLimit: true,
      cors: true
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ConsultIA rodando na porta ${PORT}`);
  console.log(`🤖 IA configurada: ${process.env.GROQ_API_KEY ? '✅' : '❌'}`);
  console.log(`🌐 Frontend permitido: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
});
