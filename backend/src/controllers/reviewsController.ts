import { Request, Response } from 'express';
import { query, transaction } from '../config/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendPaginatedResponse, getPaginationParams } from '../utils/response';
import { logger } from '../utils/logger';
import { User } from '../types/index.js';

interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

export const getReviewsForPlan = asyncHandler(async (req: Request, res: Response) => {
  const { planId } = req.params;
  const { page, limit, offset } = getPaginationParams(
    req.query.page as string,
    req.query.limit as string
  );

  // Verify plan exists
  const planResult = await query(
    'SELECT id FROM house_plans WHERE id = $1 AND is_active = true',
    [planId]
  );

  if (planResult.rows.length === 0) {
    throw new ApiError('Plan not found', 404);
  }

  // Get reviews with user information
  const reviewsResult = await query(`
    SELECT 
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      r.updated_at,
      u.first_name,
      u.last_name,
      COUNT(*) OVER() as total_count
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.plan_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3
  `, [planId, limit, offset]);

  const reviews = reviewsResult.rows.map((row: any) => ({
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user: {
      first_name: row.first_name,
      last_name: row.last_name
    }
  }));

  const totalCount = reviewsResult.rows.length > 0 ? parseInt(reviewsResult.rows[0].total_count) : 0;

  return sendPaginatedResponse(res, reviews, {
    page,
    limit,
    total: totalCount
  });
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User;
  const { planId } = req.params;
  const { rating, comment }: CreateReviewRequest = req.body;

  // Verify plan exists
  const planResult = await query(
    'SELECT id FROM house_plans WHERE id = $1 AND is_active = true',
    [planId]
  );

  if (planResult.rows.length === 0) {
    throw new ApiError('Plan not found', 404);
  }

  // Check if user already reviewed this plan
  const existingReviewResult = await query(
    'SELECT id FROM reviews WHERE user_id = $1 AND plan_id = $2',
    [user.id, planId]
  );

  if (existingReviewResult.rows.length > 0) {
    throw new ApiError('You have already reviewed this plan', 400);
  }

  // Create review
  const reviewResult = await query(`
    INSERT INTO reviews (user_id, plan_id, rating, comment, created_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING id, rating, comment, created_at, updated_at
  `, [user.id, planId, rating, comment || null]);

  const review = {
    ...reviewResult.rows[0],
    user: {
      first_name: user.first_name,
      last_name: user.last_name
    }
  };

  logger.info(`Review created for plan ${planId} by user ${user.id}`);
  return sendSuccess(res, review, 'Review created successfully', 201);
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User;
  const { reviewId } = req.params;
  const { rating, comment }: CreateReviewRequest = req.body;

  // Check if review exists and belongs to user
  const existingReviewResult = await query(
    'SELECT id, plan_id FROM reviews WHERE id = $1 AND user_id = $2',
    [reviewId, user.id]
  );

  if (existingReviewResult.rows.length === 0) {
    throw new ApiError('Review not found or unauthorized', 404);
  }

  // Update review
  const reviewResult = await query(`
    UPDATE reviews 
    SET rating = $1, comment = $2, updated_at = NOW()
    WHERE id = $3 AND user_id = $4
    RETURNING id, rating, comment, created_at, updated_at, plan_id
  `, [rating, comment || null, reviewId, user.id]);

  const review = {
    ...reviewResult.rows[0],
    user: {
      first_name: user.first_name,
      last_name: user.last_name
    }
  };

  logger.info(`Review ${reviewId} updated by user ${user.id}`);
  return sendSuccess(res, review, 'Review updated successfully');
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User;
  const { reviewId } = req.params;

  // Check if review exists and belongs to user
  const existingReviewResult = await query(
    'SELECT id FROM reviews WHERE id = $1 AND user_id = $2',
    [reviewId, user.id]
  );

  if (existingReviewResult.rows.length === 0) {
    throw new ApiError('Review not found or unauthorized', 404);
  }

  // Delete review
  await query(
    'DELETE FROM reviews WHERE id = $1 AND user_id = $2',
    [reviewId, user.id]
  );

  logger.info(`Review ${reviewId} deleted by user ${user.id}`);
  return sendSuccess(res, null, 'Review deleted successfully');
});

export const getReviewStats = asyncHandler(async (req: Request, res: Response) => {
  const { planId } = req.params;

  // Verify plan exists
  const planResult = await query(
    'SELECT id FROM house_plans WHERE id = $1 AND is_active = true',
    [planId]
  );

  if (planResult.rows.length === 0) {
    throw new ApiError('Plan not found', 404);
  }

  // Get review statistics
  const statsResult = await query(`
    SELECT 
      COUNT(*) as total_reviews,
      AVG(rating) as average_rating,
      COUNT(CASE WHEN rating = 1 THEN 1 END) as rating_1,
      COUNT(CASE WHEN rating = 2 THEN 1 END) as rating_2,
      COUNT(CASE WHEN rating = 3 THEN 1 END) as rating_3,
      COUNT(CASE WHEN rating = 4 THEN 1 END) as rating_4,
      COUNT(CASE WHEN rating = 5 THEN 1 END) as rating_5
    FROM reviews 
    WHERE plan_id = $1
  `, [planId]);

  const stats = statsResult.rows[0];
  const totalReviews = parseInt(stats.total_reviews);
  const averageRating = totalReviews > 0 ? parseFloat(parseFloat(stats.average_rating).toFixed(2)) : 0;

  const ratingDistribution = {
    1: parseInt(stats.rating_1),
    2: parseInt(stats.rating_2),
    3: parseInt(stats.rating_3),
    4: parseInt(stats.rating_4),
    5: parseInt(stats.rating_5)
  };

  return sendSuccess(res, {
    plan_id: planId,
    total_reviews: totalReviews,
    average_rating: averageRating,
    rating_distribution: ratingDistribution
  }, 'Review statistics retrieved successfully');
});
