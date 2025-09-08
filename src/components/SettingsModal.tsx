import { useState } from 'react';
import { useAIConfig } from '../hooks/useAIConfig';
import { X, Key, Trash2, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { config, clearConfig, validateAndSaveApiKey, isValidating } = useAIConfig();
  const [newApiKey, setNewApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveNewKey = async () => {
    if (!newApiKey.trim()) return;
    
    const isValid = await validateAndSaveApiKey(newApiKey);
    if (isValid) {
      setNewApiKey('');
      setIsEditing(false);
    }
  };

  const handleClearConfig = () => {
    if (confirm('Tem certeza que deseja remover a configuração da IA? Você precisará configurar novamente.')) {
      clearConfig();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Configurações da IA</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Current Status */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Status Atual</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${config.isConfigured ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {config.isConfigured ? 'IA Configurada e Ativa' : 'IA Não Configurada'}
              </span>
            </div>
            {config.isConfigured && (
              <p className="text-xs text-gray-500 mt-1">
                API Key: {config.apiKey.substring(0, 7)}...{config.apiKey.substring(config.apiKey.length - 4)}
              </p>
            )}
          </div>

          {/* API Key Management */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Gerenciar API Key</h3>
            
            {!isEditing ? (
              <div className="space-y-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Key className="w-4 h-4" />
                  <span>{config.isConfigured ? 'Alterar API Key' : 'Configurar API Key'}</span>
                </button>
                
                {config.isConfigured && (
                  <button
                    onClick={handleClearConfig}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remover Configuração</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={isValidating}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKey ? '🙈' : '👁️'}
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveNewKey}
                    disabled={!newApiKey.trim() || isValidating}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isValidating ? 'Validando...' : 'Salvar'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setNewApiKey('');
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Como obter sua API key:</h4>
            <ol className="text-xs text-blue-700 space-y-1">
              <li>1. Acesse platform.openai.com</li>
              <li>2. Faça login ou crie uma conta</li>
              <li>3. Vá em "API Keys" no menu</li>
              <li>4. Clique em "Create new secret key"</li>
              <li>5. Copie e cole aqui</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
