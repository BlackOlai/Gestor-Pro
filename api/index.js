const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://gestor-pro-rovians-projects.vercel.app',
  'https://gestor-pro-seven.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    aiConfigured: !!process.env.GROQ_API_KEY
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
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
    
    res.json({
      message: data.choices[0].message.content,
      usage: data.usage
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    service: 'ConsultIA API',
    version: '1.0.0',
    status: 'running',
    features: {
      groq: !!process.env.GROQ_API_KEY,
      supabase: !!process.env.SUPABASE_URL
    }
  });
});

// Export as Vercel serverless function
module.exports = app;
