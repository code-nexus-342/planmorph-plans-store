import { Request, Response } from 'express';
import { query } from '../config/database';
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

  try {
    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    // Get paginated users
    const usersResult = await query(
      `SELECT id, email, first_name, last_name, role, created_at, updated_at, is_active 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const users = usersResult.rows;

    sendPaginatedResponse(
      res,
      users,
      { page, limit, total },
      'Users retrieved successfully'
    );
  } catch (error) {
    logger.error('Failed to fetch users:', error);
    throw error;
  }
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const userResult = await query(
      'SELECT id, email, first_name, last_name, phone, role, created_at, updated_at, is_active FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      throw new ApiError('User not found', 404);
    }

    const user = userResult.rows[0];
    sendSuccess(res, { user }, 'User retrieved successfully');
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw error;
  }
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const currentUser = req.user as User;

  if (!role || !['customer', 'architect', 'admin'].includes(role)) {
    throw new ApiError('Valid role is required (customer, architect, admin)', 400);
  }

  try {
    // Check if user exists
    const existingResult = await query('SELECT id, role FROM users WHERE id = $1', [id]);
    
    if (existingResult.rows.length === 0) {
      throw new ApiError('User not found', 404);
    }

    // Update user role
    const userResult = await query(
      `UPDATE users 
       SET role = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, email, first_name, last_name, role, updated_at`,
      [role, id]
    );

    const user = userResult.rows[0];

    logger.info(`User role updated: ${user.email} -> ${role} by admin ${currentUser.email}`);
    sendSuccess(res, { user }, 'User role updated successfully');
  } catch (error) {
    logger.error('Error updating user role:', error);
    throw error;
  }
});

export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUser = req.user as User;

  try {
    // Get current user status
    const userResult = await query('SELECT id, email, is_active FROM users WHERE id = $1', [id]);
    
    if (userResult.rows.length === 0) {
      throw new ApiError('User not found', 404);
    }

    const user = userResult.rows[0];
    const newStatus = !user.is_active;

    // Update user status
    const updatedResult = await query(
      `UPDATE users 
       SET is_active = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, email, first_name, last_name, is_active`,
      [newStatus, id]
    );

    const updatedUser = updatedResult.rows[0];

    logger.info(`User status toggled: ${updatedUser.email} -> ${newStatus ? 'active' : 'inactive'} by admin ${currentUser.email}`);
    sendSuccess(res, { user: updatedUser }, `User ${newStatus ? 'activated' : 'deactivated'} successfully`);
  } catch (error) {
    logger.error('Error toggling user status:', error);
    throw error;
  }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUser = req.user as User;

  try {
    // Check if user exists
    const userResult = await query('SELECT id, email FROM users WHERE id = $1', [id]);
    
    if (userResult.rows.length === 0) {
      throw new ApiError('User not found', 404);
    }

    const user = userResult.rows[0];

    // Soft delete by setting is_active to false and updating email to mark as deleted
    await query(
      `UPDATE users 
       SET is_active = false, 
           email = CONCAT(email, '_deleted_', EXTRACT(EPOCH FROM NOW())),
           updated_at = NOW() 
       WHERE id = $1`,
      [id]
    );

    logger.info(`User deleted: ${user.email} by admin ${currentUser.email}`);
    sendSuccess(res, {}, 'User deleted successfully');
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
});

// New dashboard endpoints
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User;

  try {
    // Get user's purchase statistics
    const purchasesResult = await query(
      `SELECT 
        COUNT(*) as total_purchases,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN price_paid ELSE 0 END), 0) as total_spent
       FROM purchases 
       WHERE user_id = $1`,
      [user.id]
    );

    // Get favorites count
    const favoritesResult = await query(
      'SELECT COUNT(*) as favorite_count FROM user_favorites WHERE user_id = $1',
      [user.id]
    );

    // Get downloads available (completed purchases that can still be downloaded)
    const downloadsResult = await query(
      `SELECT COUNT(DISTINCT p.id) as downloads_available 
       FROM purchases p
       WHERE p.user_id = $1 AND p.status = 'completed'`,
      [user.id]
    );

    const stats = {
      totalPurchases: parseInt(purchasesResult.rows[0].total_purchases),
      totalSpent: parseFloat(purchasesResult.rows[0].total_spent),
      favoritePlans: parseInt(favoritesResult.rows[0].favorite_count),
      downloadsAvailable: parseInt(downloadsResult.rows[0].downloads_available)
    };

    sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    throw error;
  }
});

export const getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User;

  try {
    // Get recent purchases
    const recentPurchases = await query(
      `SELECT 
        'purchase' as type,
        CONCAT('Purchased ', hp.title) as title,
        CONCAT(hp.bedrooms, 'BR, ', hp.bathrooms, 'BA - $', hp.base_price) as description,
        p.purchased_at as timestamp,
        p.id
       FROM purchases p
       JOIN house_plans hp ON p.plan_id = hp.id
       WHERE p.user_id = $1 AND p.status = 'completed'
       ORDER BY p.purchased_at DESC
       LIMIT 5`,
      [user.id]
    );

    // Get recent downloads
    const recentDownloads = await query(
      `SELECT 
        'download' as type,
        CONCAT('Downloaded ', hp.title) as title,
        'Complete architectural package' as description,
        d.created_at as timestamp,
        d.id
       FROM downloads d
       JOIN purchases p ON d.purchase_id = p.id
       JOIN house_plans hp ON p.plan_id = hp.id
       WHERE p.user_id = $1
       ORDER BY d.created_at DESC
       LIMIT 3`,
      [user.id]
    );

    // Get recent favorites
    const recentFavorites = await query(
      `SELECT 
        'favorite' as type,
        CONCAT('Added to Favorites') as title,
        hp.title as description,
        uf.created_at as timestamp,
        CONCAT(uf.user_id, '-', uf.plan_id) as id
       FROM user_favorites uf
       JOIN house_plans hp ON uf.plan_id = hp.id
       WHERE uf.user_id = $1
       ORDER BY uf.created_at DESC
       LIMIT 2`,
      [user.id]
    );

    // Combine and sort activities
    const allActivities = [
      ...recentPurchases.rows,
      ...recentDownloads.rows,
      ...recentFavorites.rows
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 10)
     .map(activity => ({
       id: activity.id.toString(),
       type: activity.type,
       title: activity.title,
       description: activity.description,
       timestamp: formatTimeAgo(activity.timestamp)
     }));

    sendSuccess(res, allActivities, 'Recent activity retrieved successfully');
  } catch (error) {
    logger.error('Error fetching recent activity:', error);
    throw error;
  }
});

export const getPurchases = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User;

  try {
    const purchasesResult = await query(
      `SELECT 
        p.id,
        p.price_paid,
        p.status,
        p.purchased_at,
        hp.id as plan_id,
        hp.title as plan_title,
        hp.bedrooms,
        hp.bathrooms,
        hp.square_footage,
        hp.thumbnail_url,
        hp.main_image_url
       FROM purchases p
       JOIN house_plans hp ON p.plan_id = hp.id
       WHERE p.user_id = $1
       ORDER BY p.purchased_at DESC`,
      [user.id]
    );

    const purchases = purchasesResult.rows.map((row: any) => ({
      id: row.id,
      price: parseFloat(row.price_paid),
      status: row.status,
      purchase_date: row.purchased_at,
      plan: {
        id: row.plan_id,
        title: row.plan_title,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        square_footage: row.square_footage,
        images: row.thumbnail_url ? [row.thumbnail_url] : []
      }
    }));

    sendSuccess(res, purchases, 'Purchases retrieved successfully');
  } catch (error) {
    logger.error('Error fetching purchases:', error);
    throw error;
  }
});

// Settings Management
export const getUserSettings = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;

  try {
    const settingsResult = await query(
      `SELECT * FROM user_settings WHERE user_id = $1`,
      [userId]
    );

    if (settingsResult.rows.length === 0) {
      // Create default settings if they don't exist
      const defaultSettings = await query(
        `INSERT INTO user_settings (user_id) VALUES ($1) RETURNING *`,
        [userId]
      );
      
      sendSuccess(res, defaultSettings.rows[0], 'Default settings created');
    } else {
      sendSuccess(res, settingsResult.rows[0], 'Settings retrieved successfully');
    }
  } catch (error) {
    logger.error('Error fetching user settings:', error);
    throw new ApiError('Failed to fetch settings', 500);
  }
});

export const updateUserSettings = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const settings = req.body;

  try {
    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'email_notifications', 'marketing_emails', 'push_notifications',
      'profile_visibility', 'show_activity', 'show_purchases',
      'theme', 'language', 'timezone', 'currency',
      'auto_download', 'download_quality', 'download_format'
    ];

    for (const field of allowedFields) {
      if (settings[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        values.push(settings[field]);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      throw new ApiError('No valid settings provided', 400);
    }

    values.push(userId); // Add userId as last parameter
    updateFields.push('updated_at = NOW()');

    const updateQuery = `
      UPDATE user_settings 
      SET ${updateFields.join(', ')}
      WHERE user_id = $${paramIndex}
      RETURNING *
    `;

    const updatedSettings = await query(updateQuery, values);

    if (updatedSettings.rows.length === 0) {
      // Settings don't exist, create them
      const createQuery = `
        INSERT INTO user_settings (user_id, ${allowedFields.filter(f => settings[f] !== undefined).join(', ')})
        VALUES ($1, ${allowedFields.filter(f => settings[f] !== undefined).map((_, i) => `$${i + 2}`).join(', ')})
        RETURNING *
      `;
      
      const createValues = [userId, ...allowedFields.filter(f => settings[f] !== undefined).map(f => settings[f])];
      const newSettings = await query(createQuery, createValues);
      
      sendSuccess(res, newSettings.rows[0], 'Settings created successfully');
    } else {
      sendSuccess(res, updatedSettings.rows[0], 'Settings updated successfully');
    }
  } catch (error) {
    logger.error('Error updating user settings:', error);
    throw new ApiError('Failed to update settings', 500);
  }
});

// Payment Methods Management
export const getPaymentMethods = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;

  try {
    const paymentMethodsResult = await query(
      `SELECT id, type, provider, last_four_digits, brand, exp_month, exp_year, 
              cardholder_name, is_default, is_active, created_at
       FROM payment_methods 
       WHERE user_id = $1 AND is_active = true
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );

    sendSuccess(res, paymentMethodsResult.rows, 'Payment methods retrieved successfully');
  } catch (error) {
    logger.error('Error fetching payment methods:', error);
    throw new ApiError('Failed to fetch payment methods', 500);
  }
});

export const addPaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { 
    type, provider, last_four_digits, brand, exp_month, exp_year, 
    cardholder_name, stripe_payment_method_id, paypal_payer_id, 
    is_default, billing_address 
  } = req.body;

  try {
    // If this is set as default, remove default from other payment methods
    if (is_default) {
      await query(
        'UPDATE payment_methods SET is_default = false WHERE user_id = $1',
        [userId]
      );
    }

    const newPaymentMethod = await query(
      `INSERT INTO payment_methods (
        user_id, type, provider, last_four_digits, brand, exp_month, exp_year,
        cardholder_name, stripe_payment_method_id, paypal_payer_id, 
        is_default, billing_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        userId, type, provider, last_four_digits, brand, exp_month, exp_year,
        cardholder_name, stripe_payment_method_id, paypal_payer_id,
        is_default || false, JSON.stringify(billing_address || {})
      ]
    );

    sendSuccess(res, newPaymentMethod.rows[0], 'Payment method added successfully', 201);
  } catch (error) {
    logger.error('Error adding payment method:', error);
    throw new ApiError('Failed to add payment method', 500);
  }
});

export const updatePaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { id } = req.params;
  const { is_default, billing_address } = req.body;

  try {
    // If this is set as default, remove default from other payment methods
    if (is_default) {
      await query(
        'UPDATE payment_methods SET is_default = false WHERE user_id = $1 AND id != $2',
        [userId, id]
      );
    }

    const updatedPaymentMethod = await query(
      `UPDATE payment_methods 
       SET is_default = $1, billing_address = $2, updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [is_default || false, JSON.stringify(billing_address || {}), id, userId]
    );

    if (updatedPaymentMethod.rows.length === 0) {
      throw new ApiError('Payment method not found', 404);
    }

    sendSuccess(res, updatedPaymentMethod.rows[0], 'Payment method updated successfully');
  } catch (error) {
    logger.error('Error updating payment method:', error);
    throw new ApiError('Failed to update payment method', 500);
  }
});

export const deletePaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { id } = req.params;

  try {
    const deletedPaymentMethod = await query(
      'UPDATE payment_methods SET is_active = false WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (deletedPaymentMethod.rows.length === 0) {
      throw new ApiError('Payment method not found', 404);
    }

    sendSuccess(res, null, 'Payment method deleted successfully');
  } catch (error) {
    logger.error('Error deleting payment method:', error);
    throw new ApiError('Failed to delete payment method', 500);
  }
});

// Billing Addresses Management
export const getBillingAddresses = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;

  try {
    const addressesResult = await query(
      `SELECT * FROM billing_addresses 
       WHERE user_id = $1
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );

    sendSuccess(res, addressesResult.rows, 'Billing addresses retrieved successfully');
  } catch (error) {
    logger.error('Error fetching billing addresses:', error);
    throw new ApiError('Failed to fetch billing addresses', 500);
  }
});

export const addBillingAddress = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const {
    street_address_1, street_address_2, city, state_province, postal_code, country,
    first_name, last_name, company, phone, is_default
  } = req.body;

  try {
    // If this is set as default, remove default from other addresses
    if (is_default) {
      await query(
        'UPDATE billing_addresses SET is_default = false WHERE user_id = $1',
        [userId]
      );
    }

    const newAddress = await query(
      `INSERT INTO billing_addresses (
        user_id, street_address_1, street_address_2, city, state_province, 
        postal_code, country, first_name, last_name, company, phone, is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        userId, street_address_1, street_address_2, city, state_province,
        postal_code, country, first_name, last_name, company, phone, is_default || false
      ]
    );

    sendSuccess(res, newAddress.rows[0], 'Billing address added successfully', 201);
  } catch (error) {
    logger.error('Error adding billing address:', error);
    throw new ApiError('Failed to add billing address', 500);
  }
});

export const updateBillingAddress = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { id } = req.params;
  const {
    street_address_1, street_address_2, city, state_province, postal_code, country,
    first_name, last_name, company, phone, is_default
  } = req.body;

  try {
    // If this is set as default, remove default from other addresses
    if (is_default) {
      await query(
        'UPDATE billing_addresses SET is_default = false WHERE user_id = $1 AND id != $2',
        [userId, id]
      );
    }

    const updatedAddress = await query(
      `UPDATE billing_addresses 
       SET street_address_1 = $1, street_address_2 = $2, city = $3, state_province = $4,
           postal_code = $5, country = $6, first_name = $7, last_name = $8, company = $9,
           phone = $10, is_default = $11, updated_at = NOW()
       WHERE id = $12 AND user_id = $13
       RETURNING *`,
      [
        street_address_1, street_address_2, city, state_province, postal_code, country,
        first_name, last_name, company, phone, is_default || false, id, userId
      ]
    );

    if (updatedAddress.rows.length === 0) {
      throw new ApiError('Billing address not found', 404);
    }

    sendSuccess(res, updatedAddress.rows[0], 'Billing address updated successfully');
  } catch (error) {
    logger.error('Error updating billing address:', error);
    throw new ApiError('Failed to update billing address', 500);
  }
});

export const deleteBillingAddress = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { id } = req.params;

  try {
    const deletedAddress = await query(
      'DELETE FROM billing_addresses WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (deletedAddress.rows.length === 0) {
      throw new ApiError('Billing address not found', 404);
    }

    sendSuccess(res, null, 'Billing address deleted successfully');
  } catch (error) {
    logger.error('Error deleting billing address:', error);
    throw new ApiError('Failed to delete billing address', 500);
  }
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;

  try {
    // Soft delete by deactivating the account
    const deactivatedUser = await query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *',
      [userId]
    );

    if (deactivatedUser.rows.length === 0) {
      throw new ApiError('User not found', 404);
    }

    sendSuccess(res, null, 'Account deleted successfully');
  } catch (error) {
    logger.error('Error deleting account:', error);
    throw new ApiError('Failed to delete account', 500);
  }
});

export const getUserFavorites = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User;

  try {
    const favoritesResult = await query(
      `SELECT 
        uf.id,
        uf.plan_id,
        uf.created_at,
        hp.id as plan_id,
        hp.title,
        hp.description,
        hp.price,
        hp.main_image_url,
        hp.thumbnail_url,
        hp.bedrooms,
        hp.bathrooms,
        hp.square_footage,
        hp.style,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as review_count
       FROM user_favorites uf
       JOIN house_plans hp ON uf.plan_id = hp.id
       LEFT JOIN reviews r ON hp.id = r.plan_id
       WHERE uf.user_id = $1
       GROUP BY uf.id, uf.plan_id, uf.created_at, hp.id, hp.title, hp.description, hp.price, hp.main_image_url, hp.thumbnail_url, hp.bedrooms, hp.bathrooms, hp.square_footage, hp.style
       ORDER BY uf.created_at DESC`,
      [user.id]
    );

    const favorites = favoritesResult.rows.map((row: any) => ({
      id: row.id,
      plan_id: row.plan_id,
      created_at: row.created_at,
      plan: {
        id: row.plan_id,
        title: row.title,
        description: row.description,
        price: parseFloat(row.price),
        main_image_url: row.main_image_url,
        thumbnail_url: row.thumbnail_url,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        square_footage: row.square_footage,
        style: row.style,
        avg_rating: parseFloat(row.avg_rating),
        review_count: parseInt(row.review_count)
      }
    }));

    sendSuccess(res, favorites, 'User favorites retrieved successfully');
  } catch (error) {
    logger.error('Error fetching user favorites:', error);
    throw new ApiError('Failed to fetch favorites', 500);
  }
});

// Helper function to format time ago
function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  
  if (diffMinutes < 60) {
    return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } else if (diffWeeks < 4) {
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
  } else {
    return past.toLocaleDateString();
  }
}
