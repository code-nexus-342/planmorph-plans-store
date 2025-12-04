import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Lock, Mail, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { loginAsProfessional } from '../../services/professionals.service';

const ProfessionalLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginAsProfessional({ email, password });
      authLogin(response.token, response.user);
      
      // Check role? Ideally backend handles this or we check user object after login
      // For now, redirect to dashboard
      navigate('/professional/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-accent/10 mb-6">
            <Briefcase className="text-accent" size={32} />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Professional Portal</h1>
          <p className="text-text-secondary">Access your dashboard and manage your designs</p>
        </div>

        <div className="glass-panel border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-xl bg-surface/50">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-text-secondary/30"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-text-secondary">Password</label>
                <Link to="/professional/forgot-password" className="text-xs text-accent hover:text-accent/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-text-secondary/30"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-accent text-background hover:bg-accent/90 shadow-glow py-6 text-lg font-bold"
              isLoading={isLoading}
            >
              Sign In
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-secondary text-sm">
              Not a verified professional yet?{' '}
              <Link to="/professional/apply" className="text-accent font-bold hover:underline">
                Apply to Join
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfessionalLogin;
