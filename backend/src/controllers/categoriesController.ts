import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendPaginatedResponse, getPaginationParams } from '../utils/response';
import { logger } from '../utils/logger';
import { User } from '../types/index.js';
// Type extensions are automatically loaded from types/express.d.ts

interface CreateCategoryRequest {
  name: string;
  description?: string;
  slug?: string;
}

interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, offset } = getPaginationParams(
    req.query.page as string,
    req.query.limit as string
  );

  // Mock data for now - replace with actual database queries once schema is set up
  const mockCategories = [
    {
      id: 'modern',
      name: 'Modern',
      slug: 'modern',
      description: 'Contemporary modern home designs with clean lines and open spaces',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'traditional',
      name: 'Traditional',
      slug: 'traditional',
      description: 'Classic and timeless home designs with traditional architecture',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'contemporary',
      name: 'Contemporary',
      slug: 'contemporary',
      description: 'Stylish contemporary designs with luxury features',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'craftsman',
      name: 'Craftsman',
      slug: 'craftsman',
      description: 'Charming craftsman style homes with detailed woodwork',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'farmhouse',
      name: 'Farmhouse',
      slug: 'farmhouse',
      description: 'Rustic farmhouse designs with country charm',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Apply pagination
  const startIndex = offset;
  const endIndex = offset + limit;
  const paginatedCategories = mockCategories.slice(startIndex, endIndex);

  logger.info(`Fetched ${paginatedCategories.length} categories (page ${page}, limit ${limit})`);

  sendPaginatedResponse(
    res,
    paginatedCategories,
    { page, limit, total: mockCategories.length },
    'Categories retrieved successfully'
  );
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Mock data for now - replace with actual database query once schema is set up
  const mockCategories = [
    {
      id: 'modern',
      name: 'Modern',
      slug: 'modern',
      description: 'Contemporary modern home designs with clean lines and open spaces',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      plans: [
        { id: '1', title: 'Modern Farmhouse', price: 89999, bedrooms: 4, bathrooms: 3.5, square_feet: 2500, images: ['/api/placeholder/400/300'] }
      ]
    },
    {
      id: 'traditional',
      name: 'Traditional',
      slug: 'traditional',
      description: 'Classic and timeless home designs with traditional architecture',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      plans: [
        { id: '2', title: 'Traditional Colonial', price: 75999, bedrooms: 3, bathrooms: 2.5, square_feet: 2200, images: ['/api/placeholder/400/300'] }
      ]
    },
    {
      id: 'contemporary',
      name: 'Contemporary',
      slug: 'contemporary',
      description: 'Stylish contemporary designs with luxury features',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      plans: [
        { id: '3', title: 'Contemporary Villa', price: 125999, bedrooms: 5, bathrooms: 4.5, square_feet: 3500, images: ['/api/placeholder/400/300'] }
      ]
    },
    {
      id: 'craftsman',
      name: 'Craftsman',
      slug: 'craftsman',
      description: 'Charming craftsman style homes with detailed woodwork',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      plans: [
        { id: '4', title: 'Craftsman Bungalow', price: 65999, bedrooms: 2, bathrooms: 2, square_feet: 1800, images: ['/api/placeholder/400/300'] }
      ]
    }
  ];

  const category = mockCategories.find(c => c.id === id || c.slug === id);

  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  logger.info(`Retrieved category: ${category.name} (ID: ${id})`);

  sendSuccess(res, { category }, 'Category retrieved successfully');
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const { data: category, error } = await supabase
    .from('categories')
    .select(`
      *,
      plans!inner (
        id, title, price, bedrooms, bathrooms, square_feet, images,
        plan_reviews (rating)
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('plans.is_active', true)
    .single();

  if (error || !category) {
    throw new ApiError('Category not found', 404);
  }

  // Calculate average ratings for plans
  const plansWithRatings = category.plans?.map((plan: any) => ({
    ...plan,
    average_rating: plan.plan_reviews?.length > 0 
      ? plan.plan_reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / plan.plan_reviews.length
      : 0,
    review_count: plan.plan_reviews?.length || 0,
  })) || [];

  sendSuccess(res, { 
    category: {
      ...category,
      plans: plansWithRatings
    }
  }, 'Category retrieved successfully');
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, slug }: CreateCategoryRequest = req.body;
  
  // Generate slug if not provided
  const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Check if slug already exists
  const { data: existingCategory } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (existingCategory) {
    throw new ApiError('A category with this slug already exists', 400);
  }

  const { data: category, error } = await supabase
    .from('categories')
    .insert({
      name,
      description,
      slug: categorySlug,
      is_active: true,
    })
    .select('*')
    .single();

  if (error) {
    logger.error('Category creation failed:', error);
    throw new ApiError('Failed to create category', 500);
  }

  logger.info(`Category created: ${category.name} by user ${(req.user as User).email}`);

  sendSuccess(res, { category }, 'Category created successfully', 201);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: UpdateCategoryRequest = req.body;

  // Check if category exists
  const { data: existingCategory, error: fetchError } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !existingCategory) {
    throw new ApiError('Category not found', 404);
  }

  // If slug is being updated, check for conflicts
  if (updateData.slug && updateData.slug !== existingCategory.slug) {
    const { data: conflictingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', updateData.slug)
      .neq('id', id)
      .single();

    if (conflictingCategory) {
      throw new ApiError('A category with this slug already exists', 400);
    }
  }

  const { data: category, error } = await supabase
    .from('categories')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    logger.error('Category update failed:', error);
    throw new ApiError('Failed to update category', 500);
  }

  logger.info(`Category updated: ${category.name} by user ${(req.user as User).email}`);

  sendSuccess(res, { category }, 'Category updated successfully');
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if category exists
  const { data: existingCategory, error: fetchError } = await supabase
    .from('categories')
    .select('name')
    .eq('id', id)
    .single();

  if (fetchError || !existingCategory) {
    throw new ApiError('Category not found', 404);
  }

  // Check if category has any plans
  const { data: plans, error: plansError } = await supabase
    .from('plans')
    .select('id')
    .eq('category_id', id)
    .eq('is_active', true)
    .limit(1);

  if (plansError) {
    logger.error('Failed to check category plans:', plansError);
    throw new ApiError('Failed to check category usage', 500);
  }

  if (plans && plans.length > 0) {
    throw new ApiError('Cannot delete category that has active plans', 400);
  }

  // Soft delete (set is_active to false)
  const { error } = await supabase
    .from('categories')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    logger.error('Category deletion failed:', error);
    throw new ApiError('Failed to delete category', 500);
  }

  logger.info(`Category deleted: ${existingCategory.name} by user ${(req.user as User).email}`);

  sendSuccess(res, null, 'Category deleted successfully');
});

export const getCategoryStats = asyncHandler(async (req: Request, res: Response) => {
  const { data: stats, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      plans!inner (id)
    `)
    .eq('is_active', true)
    .eq('plans.is_active', true);

  if (error) {
    logger.error('Failed to fetch category stats:', error);
    throw new ApiError('Failed to fetch category statistics', 500);
  }

  const categoryStats = stats?.map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    plan_count: Array.isArray(category.plans) ? category.plans.length : 0,
  })) || [];

  sendSuccess(res, { categories: categoryStats }, 'Category statistics retrieved successfully');
});
