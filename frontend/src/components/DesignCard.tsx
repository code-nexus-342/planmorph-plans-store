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
        className="group relative h-full flex flex-col bg-white border border-gray-100 hover:border-accent-teal hover:shadow-card transition-all duration-300"
      >
        {/* Image Container - Larger Aspect Ratio */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          {design.preview_url ? (
            <img 
              src={design.preview_url} 
              alt={design.title} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <Ruler size={32} className="opacity-50" />
                <span className="text-sm font-medium">No Preview Available</span>
              </div>
            </div>
          )}
          
          {/* Overlay Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider text-architect-900 shadow-sm">
              Verified
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-6">
          <div className="mb-4">
            <h3 className="text-xl font-heading font-bold text-architect-900 line-clamp-1 group-hover:text-accent-teal transition-colors duration-300">
              {design.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Plot Required: <span className="font-medium text-architect-900">50x100 ft</span>
            </p>
          </div>

          {/* Specs Grid */}
          <div className="mb-6 grid grid-cols-3 gap-4 border-y border-gray-100 py-4">
            {design.specifications && (
              <>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-1 text-gray-400">
                    <BedDouble size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-bold text-architect-900">
                    {design.specifications.bedrooms}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Beds</span>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-gray-100 text-center">
                  <div className="mb-1 text-gray-400">
                    <Bath size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-bold text-architect-900">
                    {design.specifications.bathrooms}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Baths</span>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-gray-100 text-center">
                  <div className="mb-1 text-gray-400">
                    <Ruler size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-bold text-architect-900">
                    {design.specifications.sqft}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Sq.Ft</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Est. Cost</p>
              <span className="text-lg font-bold text-architect-900">${design.price}</span>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-architect-900 group-hover:text-accent-teal transition-colors duration-300">
              View Plan <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default DesignCard;
