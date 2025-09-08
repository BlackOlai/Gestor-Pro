#!/bin/bash

# Set environment variables
export PORT=3001
export FRONTEND_URL=http://localhost:5173
export GROQ_API_KEY=your_groq_api_key_here
export GROQ_MODEL=llama-3.1-8b-instant

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting ConsultIA API Server..."
npm run dev
