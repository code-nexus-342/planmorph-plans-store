import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

const ProfessionalResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 text-center bg-background">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-white">Invalid Link</h2>
          <p className="text-text-secondary">This password reset link is invalid or missing.</p>
          <Link to="/professional/forgot-password">
            <Button className="bg-accent text-background">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/professionals/reset-password', { token, password });
      setIsSuccess(true);
      setTimeout(() => navigate('/professional/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center">
            <CheckCircle className="text-accent" size={32} />
          </div>
          <h2 className="text-3xl font-heading font-bold text-white">Password Reset!</h2>
          <p className="text-text-secondary text-lg">
            Your professional account password has been successfully updated. Redirecting to login...
          </p>
          <div className="pt-4">
            <Link to="/professional/login">
              <Button className="w-full bg-accent text-background hover:bg-accent/90">Login Now</Button>
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
          <h2 className="text-3xl font-heading font-bold text-white">Set New Password</h2>
          <p className="mt-2 text-text-secondary">
            Please enter your new password below.
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
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              icon={<Lock size={18} />}
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              icon={<Lock size={18} />}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-background hover:bg-accent/90 shadow-glow"
            isLoading={isLoading}
          >
            Reset Password <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalResetPassword;
