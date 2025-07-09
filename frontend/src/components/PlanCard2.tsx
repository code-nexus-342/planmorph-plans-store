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
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
        <Link href={`/plans/${plan.id}`} className="block">
          <div className="relative h-56 overflow-hidden">
            <Image 
              src={plan.images?.[0] || '/placeholder.jpg'} 
              alt={plan.title} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {plan.is_featured && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </div>
            )}
            <button className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors duration-300 group/heart">
              <Heart className="w-5 h-5 text-gray-600 group-hover/heart:text-red-500 transition-colors duration-300" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {plan.title}
              </h3>
              {plan.average_rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-600">{plan.average_rating}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mb-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <Bed className="w-4 h-4" />
                <span className="text-sm">{plan.bedrooms}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-4 h-4" />
                <span className="text-sm">{plan.bathrooms}</span>
              </div>
              {plan.square_feet && (
                <span className="text-sm">{Number(plan.square_feet).toLocaleString()} sq ft</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">
                ${plan.price.toLocaleString()}
              </div>
              <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold group-hover:bg-blue-100 transition-colors duration-300">
                View Details
              </div>
            </div>
          </div>
        </Link>
        
        <div className="px-6 pb-6">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
