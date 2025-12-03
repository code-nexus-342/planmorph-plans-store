import React from 'react';
import { motion } from 'framer-motion';
import { fadeInLeft, fadeInRight } from '../utils/animations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { LucideIcon } from 'lucide-react';

interface ProcessStepProps {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  isLast?: boolean;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ 
  number, 
  icon: Icon, 
  title, 
  description, 
  isLast = false 
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const isEven = number % 2 === 0;

  return (
    <div ref={ref} className="relative">
      {/* Connecting line */}
      {!isLast && (
        <div className="absolute left-10 top-20 hidden h-full w-px bg-gray-200 md:block" />
      )}

      <motion.div
        variants={isEven ? fadeInRight : fadeInLeft}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative flex flex-col md:flex-row md:gap-12 items-start"
      >
        {/* Step number and icon */}
        <div className="relative z-10 mb-6 flex h-20 w-20 flex-shrink-0 items-center justify-center bg-white border border-gray-200 text-architect-900 shadow-soft md:mb-0">
          <div className="absolute -top-3 -right-3 h-8 w-8 flex items-center justify-center bg-accent-teal text-white text-xs font-bold">
            {number}
          </div>
          <Icon size={32} strokeWidth={1.5} />
        </div>

        {/* Content card */}
        <div className="flex-1 pt-2">
          <h3 className="text-2xl font-bold text-architect-900 font-heading mb-3">
            {title}
          </h3>
          <p className="text-gray-500 font-light leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProcessStep;
