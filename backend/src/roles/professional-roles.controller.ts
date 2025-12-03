import { Request, Response } from 'express';
import pool from '../db';

// Get all professional roles
export const getProfessionalRoles = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM professional_roles
      ORDER BY display_name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching professional roles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new professional role (Admin only)
export const createProfessionalRole = async (req: Request, res: Response) => {
  const {
    role_type,
    display_name,
    icon_name,
    color,
    base_path,
    api_endpoint,
    widgets,
    nav_items,
    capabilities
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO professional_roles 
       (role_type, display_name, icon_name, color, base_path, api_endpoint, widgets, nav_items, capabilities)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        role_type,
        display_name,
        icon_name,
        color,
        base_path,
        api_endpoint,
        JSON.stringify(widgets || []),
        JSON.stringify(nav_items || []),
        capabilities || []
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating professional role:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ message: 'Role type already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a professional role
export const updateProfessionalRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    display_name,
    icon_name,
    color,
    base_path,
    api_endpoint,
    widgets,
    nav_items,
    capabilities
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE professional_roles 
       SET display_name = COALESCE($1, display_name),
           icon_name = COALESCE($2, icon_name),
           color = COALESCE($3, color),
           base_path = COALESCE($4, base_path),
           api_endpoint = COALESCE($5, api_endpoint),
           widgets = COALESCE($6, widgets),
           nav_items = COALESCE($7, nav_items),
           capabilities = COALESCE($8, capabilities),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        display_name,
        icon_name,
        color,
        base_path,
        api_endpoint,
        widgets ? JSON.stringify(widgets) : null,
        nav_items ? JSON.stringify(nav_items) : null,
        capabilities,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating professional role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
