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
      className="group relative overflow-hidden bg-white p-8 border border-gray-100 hover:border-accent-teal hover:shadow-card transition-all duration-300"
    >
      <div className="relative z-10">
        {/* Icon container */}
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center bg-gray-50 text-architect-900 group-hover:bg-accent-teal group-hover:text-white transition-colors duration-300">
          <Icon size={32} strokeWidth={1.5} />
        </div>
        
        {/* Title */}
        <h3 className="mb-3 text-xl font-bold text-architect-900 font-heading">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-500 font-light leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
