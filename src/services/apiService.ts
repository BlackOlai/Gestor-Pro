import { useState, useEffect } from 'react';

// Configuração da URL base da API - FORÇAR /api para produção
const API_BASE_URL = '/api';

console.log('API_BASE_URL definido como:', API_BASE_URL);
console.log('import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ExpertContext {
  name: string;
  specialty: string;
  category: string;
}

export interface ChatResponse {
  message: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  chatId?: string;
}

export class APIService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`[API] Fazendo requisição para: ${url}`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Importante para CORS com credenciais
        ...options,
      });
      
      console.log(`[API] Resposta recebida de ${url}:`, response.status, response.statusText);

      if (!response.ok) {
      console.error(`[API] Erro na requisição para ${url}:`, response.status, response.statusText);
      
      // Tenta obter JSON, se falhar usa texto simples
      let errorData: any = {};
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
          console.error('[API] Detalhes do erro (JSON):', errorData);
        } else {
          const text = await response.text();
          console.error('[API] Detalhes do erro (texto):', text);
          errorData = { error: text };
        }
      } catch (error) {
        console.error('[API] Erro ao processar resposta de erro:', error);
        errorData = { error: 'Erro ao processar resposta do servidor' };
      }

      // Constrói mensagem detalhada sem expor segredos
      const parts: string[] = [];
      if (errorData.error) parts.push(String(errorData.error));
      if (errorData.providerStatus) parts.push(`Status do provedor: ${errorData.providerStatus}`);
      if (errorData.providerError) {
        const providerMsg = typeof errorData.providerError === 'string'
          ? errorData.providerError
          : (errorData.providerError.message || JSON.stringify(errorData.providerError));
        parts.push(`Detalhes: ${providerMsg}`);
      }
      if (parts.length === 0) parts.push(`HTTP ${response.status}: ${response.statusText}`);

        throw new Error(parts.join(' | '));
      }

      return response.json();
    } catch (error: unknown) {
      console.error(`[API] Erro na requisição para ${url}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(`Falha na comunicação com o servidor: ${errorMessage}`);
    }
  }

  static async sendChatMessage(
    messages: ChatMessage[],
    expertContext: ExpertContext,
    extras?: { authUser?: { id?: string; email?: string; name?: string }; chatId?: string | null }
  ): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages,
        expertContext,
        authUser: extras?.authUser,
        chatId: extras?.chatId ?? null
      })
    });
  }

  static async checkHealth(): Promise<{ status: string; aiConfigured: boolean }> {
    return this.request<{ status: string; aiConfigured: boolean }>('/health');
  }

  static async getStatus(): Promise<{
    service: string;
    version: string;
    status: string;
    features: Record<string, boolean>;
  }> {
    return this.request('/status');
  }
}

// Hook para verificar se o serviço está disponível
export const useServiceStatus = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const health = await APIService.checkHealth();
        setIsAvailable(health.status === 'ok' && health.aiConfigured);
        setError(null);
      } catch (err) {
        setIsAvailable(false);
        setError(err instanceof Error ? err.message : 'Serviço indisponível');
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
    
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isAvailable, isLoading, error };
};
