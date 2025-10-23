import { Request, Response } from 'express';
import { db } from '../services/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendPaginatedResponse, getPaginationParams } from '../utils/response';
import { logger } from '../utils/logger';
import { Plan, User } from '../types';
// Type extensions are automatically loaded from types/express.d.ts

interface CreatePlanRequest {
  title: string;
  description: string;
  seo_slug?: string;
  category_id: string;
  subcategory_id?: string;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  stories?: number;
  garage_spaces?: number;
  lot_width?: number;
  lot_depth?: number;
  house_width?: number;
  house_depth?: number;
  price_tier?: 'free' | 'standard' | 'premium' | 'exclusive';
  base_price?: number;
  is_featured?: boolean;
  is_popular?: boolean;
  thumbnail_url?: string;
  main_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  search_keywords?: string[];
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

  try {
    // Get total count for pagination
    const countResult = await db.query(
      'SELECT COUNT(*) FROM house_plans WHERE is_available = true'
    );
    const totalCount = parseInt(countResult.rows[0].count);

    // Get plans with pagination
    const plansResult = await db.query(
      `SELECT * FROM house_plans 
       WHERE is_available = true 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const plans = plansResult.rows;

    if (!plans || plans.length === 0) {
      return sendPaginatedResponse(
        res,
        [],
        { page, limit, total: 0 },
        'No plans available'
      );
    }

    // Get category details for all plans
    const categoryIds = plans.map(p => p.category_id).filter(Boolean);
    let categories: any[] = [];
    
    if (categoryIds.length > 0) {
      const categoriesResult = await db.query(
        'SELECT id, name, slug FROM categories WHERE id = ANY($1)',
        [categoryIds]
      );
      categories = categoriesResult.rows;
    }

    // Transform plans to include category data and defaults
    const plansWithDetails = plans.map(plan => ({
      ...plan,
      categories: categories.find(c => c.id === plan.category_id) || null,
      average_rating: 0, // TODO: Calculate from reviews
      review_count: 0, // TODO: Calculate from reviews
    }));

    logger.info(`Fetched ${plansWithDetails.length} plans (page ${page}, limit ${limit})`);

    return sendPaginatedResponse(
      res,
      plansWithDetails,
      { page, limit, total: totalCount },
      'Plans retrieved successfully'
    );
  } catch (error) {
    logger.error('Error in getAllPlans:', error);
    throw new ApiError('Failed to fetch plans', 500);
  }
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

  try {
    // Build WHERE conditions
    let whereConditions = ['is_available = true'];
    let queryParams: any[] = [];
    let paramCount = 1;

    // Apply text search filter
    if (q) {
      whereConditions.push(`(title ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      queryParams.push(`%${q}%`);
      paramCount++;
    }

    // Apply category filter
    if (category) {
      whereConditions.push(`category_id = $${paramCount}`);
      queryParams.push(category);
      paramCount++;
    }

    // Apply price range filters
    if (min_price) {
      whereConditions.push(`base_price >= $${paramCount}`);
      queryParams.push(parseFloat(min_price));
      paramCount++;
    }
    if (max_price) {
      whereConditions.push(`base_price <= $${paramCount}`);
      queryParams.push(parseFloat(max_price));
      paramCount++;
    }

    // Apply bedroom filter
    if (bedrooms) {
      whereConditions.push(`bedrooms = $${paramCount}`);
      queryParams.push(parseInt(bedrooms));
      paramCount++;
    }

    // Apply bathroom filter
    if (bathrooms) {
      whereConditions.push(`bathrooms = $${paramCount}`);
      queryParams.push(parseFloat(bathrooms));
      paramCount++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Determine sort order
    let orderBy = 'created_at DESC';
    if (sort && ['created_at', 'updated_at', 'title', 'base_price', 'bedrooms', 'bathrooms', 'square_footage'].includes(sort)) {
      orderBy = `${sort} DESC`;
    }

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM house_plans WHERE ${whereClause}`,
      queryParams
    );
    const totalCount = parseInt(countResult.rows[0].count);

    // Get plans with pagination
    const plansResult = await db.query(
      `SELECT * FROM house_plans 
       WHERE ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...queryParams, limitNum, offset]
    );

    const plans = plansResult.rows;

    if (!plans || plans.length === 0) {
      return sendPaginatedResponse(
        res,
        [],
        { page: pageNum, limit: limitNum, total: 0 },
        'No plans found matching your criteria'
      );
    }

    // Get category details for found plans
    const categoryIds = plans.map(p => p.category_id).filter(Boolean);
    let categories: any[] = [];
    
    if (categoryIds.length > 0) {
      const categoriesResult = await db.query(
        'SELECT id, name, slug FROM categories WHERE id = ANY($1)',
        [categoryIds]
      );
      categories = categoriesResult.rows;
    }

    // Transform plans to include category data
    const plansWithDetails = plans.map(plan => ({
      ...plan,
      categories: categories.find(c => c.id === plan.category_id) || null,
      average_rating: 0, // TODO: Calculate from reviews
      review_count: 0, // TODO: Calculate from reviews
    }));

    logger.info(`Search found ${plansWithDetails.length} plans with filters:`, req.query);

    return sendPaginatedResponse(
      res,
      plansWithDetails,
      { page: pageNum, limit: limitNum, total: totalCount },
      'Plans found successfully'
    );
  } catch (error) {
    logger.error('Error in searchPlans:', error);
    throw new ApiError('Failed to search plans', 500);
  }
});

export const getPlanById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Get the plan by ID
    const planResult = await db.query(
      'SELECT * FROM house_plans WHERE id = $1 AND is_available = true',
      [id]
    );

    if (planResult.rows.length === 0) {
      throw new ApiError('Plan not found', 404);
    }

    const plan = planResult.rows[0];

    // Get category details
    let categoryData = null;
    if (plan.category_id) {
      const categoryResult = await db.query(
        'SELECT id, name, slug, description FROM categories WHERE id = $1',
        [plan.category_id]
      );
      
      if (categoryResult.rows.length > 0) {
        categoryData = categoryResult.rows[0];
      }
    }

    // Get plan images
    const imagesResult = await db.query(
      'SELECT * FROM plan_images WHERE plan_id = $1 ORDER BY sort_order ASC',
      [id]
    );
    const images = imagesResult.rows;

    // Get plan files
    const filesResult = await db.query(
      'SELECT * FROM plan_files WHERE plan_id = $1 ORDER BY file_type ASC',
      [id]
    );
    const files = filesResult.rows;

    // TODO: Get reviews when reviews table is implemented
    const planReviews: any[] = [];
    
    // Combine all data
    const planWithDetails = {
      ...plan,
      categories: categoryData,
      images: images || [],
      files: files || [],
      plan_reviews: planReviews,
      average_rating: 0, // TODO: Calculate from reviews
      review_count: 0, // TODO: Calculate from reviews
    };

    logger.info(`Retrieved plan: ${plan.title} (ID: ${id})`);

    sendSuccess(res, { plan: planWithDetails }, 'Plan retrieved successfully');
  } catch (error) {
    logger.error('Error in getPlanById:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch plan', 500);
  }
});

// Plan creation, update, and deletion are handled by external admin application
// This application only provides read-only access to plans

export const getFeaturedPlans = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Get featured plans from house_plans table
    const plansResult = await db.query(
      `SELECT * FROM house_plans 
       WHERE is_available = true AND is_featured = true 
       ORDER BY created_at DESC 
       LIMIT 8`
    );

    const plans = plansResult.rows;

    // If no featured plans found, return empty array
    if (!plans || plans.length === 0) {
      return sendSuccess(res, { plans: [] }, 'No featured plans available');
    }

    // Get category details if needed
    const categoryIds = plans.map((p: any) => p.category_id).filter(Boolean);
    let categories: any[] = [];
    
    if (categoryIds.length > 0) {
      const categoriesResult = await db.query(
        'SELECT id, name, slug FROM categories WHERE id = ANY($1)',
        [categoryIds]
      );
      categories = categoriesResult.rows;
    }

    // Transform plans to include category data
    const plansWithDetails = plans.map((plan: any) => ({
      ...plan,
      categories: categories.find(c => c.id === plan.category_id) || null,
      average_rating: 0, // Default rating
      review_count: 0, // Default review count
    }));

    return sendSuccess(res, { plans: plansWithDetails }, 'Featured plans retrieved successfully');
  } catch (error) {
    logger.error('Error in getFeaturedPlans:', error);
    throw new ApiError('Failed to fetch featured plans', 500);
  }
});