import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Loader } from 'lucide-react';

// Google Icon SVG Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, register, googleLogin, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Nome é obrigatório para registro');
      return;
    }

    try {
      let success = false;
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await register(email, password, name);
      }

      if (success) {
        onClose();
        setEmail('');
        setPassword('');
        setName('');
      } else {
        setError(isLogin ? 'Credenciais inválidas' : 'Erro ao criar conta');
      }
    } catch (error) {
      setError('Erro interno. Tente novamente.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const success = await googleLogin();
      if (success) {
        onClose();
        setEmail('');
        setPassword('');
        setName('');
      } else {
        setError('Não foi possível autenticar com Google.');
      }
    } catch (error) {
      setError('Erro ao fazer login com Google');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-700 to-orange-400 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-orange-400 to-blue-700 rounded-3xl w-full max-w-md p-8 shadow-neomorphism">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-neomorphism-inset">
            <User className="w-10 h-10 text-gray-700" />
          </div>
          <h2 className="text-3xl font-bold text-gray-100 mb-3">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </h2>
          <p className="text-gray-100">
            {isLogin 
              ? 'Acesse sua conta para continuar' 
              : 'Crie sua conta para começar'
            }
          </p>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-4 bg-white text-gray-700 rounded-2xl shadow-neomorphism hover:shadow-neomorphism-small disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-3 border border-gray-300 mb-8"
        >
          <GoogleIcon />
          <span>Continuar com Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-100 text-gray-500 font-medium">ou continue com email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl shadow-neomorphism-inset focus:outline-none focus:shadow-neomorphism-small text-gray-700 placeholder-gray-500"
                placeholder="Seu nome completo"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl shadow-neomorphism-inset focus:outline-none focus:shadow-neomorphism-small text-gray-700 placeholder-gray-500"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 bg-gray-100 border-0 rounded-2xl shadow-neomorphism-inset focus:outline-none focus:shadow-neomorphism-small text-gray-700 placeholder-gray-500"
              placeholder="Sua senha"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-0 rounded-2xl shadow-neomorphism-inset">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl shadow-neomorphism-button hover:shadow-neomorphism-small disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Carregando...</span>
              </>
            ) : (
              <span>{isLogin ? 'Entrar' : 'Criar Conta'}</span>
            )}
          </button>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={toggleMode}
              className="text-gray-200 hover:text-gray-800 text-sm font-medium px-4 py-2 rounded-xl shadow-neomorphism-small hover:shadow-neomorphism-button transition-all"
            >
              {isLogin 
                ? 'Não tem conta? Criar uma nova' 
                : 'Já tem conta? Fazer login'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
