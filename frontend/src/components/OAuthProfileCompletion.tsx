"use client";
import { useState } from 'react';
import { User, Mail, ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface OAuthProfileCompletionProps {
  email: string;
  initialFirstName: string;
  initialLastName: string;
  onBack: () => void;
  onSuccess: () => void;
  requiresEmailVerification: boolean;
}

export default function OAuthProfileCompletion({ 
  email, 
  initialFirstName, 
  initialLastName, 
  onBack, 
  onSuccess,
  requiresEmailVerification 
}: OAuthProfileCompletionProps) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { completeOAuthProfile, resendVerification } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      setMessage({ type: 'error', text: 'Please enter your first and last name' });
      return;
    }
    
    if (requiresEmailVerification && !otp.trim()) {
      setMessage({ type: 'error', text: 'Please enter the verification code' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // For OAuth users who don't need email verification, pass empty OTP
      const otpToUse = requiresEmailVerification ? otp : '';
      const result = await completeOAuthProfile(email, firstName, lastName, otpToUse);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile completed successfully! Redirecting...' });
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Profile completion failed' });
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
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Complete Your Profile
        </h1>
        <p className="text-gray-600 mb-2">
          Please confirm your details and verify your email
        </p>
        <p className="text-blue-600 font-medium">
          {email}
        </p>
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
        <div className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 bg-white placeholder-gray-500"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 bg-white placeholder-gray-500"
              placeholder="Enter your last name"
              required
            />
          </div>

          {requiresEmailVerification && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-2xl tracking-wider text-gray-900 bg-white placeholder-gray-500"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                Enter the 6-digit code sent to your email
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Complete Profile</span>
            </>
          )}
        </button>
      </form>

      {requiresEmailVerification && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-3">
            Didn't receive the code?
          </p>
          
          {resendMessage && (
            <div className={`flex items-center justify-center space-x-2 p-3 rounded-lg mb-3 ${
              resendMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-600' 
                : 'bg-red-50 border border-red-200 text-red-600'
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
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
          >
            {resendLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Resend Code</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center justify-center space-x-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>
      </div>
    </div>
  );
}
