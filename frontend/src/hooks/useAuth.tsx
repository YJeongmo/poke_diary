// frontend/src/hooks/useAuth.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';
import type { User } from '../types';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'pokemon_auth_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (accessToken: string) => {
    try {
      console.log('Fetching user with token:', accessToken ? 'Token exists' : 'No token');
      const response = await api.get('/auth/me', accessToken);
      console.log('User data received:', response.data);
      setUser(response.data as User);
    } catch (error: any) {
      console.error("Failed to fetch user data, logging out.", error);
      console.error("Error response:", error.response?.data);
      console.error("Request URL:", error.config?.url);
      internalLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const internalLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const login = (accessToken: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    setToken(accessToken);
    fetchUser(accessToken);
  };

  const logout = () => {
    internalLogout();
  };

  const contextValue = {
    token,
    user,
    isLoggedIn: !!token && !!user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

