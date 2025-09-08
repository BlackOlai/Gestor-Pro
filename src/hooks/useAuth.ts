import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const stored = localStorage.getItem('auth-state');
      return stored ? JSON.parse(stored) : { user: null, isAuthenticated: false };
    } catch {
      return { user: null, isAuthenticated: false };
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Persist auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('auth-state', JSON.stringify(authState));
  }, [authState]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simple validation for demo - accept any email with password >= 6 chars
      if (email.includes('@') && password.length >= 6) {
        const user: User = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0],
          createdAt: new Date()
        };
        
        setAuthState({
          user,
          isAuthenticated: true
        });
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simple validation for demo
      if (email.includes('@') && password.length >= 6 && name.trim()) {
        const user: User = {
          id: Date.now().toString(),
          email,
          name: name.trim(),
          createdAt: new Date()
        };
        
        setAuthState({
          user,
          isAuthenticated: true
        });
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Register error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false
    });
    
    // Clear other user-specific data
    localStorage.removeItem('company-profile');
    localStorage.removeItem('chat-sessions');
    localStorage.removeItem('ai-config');
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };
};
