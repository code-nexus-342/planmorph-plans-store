import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 bg-gray-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.png')] opacity-[0.03]" />
      </div>

      <div className="mb-8 relative z-10 text-center">
        <Link to="/" className="flex items-center justify-center gap-3 group">
          <img src="/logo.jpg" alt="PlanMorph Logo" className="h-16 w-auto grayscale group-hover:grayscale-0 transition-all duration-300" />
          <span className="text-4xl font-heading font-bold text-architect-900 tracking-wider">
            PlanMorph
          </span>
        </Link>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white border border-gray-200 shadow-soft p-8 relative z-10"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default AuthLayout;
