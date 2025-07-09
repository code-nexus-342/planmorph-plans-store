import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendPaginatedResponse, getPaginationParams } from '../utils/response';
import { logger } from '../utils/logger';
import { User } from '../types/index.js';
// Type extensions are automatically loaded from types/express.d.ts

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, offset } = getPaginationParams(
    req.query.page as string,
    req.query.limit as string
  );

  const { data: users, error, count } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role, created_at, updated_at, is_active', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to fetch users:', error);
    throw new ApiError('Failed to fetch users', 500);
  }

  sendPaginatedResponse(
    res,
    users || [],
    { page, limit, total: count || 0 },
    'Users retrieved successfully'
  );
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, phone, role, created_at, updated_at, is_active')
    .eq('id', id)
    .single();

  if (error || !user) {
    throw new ApiError('User not found', 404);
  }

  sendSuccess(res, { user }, 'User retrieved successfully');
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['customer', 'architect', 'admin'].includes(role)) {
    throw new ApiError('Invalid role. Must be customer, architect, or admin', 400);
  }

  const { data: user, error } = await supabase
    .from('users')
    .update({
      role,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, email, first_name, last_name, role, updated_at')
    .single();

  if (error) {
    logger.error('Failed to update user role:', error);
    throw new ApiError('Failed to update user role', 500);
  }

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  logger.info(`User role updated: ${user.email} -> ${role} by ${(req.user as User).email}`);

  sendSuccess(res, { user }, 'User role updated successfully');
});

export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Get current user status
  const { data: currentUser, error: fetchError } = await supabase
    .from('users')
    .select('is_active, email')
    .eq('id', id)
    .single();

  if (fetchError || !currentUser) {
    throw new ApiError('User not found', 404);
  }

  const newStatus = !currentUser.is_active;

  const { data: user, error } = await supabase
    .from('users')
    .update({
      is_active: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, email, first_name, last_name, is_active, updated_at')
    .single();

  if (error) {
    logger.error('Failed to toggle user status:', error);
    throw new ApiError('Failed to update user status', 500);
  }

  logger.info(`User status toggled: ${user.email} -> ${newStatus ? 'active' : 'inactive'} by ${(req.user as User).email}`);

  sendSuccess(res, { user }, `User ${newStatus ? 'activated' : 'deactivated'} successfully`);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('email')
    .eq('id', id)
    .single();

  if (fetchError || !existingUser) {
    throw new ApiError('User not found', 404);
  }

  // Soft delete by deactivating the user
  const { error } = await supabase
    .from('users')
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    logger.error('Failed to delete user:', error);
    throw new ApiError('Failed to delete user', 500);
  }

  logger.info(`User deleted: ${existingUser.email} by ${(req.user as User).email}`);

  sendSuccess(res, null, 'User deleted successfully');
});
