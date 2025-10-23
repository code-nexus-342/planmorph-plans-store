import { Request, Response } from 'express';
import { query } from '../config/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { generateTokens, hashPassword, comparePassword } from '../utils/auth';
import { sendSuccess } from '../utils/response';
import { logger } from '../utils/logger';
import { sendVerificationEmail, sendWelcomeEmail, generateOTP } from '../utils/email';
import { User } from '../types';
import passport from '../config/passport';
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

interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, first_name, last_name, phone }: RegisterRequest = req.body;

  // Check if user already exists
  const existingUserResult = await query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUserResult.rows.length > 0) {
    throw new ApiError('User with this email already exists', 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Create user with email verification pending
  const userResult = await query(`
    INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_active, is_verified, email_verification_token, email_verification_expires)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id, email, first_name, last_name, phone, role, created_at
  `, [email, hashedPassword, first_name, last_name, phone, 'customer', true, false, otp, otpExpiry]);

  if (userResult.rows.length === 0) {
    logger.error('User registration failed: No user returned');
    throw new ApiError('Failed to create user account', 500);
  }

  const user = userResult.rows[0];

  // Send verification email
  try {
    await sendVerificationEmail(email, otp);
    logger.info(`Verification email sent to: ${email}`);
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    // Don't fail registration if email fails - user can request resend
  }

  logger.info(`New user registered (pending verification): ${user.email}`);

  sendSuccess(res, {
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
      is_verified: false
    },
    requiresVerification: true,
    message: 'Account created successfully. Please check your email for verification code.'
  }, 'Please verify your email to complete registration', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  // Get user with password
  const userResult = await query(
    'SELECT id, email, password_hash, first_name, last_name, phone, role, avatar_url, oauth_provider, oauth_provider_id, is_active, is_verified, created_at, updated_at FROM users WHERE email = $1',
    [email]
  );

  if (userResult.rows.length === 0) {
    throw new ApiError('Invalid email or password', 401);
  }

  const user = userResult.rows[0];

  // Check if user is active
  if (!user.is_active) {
    throw new ApiError('Account is deactivated', 401);
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new ApiError('Invalid email or password', 401);
  }

  // Check if email is verified
  if (!user.is_verified) {
    throw new ApiError('Please verify your email before logging in. Check your inbox for verification code.', 403);
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

  const userResult = await query(
    'SELECT id, email, first_name, last_name, phone, role, avatar_url, oauth_provider, oauth_provider_id, is_verified, is_active, created_at, updated_at FROM users WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0) {
    throw new ApiError('User not found', 404);
  }

  const user = userResult.rows[0];

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

  // Build update query dynamically
  const fields = Object.keys(updateData);
  const values = Object.values(updateData);
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  
  const userResult = await query(
    `UPDATE users SET ${setClause} WHERE id = $1 RETURNING id, email, first_name, last_name, phone, role, created_at, updated_at`,
    [userId, ...values]
  );

  if (userResult.rows.length === 0) {
    throw new ApiError('Failed to update profile', 500);
  }

  const user = userResult.rows[0];

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
  const userResult = await query(
    'SELECT password_hash FROM users WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0) {
    throw new ApiError('User not found', 404);
  }

  const user = userResult.rows[0];

  // Verify current password
  const isValidPassword = await comparePassword(currentPassword, user.password_hash);
  if (!isValidPassword) {
    throw new ApiError('Current password is incorrect', 400);
  }

  // Hash new password
  const hashedNewPassword = await hashPassword(newPassword);

  // Update password
  const updateResult = await query(
    'UPDATE users SET password_hash = $1, updated_at = $2 WHERE id = $3',
    [hashedNewPassword, new Date().toISOString(), userId]
  );

  if (updateResult.rowCount === 0) {
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
    const userResult = await query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      throw new ApiError('Invalid refresh token', 401);
    }

    const user = userResult.rows[0];

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
    let userResult = await query(
      'SELECT * FROM users WHERE email = $1 OR oauth_provider_id = $2',
      [userData.email, userData.provider_id]
    );

    let user = userResult.rows[0];
    let isNewUser = false;

    if (!user) {
      // This is a NEW USER (signup via Google OAuth)
      isNewUser = true;
      
      // Create new user (pre-verified since Google already verified the email)
      const newUserResult = await query(`
        INSERT INTO users (email, first_name, last_name, avatar_url, oauth_provider, oauth_provider_id, is_verified, role, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        userData.email,
        userData.first_name,
        userData.last_name,
        userData.avatar_url,
        userData.provider,
        userData.provider_id,
        true, // OAuth users are pre-verified since Google already verified their email
        'customer',
        true
      ]);

      if (newUserResult.rows.length === 0) {
        logger.error('Failed to create OAuth user');
        throw new ApiError('Failed to create user account', 500);
      }

      user = newUserResult.rows[0];

      // Send welcome email (not verification email)
      try {
        await sendWelcomeEmail(userData.email, userData.first_name);
        logger.info(`Welcome email sent to OAuth user: ${userData.email}`);
      } catch (error) {
        logger.error('Failed to send welcome email to OAuth user:', error);
        // Don't fail registration if email fails
      }

      // Return response indicating profile completion is required for NEW users
      logger.info(`New OAuth user registered (pre-verified): ${user.email}`);
      
      sendSuccess(res, {
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
        requiresEmailVerification: false, // No email verification needed for OAuth users
        requiresProfileCompletion: true,
        isNewUser: true,
        message: 'OAuth registration successful. Please confirm your profile details.'
      }, 'OAuth registration successful');
      return;
    } else {
      // This is an EXISTING USER (sign-in)
      isNewUser = false;
      
      // Update existing user with OAuth info if not set
      if (!user.oauth_provider) {
        await query(`
          UPDATE users 
          SET oauth_provider = $1, oauth_provider_id = $2, avatar_url = COALESCE($3, avatar_url)
          WHERE id = $4
        `, [userData.provider, userData.provider_id, userData.avatar_url, user.id]);
        
        user.oauth_provider = userData.provider;
        user.oauth_provider_id = userData.provider_id;
        user.avatar_url = userData.avatar_url || user.avatar_url;
      }

      // For existing users, if they're not verified and using OAuth, auto-verify them
      // since Google has already verified their email
      if (!user.is_verified) {
        await query(`
          UPDATE users 
          SET is_verified = true, email_verification_token = NULL, email_verification_expires = NULL
          WHERE id = $1
        `, [user.id]);
        
        user.is_verified = true;
        
        logger.info(`Auto-verified existing OAuth user: ${user.email}`);
      }
    }

    // Generate tokens for verified users (both new and existing)
    const tokens = generateTokens(user);

    // Log successful OAuth login
    logger.info(`OAuth ${isNewUser ? 'registration' : 'login'} successful for user ${user.id} via ${userData.provider}`);

    sendSuccess(res, {
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
      tokens,
      isNewUser: false // If we reach here, authentication is complete
    }, `OAuth ${isNewUser ? 'registration' : 'login'} successful`);
  } catch (error) {
    logger.error('OAuth callback error:', error);
    throw new ApiError('OAuth authentication failed', 500);
  }
});

// Google OAuth routes
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    
    if (!user) {
      logger.error('Google OAuth callback: No user found');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=oauth_failed`);
    }

    // Check if user needs email verification
    if (!user.is_verified) {
      logger.info(`Google OAuth user needs email verification: ${user.email}`);
      // Redirect to frontend with user info for verification flow
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?verification_required=true&email=${encodeURIComponent(user.email)}&first_name=${encodeURIComponent(user.first_name || '')}&last_name=${encodeURIComponent(user.last_name || '')}`;
      return res.redirect(redirectUrl);
    }

    // Generate tokens for verified users
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info(`Google OAuth successful for verified user: ${user.id}`);

    // Redirect to frontend with tokens
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${tokens.accessToken}&refresh_token=${tokens.refreshToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    logger.error('Google OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=oauth_failed`);
  }
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp }: VerifyEmailRequest = req.body;

  if (!email || !otp) {
    throw new ApiError('Email and OTP are required', 400);
  }

  // Get user with verification token
  const userResult = await query(
    'SELECT id, email, first_name, last_name, phone, role, email_verification_token, email_verification_expires, is_verified FROM users WHERE email = $1',
    [email]
  );

  if (userResult.rows.length === 0) {
    throw new ApiError('User not found', 404);
  }

  const user = userResult.rows[0];

  if (user.is_verified) {
    throw new ApiError('Email is already verified', 400);
  }

  if (!user.email_verification_token || user.email_verification_token !== otp) {
    throw new ApiError('Invalid verification code', 400);
  }

  if (new Date() > new Date(user.email_verification_expires)) {
    throw new ApiError('Verification code has expired. Please request a new one.', 400);
  }

  // Update user as verified
  await query(
    'UPDATE users SET is_verified = $1, email_verification_token = NULL, email_verification_expires = NULL, updated_at = $2 WHERE id = $3',
    [true, new Date().toISOString(), user.id]
  );

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.first_name);
    logger.info(`Welcome email sent to: ${user.email}`);
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
  }

  // Generate tokens for automatic login
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  logger.info(`Email verified for user: ${user.email}`);

  sendSuccess(res, {
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role: user.role,
      is_verified: true
    },
    tokens
  }, 'Email verified successfully. Welcome to PlanMorph!');
});

export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError('Email is required', 400);
  }

  // Get user
  const userResult = await query(
    'SELECT id, email, first_name, is_verified FROM users WHERE email = $1',
    [email]
  );

  if (userResult.rows.length === 0) {
    throw new ApiError('User not found', 404);
  }

  const user = userResult.rows[0];

  if (user.is_verified) {
    throw new ApiError('Email is already verified', 400);
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Update user with new OTP
  await query(
    'UPDATE users SET email_verification_token = $1, email_verification_expires = $2 WHERE id = $3',
    [otp, otpExpiry, user.id]
  );

  // Send verification email
  try {
    await sendVerificationEmail(email, otp);
    logger.info(`New verification email sent to: ${email}`);
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    throw new ApiError('Failed to send verification email. Please try again.', 500);
  }

  sendSuccess(res, null, 'Verification code sent successfully');
});

// OAuth profile completion for new users
export const completeOAuthProfile = asyncHandler(async (req: Request, res: Response) => {
  const { email, first_name, last_name, otp }: { email: string; first_name: string; last_name: string; otp: string } = req.body;

  // Find user by email
  const userResult = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (userResult.rows.length === 0) {
    throw new ApiError('User not found', 404);
  }

  const user = userResult.rows[0];

  // Check if user used OAuth to register
  if (!user.oauth_provider) {
    throw new ApiError('This endpoint is only for OAuth users', 400);
  }

  // For OAuth users who are already verified (Google verified their email), skip OTP verification
  if (user.is_verified) {
    // Just update the profile details and generate tokens
    const updatedUserResult = await query(`
      UPDATE users 
      SET first_name = $1, last_name = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [first_name, last_name, user.id]);

    if (updatedUserResult.rows.length === 0) {
      throw new ApiError('Failed to update user profile', 500);
    }

    const updatedUser = updatedUserResult.rows[0];

    // Generate tokens
    const tokens = generateTokens(updatedUser);

    logger.info(`OAuth profile completed for verified user: ${updatedUser.email}`);

    sendSuccess(res, {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        avatar_url: updatedUser.avatar_url,
        is_verified: updatedUser.is_verified,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      },
      tokens
    }, 'Profile completed successfully');
    return;
  }

  // For unverified OAuth users (legacy users), still require OTP verification
  if (!otp) {
    throw new ApiError('Verification code is required', 400);
  }

  // Verify OTP
  if (!user.email_verification_token || user.email_verification_token !== otp) {
    throw new ApiError('Invalid verification code', 400);
  }

  if (!user.email_verification_expires || new Date() > user.email_verification_expires) {
    throw new ApiError('Verification code has expired', 400);
  }

  // Update user profile with confirmed details and mark as verified
  const updatedUserResult = await query(`
    UPDATE users 
    SET first_name = $1, last_name = $2, is_verified = $3, email_verified_at = $4, 
        email_verification_token = NULL, email_verification_expires = NULL, updated_at = NOW()
    WHERE id = $5
    RETURNING *
  `, [first_name, last_name, true, new Date(), user.id]);

  if (updatedUserResult.rows.length === 0) {
    throw new ApiError('Failed to update user profile', 500);
  }

  const updatedUser = updatedUserResult.rows[0];

  // Generate tokens
  const tokens = generateTokens(updatedUser);

  // Send welcome email
  try {
    await sendWelcomeEmail(updatedUser.email, updatedUser.first_name);
    logger.info(`Welcome email sent to OAuth user: ${updatedUser.email}`);
  } catch (error) {
    logger.error('Failed to send welcome email to OAuth user:', error);
  }

  logger.info(`OAuth profile completed and verified for user: ${updatedUser.email}`);

  sendSuccess(res, {
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      phone: updatedUser.phone,
      role: updatedUser.role,
      avatar_url: updatedUser.avatar_url,
      is_verified: updatedUser.is_verified,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at
    },
    tokens
  }, 'Profile completed successfully');
});
