import express from 'express';
import pool from '../config/database';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all 3D tours with optional filtering
router.get('/', async (req, res): Promise<void> => {
  try {
    const { category, search } = req.query;

    let query = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.image_url as image,
        t.video_url as "videoUrl",
        t.duration,
        t.views,
        c.name as category,
        t.plan_id as "planId",
        t.created_at,
        t.updated_at
      FROM tours_3d t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    logger.error('Error fetching 3D tours:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch 3D tours'
    });
  }
});

// Get a single tour by ID
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.image_url as image,
        t.video_url as "videoUrl",
        t.duration,
        t.views,
        c.name as category,
        t.plan_id as "planId",
        t.created_at,
        t.updated_at
      FROM tours_3d t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
      return;
    }

    // Increment view count
    await pool.query(
      'UPDATE tours_3d SET views = views + 1 WHERE id = $1',
      [id]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    logger.error('Error fetching tour:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tour'
    });
  }
});

export default router;
