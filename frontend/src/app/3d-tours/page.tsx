"use client";
import { useState, useEffect } from "react";
import { Play, Eye, RotateCcw, ZoomIn } from "lucide-react";
import { useTours } from "../../hooks/useTours";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ToursPage() {
  const { tours, loading, error, fetchTours } = useTours();
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchTours({
      category: selectedCategory !== 'all' ? selectedCategory : undefined
    });
  }, [selectedCategory]);

  const categories = [
    { id: "all", name: "All Tours" },
    { id: "farmhouse", name: "Farmhouse" },
    { id: "contemporary", name: "Contemporary" },
    { id: "craftsman", name: "Craftsman" },
    { id: "modern", name: "Modern" },
    { id: "traditional", name: "Traditional" },
    { id: "mediterranean", name: "Mediterranean" }
  ];

  const filteredTours = selectedCategory === "all" 
    ? tours 
    : tours.filter(tour => tour.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cyan-600 via-purple-700 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 neon-text">
              Immersive 3D House Tours
            </h1>
            <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto">
              Step inside your future home with our interactive 3D walkthroughs. 
              Experience every room, every detail, before you build.
            </p>
            <div className="flex items-center justify-center space-x-8 text-cyan-100">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>High-Definition Views</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5" />
                <span>360° Exploration</span>
              </div>
              <div className="flex items-center space-x-2">
                <ZoomIn className="w-5 h-5" />
                <span>Detailed Zoom</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-glow-cyan"
                  : "glass text-gray-300 hover:glass-hover border border-cyan-500/30"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="glass border-2 border-red-500/30 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-red-400 mb-4">
                <p className="text-xl font-bold">Error loading tours</p>
                <p className="text-sm text-red-300 mt-2">{error}</p>
              </div>
              <button 
                onClick={() => fetchTours()}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tours Grid */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {filteredTours.length === 0 ? (
            <div className="text-center py-12">
              <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No tours found</h3>
              <p className="text-gray-400">Try selecting a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour) => (
                <div key={tour.id} className="glass hover:glass-hover rounded-2xl overflow-hidden border border-cyan-500/20 group">
                  <div className="relative">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="btn-primary p-4 rounded-full shadow-glow-cyan">
                        <Play className="w-8 h-8" />
                      </button>
                    </div>
                    <div className="absolute top-4 right-4 glass bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <Play className="w-3 h-3" />
                      <span>{tour.duration}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{tour.title}</h3>
                    <p className="text-gray-300 mb-4">{tour.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{tour.views.toLocaleString()} views</span>
                      </div>
                      <span className="capitalize text-cyan-400">{tour.category}</span>
                    </div>
                    
                    <button className="w-full btn-primary py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>Start 3D Tour</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-900 to-cyan-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Dream Home?</h2>
            <p className="text-xl text-cyan-100 mb-8">
              Browse our complete collection of house plans and start your journey today.
            </p>
            <button className="btn-primary text-lg">
              Browse All Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
