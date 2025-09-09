import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider } from '../services/firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';

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

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  googleLogin: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false });
  
  const [isLoading, setIsLoading] = useState(false);

  // Sincroniza estado com Firebase Auth
  useEffect(() => {
    // Only set up auth listener if Firebase is initialized
    if (!auth) {
      console.log('Firebase auth not initialized - skipping auth state listener');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const mapped: User = mapFirebaseUser(fbUser);
        setAuthState({ user: mapped, isAuthenticated: true });
      } else {
        setAuthState({ user: null, isAuthenticated: false });
      }
    });
    return () => unsubscribe();
  }, []);

  const mapFirebaseUser = (fbUser: FirebaseUser): User => ({
    id: fbUser.uid,
    email: fbUser.email || '',
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuário',
    createdAt: new Date(fbUser.metadata.creationTime || Date.now())
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!auth) {
      console.warn('Firebase not initialized - login unavailable');
      return false;
    }
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const mapped = mapFirebaseUser(cred.user);
      setAuthState({ user: mapped, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    if (!auth) {
      console.warn('Firebase not initialized - register unavailable');
      return false;
    }
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name?.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
      const mapped = mapFirebaseUser(cred.user);
      setAuthState({ user: mapped, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('company-profile');
    localStorage.removeItem('chat-sessions');
    localStorage.removeItem('ai-config');
  };

  const googleLogin = async (): Promise<boolean> => {
    if (!auth || !googleProvider) {
      console.warn('Firebase not initialized - Google login unavailable');
      return false;
    }
    setIsLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const mapped = mapFirebaseUser(cred.user);
      setAuthState({ user: mapped, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    googleLogin,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
