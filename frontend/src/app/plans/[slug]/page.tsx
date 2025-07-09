// ========== src/app/plans/[slug]/page.tsx ==========
"use client";
import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Bed, Bath, Home, Heart, Star, ShoppingCart, Download, 
  ArrowLeft, Share2, ChevronLeft, ChevronRight, 
  Eye,
  Square
} from 'lucide-react';
import { Plan, Review } from '../../../types';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../contexts/AuthContext';
import { API_CONFIG } from '../../../lib/api-config';
import LoadingSpinner from '../../../components/LoadingSpinner';

// Mock data - in production this would come from a database
const mockPlans = {
  "modern-minimalist-villa": {
    id: 1,
    title: "Modern Minimalist Villa",
    price: 185000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2450,
    rating: 4.8,
    reviews: 127,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
    ],
    architect: "Sarah Johnson",
    architectImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    description: "This stunning modern villa combines minimalist design principles with functional living spaces. Perfect for families seeking contemporary luxury with clean lines and open-concept living.",
    features: [
      "Open concept living area",
      "Large windows for natural light", 
      "Master suite with walk-in closet",
      "Gourmet kitchen with island",
      "Covered outdoor patio",
      "2-car attached garage",
      "Energy-efficient design",
      "Smart home pre-wiring"
    ],
    specifications: {
      "Total Square Footage": "2,450 sq ft",
      "Lot Size": "0.25 acres",
      "Stories": "1 story",
      "Garage": "2-car attached",
      "Foundation": "Slab-on-grade",
      "Roof": "Hip roof",
      "Exterior": "Modern stucco",
      "Energy Rating": "HERS 45"
    },
    downloadIncludes: [
      "Complete architectural plans",
      "Structural engineering plans", 
      "Electrical layout",
      "Plumbing layout",
      "3D renderings",
      "Material specifications",
      "Construction details",
      "Code compliance documentation"
    ]
  }
};

export default async function PlanDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = mockPlans[slug as keyof typeof mockPlans];
  
  if (!plan) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl mx-auto p-4">
          <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
            <Image
              src={plan.images[0]}
              alt={plan.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {plan.images.slice(1).map((image, index) => (
              <div key={index} className="relative h-44 lg:h-72 rounded-2xl overflow-hidden">
                <Image
                  src={image}
                  alt={`${plan.title} view ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ))}
            <div className="relative h-44 lg:h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
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
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
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
                <span className="font-medium">{plan.sqft.toLocaleString()} sq ft</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-medium">{plan.rating}</span>
                <span className="text-gray-600">({plan.reviews} reviews)</span>
              </div>
            </div>

            {/* Architect */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={plan.architectImage}
                  alt={plan.architect}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">Designed by {plan.architect}</p>
                <p className="text-sm text-gray-600">Licensed Architect</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{plan.description}</p>
          </div>

          {/* Features */}
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

          {/* Specifications */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(plan.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
            
            <button className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 rounded-xl font-semibold transition-all duration-300 mb-6">
              Request Customization
            </button>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Download Includes:</h3>
              {plan.downloadIncludes.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>{item}</span>
                </div>
              ))}
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
