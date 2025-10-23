import { Request, Response } from 'express';
import { query } from '../config/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendPaginatedResponse, getPaginationParams } from '../utils/response';
import { logger } from '../utils/logger';
import { User } from '../types/index.js';
// Type extensions are automatically loaded from types/express.d.ts

interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
}

interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, offset } = getPaginationParams(
    req.query.page as string,
    req.query.limit as string
  );

  try {
    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) FROM categories WHERE is_active = true'
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated categories
    const categoriesResult = await query(
      `SELECT id, name, slug, description, is_active, created_at, updated_at 
       FROM categories 
       WHERE is_active = true 
       ORDER BY name ASC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const categories = categoriesResult.rows;

    logger.info(`Fetched ${categories.length} categories (page ${page}, limit ${limit})`);

    sendPaginatedResponse(
      res,
      categories,
      { page, limit, total },
      'Categories retrieved successfully'
    );
  } catch (error) {
    logger.error('Error fetching categories:', error);
    throw error;
  }
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Try to find category by ID or slug
    const categoryResult = await query(
      `SELECT c.id, c.name, c.slug, c.description, c.is_active, c.created_at, c.updated_at,
              COUNT(hp.id) as plan_count
       FROM categories c
       LEFT JOIN house_plans hp ON c.id = hp.category_id AND hp.is_active = true
       WHERE (c.id = $1 OR c.slug = $1) AND c.is_active = true
       GROUP BY c.id, c.name, c.slug, c.description, c.is_active, c.created_at, c.updated_at`,
      [id]
    );

    if (categoryResult.rows.length === 0) {
      throw new ApiError('Category not found', 404);
    }

    const category = categoryResult.rows[0];

    // Get sample plans for this category
    const plansResult = await query(
      `SELECT id, title, price, bedrooms, bathrooms, square_feet, images
       FROM house_plans 
       WHERE category_id = $1 AND is_active = true 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [category.id]
    );

    const categoryWithPlans = {
      ...category,
      plan_count: parseInt(category.plan_count),
      plans: plansResult.rows
    };

    logger.info(`Retrieved category: ${category.name} (ID: ${id})`);

    sendSuccess(res, { category: categoryWithPlans }, 'Category retrieved successfully');
  } catch (error) {
    logger.error('Error fetching category:', error);
    throw error;
  }
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const categoryResult = await query(
      `SELECT c.id, c.name, c.slug, c.description, c.is_active, c.created_at, c.updated_at,
              COUNT(hp.id) as plan_count
       FROM categories c
       LEFT JOIN house_plans hp ON c.id = hp.category_id AND hp.is_active = true
       WHERE c.slug = $1 AND c.is_active = true
       GROUP BY c.id, c.name, c.slug, c.description, c.is_active, c.created_at, c.updated_at`,
      [slug]
    );

    if (categoryResult.rows.length === 0) {
      throw new ApiError('Category not found', 404);
    }

    const category = categoryResult.rows[0];

    // Get sample plans for this category
    const plansResult = await query(
      `SELECT id, title, price, bedrooms, bathrooms, square_feet, images
       FROM house_plans 
       WHERE category_id = $1 AND is_active = true 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [category.id]
    );

    const categoryWithPlans = {
      ...category,
      plan_count: parseInt(category.plan_count),
      plans: plansResult.rows
    };

    logger.info(`Retrieved category by slug: ${category.name} (slug: ${slug})`);

    sendSuccess(res, { category: categoryWithPlans }, 'Category retrieved successfully');
  } catch (error) {
    logger.error('Error fetching category by slug:', error);
    throw error;
  }
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User;
  const { name, slug, description }: CreateCategoryRequest = req.body;

  if (!name || !slug) {
    throw new ApiError('Name and slug are required', 400);
  }

  try {
    // Check if category with same name or slug exists
    const existingResult = await query(
      'SELECT id FROM categories WHERE name = $1 OR slug = $2',
      [name, slug]
    );

    if (existingResult.rows.length > 0) {
      throw new ApiError('Category with this name or slug already exists', 409);
    }

    // Create the category
    const categoryResult = await query(
      `INSERT INTO categories (name, slug, description, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, true, NOW(), NOW())
       RETURNING id, name, slug, description, is_active, created_at, updated_at`,
      [name, slug, description || '']
    );

    const category = categoryResult.rows[0];

    logger.info(`Category created: ${category.name} (ID: ${category.id}) by user ${user.id}`);

    sendSuccess(res, { category }, 'Category created successfully', 201);
  } catch (error) {
    logger.error('Error creating category:', error);
    throw error;
  }
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User;
  const { id } = req.params;
  const { name, slug, description }: UpdateCategoryRequest = req.body;

  try {
    // Check if category exists
    const existingResult = await query(
      'SELECT id, name FROM categories WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      throw new ApiError('Category not found', 404);
    }

    // Check for conflicts if name or slug is being updated
    if (name || slug) {
      const conflictResult = await query(
        'SELECT id FROM categories WHERE (name = $1 OR slug = $2) AND id != $3',
        [name || '', slug || '', id]
      );

      if (conflictResult.rows.length > 0) {
        throw new ApiError('Category with this name or slug already exists', 409);
      }
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount++}`);
      updateValues.push(name);
    }
    if (slug !== undefined) {
      updateFields.push(`slug = $${paramCount++}`);
      updateValues.push(slug);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount++}`);
      updateValues.push(description);
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id);

    const updateQuery = `
      UPDATE categories 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, slug, description, is_active, created_at, updated_at
    `;

    const categoryResult = await query(updateQuery, updateValues);
    const category = categoryResult.rows[0];

    logger.info(`Category updated: ${category.name} (ID: ${id}) by user ${user.id}`);

    sendSuccess(res, { category }, 'Category updated successfully');
  } catch (error) {
    logger.error('Error updating category:', error);
    throw error;
  }
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User;
  const { id } = req.params;

  try {
    // Check if category exists
    const existingResult = await query(
      'SELECT id, name FROM categories WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      throw new ApiError('Category not found', 404);
    }

    const existingCategory = existingResult.rows[0];

    // Check if category has plans
    const plansResult = await query(
      'SELECT COUNT(*) FROM house_plans WHERE category_id = $1',
      [id]
    );

    const planCount = parseInt(plansResult.rows[0].count);

    if (planCount > 0) {
      throw new ApiError(
        `Cannot delete category '${existingCategory.name}' because it has ${planCount} associated plans. Move or delete the plans first.`,
        409
      );
    }

    // Soft delete the category
    await query(
      'UPDATE categories SET is_active = false, updated_at = NOW() WHERE id = $1',
      [id]
    );

    logger.info(`Category deleted: ${existingCategory.name} (ID: ${id}) by user ${user.id}`);

    sendSuccess(res, {}, 'Category deleted successfully');
  } catch (error) {
    logger.error('Error deleting category:', error);
    throw error;
  }
});

export const getCategoryStats = asyncHandler(async (req: Request, res: Response) => {
  try {
    const statsResult = await query(`
      SELECT 
        c.id,
        c.name,
        c.slug,
        COUNT(hp.id) as plan_count,
        AVG(hp.price)::numeric(10,2) as avg_price,
        MIN(hp.price) as min_price,
        MAX(hp.price) as max_price
      FROM categories c
      LEFT JOIN house_plans hp ON c.id = hp.category_id AND hp.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id, c.name, c.slug
      ORDER BY plan_count DESC, c.name ASC
    `);

    const categoryStats = statsResult.rows.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      plan_count: parseInt(category.plan_count),
      avg_price: category.avg_price ? parseFloat(category.avg_price) : null,
      min_price: category.min_price ? parseFloat(category.min_price) : null,
      max_price: category.max_price ? parseFloat(category.max_price) : null
    }));

    logger.info(`Retrieved stats for ${categoryStats.length} categories`);

    sendSuccess(res, { categoryStats }, 'Category statistics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching category stats:', error);
    throw error;
  }
});
