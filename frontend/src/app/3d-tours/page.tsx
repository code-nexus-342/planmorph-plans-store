"use client";
import { useState } from "react";
import { Play, Eye, RotateCcw, ZoomIn } from "lucide-react";

interface Tour3D {
  id: string;
  title: string;
  image: string;
  duration: string;
  views: number;
  category: string;
  description: string;
}

export default function ToursPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for 3D tours
  const tours: Tour3D[] = [
    {
      id: "1",
      title: "Modern Farmhouse 3D Tour",
      image: "/api/placeholder/400/300",
      duration: "5:30",
      views: 12500,
      category: "farmhouse",
      description: "Experience our most popular modern farmhouse design with this immersive 3D walkthrough."
    },
    {
      id: "2", 
      title: "Contemporary Villa Tour",
      image: "/api/placeholder/400/300",
      duration: "7:45",
      views: 8300,
      category: "contemporary",
      description: "Explore the luxurious spaces of this stunning contemporary villa design."
    },
    {
      id: "3",
      title: "Craftsman Style Home",
      image: "/api/placeholder/400/300", 
      duration: "6:15",
      views: 9800,
      category: "craftsman",
      description: "Walk through this beautifully detailed craftsman-style home with rich woodwork."
    },
    {
      id: "4",
      title: "Minimalist Modern Design",
      image: "/api/placeholder/400/300",
      duration: "4:20",
      views: 6700,
      category: "modern",
      description: "Discover the clean lines and open spaces of this minimalist modern home."
    },
    {
      id: "5",
      title: "Traditional Colonial Tour",
      image: "/api/placeholder/400/300",
      duration: "8:10",
      views: 11200,
      category: "traditional",
      description: "Experience the timeless elegance of this classic colonial home design."
    },
    {
      id: "6",
      title: "Luxury Mediterranean Villa",
      image: "/api/placeholder/400/300",
      duration: "9:30",
      views: 15600,
      category: "mediterranean",
      description: "Tour this stunning Mediterranean-inspired luxury villa with premium finishes."
    }
  ];

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Immersive 3D House Tours
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Step inside your future home with our interactive 3D walkthroughs. 
              Experience every room, every detail, before you build.
            </p>
            <div className="flex items-center justify-center space-x-8 text-blue-100">
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
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tours Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white text-blue-600 p-4 rounded-full hover:bg-blue-50 transition-colors">
                    <Play className="w-8 h-8" />
                  </button>
                </div>
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <Play className="w-3 h-3" />
                  <span>{tour.duration}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>
                <p className="text-gray-600 mb-4">{tour.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{tour.views.toLocaleString()} views</span>
                  </div>
                  <span className="capitalize">{tour.category}</span>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Start 3D Tour</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Dream Home?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Browse our complete collection of house plans and start your journey today.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors">
              Browse All Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
