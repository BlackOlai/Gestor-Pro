import React, { useState } from 'react';
import { Bot, AlertCircle, Loader, CheckCircle } from 'lucide-react';

interface APIKeySetupProps {
  onApiKeyValidated: (apiKey: string) => void;
  isValidating: boolean;
}

export default function APIKeySetup({ onApiKeyValidated, isValidating }: APIKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!apiKey.trim()) {
      setError('Por favor, insira sua API key');
      return;
    }

    if (!apiKey.startsWith('gsk_')) {
      setError('API key deve começar com "gsk_"');
      return;
    }

    try {
      await onApiKeyValidated(apiKey);
    } catch (error) {
      setError('API key inválida. Verifique se está correta e tem permissões adequadas.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <Bot className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Configurar IA
          </h2>
          <p className="text-gray-600">
            Configure sua API key do Groq para ativar os especialistas virtuais (gratuito para testes)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Groq API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isValidating}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isValidating}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!apiKey.trim() || isValidating}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isValidating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Validando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Configurar IA</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Como obter sua API key do Groq (gratuita):</h4>
          <ol className="text-xs text-blue-700 space-y-1">
            <li>1. Acesse <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">console.groq.com/keys</a></li>
            <li>2. Faça login ou crie uma conta gratuita</li>
            <li>3. Clique em "Create API Key"</li>
            <li>4. Copie a chave gerada (começa com "gsk_")</li>
            <li>5. Cole aqui para configurar a IA</li>
          </ol>
          <p className="mt-2 text-xs text-blue-600">✨ O Groq oferece acesso gratuito para testes!</p>
        </div>
      </div>
    </div>
  );
}
