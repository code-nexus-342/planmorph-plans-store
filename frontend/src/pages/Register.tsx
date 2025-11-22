import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../services/auth.service';
import { UserPlus, User, HardHat } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'architect'>('client');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await registerApi({ email, password, role });
      login(data.token, data.user);
      navigate(role === 'architect' ? '/architect/dashboard' : '/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-white mb-2">Join the Future</h2>
        <p className="text-gray-400">Create your account to start building</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/50 p-4 text-sm text-red-400 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4 mb-6">
            <button
                type="button"
                className={`flex-1 py-3 px-4 text-sm font-bold rounded-lg border transition-all duration-300 flex flex-col items-center gap-2 ${
                  role === 'client' 
                    ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.2)]' 
                    : 'bg-nebula-800 border-glass-200 text-gray-400 hover:border-gray-500'
                }`}
                onClick={() => setRole('client')}
            >
                <User size={20} />
                Client
            </button>
            <button
                type="button"
                className={`flex-1 py-3 px-4 text-sm font-bold rounded-lg border transition-all duration-300 flex flex-col items-center gap-2 ${
                  role === 'architect' 
                    ? 'bg-neon-purple/10 border-neon-purple text-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.2)]' 
                    : 'bg-nebula-800 border-glass-200 text-gray-400 hover:border-gray-500'
                }`}
                onClick={() => setRole('architect')}
            >
                <HardHat size={20} />
                Professional
            </button>
        </div>

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="glass-input"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="glass-input"
        />
        <Button 
          type="submit" 
          className="w-full bg-neon-cyan text-nebula-900 font-bold hover:bg-white shadow-neon-cyan border-none h-12 text-lg" 
          isLoading={isLoading}
        >
          <UserPlus className="mr-2 h-5 w-5" /> Sign Up
        </Button>
      </form>
      
      <p className="mt-8 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-neon-cyan hover:text-white transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
