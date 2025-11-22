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
    <Link to={`/designs/${design.id}`}>
      <motion.div 
        variants={hoverLift}
        initial="rest"
        whileHover="hover"
        className="group relative h-full overflow-hidden rounded-2xl border border-glass-200 bg-glass-100 shadow-glass transition-all duration-500 hover:border-neon-cyan/50 hover:shadow-neon-cyan"
      >
        {/* Holographic Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-nebula-800">
          {design.preview_url ? (
            <img 
              src={design.preview_url} 
              alt={design.title} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <Ruler size={32} className="opacity-50" />
                <span className="text-sm font-medium">No Preview Available</span>
              </div>
            </div>
          )}
          
          {/* Overlay Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className="rounded-full bg-nebula-900/80 border border-neon-cyan/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-neon-cyan backdrop-blur-md shadow-lg">
              Verified Plan
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 flex h-full flex-col p-5">
          <div className="mb-3 flex items-start justify-between">
            <h3 className="text-lg font-heading font-bold text-white line-clamp-1 group-hover:text-neon-cyan transition-colors duration-300 text-shadow-sm">
              {design.title}
            </h3>
          </div>

          {/* Specs Grid */}
          <div className="mb-6 grid grid-cols-3 gap-2 border-y border-glass-200 py-3">
            {design.specifications && (
              <>
                <div className="flex flex-col items-center justify-center text-center group-hover:text-neon-cyan transition-colors duration-300">
                  <div className="mb-1 flex items-center gap-1 text-gray-400 group-hover:text-neon-cyan/70">
                    <BedDouble size={16} />
                  </div>
                  <span className="text-sm font-semibold text-gray-200">
                    {design.specifications.bedrooms}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Beds</span>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-glass-200 text-center group-hover:text-neon-cyan transition-colors duration-300">
                  <div className="mb-1 flex items-center gap-1 text-gray-400 group-hover:text-neon-cyan/70">
                    <Bath size={16} />
                  </div>
                  <span className="text-sm font-semibold text-gray-200">
                    {design.specifications.bathrooms}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Baths</span>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-glass-200 text-center group-hover:text-neon-cyan transition-colors duration-300">
                  <div className="mb-1 flex items-center gap-1 text-gray-400 group-hover:text-neon-cyan/70">
                    <Ruler size={16} />
                  </div>
                  <span className="text-sm font-semibold text-gray-200">
                    {design.specifications.sqft}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Sq.Ft</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Starting at</p>
              <span className="text-xl font-bold text-neon-purple text-shadow-sm">${design.price}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-neon-cyan opacity-0 transition-all duration-300 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
              View Details <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default DesignCard;
