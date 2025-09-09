// Firebase initialization and exports
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Debug: Log das variáveis de ambiente
console.log('Environment Variables:', {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Presente' : '❌ Ausente',
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Presente' : '❌ Ausente',
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Presente' : '❌ Ausente',
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Presente' : '❌ Ausente'
});

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string)?.trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string)?.trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string)?.trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string)?.trim(),
};

// Debug: Log da configuração
console.log('Firebase Config:', JSON.stringify(firebaseConfig, null, 2));

const missing: string[] = [];
if (!firebaseConfig.apiKey) missing.push('VITE_FIREBASE_API_KEY');
if (!firebaseConfig.authDomain) missing.push('VITE_FIREBASE_AUTH_DOMAIN');
if (!firebaseConfig.projectId) missing.push('VITE_FIREBASE_PROJECT_ID');
if (!firebaseConfig.appId) missing.push('VITE_FIREBASE_APP_ID');
if (missing.length) {
  const errorMsg = `Firebase config ausente: ${missing.join(', ')}. Aplicação funcionará sem autenticação.`;
  console.warn(errorMsg);
  // Don't throw error - allow app to continue without Firebase
}

// Initialize app only once
let auth;
let googleProvider;

// Only initialize Firebase if all config is available
if (missing.length === 0) {
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    console.log('Firebase inicializado com sucesso!');
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error('Erro ao inicializar o Firebase:', error);
    // Don't throw - allow app to continue
  }
} else {
  console.log('Firebase não inicializado - variáveis de ambiente ausentes');
}

export { auth, googleProvider };