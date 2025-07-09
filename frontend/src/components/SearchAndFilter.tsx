"use client";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface FilterOptions {
  priceRange: [number, number];
  bedrooms: number[];
  bathrooms: number[];
  sqftRange: [number, number];
  style: string[];
  features: string[];
}

const defaultFilters: FilterOptions = {
  priceRange: [0, 1000000],
  bedrooms: [],
  bathrooms: [],
  sqftRange: [0, 10000],
  style: [],
  features: [],
};

const styleOptions = [
  "Modern", "Traditional", "Contemporary", "Colonial", "Ranch", 
  "Victorian", "Craftsman", "Mediterranean", "Farmhouse", "Tudor"
];

const featureOptions = [
  "Open Concept", "Fireplace", "Walk-in Closet", "Covered Patio",
  "Island Kitchen", "Master Suite", "Garage", "Basement", "Loft", "Study"
];

export default function SearchAndFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  const handleFilterChange = (key: keyof FilterOptions, value: FilterOptions[keyof FilterOptions]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setSearchTerm("");
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search house plans, styles, or features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-6 py-3 border rounded-xl font-medium transition-all ${
              showFilters 
                ? "bg-blue-50 border-blue-300 text-blue-700" 
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filter Plans</h3>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>${filters.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      onClick={() => {
                        const newBedrooms = filters.bedrooms.includes(num)
                          ? filters.bedrooms.filter(b => b !== num)
                          : [...filters.bedrooms, num];
                        handleFilterChange('bedrooms', newBedrooms);
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        filters.bedrooms.includes(num)
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => {
                        const newBathrooms = filters.bathrooms.includes(num)
                          ? filters.bathrooms.filter(b => b !== num)
                          : [...filters.bathrooms, num];
                        handleFilterChange('bathrooms', newBathrooms);
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        filters.bathrooms.includes(num)
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Square Footage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Footage
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    value={filters.sqftRange[1]}
                    onChange={(e) => handleFilterChange('sqftRange', [500, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>500 sq ft</span>
                    <span>{filters.sqftRange[1].toLocaleString()} sq ft</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Style and Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Architectural Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Architectural Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {styleOptions.map(style => (
                    <button
                      key={style}
                      onClick={() => {
                        const newStyles = filters.style.includes(style)
                          ? filters.style.filter(s => s !== style)
                          : [...filters.style, style];
                        handleFilterChange('style', newStyles);
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        filters.style.includes(style)
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="flex flex-wrap gap-2">
                  {featureOptions.map(feature => (
                    <button
                      key={feature}
                      onClick={() => {
                        const newFeatures = filters.features.includes(feature)
                          ? filters.features.filter(f => f !== feature)
                          : [...filters.features, feature];
                        handleFilterChange('features', newFeatures);
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        filters.features.includes(feature)
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="flex justify-end">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
