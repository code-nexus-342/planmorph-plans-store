"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '../lib/api-client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean; email?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loginWithOAuth: (provider: 'google' | 'apple', userData: OAuthUserData) => Promise<OAuthResult>;
  completeOAuthProfile: (email: string, firstName: string, lastName: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
}

interface OAuthResult {
  success: boolean;
  error?: string;
  requiresEmailVerification?: boolean;
  requiresProfileCompletion?: boolean;
  isNewUser?: boolean;
  userEmail?: string;
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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.post<{
        user: User;
        tokens: { accessToken: string };
      }>('/auth/login', { email, password });

      if (response.success && response.data) {
        const { user: userData, tokens } = response.data;
        
        // Store token and set up API client
        localStorage.setItem('auth_token', tokens.accessToken);
        apiClient.setAuthToken(tokens.accessToken);
        setUser(userData);
        
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error?.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string; requiresVerification?: boolean; email?: string }> => {
    try {
      const response = await apiClient.post<{
        user: User;
        requiresVerification?: boolean;
        message: string;
      }>('/auth/register', {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
      });

      if (response.success && response.data) {
        // Check if verification is required
        if (response.data.requiresVerification) {
          return { 
            success: true, 
            requiresVerification: true,
            email: userData.email
          };
        } else {
          // If no verification required, user is already logged in
          const { user } = response.data;
          setUser(user);
          return { success: true };
        }
      }
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMessage = error?.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    apiClient.setAuthToken(null);
    setUser(null);
  };

  const loginWithOAuth = async (provider: 'google' | 'apple', userData: OAuthUserData): Promise<OAuthResult> => {
    try {
      const response = await apiClient.post<{ 
        user: User; 
        tokens?: { access_token: string };
        requiresEmailVerification?: boolean;
        requiresProfileCompletion?: boolean;
        isNewUser?: boolean;
        message: string;
      }>('/auth/oauth/callback', {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        avatar_url: userData.avatarUrl,
        provider,
        provider_id: userData.providerId,
      });

      if (response.success && response.data) {
        const { user: newUser, tokens, requiresEmailVerification, requiresProfileCompletion, isNewUser } = response.data;
        
        // If requires email verification or profile completion, return without setting user
        if (requiresEmailVerification || requiresProfileCompletion) {
          return {
            success: true,
            requiresEmailVerification,
            requiresProfileCompletion,
            isNewUser,
            userEmail: userData.email
          };
        }
        
        // Store token and set up API client for completed OAuth
        if (tokens) {
          localStorage.setItem('auth_token', tokens.access_token);
          apiClient.setAuthToken(tokens.access_token);
          setUser(newUser);
        }
        
        return { success: true, isNewUser: false };
      }
      return { success: false, error: 'OAuth authentication failed' };
    } catch (error: any) {
      console.error('OAuth login failed:', error);
      const errorMessage = error?.response?.data?.message || 'OAuth authentication failed';
      return { success: false, error: errorMessage };
    }
  };

  const completeOAuthProfile = async (email: string, firstName: string, lastName: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.post<{
        user: User;
        tokens: { accessToken: string };
      }>('/auth/oauth/complete-profile', { 
        email, 
        first_name: firstName, 
        last_name: lastName, 
        otp 
      });

      if (response.success && response.data) {
        const { user: userData, tokens } = response.data;
        
        // Store token and set up API client
        localStorage.setItem('auth_token', tokens.accessToken);
        apiClient.setAuthToken(tokens.accessToken);
        setUser(userData);
        
        return { success: true };
      }
      return { success: false, error: 'Profile completion failed' };
    } catch (error: any) {
      console.error('OAuth profile completion failed:', error);
      const errorMessage = error?.response?.data?.message || 'Profile completion failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const verifyEmail = async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.post<{
        user: User;
        tokens: { accessToken: string };
      }>('/auth/verify-email', { email, otp });

      if (response.success && response.data) {
        const { user: userData, tokens } = response.data;
        
        // Store token and set up API client
        localStorage.setItem('auth_token', tokens.accessToken);
        apiClient.setAuthToken(tokens.accessToken);
        setUser(userData);
        
        return { success: true };
      }
      return { success: false, error: 'Verification failed' };
    } catch (error: any) {
      console.error('Email verification failed:', error);
      const errorMessage = error?.response?.data?.message || 'Verification failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const resendVerification = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.post('/auth/resend-verification', { email });

      if (response.success) {
        return { success: true };
      }
      return { success: false, error: 'Failed to resend verification code' };
    } catch (error: any) {
      console.error('Resend verification failed:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to resend verification code';
      return { success: false, error: errorMessage };
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
    completeOAuthProfile,
    verifyEmail,
    resendVerification,
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
