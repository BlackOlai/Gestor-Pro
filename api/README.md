# ConsultIA API

Backend API for the ConsultIA platform, providing AI-powered consulting services for micro and small businesses.

## Prerequisites

- Node.js 18+
- npm or yarn
- Groq API key
- Supabase project (optional, for data persistence)

## Setup

1. Copy the example environment file and update with your credentials:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the API

### Development

```bash
npm run dev
```

This will start the server with hot-reload using `ts-node-dev`.

### Production

1. Build the TypeScript files:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

- `PORT`: Port to run the server on (default: 3001)
- `FRONTEND_URL`: URL of the frontend application (for CORS)
- `GROQ_API_KEY`: Your Groq API key
- `GROQ_MODEL`: The Groq model to use (default: llama-3.1-8b-instant)
- `SUPABASE_URL`: Your Supabase project URL (optional)
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (optional)

## API Endpoints

### Health Check

```
GET /api/health
```

### Chat

```
POST /api/chat
```

**Request Body:**

```json
{
  "messages": [
    {"role": "user", "content": "Hello, how are you?"}
  ],
  "expertContext": {
    "name": "Marketing Expert",
    "specialty": "Digital Marketing"
  },
  "chatId": "optional-chat-id",
  "authUser": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## Development

- Use `npm run lint` to check for TypeScript and linting errors
- The API is built with Express and TypeScript
- The code follows a modular structure for better maintainability

## License

MIT
