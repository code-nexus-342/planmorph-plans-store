// ========== src/app/plans/[slug]/PlanDetailsClient.tsx ==========
"use client";
import { useState } from 'react';
import Image from 'next/image';
import { 
  Bed, Bath, Square, Heart, Star, ShoppingCart, Download, 
  Share2, Eye
} from 'lucide-react';
import { Plan } from '../../../types';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../contexts/AuthContext';

interface PlanDetailsClientProps {
  plan: Plan;
}

export default function PlanDetailsClient({ plan }: PlanDetailsClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    try {
      await addToCart(plan.id);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: plan.title,
          text: plan.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl mx-auto p-4">
          <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
            <Image
              src={plan.images?.[currentImageIndex] || '/placeholder-image.jpg'}
              alt={plan.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {plan.images?.slice(1, 3).map((image, index) => (
              <div 
                key={index} 
                className="relative h-44 lg:h-72 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setCurrentImageIndex(index + 1)}
              >
                <Image
                  src={image}
                  alt={`${plan.title} view ${index + 2}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ))}
            <div className="relative h-44 lg:h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center cursor-pointer">
              <div className="text-center text-white">
                <Eye className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">View 3D Tour</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Details */}
      <section className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{plan.title}</h1>
              <div className="flex items-center space-x-2">
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-1">
                <Bed className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{plan.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{plan.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center space-x-1">
                <Square className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{plan.square_feet.toLocaleString()} sq ft</span>
              </div>
              {plan.average_rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{plan.average_rating.toFixed(1)}</span>
                  <span className="text-gray-600">({plan.review_count || 0} reviews)</span>
                </div>
              )}
            </div>

            {/* Architect */}
            {plan.architects && (
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <div className="w-full h-full flex items-center justify-center text-gray-600 font-medium">
                    {plan.architects.first_name.charAt(0)}{plan.architects.last_name.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Designed by {plan.architects.first_name} {plan.architects.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {plan.architects.company_name || 'Licensed Architect'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{plan.description}</p>
          </div>

          {/* Features */}
          {plan.features && plan.features.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category */}
          {plan.categories && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Category</h2>
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                {plan.categories.name}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg sticky top-24">
            <div className="text-3xl font-bold text-gray-900 mb-6">
              ${plan.price.toLocaleString()}
            </div>
            
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-4">
              <Download className="w-5 h-5 inline mr-2" />
              Download Plans
            </button>
            
            {user && (
              <button 
                onClick={handleAddToCart}
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 rounded-xl font-semibold transition-all duration-300 mb-6"
              >
                <ShoppingCart className="w-5 h-5 inline mr-2" />
                Add to Cart
              </button>
            )}

            <button className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-4 rounded-xl font-semibold transition-all duration-300 mb-6">
              Request Customization
            </button>

            <div className="space-y-2 text-sm text-gray-600">
              <p>✓ Complete architectural plans</p>
              <p>✓ Structural engineering plans</p>
              <p>✓ Electrical & plumbing layouts</p>
              <p>✓ 3D renderings included</p>
              <p>✓ Material specifications</p>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Our experts are ready to help with customizations, building permits, and more.
            </p>
            <button className="w-full bg-white text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
