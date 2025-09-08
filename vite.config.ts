import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('Vite Build Mode:', mode);
  console.log('Environment Variables:', {
    VITE_API_URL: env.VITE_API_URL,
    VITE_GROQ_API_URL: env.VITE_GROQ_API_URL
  });
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    envPrefix: 'VITE_',
    server: {
      port: 5173,
      strictPort: true
    }
  };
});
