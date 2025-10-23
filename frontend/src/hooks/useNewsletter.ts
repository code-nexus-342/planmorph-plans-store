"use client";
import { useState } from 'react';
import { apiClient } from '../lib/api-client';

interface NewsletterResponse {
  message: string;
}

interface UseNewsletterReturn {
  subscribe: (email: string) => Promise<{ success: boolean; message: string }>;
  unsubscribe: (email: string) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
  error: string | null;
}

export function useNewsletter(): UseNewsletterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (email: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<NewsletterResponse>('/newsletter/subscribe', { email });
      
      return {
        success: true,
        message: response.data?.message || '🎉 Success! You\'re now part of our community. Check your inbox!'
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Unable to subscribe right now. Please check your connection and try again.';
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async (email: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<NewsletterResponse>('/newsletter/unsubscribe', { email });
      
      return {
        success: true,
        message: response.data?.message || 'You\'ve been unsubscribed. We hope to see you again soon!'
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Unable to unsubscribe right now. Please try again later.';
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscribe,
    unsubscribe,
    isLoading,
    error
  };
}
