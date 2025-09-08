@echo off
REM Set environment variables
set PORT=3001
set FRONTEND_URL=http://localhost:5173
set GROQ_API_KEY=your_groq_api_key_here
set GROQ_MODEL=llama-3.1-8b-instant

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)

echo Starting ConsultIA API Server...
call npm run dev
