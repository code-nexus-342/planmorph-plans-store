import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

const ProfessionalForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/professionals/forgot-password', { email });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center">
            <CheckCircle className="text-accent" size={32} />
          </div>
          <h2 className="text-3xl font-heading font-bold text-white">Check your email</h2>
          <p className="text-text-secondary text-lg">
            We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
          </p>
          <div className="pt-4">
            <Link to="/professional/login">
              <Button variant="outline" className="w-full border-accent/20 text-accent hover:bg-accent/10">Back to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-bold text-white">Professional Reset</h2>
          <p className="mt-2 text-text-secondary">
            Enter your professional email address to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="pro@example.com"
              icon={<Mail size={18} />}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-background hover:bg-accent/90 shadow-glow"
            isLoading={isLoading}
          >
            Send Reset Link <ArrowRight size={18} className="ml-2" />
          </Button>

          <div className="text-center">
            <Link to="/professional/login" className="text-sm text-text-secondary hover:text-accent transition-colors">
              Back to Professional Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalForgotPassword;
