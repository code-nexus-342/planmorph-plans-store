"use client";
import { useState, useEffect } from 'react';
import { Heart, Home, Bath, Maximize, DollarSign, Eye, Trash2, ArrowUpRight } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import LoadingSpinner from '../../LoadingSpinner';
import Link from 'next/link';

interface FavoritePlan {
  id: string;
  created_at: string;
  plan_id: string;
  plan: {
    id: string;
    title: string;
    description: string;
    bedrooms: number;
    bathrooms: number;
    square_footage: number;
    base_price: number;
    thumbnail_url?: string;
  };
}

export default function FavoritesTab() {
  const [favorites, setFavorites] = useState<FavoritePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<FavoritePlan[]>('/users/favorites');
      
      if (response.success && response.data) {
        setFavorites(response.data);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      setRemovingId(favoriteId);
      const response = await apiClient.delete(`/users/favorites/${favoriteId}`);
      
      if (response.success) {
        setFavorites(favorites.filter(f => f.id !== favoriteId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setRemovingId(null);
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">My Favorites</h2>
            <p className="text-sm text-gray-400">
              {favorites.length} plan{favorites.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        </div>
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-white/10">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
          <p className="text-gray-400 mb-6">Save plans you love to access them later</p>
          <Link 
            href="/plans"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-rose-500/50 transition-all duration-300"
          >
            <span>Browse Plans</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="group relative rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-rose-500/50 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Plan Image */}
              <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900">
                {favorite.plan.thumbnail_url ? (
                  <img
                    src={favorite.plan.thumbnail_url}
                    alt={favorite.plan.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-16 h-16 text-gray-600" />
                  </div>
                )}
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  disabled={removingId === favorite.id}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-rose-500 hover:border-rose-500 transition-all duration-300 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {removingId === favorite.id ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Heart className="w-4 h-4 text-white fill-white group-hover/btn:scale-110 transition-transform" />
                  )}
                </button>

                {/* Added Date Badge */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                  Added {formatDate(favorite.created_at)}
                </div>
              </div>

              {/* Plan Info */}
              <div className="p-5 space-y-3">
                <Link 
                  href={`/plans/${favorite.plan_id}`}
                  className="block group/title"
                >
                  <h3 className="text-lg font-bold text-white group-hover/title:text-rose-400 transition-colors line-clamp-2">
                    {favorite.plan.title}
                  </h3>
                </Link>

                <p className="text-sm text-gray-400 line-clamp-2">
                  {favorite.plan.description}
                </p>

                {/* Specs */}
                <div className="flex items-center space-x-4 text-sm text-gray-400 pt-2 border-t border-white/10">
                  <div className="flex items-center space-x-1">
                    <Home className="w-4 h-4" />
                    <span>{favorite.plan.bedrooms} BD</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath className="w-4 h-4" />
                    <span>{favorite.plan.bathrooms} BA</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Maximize className="w-4 h-4" />
                    <span>{favorite.plan.square_footage.toLocaleString()}</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-5 h-5 text-rose-400" />
                    <span className="text-xl font-bold text-white">
                      {favorite.plan.base_price.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    href={`/plans/${favorite.plan_id}`}
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/50 text-rose-400 hover:from-rose-500 hover:to-pink-500 hover:text-white transition-all duration-300 group/btn"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
