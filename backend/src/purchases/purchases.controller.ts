import { Request, Response } from 'express';
import pool from '../db';
import { z } from 'zod';
import { generateDownloadUrl } from '../storage/storage.service';

const purchaseSchema = z.object({
  designId: z.number(),
  paymentMethod: z.string().optional()
});

export const createPurchase = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const { designId } = purchaseSchema.parse(req.body);

    // Check if design exists and get price
    const designResult = await pool.query(
      'SELECT * FROM designs WHERE id = $1 AND status = $2',
      [designId, 'published']
    );

    if (designResult.rows.length === 0) {
      return res.status(404).json({ message: 'Design not found or not available' });
    }

    const design = designResult.rows[0];

    // Check if already purchased
    const existingPurchase = await pool.query(
      'SELECT * FROM purchases WHERE user_id = $1 AND design_id = $2',
      [userId, designId]
    );

    if (existingPurchase.rows.length > 0) {
      return res.status(400).json({ message: 'Design already purchased' });
    }

    // Create purchase record
    // In a real app, integrate with payment gateway here (Stripe, PayPal, etc.)
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const purchaseResult = await pool.query(
      'INSERT INTO purchases (user_id, design_id, amount, transaction_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, designId, design.price, transactionId]
    );

    res.status(201).json({
      message: 'Purchase successful',
      purchase: purchaseResult.rows[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserPurchases = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const result = await pool.query(
      `SELECT p.*, d.title, d.description,
        (SELECT url FROM design_media dm WHERE dm.design_id = d.id AND dm.is_preview = true LIMIT 1) as preview_url
      FROM purchases p
      JOIN designs d ON p.design_id = d.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDesignFiles = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { designId } = req.params;

  try {
    // Verify purchase
    const purchaseCheck = await pool.query(
      'SELECT * FROM purchases WHERE user_id = $1 AND design_id = $2',
      [userId, designId]
    );

    if (purchaseCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Design not purchased' });
    }

    // Get CAD files and documents
    const filesResult = await pool.query(
      `SELECT * FROM design_media 
       WHERE design_id = $1 AND type IN ('cad', 'document')`,
      [designId]
    );

    // Generate presigned URLs for download
    const filesWithUrls = await Promise.all(
      filesResult.rows.map(async (file) => {
        // Extract key from URL (assuming URL format includes the key)
        const key = file.url;
        const downloadUrl = await generateDownloadUrl(
          process.env.DO_SPACES_BUCKET || 'planmorph',
          key
        );
        return {
          ...file,
          downloadUrl
        };
      })
    );

    res.json(filesWithUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
