import { Request, Response } from 'express';
import pool from '../db';

export const getDesigns = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, minPrice, maxPrice, bedrooms } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        let queryText = `
            SELECT d.*, 
                   (SELECT url FROM design_media dm WHERE dm.design_id = d.id AND dm.is_preview = true LIMIT 1) as preview_url,
                   u.email as architect_email
            FROM designs d
            JOIN users u ON d.architect_id = u.id
            WHERE d.status = 'published'
        `;
        
        const queryParams: any[] = [];
        let paramCount = 1;

        if (minPrice) {
            queryText += ` AND d.price >= $${paramCount}`;
            queryParams.push(minPrice);
            paramCount++;
        }

        if (maxPrice) {
            queryText += ` AND d.price <= $${paramCount}`;
            queryParams.push(maxPrice);
            paramCount++;
        }

        // Example JSONB query for bedrooms
        if (bedrooms) {
            queryText += ` AND (d.specifications->>'bedrooms')::int >= $${paramCount}`;
            queryParams.push(bedrooms);
            paramCount++;
        }

        queryText += ` ORDER BY d.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        queryParams.push(limit, offset);

        const result = await pool.query(queryText, queryParams);
        
        // Get total count for pagination
        const countResult = await pool.query('SELECT COUNT(*) FROM designs WHERE status = \'published\'');
        const total = parseInt(countResult.rows[0].count);

        res.json({
            data: result.rows,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getDesignById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const designResult = await pool.query(`
            SELECT d.*, u.email as architect_email, ap.full_name as architect_name, ap.bio as architect_bio
            FROM designs d
            JOIN users u ON d.architect_id = u.id
            LEFT JOIN architect_profiles ap ON u.id = ap.user_id
            WHERE d.id = $1
        `, [id]);

        if (designResult.rows.length === 0) {
            return res.status(404).json({ message: 'Design not found' });
        }

        const design = designResult.rows[0];

        const mediaResult = await pool.query('SELECT * FROM design_media WHERE design_id = $1', [id]);
        design.media = mediaResult.rows;

        res.json(design);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
