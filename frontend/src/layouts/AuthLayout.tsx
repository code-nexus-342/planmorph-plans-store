import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 bg-[#050505]">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.png')] opacity-[0.03]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <div className="mb-8 relative z-10 text-center">
        <Link to="/" className="flex items-center justify-center gap-3 group">
          <img src="/logo.jpg" alt="PlanMorph Logo" className="h-12 w-auto grayscale group-hover:grayscale-0 transition-all duration-300 rounded-lg" />
          <span className="text-2xl font-heading font-bold text-white tracking-wider">
            PlanMorph
          </span>
        </Link>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-[#121212] border border-white/10 shadow-card p-8 relative z-10 rounded-xl"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default AuthLayout;
