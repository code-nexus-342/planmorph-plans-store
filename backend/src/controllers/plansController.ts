import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendPaginatedResponse, getPaginationParams } from '../utils/response';
import { logger } from '../utils/logger';
import { Plan, User } from '../types';
// Type extensions are automatically loaded from types/express.d.ts

interface CreatePlanRequest {
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  category_id: string;
  architect_id?: string;
  features?: string[];
  images?: string[];
}

interface UpdatePlanRequest extends Partial<CreatePlanRequest> {}

interface SearchQuery {
  q?: string;
  category?: string;
  min_price?: string;
  max_price?: string;
  bedrooms?: string;
  bathrooms?: string;
  architect?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

export const getAllPlans = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, offset } = getPaginationParams(
    req.query.page as string,
    req.query.limit as string
  );

  // Mock data for now - replace with actual database queries once schema is set up
  const mockPlans = [
    {
      id: '1',
      title: 'Modern Farmhouse',
      description: 'A beautiful modern farmhouse with open concept living',
      price: 89999,
      bedrooms: 4,
      bathrooms: 3.5,
      square_feet: 2500,
      category_id: 'modern',
      architect_id: 'arch1',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      features: ['Open concept', 'Master suite', 'Garage'],
      images: ['/api/placeholder/400/300'],
      categories: { id: 'modern', name: 'Modern', slug: 'modern' },
      architects: { id: 'arch1', first_name: 'John', last_name: 'Doe', company_name: 'Doe Architecture' },
      plan_reviews: [{ rating: 5 }, { rating: 4 }],
      average_rating: 4.5,
      review_count: 2
    },
    {
      id: '2',
      title: 'Traditional Colonial',
      description: 'Classic colonial design with timeless appeal',
      price: 75999,
      bedrooms: 3,
      bathrooms: 2.5,
      square_feet: 2200,
      category_id: 'traditional',
      architect_id: 'arch2',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      features: ['Formal dining', 'Two-story', 'Fireplace'],
      images: ['/api/placeholder/400/300'],
      categories: { id: 'traditional', name: 'Traditional', slug: 'traditional' },
      architects: { id: 'arch2', first_name: 'Jane', last_name: 'Smith', company_name: 'Smith Designs' },
      plan_reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }],
      average_rating: 4.3,
      review_count: 3
    },
    {
      id: '3',
      title: 'Contemporary Villa',
      description: 'Stunning contemporary design with luxury features',
      price: 125999,
      bedrooms: 5,
      bathrooms: 4.5,
      square_feet: 3500,
      category_id: 'contemporary',
      architect_id: 'arch3',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      features: ['Pool ready', 'Wine cellar', 'Home theater'],
      images: ['/api/placeholder/400/300'],
      categories: { id: 'contemporary', name: 'Contemporary', slug: 'contemporary' },
      architects: { id: 'arch3', first_name: 'Mike', last_name: 'Johnson', company_name: 'Johnson Architects' },
      plan_reviews: [{ rating: 5 }, { rating: 5 }],
      average_rating: 5.0,
      review_count: 2
    }
  ];

  // Apply pagination to mock data
  const startIndex = offset;
  const endIndex = offset + limit;
  const paginatedPlans = mockPlans.slice(startIndex, endIndex);

  logger.info(`Fetched ${paginatedPlans.length} plans (page ${page}, limit ${limit})`);

  sendPaginatedResponse(
    res,
    paginatedPlans,
    { page, limit, total: mockPlans.length },
    'Plans retrieved successfully'
  );
});

export const searchPlans = asyncHandler(async (req: Request, res: Response) => {
  const {
    q,
    category,
    min_price,
    max_price,
    bedrooms,
    bathrooms,
    architect,
    sort,
    page,
    limit
  }: SearchQuery = req.query;

  const { page: pageNum, limit: limitNum, offset } = getPaginationParams(page, limit);

  // Mock data for now - same as getAllPlans but with filtering
  const allMockPlans = [
    {
      id: '1',
      title: 'Modern Farmhouse',
      description: 'A beautiful modern farmhouse with open concept living',
      price: 89999,
      bedrooms: 4,
      bathrooms: 3.5,
      square_feet: 2500,
      category_id: 'modern',
      architect_id: 'arch1',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      features: ['Open concept', 'Master suite', 'Garage'],
      images: ['/api/placeholder/400/300'],
      categories: { id: 'modern', name: 'Modern', slug: 'modern' },
      architects: { id: 'arch1', first_name: 'John', last_name: 'Doe', company_name: 'Doe Architecture' },
      plan_reviews: [{ rating: 5 }, { rating: 4 }],
      average_rating: 4.5,
      review_count: 2
    },
    {
      id: '2',
      title: 'Traditional Colonial',
      description: 'Classic colonial design with timeless appeal',
      price: 75999,
      bedrooms: 3,
      bathrooms: 2.5,
      square_feet: 2200,
      category_id: 'traditional',
      architect_id: 'arch2',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      features: ['Formal dining', 'Two-story', 'Fireplace'],
      images: ['/api/placeholder/400/300'],
      categories: { id: 'traditional', name: 'Traditional', slug: 'traditional' },
      architects: { id: 'arch2', first_name: 'Jane', last_name: 'Smith', company_name: 'Smith Designs' },
      plan_reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }],
      average_rating: 4.3,
      review_count: 3
    },
    {
      id: '3',
      title: 'Contemporary Villa',
      description: 'Stunning contemporary design with luxury features',
      price: 125999,
      bedrooms: 5,
      bathrooms: 4.5,
      square_feet: 3500,
      category_id: 'contemporary',
      architect_id: 'arch3',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      features: ['Pool ready', 'Wine cellar', 'Home theater'],
      images: ['/api/placeholder/400/300'],
      categories: { id: 'contemporary', name: 'Contemporary', slug: 'contemporary' },
      architects: { id: 'arch3', first_name: 'Mike', last_name: 'Johnson', company_name: 'Johnson Architects' },
      plan_reviews: [{ rating: 5 }, { rating: 5 }],
      average_rating: 5.0,
      review_count: 2
    },
    {
      id: '4',
      title: 'Craftsman Bungalow',
      description: 'Charming craftsman style with detailed woodwork',
      price: 65999,
      bedrooms: 2,
      bathrooms: 2,
      square_feet: 1800,
      category_id: 'craftsman',
      architect_id: 'arch1',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      features: ['Front porch', 'Built-ins', 'Hardwood floors'],
      images: ['/api/placeholder/400/300'],
      categories: { id: 'craftsman', name: 'Craftsman', slug: 'craftsman' },
      architects: { id: 'arch1', first_name: 'John', last_name: 'Doe', company_name: 'Doe Architecture' },
      plan_reviews: [{ rating: 4 }],
      average_rating: 4.0,
      review_count: 1
    }
  ];

  // Apply filters
  let filteredPlans = allMockPlans.filter(plan => {
    // Text search
    if (q) {
      const searchTerm = q.toLowerCase();
      if (!plan.title.toLowerCase().includes(searchTerm) && 
          !plan.description.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }

    // Category filter
    if (category && plan.category_id !== category) {
      return false;
    }

    // Price range
    if (min_price && plan.price < parseFloat(min_price)) {
      return false;
    }
    if (max_price && plan.price > parseFloat(max_price)) {
      return false;
    }

    // Bedrooms filter
    if (bedrooms && plan.bedrooms !== parseInt(bedrooms)) {
      return false;
    }

    // Bathrooms filter
    if (bathrooms && plan.bathrooms !== parseFloat(bathrooms)) {
      return false;
    }

    // Architect filter
    if (architect && plan.architect_id !== architect) {
      return false;
    }

    return true;
  });

  // Apply sorting
  if (sort) {
    const validSortFields = ['created_at', 'updated_at', 'title', 'price', 'bedrooms', 'bathrooms', 'square_feet'];
    if (validSortFields.includes(sort)) {
      filteredPlans.sort((a, b) => {
        const aVal = (a as any)[sort];
        const bVal = (b as any)[sort];
        if (typeof aVal === 'string') {
          return bVal.localeCompare(aVal); // Descending for strings
        }
        return bVal - aVal; // Descending for numbers
      });
    }
  }

  // Apply pagination
  const startIndex = offset;
  const endIndex = offset + limitNum;
  const paginatedPlans = filteredPlans.slice(startIndex, endIndex);

  logger.info(`Search returned ${paginatedPlans.length} plans (filters: ${JSON.stringify(req.query)})`);

  sendPaginatedResponse(
    res,
    paginatedPlans,
    { page: pageNum, limit: limitNum, total: filteredPlans.length },
    'Search results retrieved successfully'
  );
});

export const getPlanById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Mock data for now - replace with actual database query once schema is set up
  const mockPlans = [
    {
      id: '1',
      title: 'Modern Farmhouse',
      description: 'A beautiful modern farmhouse with open concept living. This stunning design features clean lines, large windows, and a perfect blend of rustic charm and contemporary style.',
      price: 89999,
      bedrooms: 4,
      bathrooms: 3.5,
      square_feet: 2500,
      category_id: 'modern',
      architect_id: 'arch1',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      features: ['Open concept', 'Master suite', 'Garage', 'Covered porch', 'Walk-in pantry'],
      images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
      categories: { id: 'modern', name: 'Modern', slug: 'modern', description: 'Contemporary modern designs' },
      architects: { id: 'arch1', first_name: 'John', last_name: 'Doe', company_name: 'Doe Architecture', bio: 'Award-winning architect with 15 years of experience', email: 'john@doearch.com' },
      plan_reviews: [
        { id: '1', rating: 5, comment: 'Absolutely love this design!', created_at: new Date().toISOString(), users: { first_name: 'Sarah', last_name: 'Johnson' } },
        { id: '2', rating: 4, comment: 'Great layout and flow', created_at: new Date().toISOString(), users: { first_name: 'Mike', last_name: 'Smith' } }
      ],
      average_rating: 4.5,
      review_count: 2
    },
    {
      id: '2',
      title: 'Traditional Colonial',
      description: 'Classic colonial design with timeless appeal. Features traditional architecture with modern amenities.',
      price: 75999,
      bedrooms: 3,
      bathrooms: 2.5,
      square_feet: 2200,
      category_id: 'traditional',
      architect_id: 'arch2',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      features: ['Formal dining', 'Two-story', 'Fireplace', 'Bay windows'],
      images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
      categories: { id: 'traditional', name: 'Traditional', slug: 'traditional', description: 'Classic traditional designs' },
      architects: { id: 'arch2', first_name: 'Jane', last_name: 'Smith', company_name: 'Smith Designs', bio: 'Specialist in traditional architecture', email: 'jane@smithdesigns.com' },
      plan_reviews: [
        { id: '3', rating: 4, comment: 'Beautiful traditional design', created_at: new Date().toISOString(), users: { first_name: 'Tom', last_name: 'Wilson' } }
      ],
      average_rating: 4.0,
      review_count: 1
    }
  ];

  const plan = mockPlans.find(p => p.id === id);

  if (!plan) {
    throw new ApiError('Plan not found', 404);
  }

  logger.info(`Retrieved plan: ${plan.title} (ID: ${id})`);

  sendSuccess(res, { plan }, 'Plan retrieved successfully');
});

export const createPlan = asyncHandler(async (req: Request, res: Response) => {
  const planData: CreatePlanRequest = req.body;
  const createdBy = (req.user as User).id;

  // Verify category exists
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('id', planData.category_id)
    .single();

  if (categoryError || !category) {
    throw new ApiError('Invalid category', 400);
  }

  // Verify architect exists if provided
  if (planData.architect_id) {
    const { data: architect, error: architectError } = await supabase
      .from('architects')
      .select('id')
      .eq('id', planData.architect_id)
      .single();

    if (architectError || !architect) {
      throw new ApiError('Invalid architect', 400);
    }
  }

  const { data: plan, error } = await supabase
    .from('plans')
    .insert({
      ...planData,
      created_by: createdBy,
      is_active: true,
    })
    .select(`
      *,
      categories (id, name, slug),
      architects (id, first_name, last_name, company_name)
    `)
    .single();

  if (error) {
    logger.error('Plan creation failed:', error);
    throw new ApiError('Failed to create plan', 500);
  }

  logger.info(`Plan created: ${plan.title} by user ${(req.user as User).email}`);

  sendSuccess(res, { plan }, 'Plan created successfully', 201);
});

export const updatePlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: UpdatePlanRequest = req.body;
  const userId = (req.user as User).id;
  const userRole = (req.user as User).role;

  // Get existing plan
  const { data: existingPlan, error: fetchError } = await supabase
    .from('plans')
    .select('created_by')
    .eq('id', id)
    .single();

  if (fetchError || !existingPlan) {
    throw new ApiError('Plan not found', 404);
  }

  // Check permissions (owner or admin)
  if (existingPlan.created_by !== userId && userRole !== 'admin') {
    throw new ApiError('Not authorized to update this plan', 403);
  }

  // Verify category if being updated
  if (updateData.category_id) {
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', updateData.category_id)
      .single();

    if (categoryError || !category) {
      throw new ApiError('Invalid category', 400);
    }
  }

  // Update plan
  const { data: plan, error } = await supabase
    .from('plans')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(`
      *,
      categories (id, name, slug),
      architects (id, first_name, last_name, company_name)
    `)
    .single();

  if (error) {
    logger.error('Plan update failed:', error);
    throw new ApiError('Failed to update plan', 500);
  }

  logger.info(`Plan updated: ${plan.title} by user ${(req.user as User).email}`);

  sendSuccess(res, { plan }, 'Plan updated successfully');
});

export const deletePlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as User).id;
  const userRole = (req.user as User).role;

  // Get existing plan
  const { data: existingPlan, error: fetchError } = await supabase
    .from('plans')
    .select('created_by, title')
    .eq('id', id)
    .single();

  if (fetchError || !existingPlan) {
    throw new ApiError('Plan not found', 404);
  }

  // Check permissions (owner or admin)
  if (existingPlan.created_by !== userId && userRole !== 'admin') {
    throw new ApiError('Not authorized to delete this plan', 403);
  }

  // Soft delete (set is_active to false)
  const { error } = await supabase
    .from('plans')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    logger.error('Plan deletion failed:', error);
    throw new ApiError('Failed to delete plan', 500);
  }

  logger.info(`Plan deleted: ${existingPlan.title} by user ${(req.user as User).email}`);

  sendSuccess(res, null, 'Plan deleted successfully');
});

export const getFeaturedPlans = asyncHandler(async (req: Request, res: Response) => {
  const { data: plans, error } = await supabase
    .from('plans')
    .select(`
      *,
      categories (id, name, slug),
      architects (id, first_name, last_name, company_name),
      plan_reviews (rating)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    logger.error('Failed to fetch featured plans:', error);
    throw new ApiError('Failed to fetch featured plans', 500);
  }

  // Calculate average ratings
  const plansWithRatings = plans?.map(plan => ({
    ...plan,
    average_rating: plan.plan_reviews?.length > 0 
      ? plan.plan_reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / plan.plan_reviews.length
      : 0,
    review_count: plan.plan_reviews?.length || 0,
  })) || [];

  sendSuccess(res, { plans: plansWithRatings }, 'Featured plans retrieved successfully');
});
