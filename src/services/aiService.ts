import { APIService, ChatMessage as APIChatMessage, ExpertContext } from './apiService';
import { ChatMessage, Expert } from '../types';

// Simple AI service using fetch instead of groq-sdk
export const initializeAI = (apiKey: string) => {
  // Store API key for use in requests
  localStorage.setItem('groq_api_key', apiKey);
};

export const getAIService = () => {
  const apiKey = localStorage.getItem('groq_api_key');
  
  return {
    // Legacy Groq SDK compatibility
    chat: {
      completions: {
        create: async (params: any) => {
          if (!apiKey) {
            throw new Error('AI service not initialized');
          }
          
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: params.model || 'llama3-8b-8192',
              messages: params.messages,
              temperature: params.temperature || 0.7,
              max_tokens: params.max_tokens || 1000
            })
          });
          
          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }
          
          return response.json();
        }
      }
    },
    
    // New sendMessage method for ChatModal compatibility
    sendMessage: async (
      messages: ChatMessage[], 
      expert: Expert, 
      extras?: { authUser?: { id?: string; email?: string; name?: string }; chatId?: string | null }
    ) => {
      // Convert ChatMessage[] to APIChatMessage[]
      const apiMessages: APIChatMessage[] = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Convert Expert to ExpertContext
      const expertContext: ExpertContext = {
        name: expert.name,
        specialty: expert.specialty,
        category: expert.category || 'Geral'
      };

      // Use APIService to send the message
      const response = await APIService.sendChatMessage(apiMessages, expertContext, extras);
      
      return {
        message: response.message,
        chatId: response.chatId,
        usage: response.usage
      };
    }
  };
};
