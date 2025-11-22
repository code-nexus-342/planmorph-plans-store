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
        <div className="absolute left-1/2 top-20 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-orange-500 to-blue-500 md:block" />
      )}

      <motion.div
        variants={isEven ? fadeInRight : fadeInLeft}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative flex flex-col items-center md:flex-row md:gap-8"
      >
        {/* Step number and icon */}
        <div className="relative z-10 mb-4 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl md:mb-0">
          <div className="absolute inset-0 animate-ping rounded-full bg-orange-400 opacity-20" />
          <Icon size={32} className="relative z-10" />
        </div>

        {/* Content card */}
        <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-bold text-white">
              {number}
            </span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProcessStep;
