import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, Bath, Ruler, ArrowRight } from 'lucide-react';
import { hoverLift } from '../utils/animations';

interface DesignCardProps {
  design: {
    id: number;
    title: string;
    price: string;
    preview_url?: string;
    specifications?: {
      bedrooms: number;
      bathrooms: number;
      sqft: number;
    };
    architect?: {
      name: string;
    };
  };
}

const DesignCard: React.FC<DesignCardProps> = ({ design }) => {
  return (
    <Link to={`/designs/${design.id}`} className="block h-full">
      <motion.div 
        variants={hoverLift}
        initial="rest"
        whileHover="hover"
        className="group relative h-full flex flex-col glass-panel hover:border-primary hover:shadow-glow transition-all duration-300 overflow-hidden rounded-2xl"
      >
        {/* Image Container - Larger Aspect Ratio */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface/50">
          {design.preview_url ? (
            <img 
              src={design.preview_url} 
              alt={design.title} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-text-secondary">
              <div className="flex flex-col items-center gap-2">
                <Ruler size={32} className="opacity-50 text-primary" />
                <span className="text-sm font-medium">No Preview Available</span>
              </div>
            </div>
          )}
          
          {/* Overlay Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className="bg-background/80 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20 shadow-lg rounded-full">
              Verified
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-6">
          <div className="mb-4">
            <h3 className="text-xl font-heading font-bold text-white line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {design.title}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Plot Required: <span className="font-medium text-white">50x100 ft</span>
            </p>
          </div>

          {/* Specs Grid */}
          <div className="mb-6 grid grid-cols-3 gap-4 border-y border-white/10 py-4">
            {design.specifications && (
              <>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-1 text-text-secondary group-hover:text-primary transition-colors">
                    <BedDouble size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-bold text-white">
                    {design.specifications.bedrooms}
                  </span>
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider">Beds</span>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-white/10 text-center">
                  <div className="mb-1 text-text-secondary group-hover:text-primary transition-colors">
                    <Bath size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-bold text-white">
                    {design.specifications.bathrooms}
                  </span>
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider">Baths</span>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-white/10 text-center">
                  <div className="mb-1 text-text-secondary group-hover:text-primary transition-colors">
                    <Ruler size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-bold text-white">
                    {design.specifications.sqft}
                  </span>
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider">Sq.Ft</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Est. Cost</p>
              <span className="text-lg font-bold text-primary">KES {design.price}</span>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-primary transition-colors duration-300">
              View Plan <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default DesignCard;
