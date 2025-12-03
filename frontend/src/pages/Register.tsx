import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { register as registerApi } from '../services/auth.service';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await registerApi({ email, password, role: 'client' });
      // Don't login immediately, redirect to verification
      navigate('/verify-email', { state: { email } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-architect-900 mb-2">Join the Future</h2>
        <p className="text-gray-500">Create your account to start building</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 p-4 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <Button 
          type="submit" 
          className="w-full h-12 text-lg shadow-soft" 
          isLoading={isLoading}
        >
          <UserPlus className="mr-2 h-5 w-5" /> Sign Up
        </Button>
      </form>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-architect-900 hover:text-accent-teal transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
