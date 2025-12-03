import { Request, Response } from 'express';
import pool from '../db';

// Civil Engineer Dashboard
export const getEngineerDashboard = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    // Get drawing statistics
    const drawingStats = await pool.query(`
      SELECT 
        COUNT(*) as total_drawings,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_drawings,
        COUNT(CASE WHEN status = 'review' THEN 1 END) as in_review,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_drawings,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_drawings
      FROM structural_drawings
      WHERE engineer_id = $1
    `, [userId]);

    // Get designs awaiting structural work
    const pendingDesigns = await pool.query(`
      SELECT 
        d.id,
        d.title,
        d.description,
        d.created_at,
        u.email as architect_email,
        pp.full_name as architect_name,
        (SELECT COUNT(*) FROM structural_drawings WHERE design_id = d.id) as drawing_count
      FROM designs d
      JOIN users u ON d.architect_id = u.id
      LEFT JOIN professional_profiles pp ON u.id = pp.user_id
      WHERE d.status = 'published'
        AND NOT EXISTS (
          SELECT 1 FROM structural_drawings sd 
          WHERE sd.design_id = d.id AND sd.engineer_id = $1 AND sd.status = 'approved'
        )
      ORDER BY d.created_at DESC
      LIMIT 10
    `, [userId]);

    // Get recent drawings
    const recentDrawings = await pool.query(`
      SELECT 
        sd.*,
        d.title as design_title
      FROM structural_drawings sd
      JOIN designs d ON sd.design_id = d.id
      WHERE sd.engineer_id = $1
      ORDER BY sd.created_at DESC
      LIMIT 10
    `, [userId]);

    // Get collaboration stats
    const collaborationStats = await pool.query(`
      SELECT 
        COUNT(DISTINCT d.architect_id) as architects_worked_with,
        COUNT(DISTINCT sd.design_id) as designs_worked_on
      FROM structural_drawings sd
      JOIN designs d ON sd.design_id = d.id
      WHERE sd.engineer_id = $1
    `, [userId]);

    res.json({
      drawingStats: drawingStats.rows[0],
      pendingDesigns: pendingDesigns.rows,
      recentDrawings: recentDrawings.rows,
      collaborationStats: collaborationStats.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all designs (for civil engineer to work on)
export const getDesignsForEngineering = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.*,
        u.email as architect_email,
        pp.full_name as architect_name,
        (SELECT COUNT(*) FROM structural_drawings WHERE design_id = d.id) as drawing_count
      FROM designs d
      JOIN users u ON d.architect_id = u.id
      LEFT JOIN professional_profiles pp ON u.id = pp.user_id
      WHERE d.status = 'published'
      ORDER BY d.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get structural drawings
export const getStructuralDrawings = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { design_id, status } = req.query;

  try {
    let query = `
      SELECT 
        sd.*,
        d.title as design_title,
        d.architect_id
      FROM structural_drawings sd
      JOIN designs d ON sd.design_id = d.id
      WHERE sd.engineer_id = $1
    `;
    const params: any[] = [userId];

    if (design_id) {
      params.push(design_id);
      query += ` AND sd.design_id = $${params.length}`;
    }

    if (status) {
      params.push(status);
      query += ` AND sd.status = $${params.length}`;
    }

    query += ' ORDER BY sd.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload structural drawing
export const uploadStructuralDrawing = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { design_id, title, drawing_url, drawing_type, notes, metadata } = req.body;

  if (!design_id || !title || !drawing_url) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if design exists
    const designCheck = await pool.query('SELECT id FROM designs WHERE id = $1', [design_id]);
    if (designCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Get next version number for this design
    const versionResult = await pool.query(
      'SELECT COALESCE(MAX(version), 0) + 1 as next_version FROM structural_drawings WHERE design_id = $1 AND engineer_id = $2',
      [design_id, userId]
    );
    const version = versionResult.rows[0].next_version;

    const result = await pool.query(
      `INSERT INTO structural_drawings 
      (engineer_id, design_id, title, drawing_url, drawing_type, version, status, notes, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [userId, design_id, title, drawing_url, drawing_type, version, 'draft', notes, metadata || {}]
    );

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'create', 'structural_drawing', result.rows[0].id, `Uploaded structural drawing: ${title}`]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update structural drawing
export const updateStructuralDrawing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;
  const { title, drawing_url, drawing_type, status, notes, metadata } = req.body;

  try {
    const result = await pool.query(
      `UPDATE structural_drawings 
      SET title = COALESCE($1, title),
          drawing_url = COALESCE($2, drawing_url),
          drawing_type = COALESCE($3, drawing_type),
          status = COALESCE($4, status),
          notes = COALESCE($5, notes),
          metadata = COALESCE($6, metadata),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND engineer_id = $8
      RETURNING *`,
      [title, drawing_url, drawing_type, status, notes, metadata, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Structural drawing not found or unauthorized' });
    }

    // Log activity
    await pool.query(
      `INSERT INTO professional_activities (user_id, activity_type, entity_type, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'update', 'structural_drawing', id, `Updated structural drawing`]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
