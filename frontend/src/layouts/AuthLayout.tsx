import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HardHat } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="mb-8 relative z-10 text-center">
        <Link to="/" className="flex items-center justify-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-neon-cyan text-nebula-900 shadow-neon-cyan group-hover:scale-110 transition-transform duration-300">
            <HardHat size={28} />
          </div>
          <span className="text-4xl font-heading font-bold text-white tracking-wider">
            Plan<span className="text-neon-cyan">Morph</span>
          </span>
        </Link>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 glass-panel p-8 relative z-10"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default AuthLayout;
