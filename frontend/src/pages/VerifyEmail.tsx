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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow">
            <Mail size={24} />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Verify Your Email</h2>
        <p className="text-sm text-text-secondary">
          We sent a verification code to <span className="text-white font-bold">{email}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center rounded-lg">
          {error}
        </div>
      )}

      {resendMessage && (
        <div className="bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-400 text-center rounded-lg">
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
          className="text-center text-2xl tracking-widest uppercase bg-white/5 border-white/10 text-white placeholder-text-secondary/50 focus:border-primary focus:ring-primary rounded-lg"
          maxLength={8}
        />
        
        <Button 
          type="submit" 
          className="w-full h-10 text-base shadow-glow bg-primary text-background hover:bg-primary/90 font-bold uppercase tracking-wide rounded-lg border-none" 
          isLoading={isLoading}
        >
          Verify Email
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-text-secondary mb-2">
          Code expires in 20 minutes.
        </p>
        <button 
          onClick={handleResend}
          disabled={isResending}
          className="text-primary hover:text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? 'Resending...' : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
