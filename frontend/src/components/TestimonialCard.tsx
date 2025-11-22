import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from '../utils/animations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  quote, 
  author, 
  role, 
  rating,
  delay = 0 
}) => {
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
      {/* Quote mark decoration */}
      <div className="absolute -right-4 -top-4 text-9xl font-serif text-orange-500/10">
        "
      </div>

      <div className="relative z-10">
        {/* Rating stars */}
        <div className="mb-4 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={`${
                i < rating
                  ? 'fill-orange-500 text-orange-500'
                  : 'text-gray-300 dark:text-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="mb-6 text-lg italic text-gray-700 dark:text-gray-300">
          "{quote}"
        </blockquote>

        {/* Author info */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-bold text-white">
            {author.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {author}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {role}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
};

export default TestimonialCard;
