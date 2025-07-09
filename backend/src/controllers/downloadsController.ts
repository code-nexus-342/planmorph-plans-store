import { Request, Response } from 'express';
import { supabase } from '../config/database';
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

  const { data: purchases, error } = await supabase
    .from('purchases')
    .select(`
      *,
      plans:plan_id (
        id, title, images, files:plan_files (*)
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (error) {
    logger.error('Failed to fetch user downloads:', error);
    throw new ApiError('Failed to fetch downloads', 500);
  }

  sendSuccess(res, purchases || [], 'Downloads retrieved successfully');
});

// Generate download link for a purchased plan file
export const generateDownloadLink = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { planId, fileId } = req.params;

  // Verify user has purchased this plan
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('plan_id', planId)
    .eq('status', 'completed')
    .single();

  if (!purchase) {
    throw new ApiError('Plan not purchased or purchase not completed', 403);
  }

  // Verify file exists for this plan
  const { data: file } = await supabase
    .from('plan_files')
    .select('*')
    .eq('id', fileId)
    .eq('plan_id', planId)
    .single();

  if (!file) {
    throw new ApiError('File not found', 404);
  }

  // Check if download already exists and is still valid
  const { data: existingDownload } = await supabase
    .from('downloads')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_id', planId)
    .eq('file_id', fileId)
    .gte('expires_at', new Date().toISOString())
    .single();

  if (existingDownload && existingDownload.download_count < existingDownload.max_downloads) {
    sendSuccess(res, {
      download_token: existingDownload.download_token,
      expires_at: existingDownload.expires_at,
      downloads_remaining: existingDownload.max_downloads - existingDownload.download_count
    }, 'Download link generated');
    return;
  }

  // Generate new download token
  const downloadToken = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

  const { data: newDownload, error } = await supabase
    .from('downloads')
    .insert({
      user_id: userId,
      plan_id: planId,
      file_id: fileId,
      download_token: downloadToken,
      expires_at: expiresAt.toISOString(),
      download_count: 0,
      max_downloads: 3 // Allow 3 downloads per token
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create download:', error);
    throw new ApiError('Failed to generate download link', 500);
  }

  sendSuccess(res, {
    download_token: newDownload.download_token,
    expires_at: newDownload.expires_at,
    downloads_remaining: newDownload.max_downloads
  }, 'Download link generated');
});

// Process file download using token
export const downloadFile = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  // Find download by token
  const { data: download, error } = await supabase
    .from('downloads')
    .select(`
      *,
      files:file_id (*)
    `)
    .eq('download_token', token)
    .gte('expires_at', new Date().toISOString())
    .single();

  if (error || !download) {
    throw new ApiError('Invalid or expired download token', 400);
  }

  // Check download limit
  if (download.download_count >= download.max_downloads) {
    throw new ApiError('Download limit exceeded', 429);
  }

  // Increment download count
  await supabase
    .from('downloads')
    .update({ 
      download_count: download.download_count + 1,
      downloaded_at: new Date().toISOString()
    })
    .eq('id', download.id);

  // Log download
  logger.info(`File downloaded: ${download.files.file_name} by user ${download.user_id}`);

  // In a real implementation, you would stream the file from cloud storage
  // For now, return the file URL for redirect
  sendSuccess(res, {
    file_url: download.files.file_url,
    file_name: download.files.file_name,
    file_size: download.files.file_size,
    downloads_remaining: download.max_downloads - download.download_count - 1
  }, 'File download ready');
});
