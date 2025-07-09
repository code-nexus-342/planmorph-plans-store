import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendPaginatedResponse, getPaginationParams } from '../utils/response';
import { logger } from '../utils/logger';
import { User } from '../types/index.js';
// Type extensions are automatically loaded from types/express.d.ts

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
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('id')
    .eq('id', planId)
    .eq('is_active', true)
    .single();

  if (planError || !plan) {
    throw new ApiError('Plan not found', 404);
  }

  const { data: reviews, error, count } = await supabase
    .from('plan_reviews')
    .select(`
      *,
      users (first_name, last_name)
    `, { count: 'exact' })
    .eq('plan_id', planId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to fetch reviews:', error);
    throw new ApiError('Failed to fetch reviews', 500);
  }

  sendPaginatedResponse(
    res,
    reviews || [],
    { page, limit, total: count || 0 },
    'Reviews retrieved successfully'
  );
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { planId } = req.params;
  const { rating, comment }: CreateReviewRequest = req.body;
  const userId = (req.user as User).id;

  // Verify plan exists
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('id')
    .eq('id', planId)
    .eq('is_active', true)
    .single();

  if (planError || !plan) {
    throw new ApiError('Plan not found', 404);
  }

  // Check if user already reviewed this plan
  const { data: existingReview, error: reviewError } = await supabase
    .from('plan_reviews')
    .select('id')
    .eq('plan_id', planId)
    .eq('user_id', userId)
    .single();

  if (existingReview) {
    throw new ApiError('You have already reviewed this plan', 400);
  }

  // Create review
  const { data: review, error } = await supabase
    .from('plan_reviews')
    .insert({
      plan_id: planId,
      user_id: userId,
      rating,
      comment,
    })
    .select(`
      *,
      users (first_name, last_name)
    `)
    .single();

  if (error) {
    logger.error('Review creation failed:', error);
    throw new ApiError('Failed to create review', 500);
  }

  logger.info(`Review created for plan ${planId} by user ${(req.user as User).email}`);

  sendSuccess(res, { review }, 'Review created successfully', 201);
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { rating, comment }: CreateReviewRequest = req.body;
  const userId = (req.user as User).id;

  // Get existing review
  const { data: existingReview, error: fetchError } = await supabase
    .from('plan_reviews')
    .select('user_id')
    .eq('id', reviewId)
    .single();

  if (fetchError || !existingReview) {
    throw new ApiError('Review not found', 404);
  }

  // Check if user owns the review
  if (existingReview.user_id !== userId) {
    throw new ApiError('Not authorized to update this review', 403);
  }

  // Update review
  const { data: review, error } = await supabase
    .from('plan_reviews')
    .update({
      rating,
      comment,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId)
    .select(`
      *,
      users (first_name, last_name)
    `)
    .single();

  if (error) {
    logger.error('Review update failed:', error);
    throw new ApiError('Failed to update review', 500);
  }

  logger.info(`Review updated: ${reviewId} by user ${(req.user as User).email}`);

  sendSuccess(res, { review }, 'Review updated successfully');
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const userId = (req.user as User).id;
  const userRole = (req.user as User).role;

  // Get existing review
  const { data: existingReview, error: fetchError } = await supabase
    .from('plan_reviews')
    .select('user_id')
    .eq('id', reviewId)
    .single();

  if (fetchError || !existingReview) {
    throw new ApiError('Review not found', 404);
  }

  // Check permissions (owner or admin)
  if (existingReview.user_id !== userId && userRole !== 'admin') {
    throw new ApiError('Not authorized to delete this review', 403);
  }

  // Delete review
  const { error } = await supabase
    .from('plan_reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    logger.error('Review deletion failed:', error);
    throw new ApiError('Failed to delete review', 500);
  }

  logger.info(`Review deleted: ${reviewId} by user ${(req.user as User).email}`);

  sendSuccess(res, null, 'Review deleted successfully');
});

export const getReviewStats = asyncHandler(async (req: Request, res: Response) => {
  const { planId } = req.params;

  // Verify plan exists
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('id')
    .eq('id', planId)
    .eq('is_active', true)
    .single();

  if (planError || !plan) {
    throw new ApiError('Plan not found', 404);
  }

  // Get review statistics
  const { data: reviews, error } = await supabase
    .from('plan_reviews')
    .select('rating')
    .eq('plan_id', planId);

  if (error) {
    logger.error('Failed to fetch review stats:', error);
    throw new ApiError('Failed to fetch review statistics', 500);
  }

  if (!reviews || reviews.length === 0) {
    sendSuccess(res, {
      stats: {
        total_reviews: 0,
        average_rating: 0,
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    }, 'Review statistics retrieved successfully');
    return;
  }

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  const ratingDistribution = reviews.reduce((dist, review) => {
    const rating = review.rating as 1 | 2 | 3 | 4 | 5;
    dist[rating] = (dist[rating] || 0) + 1;
    return dist;
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>);

  sendSuccess(res, {
    stats: {
      total_reviews: totalReviews,
      average_rating: Math.round(averageRating * 10) / 10,
      rating_distribution: ratingDistribution,
    }
  }, 'Review statistics retrieved successfully');
});
