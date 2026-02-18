// src/hooks/useAuth.ts
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api';
import type { User, LoginRequest, SignupRequest, ApiResponse } from '../types/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<boolean>;
  signup: (data: SignupRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore auth state on app start
  useEffect(() => {
    restoreAuth();
  }, []);

  const restoreAuth = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('authToken');
      const savedUser = await AsyncStorage.getItem('user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log('Auth restore error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAuth = async (token: string, user: User) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
    } catch (error) {
      console.log('Save auth error:', error);
    }
  };

  const clearAuth = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'user']);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.log('Clear auth error:', error);
    }
  };

  const login = async (data: LoginRequest): Promise<boolean> => {
    try {
      const response = await authAPI.login(data);
      if (response.data.success) {
        await saveAuth(response.data.token!, response.data.data);
        return true;
      }
      return false;
    } catch (error) {
      console.log('Login error:', error);
      return false;
    }
  };

  const signup = async (data: SignupRequest): Promise<boolean> => {
    try {
      const response = await authAPI.signup(data);
      if (response.data.success) {
        await saveAuth(response.data.token!, response.data.data);
        return true;
      }
      return false;
    } catch (error) {
      console.log('Signup error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await clearAuth();
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};