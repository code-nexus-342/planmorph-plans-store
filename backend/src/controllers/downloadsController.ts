import { Request, Response } from 'express';
import { db } from '../services/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/response';
import { logger } from '../utils/logger';
import { Download, User } from '../types';
// Type extensions are automatically loaded from types/express.d.ts
import crypto from 'crypto';

// Get user's purchased plans and downloads
export const getUserDownloads = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;

  try {
    // First, get all completed purchases for the user
    const purchasesResult = await db.query(
      'SELECT * FROM purchases WHERE user_id = $1 AND status = $2',
      [userId, 'completed']
    );

    const purchases = purchasesResult.rows;

    // If no purchases, return empty array with proper message
    if (!purchases || purchases.length === 0) {
      return sendSuccess(res, [], 'No downloads available');
    }

    // Get plan details for each purchase
    const planIds = purchases.map((p: any) => p.plan_id);
    
    let plans: any[] = [];
    let planFiles: any[] = [];
    
    if (planIds.length > 0) {
      const plansResult = await db.query(
        `SELECT id, title, description, price, images, created_at
         FROM house_plans 
         WHERE id = ANY($1)`,
        [planIds]
      );
      plans = plansResult.rows;

      // Get plan files for downloads
      const planFilesResult = await db.query(
        'SELECT * FROM plan_files WHERE plan_id = ANY($1)',
        [planIds]
      );
      planFiles = planFilesResult.rows;
    }

    // Combine the data
    const downloadsWithDetails = (purchases as any[]).map((purchase: any) => ({
      ...purchase,
      plan: plans?.find((p: any) => p.id === purchase.plan_id) || null,
      files: planFiles?.filter((f: any) => f.plan_id === purchase.plan_id) || []
    }));

    return sendSuccess(res, downloadsWithDetails, 'Downloads retrieved successfully');
  } catch (error) {
    logger.error('Error in getUserDownloads:', error);
    throw new ApiError('Failed to fetch downloads', 500);
  }
});

// Generate download link for a purchased plan file
export const generateDownloadLink = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { planId, fileId } = req.params;

  try {
    // Verify user has purchased this plan
    const purchaseResult = await db.query(
      'SELECT id FROM purchases WHERE user_id = $1 AND plan_id = $2 AND status = $3',
      [userId, planId, 'completed']
    );

    if (purchaseResult.rows.length === 0) {
      throw new ApiError('Plan not purchased or purchase not completed', 403);
    }

    // Verify file exists for this plan
    const fileResult = await db.query(
      'SELECT * FROM plan_files WHERE id = $1 AND plan_id = $2',
      [fileId, planId]
    );

    if (fileResult.rows.length === 0) {
      throw new ApiError('File not found', 404);
    }

    const file = fileResult.rows[0];

    // Check if download already exists and is still valid
    const existingDownloadResult = await db.query(
      'SELECT * FROM downloads WHERE user_id = $1 AND file_id = $2 AND expires_at > NOW()',
      [userId, fileId]
    );

    const existingDownload = existingDownloadResult.rows[0];

    if (existingDownload && existingDownload.download_count < existingDownload.max_downloads) {
      return sendSuccess(res, {
        download_token: existingDownload.download_token,
        expires_at: existingDownload.expires_at,
        downloads_remaining: existingDownload.max_downloads - existingDownload.download_count
      }, 'Download link generated');
    }

    // Generate new download token
    const downloadToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    const newDownloadResult = await db.query(
      `INSERT INTO downloads (user_id, plan_id, file_id, download_token, expires_at, download_count, max_downloads)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, planId, fileId, downloadToken, expiresAt, 0, 3]
    );

    const newDownload = newDownloadResult.rows[0];

    return sendSuccess(res, {
      download_token: newDownload.download_token,
      expires_at: newDownload.expires_at,
      downloads_remaining: newDownload.max_downloads
    }, 'Download link generated');

  } catch (error) {
    logger.error('Error in generateDownloadLink:', error);
    throw new ApiError('Failed to generate download link', 500);
  }
});

// Process file download using token
export const downloadFile = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    // Find download by token
    const downloadResult = await db.query(
      `SELECT d.*, pf.filename, pf.file_url, pf.file_size, pf.file_type
       FROM downloads d
       JOIN plan_files pf ON d.file_id = pf.id
       WHERE d.download_token = $1 AND d.expires_at > NOW()`,
      [token]
    );

    if (downloadResult.rows.length === 0) {
      throw new ApiError('Invalid or expired download token', 400);
    }

    const download = downloadResult.rows[0];

    // Check download limit
    if (download.download_count >= download.max_downloads) {
      throw new ApiError('Download limit exceeded', 429);
    }

    // Increment download count
    await db.query(
      `UPDATE downloads 
       SET download_count = download_count + 1, downloaded_at = NOW()
       WHERE id = $1`,
      [download.id]
    );

    // Log download
    logger.info(`File downloaded: ${download.filename} by user ${download.user_id}`);

    // In a real implementation, you would stream the file from cloud storage
    // For now, return the file URL for redirect
    return sendSuccess(res, {
      file_url: download.file_url,
      file_name: download.filename,
      file_size: download.file_size,
      downloads_remaining: download.max_downloads - download.download_count - 1
    }, 'File download ready');

  } catch (error) {
    logger.error('Error in downloadFile:', error);
    throw new ApiError('Download failed', 500);
  }
});
