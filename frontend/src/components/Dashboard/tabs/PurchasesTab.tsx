"use client";
import { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, DollarSign, Home, Bath, Maximize, Eye, ArrowUpRight } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import LoadingSpinner from '../../LoadingSpinner';
import Link from 'next/link';

interface Purchase {
  id: string;
  price_paid: number;
  status: string;
  purchased_at: string;
  plan_id: string;
  plan_title: string;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  thumbnail_url?: string;
}

export default function PurchasesTab() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Purchase[]>('/users/purchases');
      
      if (response.success && response.data) {
        setPurchases(response.data);
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">My Purchases</h2>
            <p className="text-sm text-gray-400">
              {purchases.length} plan{purchases.length !== 1 ? 's' : ''} purchased
            </p>
          </div>
        </div>
      </div>

      {/* Purchases List */}
      {purchases.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/10">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No purchases yet</h3>
          <p className="text-gray-400 mb-6">Start building your dream home by browsing our plans</p>
          <Link 
            href="/plans"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
          >
            <span>Browse Plans</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="group relative rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-cyan-500/50 p-6 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Plan Image */}
              <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-slate-800 to-slate-900">
                {purchase.thumbnail_url ? (
                  <img
                    src={purchase.thumbnail_url}
                    alt={purchase.plan_title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-16 h-16 text-gray-600" />
                  </div>
                )}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium">
                  {purchase.status}
                </div>
              </div>

              {/* Plan Info */}
              <div className="space-y-3">
                <Link 
                  href={`/plans/${purchase.plan_id}`}
                  className="block group/title"
                >
                  <h3 className="text-lg font-bold text-white group-hover/title:text-cyan-400 transition-colors line-clamp-2">
                    {purchase.plan_title}
                  </h3>
                </Link>

                {/* Specs */}
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Home className="w-4 h-4" />
                    <span>{purchase.bedrooms} BD</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath className="w-4 h-4" />
                    <span>{purchase.bathrooms} BA</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Maximize className="w-4 h-4" />
                    <span>{purchase.square_footage.toLocaleString()} sqft</span>
                  </div>
                </div>

                {/* Purchase Details */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(purchase.purchased_at)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-lg font-bold text-white">
                    <DollarSign className="w-5 h-5 text-cyan-400" />
                    <span>{purchase.price_paid.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/plans/${purchase.plan_id}`}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-400 hover:from-cyan-500 hover:to-blue-500 hover:text-white font-medium transition-all duration-300 group/btn"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Plan</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
