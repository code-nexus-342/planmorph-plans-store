// ========== src/components/OAuthButtons.tsx ==========
"use client";
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Notification from './Notification';

interface OAuthButtonsProps {
  onSuccess?: (userData?: { email: string; firstName: string; lastName: string }) => void;
  onError?: (error: string) => void;
  onRequiresCompletion?: (data: { 
    email: string; 
    firstName: string; 
    lastName: string; 
    requiresEmailVerification: boolean; 
    requiresProfileCompletion: boolean; 
    isNewUser?: boolean;
  }) => void;
}

export default function OAuthButtons({ onSuccess, onError, onRequiresCompletion }: OAuthButtonsProps) {
  const [isLoading, setIsLoading] = useState<'google' | 'apple' | null>(null);
  const [showAppleNotification, setShowAppleNotification] = useState(false);
  const { loginWithOAuth } = useAuth();

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(provider);
    
    if (provider === 'apple') {
      // Apple OAuth not yet implemented - show notification and redirect to Google
      setIsLoading(null);
      setShowAppleNotification(true);
      
      setTimeout(() => {
        handleOAuthLogin('google');
      }, 2000);
      return;
    }

    try {
      if (provider === 'google') {
        // Redirect to backend Google OAuth endpoint
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        window.location.href = `${backendUrl}/api/v1/auth/google`;
        return; // Don't continue execution as we're redirecting
      }

      // For other providers (currently just fallback)
      onError?.('OAuth provider not yet implemented');
    } catch (error) {
      onError?.('An error occurred during OAuth authentication');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      {showAppleNotification && (
        <Notification
          message="Apple authentication is not yet implemented. Redirecting to Google authentication instead."
          type="warning"
          duration={4000}
          onClose={() => setShowAppleNotification(false)}
        />
      )}
      
      <div className="space-y-3">
      {/* Google OAuth Button */}
      <button
        onClick={() => handleOAuthLogin('google')}
        disabled={isLoading !== null}
        className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading === 'google' ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span className="font-medium text-gray-700">
          {isLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
        </span>
      </button>

      {/* Apple OAuth Button */}
      <button
        onClick={() => handleOAuthLogin('apple')}
        disabled={isLoading !== null}
        className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
        title="Apple authentication not yet implemented - will redirect to Google"
      >
        {isLoading === 'apple' ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
            />
          </svg>
        )}
        <span className="font-medium">
          {isLoading === 'apple' ? 'Redirecting...' : 'Continue with Apple'}
        </span>
        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
          Soon
        </span>
      </button>
      </div>
    </>
  );
}
