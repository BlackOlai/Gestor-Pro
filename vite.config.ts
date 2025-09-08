import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      'process.env': {
        VITE_API_URL: JSON.stringify(env.VITE_API_URL),
        VITE_GROQ_API_URL: JSON.stringify(env.VITE_GROQ_API_URL)
      }
    },
    server: {
      port: 5173,
      strictPort: true
    }
  };
});
