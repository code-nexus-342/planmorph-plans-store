// ========== src/app/plans/[slug]/page.tsx ==========
import { notFound } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { Plan } from '../../../types';
import PlanDetailsClient from './PlanDetailsClient';

// Fetch plan data from API
async function getPlan(slug: string): Promise<Plan | null> {
  try {
    const response = await apiClient.get<Plan>(`/plans/${slug}`);
    return response.data ?? null;
  } catch (error) {
    console.error('Error fetching plan:', error);
    return null;
  }
}

// Fetch all plans for static generation
async function getAllPlans(): Promise<Plan[]> {
  try {
    // Use limit of 100 to comply with API validation
    const response = await apiClient.get<{ data: Plan[] }>('/plans?limit=100');
    
    // Explicit null check
    if (!response.data) {
      console.warn('Response data is undefined');
      return [];
    }
    
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching plans for static generation:', error);
    // During build time, the API might not be available
    // Return empty array to allow build to continue
    return [];
  }
}

// Generate static params for all available plans (optional for SSR)
export async function generateStaticParams() {
  try {
    const plans = await getAllPlans();
    
    return plans.map((plan) => ({
      slug: plan.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array for dynamic rendering
    return [];
  }
}

// Metadata generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = await getPlan(slug);
  
  if (!plan) {
    return {
      title: 'Plan Not Found',
      description: 'The requested plan could not be found.',
    };
  }

  return {
    title: `${plan.title} - House Plans`,
    description: plan.description,
    openGraph: {
      title: plan.title,
      description: plan.description,
      images: plan.images?.[0] ? [{ url: plan.images[0] }] : [],
    },
  };
}

export default async function PlanDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const plan = await getPlan(slug);
    
    if (!plan) {
      notFound();
    }

    return <PlanDetailsClient plan={plan} />;
  } catch (error) {
    console.error('Error in PlanDetailsPage:', error);
    
    // Return a fallback page if there's an error
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Temporarily Unavailable</h1>
          <p className="text-gray-600 mb-6">We're having trouble loading this plan. Please try again later.</p>
          <a 
            href="/plans" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Back to Plans
          </a>
        </div>
      </div>
    );
  }
}
