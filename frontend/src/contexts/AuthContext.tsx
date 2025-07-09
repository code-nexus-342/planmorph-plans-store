"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '../lib/api-client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loginWithOAuth: (provider: 'google' | 'apple', userData: OAuthUserData) => Promise<boolean>;
}

interface OAuthUserData {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  providerId: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
          
          // Verify token is still valid by fetching user profile
          const response = await apiClient.get<User>('/auth/profile');
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('auth_token');
            apiClient.setAuthToken(null);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
        apiClient.setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<{
        user: User;
        token: string;
      }>('/auth/login', { email, password });

      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Store token and set up API client
        localStorage.setItem('auth_token', token);
        apiClient.setAuthToken(token);
        setUser(userData);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await apiClient.post<{
        user: User;
        token: string;
      }>('/auth/register', {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
      });

      if (response.success && response.data) {
        const { user: newUser, token } = response.data;
        
        // Store token and set up API client
        localStorage.setItem('auth_token', token);
        apiClient.setAuthToken(token);
        setUser(newUser);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    apiClient.setAuthToken(null);
    setUser(null);
  };

  const loginWithOAuth = async (provider: 'google' | 'apple', userData: OAuthUserData): Promise<boolean> => {
    try {
      const response = await apiClient.post<{ user: User; tokens: { access_token: string } }>('/auth/oauth/callback', {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        avatar_url: userData.avatarUrl,
        provider,
        provider_id: userData.providerId,
      });

      if (response.success && response.data) {
        const { user: newUser, tokens } = response.data;
        
        // Store token and set up API client
        localStorage.setItem('auth_token', tokens.access_token);
        apiClient.setAuthToken(tokens.access_token);
        setUser(newUser);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('OAuth login failed:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loginWithOAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
