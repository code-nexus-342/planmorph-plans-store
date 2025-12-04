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
      className="group relative overflow-hidden glass-panel p-8 hover:border-primary hover:shadow-glow transition-all duration-300 rounded-2xl"
    >
      <div className="relative z-10">
        {/* Icon container */}
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center bg-white/5 border border-white/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-background group-hover:scale-110 transition-all duration-300 shadow-lg">
          <Icon size={32} strokeWidth={1.5} />
        </div>
        
        {/* Title */}
        <h3 className="mb-3 text-xl font-bold text-white font-heading group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-text-secondary font-light leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
