import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDesigns } from '../services/designs.service';
import DesignCard from '../components/DesignCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Filter, Search, Grid } from 'lucide-react';
import { staggerContainer, fadeInUp, slideInBottom } from '../utils/animations';

const Designs: React.FC = () => {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  });

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const data = await getDesigns(filters);
      setDesigns(data.data);
    } catch (error) {
      console.error('Failed to fetch designs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDesigns();
  };

  return (
    <div className="min-h-screen pt-20 pb-20 bg-white">
      {/* Header */}
      <div className="relative mb-12 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Grid className="text-accent-teal" size={20} />
              <span className="text-sm font-mono font-bold text-accent-teal uppercase tracking-widest">The Collection</span>
            </div>
            <h1 className="mb-6 text-5xl font-heading font-bold text-architect-900 sm:text-6xl">
              Browse <span className="text-gray-500">Visionary Plans</span>
            </h1>
            <p className="text-xl text-gray-500 font-light max-w-2xl">
              Discover our curated collection of architectural masterpieces, complete with technical drawings and specifications ready for the future.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filters */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={slideInBottom}
          className="mb-12 bg-white border border-gray-100 shadow-soft p-6"
        >
          <div className="mb-6 flex items-center gap-2 text-sm font-bold text-architect-900 uppercase tracking-wider border-b border-gray-100 pb-4">
            <Filter size={16} className="text-accent-teal" />
            <span>Refine Search</span>
          </div>
          
          <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-end gap-6">
            <div className="w-full sm:w-48">
              <label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Min Price</label>
              <Input 
                placeholder="$0" 
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                className="bg-gray-50 border-gray-200 text-architect-900 placeholder-gray-400 focus:border-accent-teal focus:ring-accent-teal rounded-none"
              />
            </div>
            <div className="w-full sm:w-48">
              <label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Max Price</label>
              <Input 
                placeholder="$10,000+" 
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                className="bg-gray-50 border-gray-200 text-architect-900 placeholder-gray-400 focus:border-accent-teal focus:ring-accent-teal rounded-none"
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Bedrooms</label>
              <Input 
                placeholder="Any" 
                type="number"
                value={filters.bedrooms}
                onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                className="bg-gray-50 border-gray-200 text-architect-900 placeholder-gray-400 focus:border-accent-teal focus:ring-accent-teal rounded-none"
              />
            </div>
            <Button type="submit" className="bg-architect-900 text-white hover:bg-accent-teal font-bold shadow-soft border-none h-[42px] px-8 rounded-none uppercase tracking-wide">
              <Search size={18} className="mr-2" /> Search Designs
            </Button>
          </form>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-accent-teal"></div>
              <p className="text-gray-400 font-mono text-sm">LOADING DESIGNS...</p>
            </div>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {designs.map((design) => (
              <motion.div key={design.id} variants={fadeInUp} className="h-full">
                <DesignCard design={design} />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {!loading && designs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50 border border-gray-100">
            <div className="mb-6 rounded-full bg-white p-8 border border-gray-200 shadow-sm">
              <Search size={48} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-architect-900 mb-2">No designs found</h3>
            <p className="text-gray-500 max-w-md mx-auto">We couldn't find any designs matching your criteria. Try adjusting your filters to expand your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Designs;
