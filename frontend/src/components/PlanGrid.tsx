// =====src/components/PlanGrid.tsx 
import PlanCard from "./PlanCard2";
import { Plan } from "../types";

const mockPlans: Plan[] = [
  {
    id: "1",
    title: "Modern Minimalist Villa",
    description: "A stunning modern villa with clean lines and open spaces",
    price: 185000,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 2450,
    category_id: "1",
    features: ["Open floor plan", "Modern kitchen", "Master suite"],
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"],
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Luxury Family Estate",
    description: "Spacious family home with luxury amenities",
    price: 325000,
    bedrooms: 5,
    bathrooms: 4,
    square_feet: 4200,
    category_id: "1",
    features: ["Grand foyer", "Gourmet kitchen", "Master wing"],
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"],
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Cozy Cottage Retreat",
    description: "Charming cottage perfect for a peaceful retreat",
    price: 145000,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1800,
    category_id: "2",
    features: ["Fireplace", "Country kitchen", "Garden views"],
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"],
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Contemporary Urban Loft",
    description: "Modern loft in the heart of the city",
    price: 275000,
    bedrooms: 3,
    bathrooms: 3,
    square_feet: 2800,
    category_id: "3",
    features: ["City views", "Industrial design", "Rooftop access"],
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"],
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Traditional Colonial",
    description: "Classic colonial home with timeless appeal",
    price: 295000,
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 3200,
    category_id: "1",
    features: ["Traditional layout", "Formal dining", "Two-car garage"],
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"],
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Scandinavian Bungalow",
    description: "Nordic-inspired design with natural materials",
    price: 195000,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 2100,
    category_id: "2",
    features: ["Natural light", "Minimalist design", "Energy efficient"],
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"],
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function PlanGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {mockPlans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}