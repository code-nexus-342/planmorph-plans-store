import { Request, Response } from 'express';
import pool from '../db';

export const getDesigns = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, minPrice, maxPrice, bedrooms, categoryId } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        let queryText = `
            SELECT d.*, 
                   (SELECT url FROM design_media dm WHERE dm.design_id = d.id AND dm.is_preview = true LIMIT 1) as preview_url,
                   p.email as architect_email,
                   p.full_name as architect_name
            FROM designs d
            JOIN professionals p ON d.professional_id = p.id
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

        if (categoryId) {
            queryText += ` AND d.category_id = $${paramCount}`;
            queryParams.push(categoryId);
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
            SELECT d.*, p.email as architect_email, p.full_name as architect_name, p.bio as architect_bio, c.name as category_name
            FROM designs d
            JOIN professionals p ON d.professional_id = p.id
            LEFT JOIN categories c ON d.category_id = c.id
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

export const createDesign = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { title, description, price, categoryId, videoUrl, specifications } = req.body;
        // @ts-ignore
        const professionalId = req.user.id; // Assumes auth middleware populates this

        // 1. Insert Design
        const insertDesignQuery = `
            INSERT INTO designs (
                professional_id, title, description, price, category_id, 
                specifications, status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, 'published', NOW(), NOW())
            RETURNING id
        `;
        
        const designResult = await client.query(insertDesignQuery, [
            professionalId, title, description, price, categoryId, specifications
        ]);
        const designId = designResult.rows[0].id;

        // 2. Handle Files
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        
        // Handle Images
        if (files?.['images']) {
            for (const [index, file] of files['images'].entries()) {
                // Construct URL for local file
                const url = `${baseUrl}/uploads/${file.filename}`;
                
                await client.query(`
                    INSERT INTO design_media (design_id, url, type, is_preview, media_type)
                    VALUES ($1, $2, 'image', $3, 'image')
                `, [designId, url, index === 0]);
            }
        }

        // Handle CAD File
        if (files?.['cadFile']) {
            const cadFile = files['cadFile'][0];
            const url = `${baseUrl}/uploads/${cadFile.filename}`;
            
            await client.query(`
                INSERT INTO design_media (design_id, url, type, is_preview, media_type)
                VALUES ($1, $2, 'file', false, 'cad')
            `, [designId, url]);
        }
        
        // Handle Video URL
        if (videoUrl) {
             await client.query(`
                INSERT INTO design_media (design_id, url, type, is_preview, media_type)
                VALUES ($1, $2, 'video', false, 'video')
            `, [designId, videoUrl]);
        }

        await client.query('COMMIT');
        
        res.status(201).json({ message: 'Design created successfully', designId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create design error:', error);
        res.status(500).json({ message: 'Failed to create design' });
    } finally {
        client.release();
    }
};
