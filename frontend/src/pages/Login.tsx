import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/auth.service';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginApi({ email, password });
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-architect-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500">Enter your credentials to access your account</p>
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
        />
        <Button 
          type="submit" 
          className="w-full h-12 text-lg shadow-soft" 
          isLoading={isLoading}
        >
          <LogIn className="mr-2 h-5 w-5" /> Sign In
        </Button>
      </form>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-architect-900 hover:text-accent-teal transition-colors">
          Sign up
        </Link>
      </p>

    </div>
  );
};

export default Login;
