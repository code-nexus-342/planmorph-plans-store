"use client";
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import LoadingSpinner from '../../../components/LoadingSpinner';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithOAuth } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          router.push('/auth?error=oauth_failed');
          return;
        }

        if (token && refreshToken) {
          // Store tokens
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', refreshToken);
          
          // Set up API client with token
          const { apiClient } = await import('../../../lib/api-client');
          apiClient.setAuthToken(token);
          
          // Get user profile to update auth context
          const response = await apiClient.get<any>('/auth/profile');
          if (response.success && response.data) {
            // The user profile now includes Google OAuth data (name, email, avatar)
            // that was saved during the OAuth callback on the backend.
            // The AuthContext will be updated when the page redirects
            console.log('OAuth user profile loaded:', response.data);
            router.push('/dashboard');
          } else {
            console.error('Failed to fetch user profile after OAuth');
            router.push('/auth?error=oauth_failed');
          }
        } else {
          console.error('No tokens received from OAuth callback');
          router.push('/auth?error=oauth_failed');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.push('/auth?error=oauth_failed');
      }
    };

    handleOAuthCallback();
  }, [searchParams, router, loginWithOAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
