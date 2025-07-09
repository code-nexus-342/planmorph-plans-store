"use client";
import { useState } from 'react';
import { Star, MapPin, Calendar, Award, Users, Briefcase, Phone, Mail, Globe, User } from 'lucide-react';

interface Architect {
  id: string;
  name: string;
  company: string;
  location: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experience: number;
  completedProjects: number;
  avatar: string;
  description: string;
  services: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  featured: boolean;
}

const mockArchitects: Architect[] = [
  {
    id: '1',
    name: 'Oscar Irungu',
    company: 'PlanMorph Architects',
    location: 'Nairobi, Kenya',
    specialty: 'Modern Residential',
    rating: 4.9,
    reviewCount: 127,
    experience: 12,
    completedProjects: 85,
    avatar: '/api/placeholder/150/150',
    description: 'Award-winning architect specializing in sustainable modern homes with innovative design solutions.',
    services: ['Custom Home Design', 'Renovations', 'Sustainable Architecture', 'Interior Design'],
    contact: {
      phone: '+254 726 054 502',
      email: 'oscarirush@gmail.com',
      website: 'www.mngmnt.planmorph.com'
    },
    featured: true
  },
  {
    id: '2',
    name: 'Lawrence Musyoka',
    company: 'PlanMorph Architects',
    location: 'Austin, TX',
    specialty: 'Traditional & Colonial',
    rating: 4.8,
    reviewCount: 93,
    experience: 15,
    completedProjects: 120,
    avatar: '/api/placeholder/150/150',
    description: 'Expert in traditional architecture with a focus on timeless designs and quality craftsmanship.',
    services: ['Traditional Homes', 'Historic Restoration', 'Additions', 'Consultation'],
    contact: {
      phone: '+254 748 767 396',
      email: 'larrysyoks@gmail.com',
      website: 'www.larry.com'
    },
    featured: true
  },
  {
    id: '3',
    name: 'Benard Kioko',
    company: 'KAA',
    location: 'Nairobi, Kenya',
    specialty: 'Contemporary & Minimalist',
    rating: 4.7,
    reviewCount: 76,
    experience: 8,
    completedProjects: 45,
    avatar: '/api/placeholder/150/150',
    description: 'Contemporary architect known for clean lines, open spaces, and innovative use of natural materials.',
    services: ['Contemporary Design', 'Minimalist Homes', 'Space Planning', 'Feng Shui Integration'],
    contact: {
      phone: '+254 721 591 846',
      email: 'kiokom@gmail.com',
      website: 'www.syoks.com'
    },
    featured: false
  },
  {
    id: '4',
    name: 'Ryan Kyalo',
    company: 'Thompson Architecture Group',
    location: 'Nairobi, Kenya',
    specialty: 'Luxury & Custom',
    rating: 4.9,
    reviewCount: 154,
    experience: 20,
    completedProjects: 200,
    avatar: '/api/placeholder/150/150',
    description: 'Luxury home specialist with expertise in custom design and high-end residential projects.',
    services: ['Luxury Homes', 'Custom Architecture', 'Estate Planning', 'Project Management'],
    contact: {
      phone: '+254 745 039 766',
      email: 'kyaloryan@gmail.com',
      website: 'www.kyaloryan.com'
    },
    featured: true
  },
  {
    id: '5',
    name: 'Joseph Makenzi',
    company: 'Park Sustainable Design',
    location: 'Mombasa, Kenya',
    specialty: 'Eco-Friendly & Green',
    rating: 4.8,
    reviewCount: 89,
    experience: 10,
    completedProjects: 67,
    avatar: '/api/placeholder/150/150',
    description: 'Pioneer in sustainable architecture with certifications in LEED and passive house design.',
    services: ['Green Building', 'Passive House', 'Solar Integration', 'Sustainable Materials'],
    contact: {
      phone: '+254 721 568 411',
      email: 'jomack73@gmail.com',
      website: 'www.jomack.com'
    },
    featured: false
  },
  {
    id: '6',
    name: 'Kennedy Wilson',
    company: 'Wilson Heritage Architects',
    location: 'Charleston, SC',
    specialty: 'Historic & Restoration',
    rating: 4.6,
    reviewCount: 112,
    experience: 18,
    completedProjects: 95,
    avatar: '/api/placeholder/150/150',
    description: 'Specialist in historic preservation and restoration with deep knowledge of period architecture.',
    services: ['Historic Restoration', 'Period Architecture', 'Heritage Consultation', 'Adaptive Reuse'],
    contact: {
      phone: '+1 (555) 789-0123',
      email: 'james@wilsonheritage.com',
      website: 'www.wilsonheritage.com'
    },
    featured: false
  }
];

export default function ArchitectsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const specialties = ['All', 'Modern Residential', 'Traditional & Colonial', 'Contemporary & Minimalist', 'Luxury & Custom', 'Eco-Friendly & Green', 'Historic & Restoration'];
  const locations = ['All', 'Nairobi, Kenya', 'Austin, TX', 'Mombasa, Kenya', 'Charleston, SC'];

  const filteredArchitects = mockArchitects.filter(architect => {
    const matchesSpecialty = selectedSpecialty === 'All' || architect.specialty === selectedSpecialty;
    const matchesLocation = selectedLocation === 'All' || architect.location === selectedLocation;
    return matchesSpecialty && matchesLocation;
  });

  const featuredArchitects = filteredArchitects.filter(architect => architect.featured);
  const otherArchitects = filteredArchitects.filter(architect => !architect.featured);

  const ArchitectCard = ({ architect }: { architect: Architect }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{architect.name}</h3>
              <p className="text-blue-600 font-medium">{architect.company}</p>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {architect.location}
              </div>
            </div>
          </div>
          {architect.featured && (
            <div className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(architect.rating) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {architect.rating} ({architect.reviewCount} reviews)
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {architect.specialty}
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {architect.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            {architect.experience} years experience
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-2 text-green-500" />
            {architect.completedProjects} projects completed
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
          <div className="flex flex-wrap gap-2">
            {architect.services.map((service, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {architect.contact.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {architect.contact.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="w-4 h-4 mr-2" />
                {architect.contact.website}
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Perfect Architect
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Connect with top-rated architects who specialize in bringing your dream home to life. 
              Browse our curated network of professionals with proven track records.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Architects */}
        {featuredArchitects.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Award className="w-6 h-6 text-gold-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Architects</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredArchitects.map(architect => (
                <ArchitectCard key={architect.id} architect={architect} />
              ))}
            </div>
          </div>
        )}

        {/* All Architects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {featuredArchitects.length > 0 ? 'More Architects' : 'All Architects'}
            </h2>
            <div className="text-sm text-gray-600">
              Showing {filteredArchitects.length} architect{filteredArchitects.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {otherArchitects.map(architect => (
              <ArchitectCard key={architect.id} architect={architect} />
            ))}
          </div>
        </div>

        {filteredArchitects.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No architects found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Are You an Architect?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our network of professionals and connect with homeowners looking for expert architectural services.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Join Our Network
          </button>
        </div>
      </div>
    </div>
  );
}
