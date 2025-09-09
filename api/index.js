// Health check endpoint
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req;
  
  if (url === '/api/health') {
    return res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      aiConfigured: !!process.env.GROQ_API_KEY
    });
  }
  
  if (url === '/api/status') {
    return res.status(200).json({
      service: 'ConsultIA API',
      version: '1.0.0',
      status: 'running',
      features: {
        groq: !!process.env.GROQ_API_KEY,
        supabase: !!process.env.SUPABASE_URL
      }
    });
  }
  
  if (url === '/api/chat' && req.method === 'POST') {
    return handleChat(req, res);
  }
  
  return res.status(404).json({ error: 'Not found' });
}

async function handleChat(req, res) {
  try {
    const { messages, expertContext } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({ 
        error: 'GROQ_API_KEY not configured' 
      });
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `Você é ${expertContext.name}, especialista em ${expertContext.specialty}. Responda de forma profissional e útil.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    
    return res.json({
      message: data.choices[0].message.content,
      usage: data.usage
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
