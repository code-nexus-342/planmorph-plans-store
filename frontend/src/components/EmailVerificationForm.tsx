"use client";
import { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface EmailVerificationFormProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
  isOAuth?: boolean; // New prop to indicate OAuth verification
}

export default function EmailVerificationForm({ email, onBack, onSuccess, isOAuth = false }: EmailVerificationFormProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { verifyEmail, resendVerification } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setMessage({ type: 'error', text: 'Please enter the verification code' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await verifyEmail(email, otp);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Email verified successfully! Redirecting...' });
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Verification failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage(null);

    try {
      const result = await resendVerification(email);
      
      if (result.success) {
        setResendMessage({ type: 'success', text: 'Verification code sent successfully!' });
      } else {
        setResendMessage({ type: 'error', text: result.error || 'Failed to resend code' });
      }
    } catch (error) {
      setResendMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {isOAuth ? (
            <div className="flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
          ) : (
            <Mail className="w-8 h-8 text-blue-600" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isOAuth ? 'Verify Your Google Account' : 'Verify Your Email'}
        </h1>
        <p className="text-gray-600">
          {isOAuth 
            ? 'For your security, we need to verify your Google account email'
            : 'We\'ve sent a verification code to'
          }
        </p>
        <p className="text-blue-600 font-medium">
          {email}
        </p>
        {isOAuth && (
          <p className="text-sm text-gray-500 mt-2">
            Check your email for a verification code from PlanMorph
          </p>
        )}
      </div>

      {message && (
        <div className={`flex items-center space-x-2 p-4 rounded-lg mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-600' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center text-lg font-mono tracking-widest text-gray-900 bg-white placeholder-gray-500"
            maxLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify Email</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-4">
          Didn't receive the code?
        </p>
        
        {resendMessage && (
          <div className={`flex items-center justify-center space-x-2 mb-4 ${
            resendMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {resendMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{resendMessage.text}</span>
          </div>
        )}
        
        <button
          onClick={handleResend}
          disabled={resendLoading}
          className="text-blue-600 hover:text-blue-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
        >
          {resendLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <span>Resend Code</span>
          )}
        </button>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center text-gray-600 hover:text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign Up
        </button>
      </div>
    </div>
  );
}
