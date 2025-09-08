import { useState, useEffect } from 'react';
import { APIService } from '../services/apiService';
import { getAIService } from '../services/aiService';

export const useAIConfig = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Check localStorage for API key first (fallback)
    const storedKey = localStorage.getItem('groq_api_key');
    if (storedKey) {
      setIsConfigured(true);
      return;
    }
    
    // Check if backend service is available on component mount
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    setIsValidating(true);
    try {
      const health = await APIService.checkHealth();
      setIsConfigured(health.status === 'ok' && health.aiConfigured);
    } catch (error) {
      console.error('Failed to check backend health:', error);
      // Fallback: check if we have API key in localStorage
      const storedKey = localStorage.getItem('groq_api_key');
      setIsConfigured(!!storedKey);
    } finally {
      setIsValidating(false);
    }
  };

  // Updated method to save API key in localStorage as fallback
  const validateAndSaveApiKey = async (apiKey: string): Promise<boolean> => {
    try {
      // Try backend first
      const health = await APIService.checkHealth();
      if (health.status === 'ok' && health.aiConfigured) {
        setIsConfigured(true);
        return true;
      }
    } catch (error) {
      console.log('Backend not available, using localStorage fallback');
    }
    
    // Fallback: save to localStorage
    if (apiKey && apiKey.trim()) {
      localStorage.setItem('groq_api_key', apiKey.trim());
      setIsConfigured(true);
      return true;
    }
    
    return false;
  };

  const clearConfig = () => {
    localStorage.removeItem('groq_api_key');
    setIsConfigured(false);
  };

  const getService = () => {
    if (!isConfigured) {
      throw new Error('AI service not configured');
    }
    return getAIService();
  };

  return {
    config: { apiKey: '', isConfigured }, // Legacy compatibility
    isValidating,
    validateAndSaveApiKey,
    clearConfig,
    getService,
    isConfigured,
    checkBackendHealth
  };
};
