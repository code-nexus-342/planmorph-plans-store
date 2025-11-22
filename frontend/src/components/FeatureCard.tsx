import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from '../utils/animations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay = 0 }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      variants={scaleIn}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{ delay }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-950"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10">
        {/* Icon container with construction theme */}
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
          <Icon size={32} />
        </div>
        
        {/* Title */}
        <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-orange-500/10 to-blue-500/10 blur-2xl transition-all duration-300 group-hover:scale-150" />
    </motion.div>
  );
};

export default FeatureCard;
