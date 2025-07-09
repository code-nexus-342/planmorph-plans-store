"use client";
import { useState, useEffect } from 'react';
import { Category } from '../../types';
import { apiClient } from '../../lib/api-client';
import LoadingSpinner from '../../components/LoadingSpinner';
import Link from 'next/link';
import { Home, Building, Trees, Mountain, Heart, Users } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'modern': <Building className="w-8 h-8" />,
  'traditional': <Home className="w-8 h-8" />,
  'cottage': <Trees className="w-8 h-8" />,
  'luxury': <Mountain className="w-8 h-8" />,
  'family': <Users className="w-8 h-8" />,
  'default': <Heart className="w-8 h-8" />
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Category[]>('/categories');
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        setError('Failed to load categories. Please try again.');
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          House Plan Categories
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore our carefully curated collection of house plans organized by style, size, and features.
          Find the perfect category that matches your vision.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/plans?category=${category.slug}`}
              className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white mb-6 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                  {categoryIcons[category.slug] || categoryIcons.default}
                </div>

                {/* Category Name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>

                {/* Description */}
                {category.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {category.description}
                  </p>
                )}

                {/* CTA */}
                <div className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  Explore Plans
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">📂</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600">
            Categories are currently being set up. Please check back soon.
          </p>
        </div>
      )}

      {/* Featured Section */}
      <div className="mt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Can't Find What You're Looking For?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Our team of expert architects can create custom house plans tailored to your specific needs and preferences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Request Custom Design
          </Link>
          <Link
            href="/plans"
            className="px-8 py-4 border-2 border-white/30 hover:border-white/50 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/10"
          >
            Browse All Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
