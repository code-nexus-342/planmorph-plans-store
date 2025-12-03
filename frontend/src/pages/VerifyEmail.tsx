import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, CheckCircle } from 'lucide-react';

import { verifyEmail, resendVerification } from '../services/auth.service';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResendMessage('');
    setIsLoading(true);

    try {
      await verifyEmail({ email, code });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendMessage('');
    setIsResending(true);

    try {
      await resendVerification(email);
      setResendMessage('Verification code resent successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-heading font-bold text-architect-900 mb-2">Email Verified!</h2>
        <p className="text-gray-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-accent-teal/10 flex items-center justify-center text-accent-teal">
            <Mail size={24} />
          </div>
        </div>
        <h2 className="text-3xl font-heading font-bold text-architect-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-500">
          We sent a verification code to <span className="text-architect-900 font-bold">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 p-4 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      {resendMessage && (
        <div className="mb-6 bg-green-50 border border-green-100 p-4 text-sm text-green-600 text-center">
          {resendMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ENTER CODE"
          required
          className="text-center text-2xl tracking-widest uppercase"
          maxLength={8}
        />
        
        <Button 
          type="submit" 
          className="w-full h-12 text-lg shadow-soft" 
          isLoading={isLoading}
        >
          Verify Email
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Code expires in 20 minutes.
        </p>
        <button 
          onClick={handleResend}
          disabled={isResending}
          className="text-accent-teal hover:text-architect-900 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? 'Resending...' : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
