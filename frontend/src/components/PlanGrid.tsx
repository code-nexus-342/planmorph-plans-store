// =====src/components/PlanGrid.tsx 
"use client";
import { useEffect } from "react";
import PlanCard from "./PlanCard2";
import { usePlans } from "../hooks/usePlans";
import LoadingSpinner from "./LoadingSpinner";

interface PlanGridProps {
  limit?: number;
  featured?: boolean;
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    search?: string;
  };
}

export default function PlanGrid({ limit = 6, featured, filters }: PlanGridProps) {
  const { 
    plans, 
    loading, 
    error, 
    fetchPlans 
  } = usePlans();

  useEffect(() => {
    const fetchFilters = {
      limit,
      featured,
      ...filters
    };
    
    fetchPlans(fetchFilters);
  }, [limit, featured, filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
          <div className="text-red-400 mb-4">
            <p className="text-xl font-bold">Error loading plans</p>
            <p className="text-sm text-red-300 mt-2">{error}</p>
          </div>
          <button 
            onClick={() => fetchPlans({ limit, featured, ...filters })}
            className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-glow"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 max-w-lg mx-auto backdrop-blur-sm">
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-white text-xl font-bold mb-2">No plans found</p>
          <p className="text-gray-400">
            Try adjusting your filters or check back later for new designs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
      {plans.map((plan, index) => (
        <div
          key={plan.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <PlanCard plan={plan} />
        </div>
      ))}
    </div>
  );
}