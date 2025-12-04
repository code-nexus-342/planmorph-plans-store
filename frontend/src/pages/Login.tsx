import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/auth.service';


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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-1">Sign In</h2>
        <p className="text-sm text-text-secondary">Enter your credentials to continue</p>
      </div>
    
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center rounded-lg">
          {error}
        </div>
      )}
    
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/5 border-white/10 text-white placeholder-text-secondary/50 focus:border-primary focus:ring-primary rounded-lg"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white/5 border-white/10 text-white placeholder-text-secondary/50 focus:border-primary focus:ring-primary rounded-lg"
        />
        <Button 
          type="submit" 
          className="w-full h-10 text-base shadow-glow bg-primary text-background hover:bg-primary/90 font-bold rounded-lg border-none" 
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>
    
      <p className="text-center text-sm text-text-secondary">
        No account?{' '}
        <Link to="/register" className="font-bold text-primary hover:text-white transition-colors">
          Create one!
        </Link>
      </p>
    </div>
  );
};

export default Login;
