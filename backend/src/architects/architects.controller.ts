import { Request, Response } from 'express';
import pool from '../db';
import { generateUploadUrl } from '../storage/storage.service';
import { z } from 'zod';

export const getDashboardStats = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        // Mock stats for now
        const stats = {
            totalDesigns: 0,
            totalSales: 0,
            totalRevenue: 0,
            views: 0
        };

        const designsCount = await pool.query('SELECT COUNT(*) FROM designs WHERE architect_id = $1', [userId]);
        stats.totalDesigns = parseInt(designsCount.rows[0].count);

        // In a real app, we'd query purchases table joined with designs
        
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMyDesigns = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const result = await pool.query(`
            SELECT d.*, 
                   (SELECT url FROM design_media dm WHERE dm.design_id = d.id AND dm.is_preview = true LIMIT 1) as preview_url
            FROM designs d
            WHERE d.architect_id = $1
            ORDER BY d.created_at DESC
        `, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createDesignSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    price: z.number().positive(),
    specifications: z.object({
        bedrooms: z.number(),
        bathrooms: z.number(),
        sqft: z.number()
    })
});

export const createDesign = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const data = createDesignSchema.parse(req.body);

        const result = await pool.query(
            'INSERT INTO designs (architect_id, title, description, price, specifications, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, data.title, data.description, data.price, data.specifications, 'draft']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUploadUrl = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { filename, contentType, designId, type } = req.body;

    if (!filename || !contentType || !designId || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify ownership of design
    const designCheck = await pool.query('SELECT * FROM designs WHERE id = $1 AND architect_id = $2', [designId, userId]);
    if (designCheck.rows.length === 0) {
        return res.status(403).json({ message: 'Unauthorized access to this design' });
    }

    const key = `designs/${designId}/${Date.now()}-${filename}`;
    
    try {
        const url = await generateUploadUrl(process.env.DO_SPACES_BUCKET || 'planmorph', key, contentType);
        
        // We might want to save the media entry now or after successful upload confirmation.
        // For simplicity, let's assume the client calls another endpoint to confirm or we just return the URL and let client handle it.
        // But we need to know the URL to save in DB.
        // The URL in DB should be the public (or CDN) URL, not the signed upload URL.
        // The key is what matters.
        
        // Let's return the upload URL and the final public URL/Key so the client can save it back to us.
        
        res.json({ uploadUrl: url, key });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to generate upload URL' });
    }
};

export const addDesignMedia = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { designId, url, type, isPreview } = req.body;

     // Verify ownership
    const designCheck = await pool.query('SELECT * FROM designs WHERE id = $1 AND architect_id = $2', [designId, userId]);
    if (designCheck.rows.length === 0) {
        return res.status(403).json({ message: 'Unauthorized access to this design' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO design_media (design_id, url, type, is_preview) VALUES ($1, $2, $3, $4) RETURNING *',
            [designId, url, type, isPreview || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
