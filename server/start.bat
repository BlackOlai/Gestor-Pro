@echo off
set GROQ_API_KEY=your_groq_api_key_here
set FRONTEND_URL=http://localhost:5173
set PORT=3001
set NODE_ENV=development

echo Iniciando servidor backend ConsultIA...
echo API Key configurada: %GROQ_API_KEY:~0,10%...
echo Frontend URL: %FRONTEND_URL%
echo Porta: %PORT%
echo.

node index.js
