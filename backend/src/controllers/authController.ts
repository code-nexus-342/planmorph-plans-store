import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { generateTokens, hashPassword, comparePassword } from '../utils/auth';
import { sendSuccess } from '../utils/response';
import { logger } from '../utils/logger';
import { User } from '../types';
// Type extensions are automatically loaded from types/express.d.ts

interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

interface OAuthUserData {
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  provider: 'google' | 'apple';
  provider_id: string;
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, first_name, last_name, phone }: RegisterRequest = req.body;

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new ApiError('User with this email already exists', 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      phone,
      role: 'customer',
      is_active: true,
    })
    .select('id, email, first_name, last_name, phone, role, created_at')
    .single();

  if (error) {
    logger.error('User registration failed:', error);
    throw new ApiError('Failed to create user account', 500);
  }

  // Generate tokens
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  logger.info(`New user registered: ${user.email}`);

  sendSuccess(res, {
    user,
    tokens,
  }, 'Account created successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  // Get user with password
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new ApiError('Invalid email or password', 401);
  }

  // Check if user is active
  if (!user.is_active) {
    throw new ApiError('Account is deactivated', 401);
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new ApiError('Invalid email or password', 401);
  }

  // Generate tokens
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Remove password from response
  const { password_hash, ...userWithoutPassword } = user;

  logger.info(`User logged in: ${user.email}`);

  sendSuccess(res, {
    user: userWithoutPassword,
    tokens,
  }, 'Login successful');
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, phone, role, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw new ApiError('User not found', 404);
  }

  sendSuccess(res, { user }, 'Profile retrieved successfully');
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { first_name, last_name, phone }: UpdateProfileRequest = req.body;

  const updateData: Partial<User> = {};
  if (first_name !== undefined) updateData.first_name = first_name;
  if (last_name !== undefined) updateData.last_name = last_name;
  if (phone !== undefined) updateData.phone = phone;

  // Only update if there's something to update
  if (Object.keys(updateData).length === 0) {
    throw new ApiError('No fields to update', 400);
  }

  updateData.updated_at = new Date().toISOString();

  const { data: user, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select('id, email, first_name, last_name, phone, role, created_at, updated_at')
    .single();

  if (error) {
    logger.error('Profile update failed:', error);
    throw new ApiError('Failed to update profile', 500);
  }

  logger.info(`Profile updated for user: ${currentUser.email}`);

  sendSuccess(res, { user }, 'Profile updated successfully');
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError('Current password and new password are required', 400);
  }

  // Get user with current password
  const { data: user, error } = await supabase
    .from('users')
    .select('password_hash')
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw new ApiError('User not found', 404);
  }

  // Verify current password
  const isValidPassword = await comparePassword(currentPassword, user.password_hash);
  if (!isValidPassword) {
    throw new ApiError('Current password is incorrect', 400);
  }

  // Hash new password
  const hashedNewPassword = await hashPassword(newPassword);

  // Update password
  const { error: updateError } = await supabase
    .from('users')
    .update({ 
      password_hash: hashedNewPassword,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (updateError) {
    logger.error('Password change failed:', updateError);
    throw new ApiError('Failed to change password', 500);
  }

  logger.info(`Password changed for user: ${currentUser.email}`);

  sendSuccess(res, null, 'Password changed successfully');
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError('Refresh token is required', 400);
  }

  try {
    // Verify refresh token
    const decoded = JSON.parse(Buffer.from(refreshToken.split('.')[1], 'base64').toString());
    
    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      throw new ApiError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    sendSuccess(res, { tokens }, 'Tokens refreshed successfully');
  } catch (error) {
    throw new ApiError('Invalid refresh token', 401);
  }
});

// OAuth login/registration
export const oauthCallback = asyncHandler(async (req: Request, res: Response) => {
  const userData: OAuthUserData = req.body;

  try {
    // Check if user exists by email or provider ID
    let { data: user } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${userData.email},oauth_provider_id.eq.${userData.provider_id}`)
      .single();

    if (!user) {
      // Create new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          avatar_url: userData.avatar_url,
          oauth_provider: userData.provider,
          oauth_provider_id: userData.provider_id,
          is_verified: true, // OAuth users are pre-verified
          role: 'user'
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create OAuth user:', error);
        throw new ApiError('Failed to create user account', 500);
      }

      user = newUser;
    } else {
      // Update existing user with OAuth info if not set
      if (!user.oauth_provider) {
        await supabase
          .from('users')
          .update({
            oauth_provider: userData.provider,
            oauth_provider_id: userData.provider_id,
            avatar_url: userData.avatar_url || user.avatar_url,
            is_verified: true
          })
          .eq('id', user.id);
      }
    }

    // Generate tokens
    const tokens = generateTokens(user);

    // Log successful OAuth login
    logger.info(`OAuth login successful for user ${user.id} via ${userData.provider}`);

    res.json({
      success: true,
      message: 'OAuth login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          role: user.role,
          avatar_url: user.avatar_url,
          is_verified: user.is_verified,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        tokens
      }
    });
  } catch (error) {
    logger.error('OAuth callback error:', error);
    throw new ApiError('OAuth authentication failed', 500);
  }
});
