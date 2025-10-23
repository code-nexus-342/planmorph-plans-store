// ========== src/components/PlanCard2.tsx ==========
"use client";
import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Heart, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../contexts/AuthContext";
import { Plan } from "../types";

export default function PlanCard2({ plan }: { plan: Plan }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(plan.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="group relative">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-600 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-dark-xl">
        <Link href={`/plans/${plan.id}`} className="block">
          <div className="relative h-56 overflow-hidden">
            <Image 
              src={plan.images?.[0] || '/placeholder.jpg'} 
              alt={plan.title} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {plan.is_featured && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                ✨ Featured
              </div>
            )}
            
            <button className="absolute top-4 right-4 p-3 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800 rounded-full transition-all duration-300 group/heart border border-slate-700 hover:border-slate-600">
              <Heart className="w-5 h-5 text-gray-300 group-hover/heart:text-red-400 transition-colors duration-300" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-white group-hover:text-brand-400 transition-colors duration-300 line-clamp-1">
                {plan.title}
              </h3>
              {plan.average_rating && (
                <div className="flex items-center space-x-1 bg-slate-800/50 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-brand-400 fill-current" />
                  <span className="text-sm font-medium text-white">{plan.average_rating}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-6 mb-6 text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Bed className="w-4 h-4 text-brand-400" />
                </div>
                <span className="text-sm font-medium">{plan.bedrooms} bed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Bath className="w-4 h-4 text-brand-400" />
                </div>
                <span className="text-sm font-medium">{plan.bathrooms} bath</span>
              </div>
              {plan.square_feet && (
                <div className="text-sm font-medium text-gray-400">
                  {Number(plan.square_feet).toLocaleString()} sq ft
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                ${plan.price.toLocaleString()}
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-xl text-sm font-semibold group-hover:from-brand-500 group-hover:to-brand-600 transition-all duration-300 border border-slate-600 group-hover:border-brand-500">
                View Details
              </div>
            </div>
          </div>
        </Link>
        
        <div className="px-6 pb-6">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-glow"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </div>
  );
}
